import time
from app.config import settings
from app.utils.logger import get_logger

logger = get_logger("Behavior")

class LoiteringDetector:
    """
    Evaluates tracking durations to check if a person is loitering in the scene.
    Keep loitering alerts independent from zone dwell alerts.
    """
    def __init__(self, threshold_seconds: float = None):
        self.threshold = threshold_seconds if threshold_seconds is not None else settings.LOITERING_THRESHOLD_SECONDS
        self.loitering_tracks = set()  # Track IDs that have already triggered loitering

    def check_loitering(self, track_id: int, first_seen: float, current_time: float = None) -> bool:
        """
        Returns True if a track's elapsed lifetime exceeds the loitering threshold
        and has not yet been flagged.
        """
        if current_time is None:
            current_time = time.time()

        if track_id in self.loitering_tracks:
            return False

        duration = current_time - first_seen
        if duration >= self.threshold:
            self.loitering_tracks.add(track_id)
            logger.info(f"[Behavior] Track {track_id} flagged for loitering (duration={duration:.1f}s)")
            return True
            
        return False

    def reset_track(self, track_id: int):
        if track_id in self.loitering_tracks:
            self.loitering_tracks.remove(track_id)
