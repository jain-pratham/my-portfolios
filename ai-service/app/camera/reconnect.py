import cv2
import time
from app.utils.logger import get_logger

logger = get_logger("Camera")

def reconnect_stream(camera_url: str, max_retries: int = None, retry_delay: int = 2) -> cv2.VideoCapture:
    """
    Attempts to reconnect to a camera feed URL.
    Continues trying every `retry_delay` seconds.
    If `max_retries` is specified, it will raise a ConnectionError if exceeded.
    """
    retries = 0
    while True:
        retries += 1
        logger.warning(f"Reconnecting to camera feed... Attempt #{retries}")
        
        cap = cv2.VideoCapture(camera_url)
        if cap.isOpened():
            logger.info(f"Reconnection successful on attempt #{retries}!")
            return cap
            
        cap.release()
        
        if max_retries is not None and retries >= max_retries:
            logger.error("Maximum camera stream reconnection retries reached.")
            raise ConnectionError(f"Failed to reconnect to stream after {max_retries} attempts.")
            
        time.sleep(retry_delay)
