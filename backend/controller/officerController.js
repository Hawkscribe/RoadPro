import Post from '../models/post.js';  // Corrected import

export const getAllPosts = async (req, res) => {
  try {
    if (req.user.role !== 'officer') {
      return res.status(403).json({ message: 'Unauthorized: Only officers can access this resource' });
    }

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'name email')
      .exec();

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updatePostStatus = async (req, res) => {
  try {
    if (req.user.role !== 'officer') {
      return res.status(403).json({ message: 'Unauthorized: Only officers can update post status' });
    }

    const { postId, status, comment } = req.body;

    if (!postId || !status) {
      return res.status(400).json({ message: 'Post ID and status are required' });
    }

    const validStatus = ['pending', 'approved', 'rejected', 'in-progress', 'completed'];
    if (!validStatus.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

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
