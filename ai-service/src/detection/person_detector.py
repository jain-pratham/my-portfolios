import os
import torch
from typing import List, Dict, Any
from ultralytics import YOLO

from src.detection.detector_interface import DetectorInterface
from src.utils.logger import logger


class PersonDetector(DetectorInterface):
    """YOLOv8 implementation for Person Detection.
    
    Loads the YOLO model once on initialization and utilizes GPU (CUDA) for inference.
    Filters out all classes except 'person' (Class ID 0).
    """

    def __init__(
        self,
        model_path: str = "weights/yolov8n.pt",
        confidence_threshold: float = 0.5,
        device_id: int = 0,
        use_gpu: bool = True,
    ):
        self.model_path = model_path
        self.confidence_threshold = confidence_threshold
        
        # Ensure the directory for weights exists
        weights_dir = os.path.dirname(model_path)
        if weights_dir and not os.path.exists(weights_dir):
            os.makedirs(weights_dir, exist_ok=True)

        # Device selection and validation
        self.device = self._configure_device(device_id, use_gpu)
        
        # Load YOLO model once during initialization
        logger.info(f"Initializing YOLO model from path: {model_path}")
        try:
            self.model = YOLO(model_path)
            logger.info("YOLO model loaded successfully.")
        except Exception as e:
            logger.critical(f"Failed to load YOLO model: {e}")
            raise RuntimeError(f"YOLO Model Loading Failure: {e}") from e

        # Ensure COCO class index 0 is indeed 'person'
        self.person_class_id = 0
        self._verify_person_class()

    def _configure_device(self, device_id: int, use_gpu: bool) -> str:
        """Determines if GPU (CUDA) is available and sets target device."""
        if use_gpu:
            if torch.cuda.is_available():
                cuda_device = f"cuda:{device_id}"
                # Get device name for logs
                try:
                    device_name = torch.cuda.get_device_name(device_id)
                    logger.info(f"GPU detected: {device_name}. Using CUDA device {cuda_device}")
                except Exception as e:
                    logger.warning(f"Unable to query GPU name for device {device_id}: {e}")
                    logger.info(f"Using CUDA device {cuda_device}")
                return cuda_device
            else:
                logger.error("GPU was requested (use_gpu=True) but CUDA is unavailable.")
                logger.warning("Falling back to CPU device.")
                return "cpu"
        else:
            logger.info("GPU disabled by configuration settings. Using CPU.")
            return "cpu"

    def _verify_person_class(self) -> None:
        """Checks if the person class exists in the model names list."""
        try:
            names = self.model.names
            if names and self.person_class_id in names:
                class_name = names[self.person_class_id]
                logger.info(f"Verified Class ID {self.person_class_id} is '{class_name}'.")
                if class_name != "person":
                    logger.warning(
                        f"Expected Class ID {self.person_class_id} to be 'person', but found '{class_name}'"
                    )
            else:
                logger.warning(f"Could not verify class names in YOLO model properties.")
        except Exception as e:
            logger.warning(f"Unable to verify class names: {e}")

    def detect(self, frame: Any) -> List[Dict[str, Any]]:
        """Detects people in the given frame.

        Args:
            frame: Numpy array representing the frame image.

        Returns:
            List[Dict[str, Any]]: List of person detections.
        """
        if frame is None:
            logger.warning("Received empty frame for detection.")
            return []

        try:
            # Run YOLO prediction filtering for class person (id=0) on designated device
            # verbose=False reduces log noise during execution
            results = self.model.predict(
                source=frame,
                device=self.device,
                conf=self.confidence_threshold,
                classes=[self.person_class_id],
                verbose=False,
            )

            detections: List[Dict[str, Any]] = []
            
            if not results:
                return detections

            for result in results:
                boxes = result.boxes
                if boxes is None:
                    continue

                for box in boxes:
                    # Extract bounding box coordinates [xmin, ymin, xmax, ymax]
                    xyxy = box.xyxy[0].tolist()
                    conf = float(box.conf[0])
                    class_id = int(box.cls[0])
                    class_name = self.model.names.get(class_id, "unknown")

                    detections.append(
                        {
                            "box": [round(coord, 2) for coord in xyxy],
                            "confidence": round(conf, 4),
                            "class_id": class_id,
                            "class_name": class_name,
                        }
                    )

            return detections

        except Exception as e:
            logger.error(f"Error occurred during frame prediction: {e}")
            return []
