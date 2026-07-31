from abc import ABC, abstractmethod
from typing import List, Dict, Any


class DetectorInterface(ABC):
    """Abstract base class defining the contract for object detection models."""

    @abstractmethod
    def detect(self, frame: Any) -> List[Dict[str, Any]]:
        """Processes an image frame to detect objects.

        Args:
            frame: Numpy array representing the image frame.

        Returns:
            List[Dict[str, Any]]: A list of detections, where each detection is a dictionary:
                {
                    "box": [xmin, ymin, xmax, ymax],
                    "confidence": float,
                    "class_id": int,
                    "class_name": str
                }
        """
        pass
