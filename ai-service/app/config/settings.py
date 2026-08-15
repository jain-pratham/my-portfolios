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
    BACKEND_API_URL: str = os.getenv("BACKEND_API_URL", "http://localhost:5000")
    AI_SERVICE_API_KEY: str = os.getenv("AI_SERVICE_API_KEY", "")

    # AI Model parameters
    YOLO_MODEL: str = os.getenv("YOLO_MODEL", "yolov8n.pt")
    CONFIDENCE_THRESHOLD: float = float(os.getenv("CONFIDENCE_THRESHOLD", "0.5"))
    PERSON_CONFIDENCE: float = float(os.getenv("PERSON_CONFIDENCE", "0.45"))
    AI_DEVICE: str = os.getenv("AI_DEVICE", "auto")
    AI_PROCESS_FPS: int = int(os.getenv("AI_PROCESS_FPS", "10"))

    # Security & Behavior Rules
    ZONE_REFRESH_SECONDS: int = int(os.getenv("ZONE_REFRESH_SECONDS", "30"))
    CAMERA_OFFLINE_AFTER_SECONDS: int = int(os.getenv("CAMERA_OFFLINE_AFTER_SECONDS", "30"))
    LOITERING_THRESHOLD_SECONDS: int = int(os.getenv("LOITERING_THRESHOLD_SECONDS", "10"))
    TIMEZONE: str = os.getenv("TIMEZONE", "Asia/Kolkata")
    
    # Tampering Detection Heuristics
    CAMERA_TAMPERING_THRESHOLD: float = float(os.getenv("CAMERA_TAMPERING_THRESHOLD", "0.3"))
    CAMERA_TAMPERING_DURATION_SECONDS: int = int(os.getenv("CAMERA_TAMPERING_DURATION_SECONDS", "10"))

    # UI Options
    DISPLAY_WINDOW: bool = os.getenv("DISPLAY_WINDOW", "true").lower() == "true"

settings = Settings()

