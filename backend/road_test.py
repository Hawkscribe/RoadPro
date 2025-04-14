from ultralytics import YOLO
import cv2
import os

# Load trained model
model = YOLO('best.pt')  # Make sure 'best.pt' is in the same directory or provide full path

# Test images folder
image_folder = 'resources'
output_folder = 'predicted'

# Create output folder if it doesn't exist
os.makedirs(output_folder, exist_ok=True)

# Valid image extensions
valid_exts = {'.jpg', '.jpeg', '.png', '.bmp', '.tif', '.tiff', '.webp'}

# Loop through all images in the folder
for img_name in os.listdir(image_folder):
    # Skip hidden files like .DS_Store
    if not os.path.splitext(img_name)[1].lower() in valid_exts:
        continue

    img_path = os.path.join(image_folder, img_name)

    # Run inference
    results = model(img_path)

    # Save result image and print pothole count
    for r in results:
        im_array = r.plot()
        output_path = os.path.join(output_folder, f"pred_{img_name}")
        cv2.imwrite(output_path, im_array)

        n_potholes = len(r.boxes)
        print(f"{img_name}: {n_potholes} potholes found.")

        if n_potholes == 0:
            print("🚫 No potholes detected. You're on smooth roads!")
