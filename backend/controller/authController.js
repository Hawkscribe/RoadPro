import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/userModel.js';
import { OfficerModel } from '../models/officerModel.js';

const JWT_SECRET = process.env.JWT_SECRET;

// Sign up for User
export const signupUser = async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new UserModel({ email, name, password: hashedPassword });
    await newUser.save();

    res.status(200).json({ msg: 'User has been registered' });
  } catch (error) {
    res.status(400).json({ msg: 'Error in registration', error: error.message });
  }
};

// Sign in for User
export const signinUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ msg: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ msg: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ msg: 'Error signing in', error: error.message });
  }
};

// Sign up for Officer
export const signupOfficer = async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newOfficer = new OfficerModel({ email, name, password: hashedPassword });
    await newOfficer.save();

    res.status(200).json({ msg: 'Officer has been registered' });
  } catch (error) {
    res.status(400).json({ msg: 'Error in registration', error: error.message });
  }
};

// Sign in for Officer
export const signinOfficer = async (req, res) => {
  const { email, password } = req.body;

  try {
    const officer = await OfficerModel.findOne({ email });
    if (!officer) {
      return res.status(401).json({ msg: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, officer.password);
    if (!isPasswordValid) {
      return res.status(401).json({ msg: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: officer._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ msg: 'Error signing in', error: error.message });
  }
};
