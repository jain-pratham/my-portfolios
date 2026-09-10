from app.utils.logger import get_logger

logger = get_logger("Event")

def get_risk_severity(event_type: str, zone_type: str = None) -> str:
    """
    Maps events and zone types to risk levels ('HIGH', 'MEDIUM', 'LOW').
    Keep it deterministic and configurable.
    """
    # Zone-based severities
    if zone_type in ("RESTRICTED", "VALUABLE"):
        return "HIGH"
    
    if zone_type in ("CASH_COUNTER", "STORAGE", "DOOR"):
        return "MEDIUM"
        
    # Hardware stream alerts
    if event_type in ("CAMERA_OFFLINE", "CAMERA_TAMPERING"):
        return "HIGH"
        
    if event_type == "CAMERA_ONLINE":
        return "LOW"
        
    # Behavior metrics alerts
    if event_type == "SUSPICIOUS_MOVEMENT_PATTERN":
        return "MEDIUM"

    return "MEDIUM"
