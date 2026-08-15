from fastapi import APIRouter
from app.config import settings
from app.detection.person_detector import YOLOModelManager

router = APIRouter()

@router.get("/detection/status")
def get_detection_status():
    """
    Exposes YOLO model parameter details and GPU/CPU device settings.
    """
    # Force loading if not initialized
    YOLOModelManager.get_model()
    device = YOLOModelManager.get_device()
    
    return {
        "success": True,
        "modelName": settings.YOLO_MODEL,
        "device": device,
        "personConfidenceThreshold": settings.PERSON_CONFIDENCE
    }
