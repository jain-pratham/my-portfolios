import time
import unittest
from unittest.mock import MagicMock, patch
import numpy as np

from src.camera.camera_manager import CameraManager
from src.camera.opencv_camera import OpenCVCamera


class TestCameraModule(unittest.TestCase):
    """Unit tests for the Camera Module, mocking OpenCV video captures."""

    @patch("src.camera.opencv_camera.cv2.VideoCapture")
    def test_camera_registration_and_open(self, mock_video_capture):
        """Tests that a camera is registered and opened correctly."""
        # Mock VideoCapture instance
        mock_cap = MagicMock()
        mock_cap.isOpened.return_value = True
        # Mock frame read: returns (True, dummy numpy frame)
        dummy_frame = np.zeros((100, 100, 3), dtype=np.uint8)
        mock_cap.read.return_value = (True, dummy_frame)
        mock_video_capture.return_value = mock_cap

        # Initialize manager and add camera
        manager = CameraManager(reconnect_interval=1.0)
        success = manager.add_camera("test_cam", 0)
        self.assertTrue(success)

        # Open camera
        opened = manager.open_camera("test_cam")
        self.assertTrue(opened)
        
        # Give capture thread a moment to fetch first frame
        time.sleep(0.1)

        # Verify read success
        read_success, frame = manager.read_frame("test_cam")
        self.assertTrue(read_success)
        self.assertIsNotNone(frame)
        self.assertEqual(frame.shape, (100, 100, 3))

        # Close camera
        manager.close_camera("test_cam")
        self.assertFalse(manager.is_camera_connected("test_cam"))

    @patch("src.camera.opencv_camera.cv2.VideoCapture")
    def test_camera_reconnection_flow(self, mock_video_capture):
        """Tests that camera auto-reconnects when stream is lost."""
        mock_cap = MagicMock()
        mock_cap.isOpened.return_value = False  # Start closed
        mock_video_capture.return_value = mock_cap

        camera = OpenCVCamera(source="rtsp://dummy_source", reconnect_interval=0.1)
        
        # Try to open
        opened = camera.open()
        self.assertFalse(opened)  # Should be false because isOpened is False
        self.assertFalse(camera.is_connected())

        # Change mock to return open and successfully read frame on reconnect
        mock_cap.isOpened.return_value = True
        dummy_frame = np.zeros((100, 100, 3), dtype=np.uint8)
        mock_cap.read.return_value = (True, dummy_frame)

        # Let reconnect loop execute (runs in background thread)
        time.sleep(0.3)

        # Should be connected now after reconnect loop success
        self.assertTrue(camera.is_connected())
        
        # Cleanup
        camera.close()


if __name__ == "__main__":
    unittest.main()
