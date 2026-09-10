import torch
import threading
from ultralytics import YOLO
from app.config import settings
from app.utils.logger import get_logger

logger = get_logger("Detection")

class YOLOModelManager:
    """
    Registry manager to load and store YOLO model instances per camera stream,
    ensuring ByteTrack and trackers are fully isolated.
    """
    _models = {}  # camera_key -> YOLO model instance
    _device = None
    _lock = threading.Lock()

    @classmethod
    def get_model(cls, camera_key: str = "default", model_path: str = None, device: str = None) -> YOLO:
        # Check if YOLO is a mock (used in unit tests) to prevent caching issues
        is_mock = "Mock" in type(YOLO).__name__ or "MagicMock" in type(YOLO).__name__
        
        with cls._lock:
            if camera_key not in cls._models or is_mock:
                path = model_path or settings.YOLO_MODEL
                dev = device or settings.AI_DEVICE
                
                if dev == "auto":
                    resolved_device = "cuda" if torch.cuda.is_available() else "cpu"
                else:
                    resolved_device = dev
                    
                logger.info(f"[System] Loading independent YOLO Model instance for '{camera_key}' using weights: {path} on device: {resolved_device}")
                model = YOLO(path)
                if not is_mock:
                    model.to(resolved_device)
                cls._models[camera_key] = model
                cls._device = resolved_device
                
            return cls._models[camera_key]

    @classmethod
    def get_device(cls) -> str:
        if cls._device is None:
            dev = settings.AI_DEVICE
            if dev == "auto":
                cls._device = "cuda" if torch.cuda.is_available() else "cpu"
            else:
                cls._device = dev
        return cls._device

    @classmethod
    def remove_model(cls, camera_key: str):
        """
        Memory safety helper to remove model reference when camera is unregistered.
        """
        with cls._lock:
            if camera_key in cls._models:
                del cls._models[camera_key]
                logger.info(f"[System] Released YOLO Model reference for camera '{camera_key}'")

class PersonDetector:
    """
    Handles person detection and tracking using camera-isolated YOLO model instances
    with serialized inference locking for GPU stability.
    """
    _inference_lock = threading.Lock()

    def __init__(self, camera_key: str = "default", model_path: str = None, confidence_threshold: float = None, device: str = None):
        self.camera_key = camera_key
        self.model = YOLOModelManager.get_model(camera_key, model_path, device)
        # Fallback confidence threshold
        self.confidence_threshold = confidence_threshold or settings.PERSON_CONFIDENCE
        self.person_class_id = 0

    def detect_persons(self, frame) -> list:
        """
        Runs inference on the provided frame using predict().
        Used for tests and non-tracking baseline validations.
        """
        with PersonDetector._inference_lock:
            results = self.model.predict(source=frame, classes=[self.person_class_id], conf=self.confidence_threshold, verbose=False)
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

    def track_persons(self, frame) -> list:
        """
        Runs tracking inference on the provided frame in a single pass using ByteTrack.
        Returns a structured list of normalized track objects.
        """
        device = YOLOModelManager.get_device()
        with PersonDetector._inference_lock:
            results = self.model.track(
                source=frame,
                persist=True,
                classes=[self.person_class_id],
                tracker="bytetrack.yaml",
                conf=self.confidence_threshold,
                device=device,
                verbose=False
            )

        detections = []
        for result in results:
            boxes = result.boxes
            if boxes is None or len(boxes) == 0:
                continue

            for box in boxes:
                confidence = float(box.conf[0])
                if confidence >= self.confidence_threshold:
                    x1, y1, x2, y2 = map(int, box.xyxy[0])
                    
                    # Retrieve track id assigned by ByteTrack
                    track_id = None
                    if box.id is not None:
                        track_id = int(box.id[0])
                    
                    center_x = int((x1 + x2) / 2)
                    center_y = int((y1 + y2) / 2)
                    foot_x = int((x1 + x2) / 2)
                    foot_y = int(y2)

                    detections.append({
                        "trackId": track_id,
                        "classId": self.person_class_id,
                        "label": "person",
                        "confidence": confidence,
                        "bbox": {
                            "x1": x1,
                            "y1": y1,
                            "x2": x2,
                            "y2": y2
                        },
                        "center": {
                            "x": center_x,
                            "y": center_y
                        },
                        "footPoint": {
                            "x": foot_x,
                            "y": foot_y
                        }
                    })

        return detections
