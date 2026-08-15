import time
from app.config import settings
from app.inference.priority import InferencePriority, get_target_fps, FORCED_PERIODIC_CHECK
from app.inference.inference_state import InferenceState
from app.inference.adaptive_policy import AdaptivePolicy

class InferenceScheduler:
    def __init__(self, camera_key: str, policy: AdaptivePolicy = None):
        self.camera_key = camera_key
        self.policy = policy or AdaptivePolicy()
        self.state = InferenceState(camera_key)
        
        # Load configuration parameters
        self.min_duration = float(getattr(settings, "PRIORITY_MIN_DURATION_SECONDS", 2.0))
        self.cooldown_duration = float(getattr(settings, "PRIORITY_COOLDOWN_SECONDS", 10.0))
        self.max_inference_interval = float(getattr(settings, "MAX_INFERENCE_INTERVAL_SECONDS", 5.0))
        self.min_active_security_fps = float(getattr(settings, "MIN_ACTIVE_SECURITY_FPS", 2.0))

    def should_run_inference(self, now: float, context: dict) -> bool:
        """
        Decides if expensive AI (YOLO) inference should run on the current frame.
        Handles priority escalation (immediate) and de-escalation (stepwise decay).
        """
        # 1. Update state attributes from current context
        self.state.motion_score = context.get("motionScore", 0.0)
        self.state.active_track_count = len(context.get("activeTracks", []))
        self.state.active_security_event = context.get("activeSecurityEvent", False)

        # 2. Evaluate raw desired priority from the policy
        desired_priority, reason = self.policy.evaluate_priority(context)

        # 3. Apply escalation and stepwise decay de-escalation logic
        current_priority = self.state.current_priority

        if self._priority_val(desired_priority) > self._priority_val(current_priority):
            # Immediate escalation
            self.state.update_priority(desired_priority, reason, now)
            if desired_priority in (InferencePriority.HIGH, InferencePriority.CRITICAL):
                self.state.last_high_priority_at = now
        elif self._priority_val(desired_priority) < self._priority_val(current_priority):
            # Check hysteresis timers before letting it decay
            time_since_change = now - self.state.last_priority_change_at
            time_since_high = now - self.state.last_high_priority_at
            
            # Must satisfy minimum priority duration constraint
            if time_since_change >= self.min_duration:
                # If de-escalating from high/critical, check cooldown constraint
                is_high_or_critical = current_priority in (InferencePriority.HIGH, InferencePriority.CRITICAL)
                if not is_high_or_critical or time_since_high >= self.cooldown_duration:
                    # Gradual stepwise decay (CRITICAL -> HIGH -> NORMAL -> LOW)
                    next_lower_priority = self._get_next_lower_priority(current_priority)
                    self.state.update_priority(next_lower_priority, reason, now)

        # 4. Enforce forced verification timer safety override
        time_since_last_inference = now - self.state.last_inference_at
        if time_since_last_inference >= self.max_inference_interval:
            # Enforce forced periodic check reason on scheduler
            self.state.priority_reason = FORCED_PERIODIC_CHECK
            return True

        # 5. Check time interval based on resolved target FPS
        target_fps = self.state.target_fps
        # Enforce minimum security inference rate if tracks are active
        if self.state.active_track_count > 0:
            target_fps = max(target_fps, self.min_active_security_fps)

        time_per_inference = 1.0 / target_fps if target_fps > 0 else 1.0
        if time_since_last_inference >= time_per_inference:
            return True

        return False

    def _get_next_lower_priority(self, current: InferencePriority) -> InferencePriority:
        if current == InferencePriority.CRITICAL:
            return InferencePriority.HIGH
        elif current == InferencePriority.HIGH:
            return InferencePriority.NORMAL
        return InferencePriority.LOW

    def _priority_val(self, p: InferencePriority) -> int:
        mapping = {
            InferencePriority.LOW: 1,
            InferencePriority.NORMAL: 2,
            InferencePriority.HIGH: 3,
            InferencePriority.CRITICAL: 4
        }
        return mapping.get(p, 1)
