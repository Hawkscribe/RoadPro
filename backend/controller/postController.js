import multer from 'multer';
import path from 'path';
import { spawn } from 'child_process';
import Post from '../models/post.js';  // Corrected import statement
import fs from 'fs';
import { fileURLToPath } from 'url';

// --- Configuration ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..'); // Project root directory
const UPLOADS_FOLDER = path.join(ROOT_DIR, 'uploads'); // Absolute path to uploads
const ML_SCRIPT_FOLDER = path.join(ROOT_DIR, 'ml'); // Absolute path to ml folder
const PYTHON_SCRIPT_NAME = 'detect_potholes.py';
const PYTHON_SCRIPT_PATH = path.join(ML_SCRIPT_FOLDER, PYTHON_SCRIPT_NAME);
// --- End Configuration ---

// Ensure the uploads directory exists
if (!fs.existsSync(UPLOADS_FOLDER)) {
  try {
      fs.mkdirSync(UPLOADS_FOLDER, { recursive: true });
      console.log(`Created uploads directory at: ${UPLOADS_FOLDER}`);
  } catch (err) {
      console.error(`Error creating uploads directory: ${UPLOADS_FOLDER}`, err);
      // Consider exiting if the directory can't be created
      // process.exit(1);
  }
} else {
    console.log(`Uploads directory already exists at: ${UPLOADS_FOLDER}`);
}

// --- Multer Configuration ---
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, UPLOADS_FOLDER);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = function(req, file, cb) {
  const filetypes = /jpeg|jpg|png/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('File upload only supports the following filetypes - .jpeg, .jpg, .png'));
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter
}).single('image');

// --- Controller Function ---
export const createPost = (req, res) => {
  // Assumes auth middleware ran successfully and attached req.user

  upload(req, res, async function(multerError) {
    if (multerError) {
      console.error("Multer Error:", multerError);
      return res.status(400).json({ message: `File Upload Error: ${multerError.message}` });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required.' });
    }

    const originalImageAbsolutePath = req.file.path;
    const originalImageFilename = req.file.filename;

    try {
      const { location, description, issueType } = req.body;
      if (!description || !location || !issueType ) {
         fs.unlinkSync(originalImageAbsolutePath); // Clean up
         return res.status(400).json({ message: 'Description, location, and issue type are required.' });
      }

      let parsedLocation;
      try {
          parsedLocation = JSON.parse(location);
          if (typeof parsedLocation.lat !== 'number' || typeof parsedLocation.lng !== 'number') {
              throw new Error('Invalid location format');
          }
      } catch (e) {
           fs.unlinkSync(originalImageAbsolutePath); // Clean up
           return res.status(400).json({ message: 'Invalid location format. Expected JSON like {"lat": number, "lng": number}.' });
      }

       // Check if user info is present after auth middleware
       if (!req.user || !req.user._id) {
            console.error("User ID not found in request after auth middleware.");
            fs.unlinkSync(originalImageAbsolutePath); // Clean up
            return res.status(401).json({ message: "Authentication error: User ID missing." });
       }

      const annotatedImageFilename = `annotated-${originalImageFilename}`;
      const annotatedImageAbsolutePath = path.join(UPLOADS_FOLDER, annotatedImageFilename);

       if (!fs.existsSync(PYTHON_SCRIPT_PATH)) {
            console.error(`Python script not found at: ${PYTHON_SCRIPT_PATH}`);
            fs.unlinkSync(originalImageAbsolutePath); // Clean up
            return res.status(500).json({ message: 'Server configuration error: ML script not found.' });
       }

      console.log(`Running Python script: ${PYTHON_SCRIPT_PATH}`);
      const pythonProcess = spawn('python', [
          PYTHON_SCRIPT_PATH,
          originalImageAbsolutePath,
          annotatedImageAbsolutePath
      ]);

      let pythonJsonOutput = '';
      let pythonErrorOutput = '';

      pythonProcess.stdout.on('data', (data) => { pythonJsonOutput += data.toString(); });
      pythonProcess.stderr.on('data', (data) => { pythonErrorOutput += data.toString(); console.error(`Python stderr: ${data}`); });

      pythonProcess.on('close', async (code) => {
        console.log(`Python process exited with code ${code}`);

        if (code !== 0) {
          console.error(`Python script failed. Stderr: ${pythonErrorOutput}`);
          let scriptErrorMsg = 'Error processing image with ML model.';
          try {
              const parsedError = JSON.parse(pythonJsonOutput || pythonErrorOutput);
              if(parsedError.error) scriptErrorMsg = parsedError.error; // Use error directly from script
          } catch (parseErr) { /* Ignore if output wasn't JSON */ }

          // Decide whether to delete the original image on ML failure
          // fs.unlinkSync(originalImageAbsolutePath); // Optional cleanup
          return res.status(500).json({ message: scriptErrorMsg, details: pythonErrorOutput });
        }

        try {
          const mlResults = JSON.parse(pythonJsonOutput.trim());
          if (mlResults.error) {
               console.error(`Python script returned error JSON: ${mlResults.error}`);
               return res.status(500).json({ message: `ML Processing Error: ${mlResults.error}` });
          }

          // Use RELATIVE URL paths for storing and sending to client
          const originalImageRelativePath = `/uploads/${originalImageFilename}`;
          const annotatedImageRelativePath = `/uploads/${annotatedImageFilename}`;

          const newPost = new Post({
            userId: req.user._id,
            description: description,
            issueType: issueType,
            location: {
                type: 'Point',
                coordinates: [parsedLocation.lng, parsedLocation.lat] // Lon, Lat
            },
            originalImagePath: originalImageRelativePath,
            annotatedImagePath: annotatedImageRelativePath,
            mlData: {
                potholeCount: mlResults.num_potholes,
                potholeWidthsPixels: mlResults.widths_pixels,
                confidences: mlResults.confidences // Store confidences if available
            },
            status: 'pending'
          });

          const savedPost = await newPost.save();

          // Respond with the saved post data (Mongoose doc is converted to plain object)
          res.status(201).json({
            message: 'Post created successfully and image processed!',
            post: savedPost.toObject() // Send back plain object
          });

        } catch (error) {
           console.error('Error parsing ML results or saving to DB:', error);
           // Attempt cleanup of generated annotated image if DB save fails
           if (fs.existsSync(annotatedImageAbsolutePath)) {
               try { fs.unlinkSync(annotatedImageAbsolutePath); } catch (e) { console.error("Error deleting annotated image on DB fail:", e);}
           }
           // Send specific Mongoose validation errors if possible
           if (error.name === 'ValidationError') {
               return res.status(400).json({ message: "Validation Error", errors: error.errors });
           }
           res.status(500).json({ message: 'Error saving post or processing results.', error: error.message });
        }
      });

      pythonProcess.on('error', (spawnError) => {
           console.error('Failed to start Python process:', spawnError);
           fs.unlinkSync(originalImageAbsolutePath); // Clean up
           res.status(500).json({ message: 'Server error: Could not run image processing script.' });
       });

    } catch (serverError) {
       console.error('Server error in createPost:', serverError);
       if (req.file && req.file.path && fs.existsSync(req.file.path)) {
           try { fs.unlinkSync(req.file.path); } catch (e) { console.error("Error deleting original image on server error:", e); }
       }
       res.status(500).json({ message: 'Internal server error.', error: serverError.message });
    }
  });
};
