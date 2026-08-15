from app.utils.logger import get_logger

logger = get_logger("Security")

def process_valuable_zone_event(zone_event: dict) -> dict:
    """
    Enriches zone events inside VALUABLE regions.
    Does not claim theft.
    """
    event = zone_event.copy()
    event["eventType"] = "VALUABLE_AREA_ACTIVITY"
    event["message"] = f"Activity detected in valuable area: {zone_event.get('zoneName', 'Valuable Zone')}"
    return event
