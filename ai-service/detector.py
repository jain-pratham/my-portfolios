# Smart Security Camera - Human Detection & Alert Dispatcher
#
# To run this script, first install the required packages:
# pip install opencv-python ultralytics requests
#
# ---------------------------------------------------------------------------
# Instructions to get a free ImgBB API Key:
# 1. Go to https://imgbb.com/ and create a free account.
# 2. Visit https://api.imgbb.com/ to generate your API Key.
# 3. Replace 'YOUR_IMGBB_API_KEY' in this file with your generated key.
# ---------------------------------------------------------------------------

import cv2
import time
import json
import requests
import threading
from datetime import datetime
from ultralytics import YOLO

# CAMERA_URL of your stream.
# Replace with your phone's actual IP address if it changes (e.g. 192.0.0.4)
# Note: Root URL "/" serves HTML which fails. We append "/video" for the stream.
CAMERA_URL = "http://192.0.0.4:8080/video"


# ImgBB API Key (Get from https://api.imgbb.com/)
IMGBB_API_KEY ="b41d8cd80808d59eba22407cf32b0ec2"

# Unique Camera Key generated from Next.js Dashboard settings
# Replace with your generated key (e.g. CAM-ABCDEF)
CAMERA_KEY = "CAM-ABKF0C"

# Local Next.js alert handler endpoint
NEXTJS_ALERT_API = "http://localhost:3000/api/alerts"

# Cooldown config (Seconds to wait between sending alert events)
COOLDOWN = 10
last_alert_time = 0.0


def upload_to_imgbb(image_path, api_key):
    """Uploads the local image to ImgBB and returns its public URL."""
    if api_key == "YOUR_IMGBB_API_KEY" or not api_key:
        print("[ImgBB] Error: ImgBB API key is not configured. Skipping upload.")
        return None

    try:
        url = "https://api.imgbb.com/1/upload"
        payload = {"key": api_key}
        
        with open(image_path, "rb") as file:
            files = {"image": file}
            print(f"[ImgBB] Uploading {image_path} to cloud storage...")
            response = requests.post(url, params=payload, files=files, timeout=10)
            
        if response.status_code == 200:
            res_json = response.json()
            if res_json.get("success"):
                public_url = res_json["data"]["url"]
                print(f"[ImgBB] Upload successful! Public URL: {public_url}")
                return public_url
            else:
                print(f"[ImgBB] Upload failed: {res_json.get('error', {}).get('message', 'Unknown error')}")
        else:
            print(f"[ImgBB] HTTP Error {response.status_code}: {response.text}")
    except Exception as e:
        print(f"[ImgBB] Exception occurred during upload: {e}")
    return None


def send_alert_to_nextjs(camera_key, image_url, api_url):
    """Sends the security alert payload to the local Next.js server."""
    payload = {
        "cameraKey": camera_key,
        "timestamp": datetime.utcnow().isoformat() + "Z",  # ISO 8601 UTC string
        "imageUrl": image_url or "",
        "message": "Human detected in shop!"
    }
    
    try:
        headers = {"Content-Type": "application/json"}
        print(f"[Next.js Alert] Posting payload to {api_url}...")
        response = requests.post(api_url, data=json.dumps(payload), headers=headers, timeout=3)
        print(f"[Next.js Alert] Server responded: HTTP {response.status_code} - {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"[Next.js Alert] Connection failed: Next.js server is not running or unreachable. (Error: {e})")


def process_and_dispatch_alert(frame_copy, camera_key, api_key, api_url):
    """Saves the frame, uploads to ImgBB, and sends Next.js API alert.
    
    Runs in a background thread to prevent camera preview frame stuttering.
    """
    temp_filename = "detection.jpg"
    try:
        # Save frame as local image file
        success = cv2.imwrite(temp_filename, frame_copy)
        if not success:
            print("[Alert Worker] Failed to write temporary frame to disk.")
            return

        print(f"[Alert Worker] Saved frame snapshot to {temp_filename}")

        # Upload image to ImgBB
        public_image_url = upload_to_imgbb(temp_filename, api_key)

        # Dispatch API alert to Next.js
        send_alert_to_nextjs(camera_key, public_image_url, api_url)
        
    except Exception as e:
        print(f"[Alert Worker] Error during background dispatch: {e}")


def main():
    global last_alert_time

    print(f"Connecting to camera stream at: {CAMERA_URL}")
    cap = cv2.VideoCapture(CAMERA_URL)

    if not cap.isOpened():
        print(f"Error: Unable to connect to stream at {CAMERA_URL}")
        if "YOUR_PHONE_IP" in CAMERA_URL:
            print("Action Required: Please replace 'YOUR_PHONE_IP' with your phone's actual IP address.")
        return

    print("Loading YOLOv8n model...")
    model = YOLO("yolov8n.pt")
    
    PERSON_CLASS_ID = 0
    window_name = "Shop Security - Real-Time Human Detection"
    print(f"Starting processing. Alert Cooldown is set to {COOLDOWN} seconds.")
    print("Press 'q' in the camera window to exit cleanly.")

    while True:
        # Read a frame from the stream
        ret, frame = cap.read()
        
        # Handle connection drops and re-synchronize boundaries
        if not ret or frame is None:
            print("Failed to grab frame from stream. Reconnecting...")
            cap.release()
            cv2.waitKey(1000)
            cap = cv2.VideoCapture(CAMERA_URL)
            continue

        # Run YOLOv8 on the frame filtering strictly for 'person' (Class ID 0)
        results = model.predict(source=frame, classes=[PERSON_CLASS_ID], verbose=False)
        
        person_detected = False

        for result in results:
            boxes = result.boxes
            if boxes is None or len(boxes) == 0:
                continue

            person_detected = True

            # Draw green bounding boxes and confidence levels
            for box in boxes:
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                confidence = float(box.conf[0])

                # Draw bounding box
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)

                # Draw label header
                label = f"Human Detected: {confidence:.2%}"
                label_size, _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 1)
                cv2.rectangle(frame, (x1, y1 - label_size[1] - 10), (x1 + label_size[0], y1), (0, 255, 0), cv2.FILLED)

                # Put label text on frame
                cv2.putText(
                    frame,
                    label,
                    (x1, y1 - 5),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.5,
                    (0, 0, 0),
                    1,
                    cv2.LINE_AA
                )

        # Trigger Cooldown Alert Check
        if person_detected:
            current_time = time.time()
            if current_time - last_alert_time >= COOLDOWN:
                last_alert_time = current_time
                print("\n🚨 [ALERT TRIGGERED] Human detected! Launching alert thread...")
                
                # Run the upload and POST request in a background thread to prevent UI freezing
                alert_thread = threading.Thread(
                    target=process_and_dispatch_alert,
                    args=(frame.copy(), CAMERA_KEY, IMGBB_API_KEY, NEXTJS_ALERT_API),
                    daemon=True
                )
                alert_thread.start()

        # Display the frame window
        cv2.imshow(window_name, frame)

        # Exit on 'q' press
        if cv2.waitKey(1) & 0xFF == ord('q'):
            print("Quitting script...")
            break

    cap.release()
    cv2.destroyAllWindows()
    print("Resources released. Script stopped.")


if __name__ == "__main__":
    main()
