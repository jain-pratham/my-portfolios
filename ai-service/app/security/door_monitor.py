from app.utils.logger import get_logger

logger = get_logger("Security")

def process_door_zone_event(zone_event: dict) -> dict:
    """
    Interface for door activities.
    Does NOT claim door opened.
    """
    event = zone_event.copy()
    event["eventType"] = "DOOR_AREA_ACTIVITY"
    event["message"] = f"Presence detected near door: {zone_event.get('zoneName', 'Door Zone')}"
    return event
