import cv2
import json
import time
import requests
import threading
from datetime import datetime
from app.config import settings
from app.alerts.image_uploader import upload_to_imgbb
from app.utils.logger import get_logger

logger = get_logger("Alert")

class AlertDispatcher:
    """
    Manages alerting cooldowns per camera key and coordinates the 
    background upload/dispatch workers to keep video preview threads non-blocking.
    """
    def __init__(self, api_url: str = None, cooldown_seconds: int = None):
        self.api_url = api_url or settings.NEXTJS_ALERT_API
        self.cooldown_seconds = cooldown_seconds if cooldown_seconds is not None else settings.ALERT_COOLDOWN
        
        # Mapping camera_key -> last alert timestamp (float)
        self._last_alert_times = {}
        self._lock = threading.Lock()

    def can_trigger_alert(self, camera_key: str, current_time: float) -> bool:
        """
        Validates if the camera key is outside the cooldown window.
        If yes, locks in the current timestamp and returns True.
        """
        with self._lock:
            last_time = self._last_alert_times.get(camera_key, 0.0)
            if current_time - last_time >= self.cooldown_seconds:
                self._last_alert_times[camera_key] = current_time
                return True
            return False

    def dispatch_alert(self, frame, camera_key: str, message: str = "Human detected in shop!"):
        """
        Launches the asynchronous alert dispatch worker.
        Creates a copy of the frame to prevent mutation issues.
        """
        frame_copy = frame.copy()
        
        # Run the upload and POST request in a background thread to prevent UI freezing
        worker_thread = threading.Thread(
            target=self._dispatch_worker,
            args=(frame_copy, camera_key, message),
            daemon=True
        )
        worker_thread.start()

    def _dispatch_worker(self, frame, camera_key: str, message: str):
        """
        Saves snapshot, uploads to ImgBB, and posts threat metadata to Next.js API.
        """
        # Save snapshot using camera key for uniqueness to support future multi-camera setups
        temp_filename = f"detection_{camera_key}.jpg"
        
        try:
            # Save frame as local image file
            success = cv2.imwrite(temp_filename, frame)
            if not success:
                logger.error(f"Failed to write temporary snapshot to disk for camera {camera_key}.")
                return

            logger.info(f"Saved local snapshot to {temp_filename}")

            # Upload image to ImgBB
            image_url = upload_to_imgbb(temp_filename)

            # Send payload to Next.js server
            self._send_payload(camera_key, image_url, message)
            
        except Exception as e:
            logger.error(f"Error during background dispatch: {e}")

    def _send_payload(self, camera_key: str, image_url: str, message: str):
        """
        Helper method to perform HTTP POST to the Next.js API server.
        """
        payload = {
            "cameraKey": camera_key,
            "timestamp": datetime.utcnow().isoformat() + "Z",  # ISO 8601 UTC string
            "imageUrl": image_url or "",
            "message": message
        }

        try:
            headers = {"Content-Type": "application/json"}
            logger.info(f"Posting alert payload to Next.js endpoint: {self.api_url}...")
            
            response = requests.post(self.api_url, data=json.dumps(payload), headers=headers, timeout=5)
            logger.info(f"Server responded: HTTP {response.status_code} - {response.text}")
        except requests.exceptions.RequestException as e:
            logger.error(f"Connection failed: Next.js server is unreachable. (Error: {e})")
