// routes/authRoutes.js
import express from 'express';
import { signupUser, signinUser, signupOfficer, signinOfficer } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup/user', signupUser);
router.post('/signin/user', signinUser);
router.post('/signup/officer', signupOfficer);
router.post('/signin/officer', signinOfficer);

export { router };