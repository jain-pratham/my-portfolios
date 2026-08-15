import time
from app.config import settings
from app.utils.logger import get_logger

logger = get_logger("Camera")

class CameraOfflineDetector:
    """
    Monitors camera stream health and flags offline/online state transitions.
    Ensures warnings/recovery messages are sent exactly once.
    """
    def __init__(self, camera_id: str, threshold_seconds: float = None):
        self.camera_id = camera_id
        self.threshold = threshold_seconds if threshold_seconds is not None else settings.CAMERA_OFFLINE_AFTER_SECONDS
        self.last_frame_time = time.time()
        self.is_offline = False

    def update(self, frame_received: bool, current_time: float = None) -> list:
        """
        Updates the health monitor and returns state transition events if any.
        """
        if current_time is None:
            current_time = time.time()

        events = []

        if frame_received:
            self.last_frame_time = current_time
            if self.is_offline:
                self.is_offline = False
                logger.info(f"[Camera] Camera {self.camera_id} connection recovered (ONLINE).")
                events.append({
                    "eventType": "CAMERA_ONLINE",
                    "cameraId": self.camera_id,
                    "timestamp": current_time,
                    "message": f"Camera connection recovered."
                })
        else:
            time_elapsed = current_time - self.last_frame_time
            if time_elapsed > self.threshold and not self.is_offline:
                self.is_offline = True
                logger.warning(f"[Camera] Camera {self.camera_id} has gone OFFLINE (duration={time_elapsed:.1f}s).")
                events.append({
                    "eventType": "CAMERA_OFFLINE",
                    "cameraId": self.camera_id,
                    "timestamp": current_time,
                    "message": f"Camera offline detector triggered. No feed received for {time_elapsed:.1f} seconds."
                })

        return events
