// controllers/postController.js
import multer from 'multer';
import path from 'path';
import { spawn } from 'child_process';
import { Post } from '../models/Post.js';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function(req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only .png, .jpg and .jpeg files are allowed'));
  }
}).single('image');

export const createPost = (req, res) => {
  upload(req, res, async function(err) {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    try {
      // Get Python script path
      const pythonScriptPath = path.join(__dirname, '../pothole_detection.py');
      const imagePath = path.join(uploadsDir, req.file.filename);
      
      // Execute Python script using spawn (safer than exec)
      const pythonProcess = spawn('python', [pythonScriptPath, imagePath]);
      
      let pythonData = '';
      let pythonError = '';
      
      // Collect data from stdout
      pythonProcess.stdout.on('data', (data) => {
        pythonData += data.toString();
      });
      
      // Collect errors from stderr
      pythonProcess.stderr.on('data', (data) => {
        pythonError += data.toString();
      });
      
      // Handle process completion
      pythonProcess.on('close', async (code) => {
        if (code !== 0) {
          console.error(`Python process exited with code ${code}`);
          console.error(`Python error: ${pythonError}`);
          return res.status(500).json({ message: 'Error processing image' });
        }
        
        try {
          // Parse the output from Python script
          const [jsonOutput, annotatedImagePath] = pythonData.trim().split('::');
          const { num_potholes, widths } = JSON.parse(jsonOutput);
          
          // Create a new post with pothole information
          const newPost = new Post({
            userId: req.user._id,
            location: req.body.location || 'Unknown',
            description: req.body.description || '',
            originalImage: `/uploads/${req.file.filename}`,
            annotatedImage: `/${annotatedImagePath}`,
            numPotholes: num_potholes,
            potholeWidths: widths,
            status: 'pending'
          });
          
          await newPost.save();
          res.status(201).json({ 
            message: 'Post created successfully', 
            post: newPost 
          });
        } catch (error) {
          console.error('Error processing ML results:', error);
          res.status(500).json({ message: 'Error processing ML results', error: error.message });
        }
      });
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
};