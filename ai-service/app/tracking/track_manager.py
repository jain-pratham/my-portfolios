import time
from app.utils.logger import get_logger

logger = get_logger("Tracking")

class TrackState:
    def __init__(self, track_id: int, timestamp: float, position: tuple):
        self.track_id = track_id
        self.first_seen = timestamp
        self.last_seen = timestamp
        self.current_position = position  # (x, y)
        self.previous_position = position  # (x, y)
        self.velocity = (0.0, 0.0)  # (vx, vy)
        self.current_zone = None
        self.zone_entered_at = None
        self.last_alert_times = {}  # event_type -> timestamp

    def update(self, timestamp: float, position: tuple):
        self.previous_position = self.current_position
        self.current_position = position
        dt = timestamp - self.last_seen
        self.last_seen = timestamp
        
        # Calculate velocity: change in position over change in time
        if dt > 0:
            vx = (self.current_position[0] - self.previous_position[0]) / dt
            vy = (self.current_position[1] - self.previous_position[1]) / dt
            self.velocity = (vx, vy)

class TrackManager:
    """
    Manages track histories and states for a specific camera.
    Provides logic to clean up old tracks that haven't been seen for a grace period.
    """
    def __init__(self, track_lost_grace_seconds: float = 2.0):
        self.tracks = {}  # track_id -> TrackState
        self.track_lost_grace_seconds = track_lost_grace_seconds

    def update_tracks(self, detections: list, timestamp: float = None) -> list:
        """
        Updates the track state of all active tracks with new detections.
        Cleans up dead tracks.
        """
        if timestamp is None:
            timestamp = time.time()

        active_track_ids = set()
        updated_detections = []

        for det in detections:
            track_id = det.get("trackId")
            if track_id is None:
                updated_detections.append(det)
                continue

            active_track_ids.add(track_id)
            foot_pt = (det["footPoint"]["x"], det["footPoint"]["y"])

            if track_id not in self.tracks:
                # New track
                self.tracks[track_id] = TrackState(track_id, timestamp, foot_pt)
                logger.info(f"[Tracking] New track detected: id={track_id}")
            else:
                # Existing track
                self.tracks[track_id].update(timestamp, foot_pt)

            # Enrich detection with history from track state
            track_state = self.tracks[track_id]
            det["firstSeen"] = track_state.first_seen
            det["lastSeen"] = track_state.last_seen
            det["velocity"] = track_state.velocity
            updated_detections.append(det)

        # Cleanup lost tracks after grace period
        dead_track_ids = []
        for tid, track in self.tracks.items():
            if timestamp - track.last_seen > self.track_lost_grace_seconds:
                dead_track_ids.append(tid)

        for tid in dead_track_ids:
            logger.info(f"[Tracking] Track expired/lost: id={tid}")
            del self.tracks[tid]

        return updated_detections
