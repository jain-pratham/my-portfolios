import numpy as np
from ultralytics import YOLO
from app.config import settings
from app.utils.logger import get_logger

logger = get_logger("Detection")

class PersonDetector:
    """
    Handles initialization of YOLO weights and execution of inference
    specifically targeted for detecting class 0 (person).
    """
    def __init__(self, model_path: str = None, confidence_threshold: float = None):
        self.model_path = model_path or settings.YOLO_MODEL
        self.confidence_threshold = confidence_threshold or settings.CONFIDENCE_THRESHOLD
        self.person_class_id = 0
        
        logger.info(f"Initializing YOLO Model using weights: {self.model_path}")
        self.model = YOLO(self.model_path)

    def detect_persons(self, frame) -> list:
        """
        Runs inference on the provided frame.
        Filters strictly for person (Class ID 0) with confidence >= threshold.
        
        Returns:
            list of dict: [
                {
                    "class_id": 0,
                    "confidence": float,
                    "box": (x1, y1, x2, y2),
                    "center": (x_center, y_center),
                    "feet": (x_center, y_bottom)
                }, ...
            ]
        """
        # Run YOLOv8 on the frame filtering strictly for 'person' (Class ID 0)
        results = self.model.predict(source=frame, classes=[self.person_class_id], verbose=False)
        detections = []

        for result in results:
            boxes = result.boxes
            if boxes is None or len(boxes) == 0:
                continue

            for box in boxes:
                confidence = float(box.conf[0])
                if confidence >= self.confidence_threshold:
                    x1, y1, x2, y2 = map(int, box.xyxy[0])
                    x_center = int((x1 + x2) / 2)
                    y_center = int((y1 + y2) / 2)
                    
                    detections.append({
                        "class_id": self.person_class_id,
                        "confidence": confidence,
                        "box": (x1, y1, x2, y2),
                        "center": (x_center, y_center),
                        "feet": (x_center, y2)
                    })

        return detections
