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

@router.get("/detection/performance")
def get_detection_performance():
    """
    Exposes real-time adaptive inference performance telemetry for all active cameras.
    """
    from app.main import camera_manager
    performance_list = []
    
    for key, runtime in camera_manager.runtimes.items():
        if hasattr(runtime, "scheduler") and runtime.scheduler is not None:
            performance_list.append(runtime.scheduler.state.to_dict())
            
    return {
        "success": True,
        "cameras": performance_list
    }

