import { spawn } from 'child_process';
import Post from '../models/post.js';
import cloudinary from '../config/cloudinary.js'; // Your Cloudinary config
import fs from 'fs';


// Handles file upload using Multer (you can send the file in form-data)
export const createPost = async (req, res) => {
  try {
    const { location, description, issueType } = req.body;
    const imageFile = req.file;

    if (!imageFile || !description || !location || !issueType) {
      return res.status(400).json({ message: 'All fields including image are required.' });
    }

    // Upload original image to Cloudinary
    const originalUpload = await cloudinary.uploader.upload(imageFile.path);
    const originalImageUrl = originalUpload.secure_url;

    // Call Python script with originalImageUrl
    const python = spawn('python', ['./ml/yolo.py', originalImageUrl]);

    let output = '';
    let errorOutput = '';

    python.stdout.on('data', data => output += data.toString());
    python.stderr.on('data', data => errorOutput += data.toString());

    python.on('close', async (code) => {
      // Delete local image after processing
      fs.unlinkSync(imageFile.path);

      if (code !== 0) {
        return res.status(500).json({ message: 'ML script error', details: errorOutput });
      }

      try {
        const result = JSON.parse(output);

        if (result.error) {
          return res.status(500).json({ message: result.error });
        }

        const annotatedUpload = await cloudinary.uploader.upload(result.annotated_local_path);
        const annotatedImageUrl = annotatedUpload.secure_url;

        // Clean annotated local image
        fs.unlinkSync(result.annotated_local_path);

        // Save post in MongoDB
        const newPost = new Post({
          userId: req.user._id,
          description,
          issueType,
          location: {
            type: 'Point',
            coordinates: [JSON.parse(location).lng, JSON.parse(location).lat]
          },
          originalImagePath: originalImageUrl,
          annotatedImagePath: annotatedImageUrl,
          mlData: {
            potholeCount: result.num_potholes,
            potholeWidthsPixels: result.widths_pixels,
            confidences: result.confidences
          },
          status: 'pending'
        });

        const savedPost = await newPost.save();
        res.status(201).json({ message: 'Post created and processed successfully', post: savedPost });

      } catch (err) {
        res.status(500).json({ message: 'Failed to parse or save ML result', error: err.message });
      }
    });

    python.on('error', err => {
      fs.unlinkSync(imageFile.path);
      res.status(500).json({ message: 'Error running Python script', error: err.message });
    });

  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};
