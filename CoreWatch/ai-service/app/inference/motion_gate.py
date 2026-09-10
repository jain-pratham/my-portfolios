import cv2
import numpy as np
from app.config import settings
from app.utils.logger import get_logger

logger = get_logger("MotionGate")

class MotionGate:
    def __init__(self, threshold: float = None, enabled: bool = None, low_res_dims: tuple = (160, 120)):
        self.threshold = threshold if threshold is not None else float(getattr(settings, "MOTION_THRESHOLD", 0.15))
        self.enabled = enabled if enabled is not None else bool(getattr(settings, "MOTION_GATE_ENABLED", True))
        self.low_res_dims = low_res_dims
        self.prev_gray = None

    def update(self, frame) -> dict:
        """
        Runs extremely cheap scene change detection.
        Returns:
            dict: { "motionDetected": bool, "motionScore": float, "sceneChanged": bool }
        """
        if not self.enabled:
            return {
                "motionDetected": True,
                "motionScore": 1.0,
                "sceneChanged": True
            }

        if frame is None:
            return {
                "motionDetected": False,
                "motionScore": 0.0,
                "sceneChanged": False
            }

        try:
            # 1. Convert to low-resolution grayscale
            resized = cv2.resize(frame, self.low_res_dims, interpolation=cv2.INTER_AREA)
            gray = cv2.cvtColor(resized, cv2.COLOR_BGR2GRAY)
            
            # Smooth slightly to eliminate high-frequency noise
            gray = cv2.GaussianBlur(gray, (5, 5), 0)

            if self.prev_gray is None:
                self.prev_gray = gray
                # Initialize reference frame, return no false motion event
                return {
                    "motionDetected": False,
                    "motionScore": 0.0,
                    "sceneChanged": False
                }

            # 2. Compute absolute frame difference
            diff = cv2.absdiff(gray, self.prev_gray)
            _, thresh = cv2.threshold(diff, 15, 255, cv2.THRESH_BINARY)

            # 3. Calculate motion score: fraction of changed pixels
            non_zero_count = np.count_nonzero(thresh)
            total_pixels = self.low_res_dims[0] * self.low_res_dims[1]
            motion_score = float(non_zero_count) / float(total_pixels)

            # 4. Compare with threshold
            motion_detected = motion_score >= self.threshold

            # Update previous reference frame
            self.prev_gray = gray

            return {
                "motionDetected": motion_detected,
                "motionScore": round(motion_score, 4),
                "sceneChanged": motion_detected
            }
        except Exception as e:
            logger.error(f"Error inside MotionGate update: {e}", exc_info=True)
            # Fallback to fail-safe behavior
            return {
                "motionDetected": True,
                "motionScore": 1.0,
                "sceneChanged": True
            }
