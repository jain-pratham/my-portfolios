from app.config import settings
from app.inference.priority import InferencePriority, STABLE_SCENE, MOTION_DETECTED, ACTIVE_TRACKS, NEW_PERSON, UNKNOWN_PERSON, TRUSTED_PERSON, HIGH_RISK_ZONE, NEAR_RESTRICTED_ZONE, SECURITY_EVENT, SUSPICIOUS_BEHAVIOR, ACTIVE_TRACKS_HIGH_COUNT

class AdaptivePolicy:
    def __init__(self):
        # Configuration thresholds/defaults
        self.unknown_person_priority = getattr(settings, "UNKNOWN_PERSON_PRIORITY", "HIGH")
        self.restricted_zone_priority = getattr(settings, "RESTRICTED_ZONE_PRIORITY", "HIGH")
        self.valuable_zone_priority = getattr(settings, "VALUABLE_ZONE_PRIORITY", "HIGH")
        self.cash_counter_zone_priority = getattr(settings, "CASH_COUNTER_ZONE_PRIORITY", "MEDIUM")
        self.active_track_high_threshold = int(getattr(settings, "ACTIVE_TRACK_HIGH_THRESHOLD", 5))

    def evaluate_priority(self, context: dict) -> tuple:
        """
        Pure deterministic logic mapping current scene context to InferencePriority.
        Returns:
            (InferencePriority, reason_string)
        """
        # Read context inputs
        motion_detected = context.get("motionDetected", False)
        active_tracks = context.get("activeTracks", [])
        active_security_event = context.get("activeSecurityEvent", False)

        # 1. CRITICAL: Active security event overrides everything
        if active_security_event:
            return InferencePriority.CRITICAL, SECURITY_EVENT

        # 2. Check for crowd / high number of active tracks -> HIGH
        if len(active_tracks) >= self.active_track_high_threshold:
            return InferencePriority.HIGH, ACTIVE_TRACKS_HIGH_COUNT

        # If there are active tracks, analyze them individually
        if len(active_tracks) > 0:
            highest_priority = InferencePriority.LOW
            reason = TRUSTED_PERSON

            for track in active_tracks:
                identity_status = track.get("identityStatus", "UNKNOWN")
                zone_type = track.get("zoneType")
                is_near_restricted = track.get("isNearRestricted", False)
                has_suspicious = track.get("hasSuspiciousBehavior", False)
                is_new = track.get("isNew", False)

                # Determine track specific priority based on hierarchy
                track_priority = InferencePriority.NORMAL
                track_reason = ACTIVE_TRACKS

                # Evaluation order matching strict security priority hierarchy
                if zone_type in ("RESTRICTED", "VALUABLE"):
                    # Confirmed restricted-zone security activity
                    track_priority = InferencePriority.CRITICAL if (has_suspicious or identity_status == "UNTRUSTED") else InferencePriority.HIGH
                    track_reason = HIGH_RISK_ZONE
                elif has_suspicious:
                    # Confirmed high-risk behavior
                    track_priority = InferencePriority.CRITICAL if zone_type in ("CASH_COUNTER", "STORAGE") else InferencePriority.HIGH
                    track_reason = SUSPICIOUS_BEHAVIOR
                elif is_near_restricted:
                    # Restricted-zone proximity
                    track_priority = InferencePriority.HIGH
                    track_reason = NEAR_RESTRICTED_ZONE
                elif is_new:
                    # New person boost
                    track_priority = InferencePriority.HIGH
                    track_reason = NEW_PERSON
                elif identity_status in ("UNKNOWN", "UNTRUSTED", "UNCERTAIN"):
                    # Unknown/untrusted person in other contexts
                    if zone_type in ("CASH_COUNTER", "STORAGE", "DOOR"):
                        track_priority = InferencePriority.HIGH
                        track_reason = f"UNKNOWN_PERSON_IN_{zone_type}_ZONE"
                    else:
                        track_priority = InferencePriority.HIGH
                        track_reason = UNKNOWN_PERSON
                else: # TRUSTED person
                    # Trusted person normal activity -> LOW/NORMAL
                    if zone_type in ("CASH_COUNTER", "STORAGE"):
                        track_priority = InferencePriority.NORMAL
                        track_reason = "TRUSTED_PERSON_IN_SENSITIVE_ZONE"
                    else:
                        # Trusted person on normal shop floor is low priority
                        track_priority = InferencePriority.LOW
                        track_reason = TRUSTED_PERSON

                # Take the highest priority across all tracks in the context
                if self._priority_val(track_priority) > self._priority_val(highest_priority):
                    highest_priority = track_priority
                    reason = track_reason

            return highest_priority, reason

        # 3. If there are no tracks:
        if motion_detected:
            # Active movement but no identified tracks -> NORMAL (sampling to check for new tracks)
            return InferencePriority.NORMAL, MOTION_DETECTED

        # Stable empty scene -> LOW
        return InferencePriority.LOW, STABLE_SCENE

    def _priority_val(self, p: InferencePriority) -> int:
        mapping = {
            InferencePriority.LOW: 1,
            InferencePriority.NORMAL: 2,
            InferencePriority.HIGH: 3,
            InferencePriority.CRITICAL: 4
        }
        return mapping.get(p, 1)
