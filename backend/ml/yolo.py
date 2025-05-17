# ml/detect_potholes.py
# Modified version - Ensure best.pt is in this SAME directory

import sys
import json
import cv2
import numpy as np
from ultralytics import YOLO
import os

# --- Script Configuration ---
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(SCRIPT_DIR, "best.pt") # Assumes model is in the same directory
# --- End Configuration ---

# 1. Check for correct number of arguments
if len(sys.argv) != 3:
    print(json.dumps({
        "error": "Internal Server Error: Script called with incorrect arguments." # User-friendly msg
       # "debug": f"Usage: python {os.path.basename(__file__)} <input_image_path> <output_annotated_path>" # For server logs
    }))
    sys.exit(1)

input_image_path = sys.argv[1]
output_annotated_path = sys.argv[2]

try:
    # 2. Check if model file exists
    if not os.path.exists(MODEL_PATH):
         print(json.dumps({"error": f"Server Configuration Error: Model file not found."}))
         sys.exit(1)

    # 3. Check if input image file exists
    if not os.path.exists(input_image_path):
         print(json.dumps({"error": f"Server Error: Input image not found at {input_image_path}."})) # Changed error msg
         sys.exit(1)

    # Load the model
    model = YOLO(MODEL_PATH)
    # Process the image
    results = model(input_image_path)[0]

    boxes = results.boxes
    annotated_img = results.plot() # Get the annotated image frame

    # 4. Ensure the output directory exists before saving
    output_dir = os.path.dirname(output_annotated_path)
    if output_dir and not os.path.exists(output_dir):
         os.makedirs(output_dir, exist_ok=True)

    # 5. Save the annotated image to the path specified by Node.js
    save_success = cv2.imwrite(output_annotated_path, annotated_img)
    if not save_success:
        print(json.dumps({"error": f"Server Error: Failed to save annotated image."}))
        sys.exit(1)

    # 6. Measure width of each pothole in pixels
    widths = []
    confidences = [] # Optionally capture confidences
    if boxes is not None and hasattr(boxes, 'xywh') and boxes.xywh is not None:
        for i, box_xywh in enumerate(boxes.xywh):
            widths.append(float(box_xywh[2])) # Width is at index 2
            if hasattr(boxes, 'conf') and boxes.conf is not None and i < len(boxes.conf):
                 confidences.append(float(boxes.conf[i]))


    # 7. Prepare JSON output data
    output_data = {
        "num_potholes": len(widths),
        "widths_pixels": widths,
        "confidences": confidences # Add confidences if needed
    }

    # 8. Print ONLY the JSON data to stdout
    print(json.dumps(output_data))
    sys.exit(0) # Exit with 0 to indicate success

except Exception as e:
    # Catch any unexpected errors during processing
    print(json.dumps({"error": f"ML Model Error: {str(e)}"})) # More specific error type
    sys.exit(1)