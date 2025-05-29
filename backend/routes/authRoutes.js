// routes/authRoutes.js
import express from 'express';
import { signupUser, signinUser, signupOfficer, signinOfficer ,logoutUser, userInfo} from '../controller/authController.js';

const router = express.Router();
router.get('/user', userInfo);
router.post('/logout/user', logoutUser);
router.post('/signup/user', signupUser);
router.post('/signin/user', signinUser);
router.post('/signup/officer', signupOfficer);
router.post('/signin/officer', signinOfficer);

export { router };