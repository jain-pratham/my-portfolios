import time
from app.inference.priority import InferencePriority, get_target_fps

class InferenceState:
    def __init__(self, camera_key: str):
        self.camera_key = camera_key
        
        # Telemetry metrics counters
        self.frames_received = 0
        self.frames_skipped = 0
        self.inference_count = 0
        self.last_inference_at = 0.0
        
        # Performance trackers
        self.target_fps = get_target_fps(InferencePriority.LOW)
        self.actual_inference_fps = 0.0
        self.average_inference_ms = 0.0
        
        # State priority trackers
        self.current_priority = InferencePriority.LOW
        self.priority_reason = "STABLE_SCENE"
        self.active_tracks = 0
        self.motion_score = 0.0
        self.last_priority_change_at = time.time()
        self.last_high_priority_at = 0.0
        
        # Internal tracking to calculate actual FPS
        self._fps_window_start = time.time()
        self._fps_inference_count = 0

    def update_priority(self, new_priority: InferencePriority, reason: str, now: float = None):
        """
        Updates current priority, target FPS, and reasons.
        """
        if now is None:
            now = time.time()
        self.current_priority = new_priority
        self.target_fps = get_target_fps(new_priority)
        self.priority_reason = reason
        self.last_priority_change_at = now

    def record_skipped(self):
        self.frames_received += 1
        self.frames_skipped += 1

    def record_inference(self, now: float, latency_ms: float):
        """
        Updates metrics after running a YOLO detector inference.
        """
        self.frames_received += 1
        self.inference_count += 1
        self.last_inference_at = now
        
        # Compute rolling average latency
        if self.average_inference_ms == 0.0:
            self.average_inference_ms = latency_ms
        else:
            self.average_inference_ms = 0.9 * self.average_inference_ms + 0.1 * latency_ms

        # Calculate actual inference FPS over a rolling window (e.g. every 5 seconds)
        self._fps_inference_count += 1
        window_duration = now - self._fps_window_start
        if window_duration >= 5.0:
            self.actual_inference_fps = round(self._fps_inference_count / window_duration, 2)
            self._fps_window_start = now
            self._fps_inference_count = 0

    def to_dict(self) -> dict:
        """
        Returns telemetry data formatted for the API performance view.
        Ensures secrets are not exposed.
        """
        return {
            "cameraKey": self.camera_key,
            "priority": self.current_priority.value,
            "targetInferenceFps": self.target_fps,
            "actualInferenceFps": self.actual_inference_fps,
            "framesReceived": self.frames_received,
            "framesSkipped": self.frames_skipped,
            "inferenceCount": self.inference_count,
            "activeTracks": self.active_tracks,
            "motionScore": self.motion_score,
            "averageInferenceMs": round(self.average_inference_ms, 2),
            "reason": self.priority_reason,
            "lastInferenceAt": self.last_inference_at,
            "lastPriorityChangeAt": self.last_priority_change_at
        }
Definition_Status = True
