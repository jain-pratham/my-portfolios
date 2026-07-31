import unittest
from unittest.mock import MagicMock
import numpy as np

from src.events.event_engine import EventEngine
from src.events.event_models import CameraEvent


class TestEventEngine(unittest.TestCase):
    """Unit tests for the EventEngine and CameraEvent models."""

    def test_camera_event_serialization(self):
        """Tests that CameraEvent schema validates and serializes to dict properly."""
        dummy_frame = np.zeros((10, 10, 3), dtype=np.uint8)
        event = CameraEvent(
            timestamp=123456789.0,
            camera_id="cam_test",
            event_type="person_detected",
            confidence=0.92,
            frame=dummy_frame,
            bounding_boxes=[[10, 15, 40, 45]]
        )

        self.assertEqual(event.camera_id, "cam_test")
        self.assertEqual(event.confidence, 0.92)
        
        # Verify custom serialization method omits the frame array
        serial_dict = event.to_dict()
        self.assertNotIn("frame", serial_dict)
        self.assertEqual(serial_dict["camera_id"], "cam_test")
        self.assertEqual(serial_dict["event_type"], "person_detected")
        self.assertEqual(serial_dict["bounding_boxes"], [[10, 15, 40, 45]])

    def test_listener_registration_and_notification(self):
        """Tests registration and dispatch of events to observers."""
        engine = EventEngine()
        
        # Mock listener
        listener = MagicMock()
        engine.register_listener(listener)

        # Trigger detections
        dummy_frame = np.zeros((10, 10, 3), dtype=np.uint8)
        detections = [
            {"box": [1, 2, 3, 4], "confidence": 0.88, "class_id": 0, "class_name": "person"}
        ]

        engine.process_detections("cam_test", dummy_frame, detections)

        # Check listener was notified
        listener.assert_called_once()
        event_arg = listener.call_args[0][0]
        self.assertIsInstance(event_arg, CameraEvent)
        self.assertEqual(event_arg.camera_id, "cam_test")
        self.assertEqual(event_arg.confidence, 0.88)
        self.assertEqual(event_arg.bounding_boxes, [[1, 2, 3, 4]])


if __name__ == "__main__":
    unittest.main()
