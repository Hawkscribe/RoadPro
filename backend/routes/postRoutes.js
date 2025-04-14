// routes/postRoutes.js
import express from 'express';
import { createPost } from '../controllers/postController.js';
import { auth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', auth, createPost);

export { router };