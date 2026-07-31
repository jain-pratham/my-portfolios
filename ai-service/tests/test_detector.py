import unittest
from unittest.mock import MagicMock, patch
import numpy as np

from src.detection.person_detector import PersonDetector


class TestDetectorModule(unittest.TestCase):
    """Unit tests for the Person Detection Module, mocking YOLOv8 model inference."""

    @patch("src.detection.person_detector.YOLO")
    def test_detector_initialization_and_device(self, mock_yolo):
        """Tests that the detector initializes YOLO and selects the correct device."""
        mock_yolo_instance = MagicMock()
        mock_yolo_instance.names = {0: "person", 1: "bicycle"}
        mock_yolo.return_value = mock_yolo_instance

        # Test CPU device configuration
        detector = PersonDetector(model_path="dummy.pt", use_gpu=False)
        self.assertEqual(detector.device, "cpu")

        # Test default GPU configuration
        # Mock torch.cuda.is_available() to return True
        with patch("src.detection.person_detector.torch.cuda.is_available", return_value=True):
            with patch("src.detection.person_detector.torch.cuda.get_device_name", return_value="RTX 4060"):
                detector_gpu = PersonDetector(model_path="dummy.pt", device_id=0, use_gpu=True)
                self.assertEqual(detector_gpu.device, "cuda:0")

    @patch("src.detection.person_detector.YOLO")
    def test_detection_filtering_and_parsing(self, mock_yolo):
        """Tests that detections are correctly filtered and formatted."""
        mock_yolo_instance = MagicMock()
        mock_yolo_instance.names = {0: "person", 1: "car"}
        mock_yolo.return_value = mock_yolo_instance

        # Setup mock results
        mock_result = MagicMock()
        
        # Setup mock boxes: one person and one car
        box_person = MagicMock()
        mock_xyxy = MagicMock()
        mock_xyxy.tolist.return_value = [10.0, 20.0, 50.0, 60.0]
        box_person.xyxy = [mock_xyxy]
        box_person.conf = [0.85]
        box_person.cls = [0.0]

        mock_result.boxes = [box_person]
        mock_yolo_instance.predict.return_value = [mock_result]

        # Initialize detector
        detector = PersonDetector(model_path="dummy.pt", confidence_threshold=0.5, use_gpu=False)
        
        # Dummy frame
        frame = np.zeros((100, 100, 3), dtype=np.uint8)
        
        # Run detection
        detections = detector.detect(frame)

        # Verify output formats and filter criteria
        self.assertEqual(len(detections), 1)
        det = detections[0]
        self.assertEqual(det["class_name"], "person")
        self.assertEqual(det["class_id"], 0)
        self.assertEqual(det["confidence"], 0.85)
        self.assertEqual(det["box"], [10.0, 20.0, 50.0, 60.0])

        # Verify YOLO predict parameters
        mock_yolo_instance.predict.assert_called_once_with(
            source=frame,
            device="cpu",
            conf=0.5,
            classes=[0],
            verbose=False
        )


if __name__ == "__main__":
    unittest.main()
