import sys
import json
import cv2
import numpy as np
from ultralytics import YOLO
import os

image_path = sys.argv[1]
model = YOLO("best.pt")
results = model(image_path)[0]

boxes = results.boxes
annotated_img = results.plot()

# Save the annotated image
annotated_path = f"annotated_{os.path.basename(image_path)}"
cv2.imwrite(f"./uploads/{annotated_path}", annotated_img)

# Measure width of each pothole in pixels
widths = []
if boxes is not None:
    for box in boxes.xywh:
        _, _, w, _ = box
        widths.append(float(w))

output = {
    "num_potholes": len(widths),
    "widths": widths
}

# Send to Node.js
print(json.dumps(output) + "::" + f"uploads/{annotated_path}")