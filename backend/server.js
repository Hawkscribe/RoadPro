import express from 'express';
import { connectDB } from './config/db.js';
import { router as authRouter } from './routes/authRoutes.js';
import { router as postRouter } from './routes/postRoutes.js';
import { router as officerRouter } from './routes/officerRoutes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
connectDB();

app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);
app.use('/api/officers', officerRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
