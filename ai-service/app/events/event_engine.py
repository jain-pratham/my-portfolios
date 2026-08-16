import time
import cv2
from app.config import settings
from app.utils.logger import get_logger
from app.events.risk_engine import get_risk_severity
from app.alerts.dispatcher import AlertDispatcher
from app.security.valuable_area import process_valuable_zone_event
from app.security.cash_counter import process_cash_counter_zone_event
from app.security.door_monitor import process_door_zone_event
from app.security.after_hours import is_after_hours

logger = get_logger("Event")

class EventEngine:
    """
    Evaluates generated events, performs deduplication with cooldown tracking, 
    evaluates time schedules, applies risk mapping, draws overlays, and queues uploads.
    """
    def __init__(self, dispatcher: AlertDispatcher = None, cooldown_seconds: float = None):
        self.dispatcher = dispatcher or AlertDispatcher()
        self.cooldown = cooldown_seconds if cooldown_seconds is not None else settings.ALERT_COOLDOWN
        self.last_alert_times = {}  # Cooldown map: key -> timestamp

    def process_events(self, events: list, frame, zones: list, current_time: float = None):
        """
        Validates alerts cooldown, coordinates after-hours overrides, creates snapshots, 
        and dispatches messages.
        """
        if current_time is None:
            current_time = time.time()

        for event in events:
            camera_id = event["cameraId"]
            event_type = event["eventType"]
            zone_id = event.get("zoneId", "stream")
            track_id = event.get("trackId", "system")
            zone_type = event.get("zoneType")

            # 1. Enforce per-camera, per-zone, per-track cooldown limits
            cooldown_key = f"{camera_id}:{zone_id}:{track_id}:{event_type}"
            last_time = self.last_alert_times.get(cooldown_key, 0.0)
            if current_time - last_time < self.cooldown:
                continue

            # 2. Enrich events according to zone types
            if zone_type == "VALUABLE":
                event = process_valuable_zone_event(event)
            elif zone_type == "CASH_COUNTER":
                event = process_cash_counter_zone_event(event)
            elif zone_type == "DOOR":
                event = process_door_zone_event(event)

            # 3. Check after-hours overrides
            if event_type in ("ZONE_ENTRY", "ZONE_DWELL"):
                # Find matching zone
                zone = next((z for z in zones if z["_id"] == zone_id), None)
                if zone and zone.get("rules", {}).get("afterHoursOnly", False):
                    if is_after_hours(camera_id):
                        event["eventType"] = "AFTER_HOURS_PRESENCE"
                        event["message"] = f"After-hours intrusion detected in restricted zone: {zone.get('name')}"
                    else:
                        # Skip trigger if shop is open and afterHoursOnly is True
                        continue

            # 4. Map risk severity
            severity = get_risk_severity(event["eventType"], zone_type)
            event["severity"] = severity

            # 5. Populate descriptive messages
            if "message" not in event:
                if event_type == "CAMERA_OFFLINE":
                    event["message"] = f"Camera connection dropped."
                elif event_type == "CAMERA_ONLINE":
                    event["message"] = f"Camera connection recovered."
                elif event_type == "CAMERA_TAMPERING":
                    event["message"] = f"Camera tampering detected."
                elif event_type == "SUSPICIOUS_MOVEMENT_PATTERN":
                    event["message"] = f"Suspicious movement pacing detected."
                elif event_type in ("ZONE_ENTRY", "ZONE_DWELL"):
                    event["message"] = f"Person detected inside Restricted Area: {event.get('zoneName', 'Zone')}."
                else:
                    event["message"] = f"Security alert triggered."

            # Update cooldown timestamp
            self.last_alert_times[cooldown_key] = current_time

            # 6. Annotate frame copy for snapshots (no modification of original stream frame)
            annotated_frame = None
            if frame is not None:
                annotated_frame = frame.copy()
                self._annotate_frame(annotated_frame, event)

            # 7. Asynchronously dispatch alert to Next.js API
            logger.info(f"[Event] {severity} event={event['eventType']} camera={camera_id}")
            self.dispatcher.dispatch_alert(
                frame=annotated_frame,
                camera_key=camera_id,
                message=event["message"]
            )

    def _annotate_frame(self, frame, event):
        """
        Draws bounding box overlays and alert text directly onto the snapshot copy.
        """
        bbox = event.get("bbox")
        if bbox:
            x1, y1, x2, y2 = bbox["x1"], bbox["y1"], bbox["x2"], bbox["y2"]
            # Draw bounding box (Red)
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 255), 2)
            
            # Label header
            label = f"{event['eventType']} ID: {event.get('trackId')}"
            cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 1, cv2.LINE_AA)
