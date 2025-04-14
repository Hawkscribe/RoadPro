// controllers/officerController.js
import { Post } from '../models/Post.js';

export const getAllPosts = async (req, res) => {
  try {
    // Check if the user is an officer
    if (req.user.role !== 'officer') {
      return res.status(403).json({ message: 'Unauthorized: Only officers can access this resource' });
    }

    // Get all posts, sorted by newest first
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'name email') // Populate user information
      .exec();

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updatePostStatus = async (req, res) => {
  try {
    // Check if the user is an officer
    if (req.user.role !== 'officer') {
      return res.status(403).json({ message: 'Unauthorized: Only officers can update post status' });
    }

    const { postId, status, comment } = req.body;

    if (!postId || !status) {
      return res.status(400).json({ message: 'Post ID and status are required' });
    }

    // Valid status values
    const validStatus = ['pending', 'approved', 'rejected', 'in-progress', 'completed'];
    if (!validStatus.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // Update the post status
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { 
        status,
        officerComment: comment || '',
        reviewedBy: req.user._id,
        reviewedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json({ 
      message: 'Post status updated successfully', 
      post: updatedPost 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};