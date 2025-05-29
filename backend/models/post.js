// routes/post.js
import express from "express";
import multer from "multer";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const inputPath = req.file.path;
    const outputFilename = `annotated-${Date.now()}.jpg`;
    const outputPath = path.join("annotated", outputFilename);

    const pythonProcess = spawn("python3", [
      "ml/detect_potholes.py",
      inputPath,
      outputPath,
    ]);

    let pythonOutput = "";

    pythonProcess.stdout.on("data", (data) => {
      pythonOutput += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error("stderr:", data.toString());
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        return res.status(500).json({ error: "Python script failed." });
      }

      const result = JSON.parse(pythonOutput);

      res.json({
        ...result,
        annotatedImage: `/annotated/${outputFilename}`,
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Correct ES module export
export default router;
