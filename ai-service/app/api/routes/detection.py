from fastapi import APIRouter

router = APIRouter()

@router.get("/detection/status")
def get_detection_status():
    """
    Placeholder endpoint for detection triggers and configuration settings.
    """
    return {
        "status": "not_implemented",
        "message": "Future detection configuration APIs"
    }
