import { PostModel } from '../models/postModel.js';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Get all posts (for officers)
export const getAllPosts = async (req, res) => {
  try {
    const posts = await PostModel.find();
    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ msg: 'Error retrieving posts', error: error.message });
  }
};

// Update post status
export const updatePostStatus = async (req, res) => {
  const { postId, status } = req.body;

  try {
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    post.status = status;
    await post.save();

    // Send email to the user
    const user = await UserModel.findById(post.userId);
    if (user) {
      const mailOptions = {
        from: process.env.EMAIL,
        to: user.email,
        subject: 'Post Status Updated',
        text: `Your post has been marked as ${status}.`,
      };
      await transporter.sendMail(mailOptions);
    }

    res.status(200).json({ msg: 'Post status updated successfully' });
  } catch (error) {
    res.status(500).json({ msg: 'Error updating status', error: error.message });
  }
};
