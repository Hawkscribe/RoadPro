const express = require("express");
const multer = require("multer");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Setup multer for image uploads
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

      // Return image URL (assuming static file serving setup)
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

module.exports = router;
