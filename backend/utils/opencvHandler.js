// utils/opencvHandler.js
import { spawn } from 'child_process';

export const analyzeImageWithPython = (imageBuffer) => {
  return new Promise((resolve, reject) => {
    const python = spawn('python3', ['opencv_script.py']);
    
    let result = '';
    python.stdout.on('data', (data) => {
      result += data.toString();
    });

    python.stdin.write(imageBuffer);
    python.stdin.end();

    python.on('close', () => {
      resolve(result);
    });

    python.on('error', (err) => {
      reject(err);
    });
  });
};
