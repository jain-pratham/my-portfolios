import cv2
import time
import threading
from app.config import settings
from app.camera.reconnect import reconnect_stream
from app.utils.logger import get_logger

logger = get_logger("Camera")

class CameraStream:
    """
    Manages opening, reading, and releasing an OpenCV VideoCapture stream.
    Uses a background thread to continuously pull frames to prevent OpenCV queue lag.
    """
    def __init__(self, camera_url: str = None):
        self.camera_url = camera_url or settings.CAMERA_URL
        self.cap = None
        self._lock = threading.Lock()
        self._is_opened = False
        self.latest_frame = None
        self.grab_thread = None
        self.running = False

    def open(self) -> bool:
        """
        Attempts to open the camera stream and starts the grab thread.
        """
        with self._lock:
            if self._is_opened:
                return True
                
            logger.info(f"Connecting to camera stream at: {self.camera_url}")
            self.cap = cv2.VideoCapture(self.camera_url)
            self._is_opened = self.cap.isOpened()
            
            if self._is_opened:
                self.running = True
                self.grab_thread = threading.Thread(target=self._grab_frames, name="GrabThread", daemon=True)
                self.grab_thread.start()
                logger.info("Real-time stream grabbing thread started successfully.")
            else:
                logger.error(f"Unable to connect to stream at {self.camera_url}")
                
            return self._is_opened

    def _grab_frames(self):
        """
        Continuously grabs frames in the background to prevent OpenCV buffer build-up.
        """
        while self.running and self._is_opened:
            try:
                if self.cap is not None:
                    ret, frame = self.cap.read()
                    if ret and frame is not None:
                        with self._lock:
                            self.latest_frame = frame
                    else:
                        time.sleep(0.01)
                else:
                    time.sleep(0.01)
            except Exception as e:
                logger.error(f"Error in grab thread: {e}")
                time.sleep(0.1)

    def read_frame(self):
        """
        Returns the latest grabbed frame from the background thread.
        """
        if not self._is_opened or self.cap is None:
            self.open()

        # Retrieve the latest frame from the lock
        with self._lock:
            frame = self.latest_frame

        # If no frame has been grabbed yet, wait briefly
        attempts = 0
        while frame is None and attempts < 10:
            time.sleep(0.05)
            with self._lock:
                frame = self.latest_frame
            attempts += 1

        # If still None or connection dropped, trigger reconnection
        if frame is None:
            logger.warning("No frame grabbed. Reconnecting stream...")
            self.reconnect()
            with self._lock:
                frame = self.latest_frame

        return frame

    def reconnect(self):
        """
        Reconnects the stream and restarts the frame grabbing thread.
        """
        with self._lock:
            self.running = False
            if self.cap is not None:
                self.cap.release()
            self.cap = reconnect_stream(self.camera_url)
            self._is_opened = self.cap.isOpened()
            if self._is_opened:
                self.running = True
                self.grab_thread = threading.Thread(target=self._grab_frames, name="GrabThread", daemon=True)
                self.grab_thread.start()

    def release(self):
        """
        Safely releases OpenCV VideoCapture resources and stops the grab thread.
        """
        with self._lock:
            self.running = False
            self._is_opened = False
            if self.cap is not None:
                self.cap.release()
                self.cap = None
            logger.info("Camera stream resources released.")
