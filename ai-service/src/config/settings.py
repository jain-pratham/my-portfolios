import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env file
env_path = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(dotenv_path=env_path)

# Helper function to parse booleans
def _parse_bool(val: str, default: bool) -> bool:
    if val is None:
        return default
    return val.lower() in ("true", "1", "yes", "on")

# Camera Configurations
camera_source_raw = os.getenv("CAMERA_SOURCE", "0")
# Parse CAMERA_SOURCE: convert to int if it's a digit (like 0, 1, etc.)
try:
    if camera_source_raw.isdigit():
        CAMERA_SOURCE = int(camera_source_raw)
    else:
        CAMERA_SOURCE = camera_source_raw
except Exception:
    CAMERA_SOURCE = 0

DISPLAY_WINDOW = _parse_bool(os.getenv("DISPLAY_WINDOW", "true"), True)
WINDOW_NAME = os.getenv("WINDOW_NAME", "CoreWatch Camera")
RECONNECT_INTERVAL_SEC = float(os.getenv("RECONNECT_INTERVAL_SEC", "5.0"))

# Detection Configurations
YOLO_MODEL_PATH = os.getenv("YOLO_MODEL_PATH", "weights/yolov8n.pt")
CONFIDENCE_THRESHOLD = float(os.getenv("CONFIDENCE_THRESHOLD", "0.5"))
DEVICE_ID = int(os.getenv("DEVICE_ID", "0"))
USE_GPU = _parse_bool(os.getenv("USE_GPU", "true"), True)

# Logging Configurations
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
LOG_FILE_PATH = os.getenv("LOG_FILE_PATH", "logs/corewatch_ai.log")

# Integration Configurations
CAMERA_ID = os.getenv("CAMERA_ID", "Main Entrance")
CUSTOMER_ID = os.getenv("CUSTOMER_ID", "662a5b6f3a47551068c85abc")  # Placeholder or default admin/user ID
BACKEND_API_URL = os.getenv("BACKEND_API_URL", "http://localhost:5000/api")