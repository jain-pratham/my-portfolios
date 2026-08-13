import cv2
import threading
from app.config import settings
from app.camera.reconnect import reconnect_stream
from app.utils.logger import get_logger

logger = get_logger("Camera")

class CameraStream:
    """
    Manages opening, reading, and releasing an OpenCV VideoCapture stream.
    Exposes frames and handles automatic reconnection upon failure.
    """
    def __init__(self, camera_url: str = None):
        self.camera_url = camera_url or settings.CAMERA_URL
        self.cap = None
        self._lock = threading.Lock()
        self._is_opened = False

    def open(self) -> bool:
        """
        Attempts to open the camera stream.
        """
        with self._lock:
            logger.info(f"Connecting to camera stream at: {self.camera_url}")
            self.cap = cv2.VideoCapture(self.camera_url)
            self._is_opened = self.cap.isOpened()
            if not self._is_opened:
                logger.error(f"Unable to connect to stream at {self.camera_url}")
            return self._is_opened

    def read_frame(self):
        """
        Reads a frame from the stream.
        Triggers reconnect_stream if the capture fails or stream closes.
        """
        if not self._is_opened or self.cap is None:
            self.open()

        ret, frame = self.cap.read()
        
        # Handle connection drops and re-synchronize boundaries
        if not ret or frame is None:
            logger.warning("Lost connection or failed to grab frame. Initiating reconnect process...")
            with self._lock:
                if self.cap is not None:
                    self.cap.release()
                self.cap = reconnect_stream(self.camera_url)
                self._is_opened = self.cap.isOpened()
                # Read immediate frame after reconnecting
                ret, frame = self.cap.read()
                
        return frame

    def release(self):
        """
        Safely releases OpenCV VideoCapture resources.
        """
        with self._lock:
            if self.cap is not None:
                self.cap.release()
                self.cap = None
            self._is_opened = False
            logger.info("Camera stream resources released.")
