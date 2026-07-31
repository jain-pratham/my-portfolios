from typing import Dict, Tuple, Any, Union
from src.camera.camera_interface import CameraInterface
from src.camera.opencv_camera import OpenCVCamera
from src.utils.logger import logger


class CameraManager:
    """Manages the lifecycle, operations, and aggregation of multiple camera streams."""

    def __init__(self, default_source: Union[int, str, None] = None, reconnect_interval: float = 5.0):
        self._cameras: Dict[str, CameraInterface] = {}
        self.reconnect_interval = reconnect_interval
        
        # If a default source is provided, initialize it as the "default" camera
        if default_source is not None:
            self.add_camera("default", default_source)

    def add_camera(self, camera_id: str, source: Union[int, str]) -> bool:
        """Registers a camera source under a unique ID.
        
        Args:
            camera_id: Unique string identifier for the camera.
            source: USB device index (int) or RTSP stream URI (str).
            
        Returns:
            bool: True if camera was added, False if camera_id already exists.
        """
        if camera_id in self._cameras:
            logger.warning(f"Camera ID '{camera_id}' is already registered.")
            return False

        # Create camera implementation (using OpenCV threaded implementation)
        camera_instance = OpenCVCamera(source, reconnect_interval=self.reconnect_interval)
        self._cameras[camera_id] = camera_instance
        logger.info(f"Registered camera '{camera_id}' with source '{source}'")
        return True

    def remove_camera(self, camera_id: str) -> None:
        """Closes and removes a camera from the manager.
        
        Args:
            camera_id: Unique string identifier for the camera.
        """
        if camera_id in self._cameras:
            self.close_camera(camera_id)
            del self._cameras[camera_id]
            logger.info(f"Removed camera '{camera_id}' from manager.")
        else:
            logger.warning(f"Camera ID '{camera_id}' not found for removal.")

    def open_camera(self, camera_id: str) -> bool:
        """Opens a specific camera.
        
        Args:
            camera_id: Unique identifier for the camera.
            
        Returns:
            bool: True if camera is opened, False otherwise.
        """
        if camera_id not in self._cameras:
            logger.error(f"Cannot open camera '{camera_id}': camera is not registered.")
            return False
        return self._cameras[camera_id].open()

    def close_camera(self, camera_id: str) -> None:
        """Closes a specific camera.
        
        Args:
            camera_id: Unique identifier for the camera.
        """
        if camera_id in self._cameras:
            self._cameras[camera_id].close()
        else:
            logger.warning(f"Cannot close camera '{camera_id}': camera is not registered.")

    def read_frame(self, camera_id: str) -> Tuple[bool, Any]:
        """Reads the latest frame from a specific camera.
        
        Args:
            camera_id: Unique identifier for the camera.
            
        Returns:
            Tuple[bool, Any]: (success, frame)
        """
        if camera_id not in self._cameras:
            logger.error(f"Cannot read frame from camera '{camera_id}': camera is not registered.")
            return False, None
        return self._cameras[camera_id].read()

    def is_camera_connected(self, camera_id: str) -> bool:
        """Checks if a camera is connected and receiving frames.
        
        Args:
            camera_id: Unique identifier for the camera.
        """
        if camera_id not in self._cameras:
            return False
        return self._cameras[camera_id].is_connected()

    # --- Backward compatibility methods for single-camera control ---

    def open(self) -> bool:
        """Backward compatible open method for the default camera."""
        return self.open_camera("default")

    def read(self) -> Tuple[bool, Any]:
        """Backward compatible read method for the default camera."""
        return self.read_frame("default")

    def release(self) -> None:
        """Backward compatible release method for the default camera."""
        self.close_camera("default")

    def close_all(self) -> None:
        """Closes all managed camera streams."""
        logger.info("Closing all camera streams...")
        for camera_id in list(self._cameras.keys()):
            self.close_camera(camera_id)
        logger.info("All camera streams closed.")