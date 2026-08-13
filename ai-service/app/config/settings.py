import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env file if it exists
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent.parent

class Settings:
    # Camera Stream configuration
    CAMERA_URL: str = os.getenv("CAMERA_URL", "http://192.0.0.4:8080/video")
    CAMERA_KEY: str = os.getenv("CAMERA_KEY", "CAM-48X8WB")

    # Cloud Upload & Integration
    IMGBB_API_KEY: str = os.getenv("IMGBB_API_KEY", "")
    NEXTJS_ALERT_API: str = os.getenv("NEXTJS_ALERT_API", "http://localhost:3000/api/alerts")
    ALERT_COOLDOWN: int = int(os.getenv("ALERT_COOLDOWN", "10"))

    # AI Model parameters
    YOLO_MODEL: str = os.getenv("YOLO_MODEL", "yolov8n.pt")
    CONFIDENCE_THRESHOLD: float = float(os.getenv("CONFIDENCE_THRESHOLD", "0.5"))

    # UI Options
    DISPLAY_WINDOW: bool = os.getenv("DISPLAY_WINDOW", "true").lower() == "true"

settings = Settings()
