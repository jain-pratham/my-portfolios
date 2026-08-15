import time
from app.utils.logger import get_logger

logger = get_logger("Behavior")

class SuspiciousMovementDetector:
    """
    Evaluates tracking history metrics to flag visual pacing or repeated back-and-forth shifts.
    Reports events under the neutral classification: SUSPICIOUS_MOVEMENT_PATTERN.
    """
    def __init__(self, direction_changes_threshold: int = 3, min_distance: float = 150.0):
        self.direction_changes_threshold = direction_changes_threshold
        self.min_distance = min_distance
        self.triggered_tracks = set()  # Track IDs that have already triggered suspicious pacing

    def check_suspicious_movement(self, track_id: int, movement_metrics: dict) -> bool:
        """
        Returns True if a track has exceeded both direction changes and cumulative distance thresholds.
        """
        if track_id in self.triggered_tracks:
            return False

        changes = movement_metrics.get("direction_changes", 0)
        dist = movement_metrics.get("distance_traveled", 0.0)

        # Trigger when a tracked person is pacing persistently (multiple turns and distance)
        if changes >= self.direction_changes_threshold and dist >= self.min_distance:
            self.triggered_tracks.add(track_id)
            logger.info(f"[Behavior] Track {track_id} flagged for SUSPICIOUS_MOVEMENT_PATTERN (turns={changes}, dist={dist:.1f})")
            return True

        return False

    def reset_track(self, track_id: int):
        if track_id in self.triggered_tracks:
            self.triggered_tracks.remove(track_id)
