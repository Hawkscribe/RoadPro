// models/Post.js
import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  originalImage: {
    type: String,
    required: true
  },
  annotatedImage: {
    type: String,
    required: true
  },
  numPotholes: {
    type: Number,
    default: 0
  },
  potholeWidths: [{
    type: Number
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'in-progress', 'completed'],
    default: 'pending'
  },
  officerComment: {
    type: String,
    default: ''
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
postSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export const Post = mongoose.model('Post', postSchema);