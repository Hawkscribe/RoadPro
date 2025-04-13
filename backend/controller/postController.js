import multer from 'multer';
import axios from 'axios';
import { PostModel } from '../models/postModel.js';

const upload = multer({ dest: 'uploads/' });

// Create post
export const createPost = async (req, res) => {
  const { description } = req.body;
  const { file } = req;

  if (!description || !file) {
    return res.status(400).json({ msg: 'Description and photo are required' });
  }

  try {
    // Send image to Python server
    const formData = new FormData();
    formData.append('photo', file.buffer, file.originalname);
    formData.append('description', description);

    const response = await axios.post(process.env.PYTHON_SERVER_URL, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    const { processedData } = response.data;

    const newPost = new PostModel({
      description,
      photo: { data: file.buffer, contentType: file.mimetype },
      processedData,
      userId: req.userId, // Attach user ID from JWT token
    });

    await newPost.save();
    res.status(201).json({ msg: 'Post created successfully', post: newPost });
  } catch (error) {
    res.status(500).json({ msg: 'Error creating post', error: error.message });
  }
};
