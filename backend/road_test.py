from ultralytics import YOLO
import cv2
import os

# Load trained model
model = YOLO('best.pt')

# Test folder path
image_folder = 'resources'
output_folder = 'predicted'

# Create output folder if not exist
os.makedirs(output_folder, exist_ok=True)

# Loop through test images
for img_name in os.listdir(image_folder):
    img_path = os.path.join(image_folder, img_name)
    results = model(img_path)

    # Save result image
    for r in results:
        im_array = r.plot()
        cv2.imwrite(os.path.join(output_folder, f"pred_{img_name}"), im_array)

        # Count potholes
        n_potholes = len(r.boxes)
        print(f"{img_name}: {n_potholes} potholes found.")

        if n_potholes == 0:
            print("🚫 No potholes detected. You're on smooth roads!")

