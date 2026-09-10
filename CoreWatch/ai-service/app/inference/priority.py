from enum import Enum
from app.config import settings

class InferencePriority(str, Enum):
    LOW = "LOW"
    NORMAL = "NORMAL"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

# Centralized list of explanation reason codes for telemetry and logs
STABLE_SCENE = "STABLE_SCENE"
MOTION_DETECTED = "MOTION_DETECTED"
ACTIVE_TRACKS = "ACTIVE_TRACKS"
NEW_PERSON = "NEW_PERSON"
UNKNOWN_PERSON = "UNKNOWN_PERSON"
TRUSTED_PERSON = "TRUSTED_PERSON"
HIGH_RISK_ZONE = "HIGH_RISK_ZONE"
NEAR_RESTRICTED_ZONE = "NEAR_RESTRICTED_ZONE"
SECURITY_EVENT = "SECURITY_EVENT"
FORCED_PERIODIC_CHECK = "FORCED_PERIODIC_CHECK"
CAMERA_RECOVERED = "CAMERA_RECOVERED"
SUSPICIOUS_BEHAVIOR = "SUSPICIOUS_BEHAVIOR"
ACTIVE_TRACKS_HIGH_COUNT = "ACTIVE_TRACKS_HIGH_COUNT"

def get_target_fps(priority: InferencePriority) -> float:
    """
    Resolves target FPS for each priority based on settings, ensuring validation.
    """
    low_fps = max(0.01, float(settings.LOW_PRIORITY_FPS))
    normal_fps = max(low_fps, float(settings.NORMAL_PRIORITY_FPS))
    high_fps = max(normal_fps, float(settings.HIGH_PRIORITY_FPS))
    critical_fps = max(high_fps, float(settings.CRITICAL_PRIORITY_FPS))

    if priority == InferencePriority.LOW:
        return low_fps
    elif priority == InferencePriority.NORMAL:
        return normal_fps
    elif priority == InferencePriority.HIGH:
        return high_fps
    elif priority == InferencePriority.CRITICAL:
        return critical_fps
        
    return normal_fps
