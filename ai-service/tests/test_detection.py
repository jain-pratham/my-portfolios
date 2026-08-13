import unittest
from unittest.mock import MagicMock, patch
import numpy as np

# Adjust module paths for running tests
from app.detection.person_detector import PersonDetector

class TestDetectionParsing(unittest.TestCase):
    @patch("app.detection.person_detector.YOLO")
    def test_person_detection_result_parsing(self, mock_yolo_class):
        """
        Validates that YOLO result lists are parsed correctly into human bounding boxes,
        centers, and feet contact points.
        """
        # Create a mock YOLO instance
        mock_model = MagicMock()
        mock_yolo_class.return_value = mock_model

        # Setup mock bounding box structures
        mock_box = MagicMock()
        mock_box.cls = [0.0]  # person
        mock_box.conf = [0.85]  # 85% confidence
        mock_box.xyxy = [[100, 150, 200, 350]] # box coordinates

        mock_result = MagicMock()
        mock_result.boxes = [mock_box]
        mock_model.predict.return_value = [mock_result]

        # Initialize detector with a mock model path
        detector = PersonDetector(model_path="dummy_yolov8n.pt", confidence_threshold=0.5)
        dummy_frame = np.zeros((480, 640, 3), dtype=np.uint8)

        # Run parser
        detections = detector.detect_persons(dummy_frame)

        # Verify parsed metadata structure
        self.assertEqual(len(detections), 1)
        parsed = detections[0]
        self.assertEqual(parsed["class_id"], 0)
        self.assertEqual(parsed["confidence"], 0.85)
        self.assertEqual(parsed["box"], (100, 150, 200, 350))
        self.assertEqual(parsed["center"], (150, 250))  # (100+200)//2, (150+350)//2
        self.assertEqual(parsed["feet"], (150, 350))    # (100+200)//2, y2

    @patch("app.detection.person_detector.YOLO")
    def test_confidence_threshold_filtering(self, mock_yolo_class):
        """
        Ensures detections with confidence values below threshold are filtered out.
        """
        mock_model = MagicMock()
        mock_yolo_class.return_value = mock_model

        mock_box = MagicMock()
        mock_box.cls = [0.0]
        mock_box.conf = [0.45] # Below 0.5 confidence threshold
        mock_box.xyxy = [[100, 150, 200, 350]]

        mock_result = MagicMock()
        mock_result.boxes = [mock_box]
        mock_model.predict.return_value = [mock_result]

        detector = PersonDetector(model_path="dummy_yolov8n.pt", confidence_threshold=0.5)
        dummy_frame = np.zeros((480, 640, 3), dtype=np.uint8)

        detections = detector.detect_persons(dummy_frame)
        self.assertEqual(len(detections), 0)

if __name__ == "__main__":
    unittest.main()
