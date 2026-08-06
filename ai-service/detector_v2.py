# Run command to install dependencies if not present:
# pip install opencv-python ultralytics requests numpy

import cv2
import numpy as np
import time
import requests
import json
import threading
from datetime import datetime
from ultralytics import YOLO

# ============================================================================
# SYSTEM CONFIGURATION & CREDENTIALS
# ============================================================================

# Network Video Stream URL
CAMERA_URL = "http://192.168.1.15:8080/video"

# Next.js API configuration
API_BASE_URL = "http://localhost:3000/api/v1"
CAMERA_KEY = "CAM-89F3A1"
SECRET_TOKEN = "your_camera_secret_token_here"

# Free ImgBB cloud key (from https://api.imgbb.com/)
IMGBB_API_KEY = "your_imgbb_api_key_here"

# Intrusion Alert parameters
COOLDOWN_SECONDS = 10
last_alert_time = 0.0

# Low-Light / Night Enhancement Toggle
ENABLE_NIGHT_VISION = True

# Restricted shop area represented as a Polygon (ROI)
ROI_POLYGON = [(100, 150), (500, 150), (500, 450), (100, 450)]

# Load YOLOv8 nano model
print("[System] Loading YOLOv8 Model...")
model = YOLO("yolov8n.pt")


# ============================================================================
# 1. LOW-LIGHT / NIGHT VISION ENHANCEMENT (CLAHE)
# ============================================================================

def enhance_low_light(frame):
    """Enhances low-light frames using CLAHE in the LAB color space."""
    # Convert from BGR to LAB color space
    lab = cv2.cvtColor(frame, cv2.COLOR_BGR2LAB)
    
    # Split the LAB channels
    l_channel, a_channel, b_channel = cv2.split(lab)
    
    # Apply CLAHE to the Lightness (L) channel
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
    cl_enhanced = clahe.apply(l_channel)
    
    # Merge channels back together
    lab_merged = cv2.merge((cl_enhanced, a_channel, b_channel))
    
    # Convert from LAB back to BGR color space
    enhanced_frame = cv2.cvtColor(lab_merged, cv2.COLOR_LAB2BGR)
    return enhanced_frame


# ============================================================================
# 2. THREAT DISPATCH PIPELINE
# ============================================================================

def upload_to_imgbb(image_path, api_key):
    """Uploads threat snapshot to ImgBB and returns its public URL."""
    if not api_key or api_key == "your_imgbb_api_key_here":
        print("[Cloud Worker] Warning: ImgBB API key not configured. Skipping upload.")
        return None

    try:
        url = "https://api.imgbb.com/1/upload"
        payload = {"key": api_key}
        
        with open(image_path, "rb") as file:
            files = {"image": file}
            print(f"[Cloud Worker] Uploading alert snapshot '{image_path}'...")
            response = requests.post(url, params=payload, files=files, timeout=10)
            
        if response.status_code == 200:
            res_json = response.json()
            if res_json.get("success"):
                public_url = res_json["data"]["url"]
                print(f"[Cloud Worker] Upload complete: {public_url}")
                return public_url
            else:
                print(f"[Cloud Worker] Upload rejected: {res_json.get('error', {}).get('message')}")
        else:
            print(f"[Cloud Worker] HTTP Error {response.status_code}: {response.text}")
    except Exception as e:
        print(f"[Cloud Worker] Connection exception: {e}")
    return None


def send_alert_to_nextjs(image_url, max_confidence):
    """Dispatches the threat alert securely to the Next.js API Router endpoint."""
    headers = {
        "x-camera-key": CAMERA_KEY,
        "x-camera-token": SECRET_TOKEN,
        "Content-Type": "application/json"
    }

    payload = {
        "threatLevel": "HIGH",
        "threatType": "RESTRICTED_ZONE_INTRUSION",
        "imageUrl": image_url or "",
        "timestamp": datetime.utcnow().isoformat() + "Z",  # ISO 8601 UTC
        "metadata": {
            "confidence": float(max_confidence)
        }
    }

    endpoint_url = f"{API_BASE_URL}/alerts"

    try:
        print(f"[API Dispatch] Sending POST threat log to {endpoint_url}...")
        response = requests.post(endpoint_url, data=json.dumps(payload), headers=headers, timeout=5)
        if response.status_code == 201:
            print(f"[API Dispatch] Success: 201 Created - Zone intrusion logged!")
            print(f"[API Dispatch] Response Payload: {response.text}")
        else:
            print(f"[API Dispatch] Failure: HTTP {response.status_code} - {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"[API Dispatch] Connection error: Next.js server is unreachable. (Error: {e})")


def threat_dispatch_worker(frame_copy, max_confidence):
    """Background worker threat dispatcher thread."""
    temp_filename = "intrusion_frame.jpg"
    try:
        # Save current state locally
        success = cv2.imwrite(temp_filename, frame_copy)
        if not success:
            print("[Alert Worker] Failed to save frame image.")
            return

        print(f"[Alert Worker] Local snapshot written to '{temp_filename}'")

        # Upload image and post metadata
        public_url = upload_to_imgbb(temp_filename, IMGBB_API_KEY)
        send_alert_to_nextjs(public_url, max_confidence)
        
    except Exception as e:
        print(f"[Alert Worker] Worker thread error: {e}")


# ============================================================================
# 3. DETECTION LOOP & ROI REGION MAPPING
# ============================================================================

def main():
    global last_alert_time
    
    # Format ROI Polygon coordinates into standard OpenCV contour mapping
    roi_contour = np.array(ROI_POLYGON, dtype=np.int32).reshape((-1, 1, 2))

    print(f"[System] Stream starting: {CAMERA_URL}")
    cap = cv2.VideoCapture(CAMERA_URL)

    window_name = f"CoreWatch V2 Guard - Zone Intrusion Detector ({CAMERA_KEY})"
    cv2.namedWindow(window_name, cv2.WINDOW_NORMAL)

    while True:
        ret, frame = cap.read()
        if not ret:
            print("[System] Error: Lost frame sync. Reconnecting to MJPEG feed...")
            cap.release()
            time.sleep(2)
            cap = cv2.VideoCapture(CAMERA_URL)
            continue

        # Create copy for AI processing (and optionally apply night vision CLAHE)
        processed_frame = frame.copy()
        if ENABLE_NIGHT_VISION:
            processed_frame = enhance_low_light(processed_frame)

        # Run inference using YOLOv8 model on processed frame
        results = model(processed_frame, verbose=False)
        
        intrusion_detected = False
        max_confidence = 0.0

        for r in results:
            boxes = r.boxes
            for box in boxes:
                cls_id = int(box.cls[0])
                confidence = float(box.conf[0])

                # Class 0 represents "person" in COCO dataset
                if cls_id == 0 and confidence >= 0.5:
                    x1, y1, x2, y2 = map(int, box.xyxy[0])

                    # Calculate bottom-center coordinate (approx. feet location of person)
                    x_center = int((x1 + x2) / 2)
                    y_bottom = int(y2)

                    # Check if feet coordinates reside inside the ROI polygon contour
                    inside = cv2.pointPolygonTest(roi_contour, (x_center, y_bottom), measureDist=False)

                    # inside >= 0 means person is inside or on the boundary of the zone
                    if inside >= 0:
                        intrusion_detected = True
                        max_confidence = max(max_confidence, confidence)

                        # Draw box around intruding person (Red warning)
                        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 255), 2)
                        label = f"WARNING: Zone Intruder ({confidence:.2%})"
                        cv2.putText(frame, label, (x1, y1 - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)
                        
                        # Draw feet detection point
                        cv2.circle(frame, (x_center, y_bottom), 5, (0, 0, 255), -1)
                    else:
                        # Person is outside the restricted zone (Green safe)
                        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                        label = f"Staff/Person ({confidence:.2%})"
                        cv2.putText(frame, label, (x1, y1 - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1)

        # Define polygon display color based on intrusion state
        if intrusion_detected:
            poly_color = (0, 0, 255) # Red warning
            status_text = "INTRUSION DETECTED!"
            status_color = (0, 0, 255)
        else:
            poly_color = (0, 255, 255) # Yellow monitoring
            status_text = "Restricted Zone Monitored"
            status_color = (0, 255, 255)

        # Draw ROI Polygon overlay on the screen
        cv2.polylines(frame, [roi_contour], isClosed=True, color=poly_color, thickness=2)

        # Draw HUD UI labels
        timestamp_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        cv2.putText(frame, f"STATUS: {status_text}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.6, status_color, 2)
        cv2.putText(
            frame, 
            f"HUD | {timestamp_str} | Night Vision: {'ON' if ENABLE_NIGHT_VISION else 'OFF'}", 
            (10, 60), 
            cv2.FONT_HERSHEY_SIMPLEX, 
            0.5, 
            (255, 255, 255), 
            1
        )

        # Dispatch alert if cooldown window permits
        if intrusion_detected:
            current_time = time.time()
            if current_time - last_alert_time >= COOLDOWN_SECONDS:
                last_alert_time = current_time
                print(f"\n🚨 [INTRUSION ALERT] Person detected inside zone ({max_confidence:.2%}). Dispatching background thread...")
                
                # Copy frame for asynchronous worker
                frame_copy = frame.copy()

                worker_thread = threading.Thread(
                    target=threat_dispatch_worker,
                    args=(frame_copy, max_confidence),
                    daemon=True
                )
                worker_thread.start()

        # Display window
        cv2.imshow(window_name, frame)

        # Exit on 'q' press
        if cv2.waitKey(1) & 0xFF == ord('q'):
            print("[System] Terminating detection client...")
            break

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
