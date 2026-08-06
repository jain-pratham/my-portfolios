# Run command to install dependencies if not present:
# pip install opencv-python ultralytics requests numpy

import cv2
import time
import requests
import json
import threading
from datetime import datetime
from ultralytics import YOLO

# ============================================================================
# ENTERPRISE CAMERA CONFIGURATION
# ============================================================================

# The URL of your network IP camera stream (adjust port/path if needed)
# For testing with local file or webcam, you can replace with 0 or a path.
CAMERA_URL = "http://192.168.1.15:8080/video"

# Next.js local v1 alerts API endpoint
API_BASE_URL = "http://localhost:3000/api/v1"

# Unique credentials provisioned from the Next.js portal
CAMERA_KEY = "CAM-89F3A1"
SECRET_TOKEN = "your_camera_secret_token_here"

# Free ImgBB cloud key (from https://api.imgbb.com/)
IMGBB_API_KEY = "your_imgbb_api_key_here"

# Alert Cooldown controls (prevent spamming alerts too frequently)
COOLDOWN_SECONDS = 10
last_alert_time = 0.0

# Load lightweight YOLOv8 nano model
print("[System] Initializing YOLOv8 Model...")
model = YOLO("yolov8n.pt")


# ============================================================================
# THREAT DISPATCH PIPELINE (BACKGROUND WORKERS)
# ============================================================================

def upload_to_imgbb(image_path, api_key):
    """Uploads the local alert frame snapshot to ImgBB and returns the URL."""
    if not api_key or api_key == "your_imgbb_api_key_here":
        print("[Cloud Worker] Error: ImgBB API key not configured. Skipping upload.")
        return None

    try:
        url = "https://api.imgbb.com/1/upload"
        payload = {"key": api_key}
        
        with open(image_path, "rb") as file:
            files = {"image": file}
            print(f"[Cloud Worker] Uploading snapshot '{image_path}'...")
            response = requests.post(url, params=payload, files=files, timeout=10)
            
        if response.status_code == 200:
            res_json = response.json()
            if res_json.get("success"):
                public_url = res_json["data"]["url"]
                print(f"[Cloud Worker] Upload successful! Public URL: {public_url}")
                return public_url
            else:
                print(f"[Cloud Worker] API rejected upload: {res_json.get('error', {}).get('message')}")
        else:
            print(f"[Cloud Worker] HTTP Error {response.status_code}: {response.text}")
    except Exception as e:
        print(f"[Cloud Worker] Exception during upload: {e}")
    return None


def send_alert_to_nextjs(image_url, max_confidence):
    """Posts threat payload securely to Next.js API endpoint."""
    headers = {
        "x-camera-key": CAMERA_KEY,
        "x-camera-token": SECRET_TOKEN,
        "Content-Type": "application/json"
    }

    payload = {
        "threatLevel": "HIGH",
        "threatType": "HUMAN_INTRUSION",
        "imageUrl": image_url or "",
        "timestamp": datetime.utcnow().isoformat() + "Z",  # ISO 8601 UTC
        "metadata": {
            "confidence": float(max_confidence)
        }
    }

    endpoint_url = f"{API_BASE_URL}/alerts"

    try:
        print(f"[API Dispatch] Connecting to {endpoint_url}...")
        response = requests.post(endpoint_url, data=json.dumps(payload), headers=headers, timeout=5)
        if response.status_code == 201:
            print(f"[API Dispatch] Response Code: 201 Created - Threat Saved!")
            print(f"[API Dispatch] Server Payload: {response.text}")
        else:
            print(f"[API Dispatch] Response Code: {response.status_code} - {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"[API Dispatch] Connection failed: Next.js API is unreachable. (Error: {e})")


def threat_dispatch_worker(frame_copy, max_confidence):
    """Worker function to save frame, upload snapshot, and post alert in the background."""
    temp_filename = "alert_frame.jpg"
    try:
        # Save current annotated frame locally
        success = cv2.imwrite(temp_filename, frame_copy)
        if not success:
            print("[Alert Worker] Failed to write temporary annotated frame to disk.")
            return

        print(f"[Alert Worker] Snapshot written locally to '{temp_filename}'")

        # Upload frame to obtain public image URL
        public_url = upload_to_imgbb(temp_filename, IMGBB_API_KEY)

        # Dispatch alert payload
        send_alert_to_nextjs(public_url, max_confidence)
        
    except Exception as e:
        print(f"[Alert Worker] Execution crashed: {e}")


# ============================================================================
# MAIN REAL-TIME DETECTION LOOP
# ============================================================================

def main():
    global last_alert_time
    
    print(f"[System] Connecting to camera feed at: {CAMERA_URL}")
    cap = cv2.VideoCapture(CAMERA_URL)

    window_name = f"CoreWatch Pro Security - Real-Time Human Detection ({CAMERA_KEY})"
    cv2.namedWindow(window_name, cv2.WINDOW_NORMAL)

    while True:
        ret, frame = cap.read()
        if not ret:
            print("[System] Warning: Lost frame sync. Reconnecting to video stream...")
            cap.release()
            time.sleep(2)
            cap = cv2.VideoCapture(CAMERA_URL)
            continue

        # Run inference using YOLOv8 model (object classes list: coco.txt, index 0 = 'person')
        results = model(frame, verbose=False)
        
        person_detected = False
        max_confidence = 0.0

        for r in results:
            boxes = r.boxes
            for box in boxes:
                cls_id = int(box.cls[0])
                confidence = float(box.conf[0])

                # Filter for class person (0) with confidence threshold (> 0.5)
                if cls_id == 0 and confidence >= 0.5:
                    person_detected = True
                    max_confidence = max(max_confidence, confidence)

                    # Extract coordinates
                    x1, y1, x2, y2 = map(int, box.xyxy[0])

                    # Draw bounding box (Green)
                    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)

                    # Create overlay label
                    label = f"Human Detected: {confidence:.2%}"
                    label_size, _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 1)
                    cv2.rectangle(frame, (x1, y1 - label_size[1] - 10), (x1 + label_size[0], y1), (0, 255, 0), cv2.FILLED)
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

        # Draw local live status/timestamp on the frame
        timestamp_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        cv2.putText(
            frame,
            f"LIVE | {timestamp_str}",
            (10, 30),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            (0, 255, 0),
            2,
            cv2.LINE_AA
        )

        # Cooldown trigger validation
        if person_detected:
            current_time = time.time()
            if current_time - last_alert_time >= COOLDOWN_SECONDS:
                last_alert_time = current_time
                print(f"\n🚨 [ALERT] Human detected ({max_confidence:.2%}). Triggering background threat dispatch...")
                
                # Copy the frame so worker thread gets snapshot state
                frame_copy = frame.copy()

                # Dispatch worker thread
                worker_thread = threading.Thread(
                    target=threat_dispatch_worker,
                    args=(frame_copy, max_confidence),
                    daemon=True
                )
                worker_thread.start()

        # Display window
        cv2.imshow(window_name, frame)

        # Break loop gracefully on 'q' press
        if cv2.waitKey(1) & 0xFF == ord('q'):
            print("[System] Terminating detection client...")
            break

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
