from app.utils.logger import get_logger

logger = get_logger("Security")

def process_cash_counter_zone_event(zone_event: dict) -> dict:
    """
    Enriches zone events inside CASH_COUNTER regions.
    Does not claim theft or fraud.
    """
    event = zone_event.copy()
    event["eventType"] = "CASH_COUNTER_ACTIVITY"
    event["message"] = f"Activity detected at cash counter: {zone_event.get('zoneName', 'Cash Counter')}"
    return event
