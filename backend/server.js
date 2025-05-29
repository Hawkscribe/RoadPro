import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { spawn } from 'child_process';

// Route imports
import { router as authRoutes } from './routes/authRoutes.js';
import { router as postRoutes } from './routes/postRoutes.js';
import { router as officerRoutes } from './routes/officerRoutes.js';

// ES module fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/annotated', express.static(path.join(__dirname, 'annotated')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/officer', officerRoutes);

// === Image Upload + Python Annotation Route ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, 'uploads')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

app.post('/api/annotate', upload.single('image'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const inputPath = req.file.path;
    const outputFilename = `annotated-${Date.now()}.jpg`;
    const outputPath = path.join(__dirname, 'annotated', outputFilename);

    const scriptPath = path.join(__dirname, 'ml', 'detect_potholes.py');

    const pythonProcess = spawn('python3', [scriptPath, inputPath, outputPath]);

    let pythonOutput = '';

    pythonProcess.stdout.on('data', (data) => {
      pythonOutput += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error('Python stderr:', data.toString());
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        return res.status(500).json({ error: 'Python script failed' });
      }

      try {
        const result = JSON.parse(pythonOutput);
        res.json({
          ...result,
          annotatedImage: `/annotated/${outputFilename}`,
        });
      } catch (e) {
        console.error('JSON parse error:', e);
        res.status(500).json({ error: 'Invalid JSON from Python script' });
      }
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// MongoDB Connection
const mongoURI = 'mongodb+srv://database1:123456789pwd@cluster0.bhtab.mongodb.net/start';
mongoose.connect(mongoURI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 8000;
app.listen(8000, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
