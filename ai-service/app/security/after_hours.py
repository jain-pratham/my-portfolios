import pytz
from datetime import datetime, time
from app.config import settings
from app.utils.logger import get_logger

logger = get_logger("Security")

class OperatingHoursProvider:
    """
    Interface/provider that determines shop opening and closing times.
    Currently falls back to env-configured settings, but is designed
    to support pulling from the backend Shop configuration in the future.
    """
    def __init__(self):
        # Allow settings defaults if not present
        self.opening_str = getattr(settings, "SHOP_OPENING_TIME", "09:00")
        self.closing_str = getattr(settings, "SHOP_CLOSING_TIME", "22:00")
        self.timezone_str = settings.TIMEZONE

    def get_operating_hours(self, camera_id: str) -> dict:
        """
        Returns a dictionary with open, close, and timezone parameters.
        Can be extended to query backend Shop model based on camera owner.
        """
        return {
            "open": self.opening_str,
            "close": self.closing_str,
            "timezone": self.timezone_str
        }

def is_after_hours(camera_id: str, current_dt: datetime = None) -> bool:
    """
    Determines if current local time is outside operating hours for the given camera.
    Uses timezone-aware comparisons.
    """
    provider = OperatingHoursProvider()
    hours = provider.get_operating_hours(camera_id)
    
    tz = pytz.timezone(hours["timezone"])
    
    if current_dt is None:
        current_dt = datetime.now(tz)
    elif current_dt.tzinfo is None:
        # Localize naive datetime if passed
        current_dt = tz.localize(current_dt)
    else:
        # Convert to local timezone
        current_dt = current_dt.astimezone(tz)

    # Parse open/close strings
    open_h, open_m = map(int, hours["open"].split(":"))
    close_h, close_m = map(int, hours["close"].split(":"))
    
    open_time = time(open_h, open_m)
    close_time = time(close_h, close_m)
    current_time = current_dt.time()

    if open_time <= close_time:
        # Standard hours (e.g. 09:00 to 22:00)
        return not (open_time <= current_time <= close_time)
    else:
        # Overnight hours (e.g. 22:00 to 06:00)
        return current_time > close_time and current_time < open_time
