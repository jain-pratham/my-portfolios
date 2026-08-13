from pydantic import BaseModel
from typing import List, Tuple

class DetectionSchema(BaseModel):
    """
    Validation schema for detection event messages.
    """
    class_id: int
    confidence: float
    box: Tuple[int, int, int, int]
