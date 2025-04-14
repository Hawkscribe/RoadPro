// controllers/authController.js
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const generateToken = (userId) => {
  return jwt.sign(
    { userId }, 
    process.env.JWT_SECRET || 'default_secret_change_in_production', 
    { expiresIn: '7d' }
  );
};

export const signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create new user
    const user = new User({
      name,
      email,
      password,
      role: 'user'
    });
    
    await user.save();
    
    // Generate token
    const token = generateToken(user._id);
    
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const signinUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email, role: 'user' });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate token
    const token = generateToken(user._id);
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const signupOfficer = async (req, res) => {
  try {
    const { name, email, password, secretCode } = req.body;
    
    // Verify officer secret code
    const officerSecretCode = process.env.OFFICER_SECRET || 'officer123';
    if (secretCode !== officerSecretCode) {
      return res.status(401).json({ message: 'Invalid officer secret code' });
    }
    
    // Check if officer already exists
    const existingOfficer = await User.findOne({ email });
    if (existingOfficer) {
      return res.status(400).json({ message: 'Officer already exists' });
    }
    
    // Create new officer
    const officer = new User({
      name,
      email,
      password,
      role: 'officer'
    });
    
    await officer.save();
    
    // Generate token
    const token = generateToken(officer._id);
    
    res.status(201).json({
      message: 'Officer created successfully',
      token,
      user: {
        id: officer._id,
        name: officer.name,
        email: officer.email,
        role: officer.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const signinOfficer = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find officer
    const officer = await User.findOne({ email, role: 'officer' });
    if (!officer) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await officer.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate token
    const token = generateToken(officer._id);
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: officer._id,
        name: officer.name,
        email: officer.email,
        role: officer.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};