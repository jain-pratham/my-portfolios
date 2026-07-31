import time
import threading
from typing import Tuple, Any, Union
import cv2

from src.camera.camera_interface import CameraInterface
from src.utils.logger import logger


class OpenCVCamera(CameraInterface):
    """Threaded OpenCV implementation of CameraInterface to handle USB, Webcams, and RTSP streams.
    
    Reads frames continuously in a background thread to prevent buffering latency
    and handles automatic reconnection.
    """

    def __init__(self, source: Union[int, str], reconnect_interval: float = 5.0):
        self.source = source
        self.reconnect_interval = reconnect_interval
        
        self.cap: Union[cv2.VideoCapture, None] = None
        self._latest_frame: Any = None
        self._is_connected = False
        self._is_running = False
        
        self._lock = threading.Lock()
        self._thread: Union[threading.Thread, None] = None
        self._stop_event = threading.Event()

    def open(self) -> bool:
        """Opens the camera connection and starts the background acquisition thread."""
        with self._lock:
            if self._is_running:
                logger.warning(f"Camera stream for source {self.source} is already running.")
                return True

            logger.info(f"Opening camera stream for source: {self.source}")
            self.cap = cv2.VideoCapture(self.source)
            
            if not self.cap.isOpened():
                logger.error(f"Failed to open camera source: {self.source}")
                self._is_connected = False
            else:
                logger.info(f"Successfully opened camera source: {self.source}")
                self._is_connected = True

            self._stop_event.clear()
            self._is_running = True
            self._thread = threading.Thread(
                target=self._capture_loop, 
                name=f"CameraCapture-{self.source}", 
                daemon=True
            )
            self._thread.start()
            return self._is_connected

    def _capture_loop(self) -> None:
        """Background thread loop to continuously read frames and handle reconnections."""
        logger.info(f"Started frame capture thread for source {self.source}")
        
        while not self._stop_event.is_set():
            if not self._is_connected or self.cap is None or not self.cap.isOpened():
                logger.warning(f"Camera source {self.source} disconnected. Initiating reconnection...")
                self._reconnect()
                if self._stop_event.is_set():
                    break
                # Sleep a bit to avoid hot looping if reconnection fails immediately
                time.sleep(self.reconnect_interval)
                continue

            try:
                success, frame = self.cap.read()
                if success and frame is not None:
                    with self._lock:
                        self._latest_frame = frame
                        self._is_connected = True
                else:
                    logger.warning(f"Failed to read frame from source {self.source}")
                    with self._lock:
                        self._is_connected = False
            except Exception as e:
                logger.error(f"Error during frame acquisition on source {self.source}: {e}")
                with self._lock:
                    self._is_connected = False

            # Yield thread control
            time.sleep(0.001)

        logger.info(f"Stopped frame capture thread for source {self.source}")

    def _reconnect(self) -> None:
        """Attempts to release and re-open the camera capture stream."""
        with self._lock:
            if self.cap is not None:
                try:
                    self.cap.release()
                except Exception as e:
                    logger.error(f"Error releasing camera cap during reconnect: {e}")
                self.cap = None

        logger.info(f"Retrying connection to camera source {self.source}...")
        new_cap = cv2.VideoCapture(self.source)
        
        with self._lock:
            if new_cap.isOpened():
                self.cap = new_cap
                self._is_connected = True
                logger.info(f"Reconnected successfully to camera source {self.source}")
            else:
                self._is_connected = False
                logger.warning(f"Reconnection attempt failed for source {self.source}")
                try:
                    new_cap.release()
                except Exception:
                    pass

    def read(self) -> Tuple[bool, Any]:
        """Returns the latest captured frame from memory.
        
        Returns:
            Tuple[bool, Any]: (success status, frame array)
        """
        with self._lock:
            if not self._is_connected or self._latest_frame is None:
                return False, None
            # Return a copy or directly the array (reading is read-only)
            return True, self._latest_frame.copy()

    def close(self) -> None:
        """Stops the capture thread and releases camera resources."""
        logger.info(f"Closing camera stream for source {self.source}...")
        self._stop_event.set()
        
        if self._thread is not None:
            self._thread.join(timeout=3.0)
            self._thread = None

        with self._lock:
            self._is_running = False
            self._is_connected = False
            if self.cap is not None:
                try:
                    self.cap.release()
                except Exception as e:
                    logger.error(f"Error releasing camera resource on close: {e}")
                self.cap = None
            self._latest_frame = None
        logger.info(f"Camera stream closed for source {self.source}")

    def is_opened(self) -> bool:
        """Checks if the camera loop is running."""
        with self._lock:
            return self._is_running

    def is_connected(self) -> bool:
        """Checks if the camera stream is actively capturing frames."""
        with self._lock:
            return self._is_connected
