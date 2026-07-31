from typing import List, Any
from pydantic import BaseModel, ConfigDict


class CameraEvent(BaseModel):
    """Pydantic model representing an aggregated CCTV detection event."""
    
    # Configure Pydantic to allow arbitrary types like numpy arrays for the frame
    model_config = ConfigDict(arbitrary_types_allowed=True)

    timestamp: float
    camera_id: str
    event_type: str
    confidence: float
    frame: Any  # Usually numpy.ndarray representing the raw frame
    bounding_boxes: List[List[float]]

    def to_dict(self) -> dict:
        """Helper method to serialize the event details, omitting the heavy frame array."""
        return {
            "timestamp": self.timestamp,
            "camera_id": self.camera_id,
            "event_type": self.event_type,
            "confidence": self.confidence,
            "bounding_boxes": self.bounding_boxes,
        }
