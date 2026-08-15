import cv2
import time
import numpy as np
from app.config import settings
from app.utils.logger import get_logger

logger = get_logger("Camera")

class CameraTamperingDetector:
    """
    Detects persistent camera feed tampering including frozen stream, 
    blacked/covered lens, or a major change in camera direction/scene angle.
    """
    def __init__(self, camera_id: str):
        self.camera_id = camera_id
        self.tampering_threshold = settings.CAMERA_TAMPERING_THRESHOLD  # Fraction of changed pixels
        self.tampering_duration = settings.CAMERA_TAMPERING_DURATION_SECONDS

        self.ref_frame_gray = None
        self.last_frame_gray = None
        self.tamper_start_time = None
        self.tamper_triggered = False

    def _preprocess(self, frame) -> np.ndarray:
        """
        Grayscales, resizes, and blurs a frame to eliminate high frequency noise
        for stable comparison.
        """
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        resized = cv2.resize(gray, (128, 128))
        blurred = cv2.GaussianBlur(resized, (5, 5), 0)
        return blurred

    def update(self, frame, current_time: float = None) -> list:
        """
        Processes the new frame and returns camera security events if tampering is detected.
        """
        if current_time is None:
            current_time = time.time()

        if frame is None:
            return []

        processed = self._preprocess(frame)
        events = []

        # Initialize reference frames on stream start
        if self.ref_frame_gray is None:
            self.ref_frame_gray = processed
            self.last_frame_gray = processed
            return []

        # 1. Check for frozen frame (no delta compared to previous frame)
        frozen_detected = False
        diff_last = cv2.absdiff(processed, self.last_frame_gray)
        if np.max(diff_last) == 0:
            frozen_detected = True

        self.last_frame_gray = processed

        # 2. Check for covered/black frame (lens blocked)
        avg_intensity = np.mean(processed)
        black_detected = avg_intensity < 12.0  # Threshold of pixel intensity (0-255)

        # 3. Check for camera angle shift (compared against initial reference frame)
        diff_ref = cv2.absdiff(processed, self.ref_frame_gray)
        _, thresh = cv2.threshold(diff_ref, 30, 255, cv2.THRESH_BINARY)
        non_zero = np.count_nonzero(thresh)
        change_ratio = non_zero / float(thresh.size)

        scene_changed = change_ratio > self.tampering_threshold

        is_tampering = frozen_detected or black_detected or scene_changed

        if is_tampering:
            if self.tamper_start_time is None:
                self.tamper_start_time = current_time
            else:
                elapsed = current_time - self.tamper_start_time
                if elapsed >= self.tampering_duration and not self.tamper_triggered:
                    self.tamper_triggered = True
                    message = "Camera tampering detected."
                    if frozen_detected:
                        message = "Camera stream appears frozen."
                    elif black_detected:
                        message = "Camera lens is covered or completely dark."
                    elif scene_changed:
                        message = "Camera orientation/view has significantly changed."

                    logger.warning(f"[Camera] {message} camera={self.camera_id}")
                    events.append({
                        "eventType": "CAMERA_TAMPERING",
                        "cameraId": self.camera_id,
                        "timestamp": current_time,
                        "message": message
                    })
        else:
            if self.tamper_triggered:
                self.tamper_triggered = False
                logger.info(f"[Camera] Camera {self.camera_id} tampering cleared (recovered).")
                events.append({
                    "eventType": "CAMERA_ONLINE",
                    "cameraId": self.camera_id,
                    "timestamp": current_time,
                    "message": "Camera view/feed restored to normal."
                })
            self.tamper_start_time = None

        return events
