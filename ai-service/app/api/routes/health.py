from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
def health_check():
    """
    Exposes service health status.
    """
    return {
        "status": "ok",
        "service": "corewatch-ai"
    }
