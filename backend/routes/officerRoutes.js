// routes/officerRoutes.js
import express from 'express';
import { getAllPosts, updatePostStatus } from '../controllers/officerController.js';
import { auth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/posts', auth, getAllPosts);
router.post('/update-status', auth, updatePostStatus);

export { router };