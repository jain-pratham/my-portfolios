import unittest
import time
from unittest.mock import MagicMock, patch
from app.tracking.track_manager import TrackManager
from app.zones.polygon import inside_zone
from app.zones.zone_rules import ZoneRulesEngine, ZoneState
from app.events.event_engine import EventEngine
from app.inference.adaptive_policy import AdaptivePolicy, InferencePriority
from app.inference.inference_scheduler import InferenceScheduler

class TestRestrictedZoneAlertPipeline(unittest.TestCase):
    def setUp(self):
        self.camera_key = "CAM-1F8IPF"
        # Configured zone from DB: Zone bvx (Restricted)
        self.zones = [
            {
                "_id": "6a806eed50b097b930590bb7",
                "cameraId": self.camera_key,
                "name": "bvx",
                "type": "RESTRICTED",
                "enabled": True,
                "points": [
                    {"x": 0.7857, "y": 0.538},
                    {"x": 0.7878, "y": 0.7149},
                    {"x": 0.9115, "y": 0.7113},
                    {"x": 0.8973, "y": 0.5344}
                ],
                "rules": {
                    "alertAfterSeconds": 5,
                    "enabled": True,
                    "afterHoursOnly": False
                }
            }
        ]
        self.width = 640
        self.height = 480

    def test_person_outside_restricted_zone(self):
        """
        1. Person outside restricted zone -> no ZONE_ENTRY
        """
        # Pixel coordinates outside the polygon (left of the screen)
        dets = [
            {
                "trackId": 1,
                "footPoint": {"x": 100, "y": 100},
                "bbox": {"x1": 50, "y1": 50, "x2": 150, "y2": 100},
                "confidence": 0.9
            }
        ]
        engine = ZoneRulesEngine()
        events = engine.evaluate(self.camera_key, self.zones, dets, self.width, self.height)
        self.assertEqual(len(events), 0)

    def test_person_enters_and_remains_restricted_zone(self):
        """
        2. Person enters restricted zone -> ZONE_ENTRY
        3. Person remains inside -> no duplicate ZONE_ENTRY during same entry
        4. Person exits -> EXITED
        5. Person re-enters -> new ZONE_ENTRY
        """
        engine = ZoneRulesEngine(track_lost_grace_seconds=1.0)
        t0 = time.time()

        # Step 2: Person inside Zone bvx (e.g. x: 0.85, y: 0.6 in normalized coords -> foot: (544, 288))
        dets = [
            {
                "trackId": 1,
                "footPoint": {"x": 544, "y": 288},
                "bbox": {"x1": 500, "y1": 150, "x2": 588, "y2": 288},
                "confidence": 0.9
            }
        ]
        events = engine.evaluate(self.camera_key, self.zones, dets, self.width, self.height, t0)
        self.assertEqual(len(events), 1)
        self.assertEqual(events[0]["eventType"], "ZONE_ENTRY")

        # Step 3: Call again on next frame (still inside) -> no new ZONE_ENTRY
        events = engine.evaluate(self.camera_key, self.zones, dets, self.width, self.height, t0 + 0.1)
        self.assertEqual(len(events), 0)

        # Step 4: Person exits (no detections) and time moves beyond grace period (1.5s later) -> EXITED
        events = engine.evaluate(self.camera_key, self.zones, [], self.width, self.height, t0 + 1.6)
        self.assertEqual(len(events), 1)
        self.assertEqual(events[0]["eventType"], "ZONE_EXIT")

        # Step 5: Person re-enters -> new ZONE_ENTRY
        events = engine.evaluate(self.camera_key, self.zones, dets, self.width, self.height, t0 + 2.0)
        self.assertEqual(len(events), 1)
        self.assertEqual(events[0]["eventType"], "ZONE_ENTRY")

    def test_adaptive_policy_escalation_and_monitoring_active(self):
        """
        6. Restricted zone + low motion -> security monitoring remains active
        """
        policy = AdaptivePolicy()
        # Simulated context: person in RESTRICTED zone with low motion (0.01)
        context = {
            "motionDetected": False,
            "motionScore": 0.01,
            "activeTracks": [
                {
                    "trackId": 1,
                    "identityStatus": "UNKNOWN",
                    "zoneType": "RESTRICTED",
                    "isNearRestricted": False,
                    "hasSuspiciousBehavior": False
                }
            ],
            "activeSecurityEvent": False
        }
        priority, reason = policy.evaluate_priority(context)
        # Verify priority is boosted to HIGH despite zero motion
        self.assertEqual(priority, InferencePriority.HIGH)
        self.assertEqual(reason, "HIGH_RISK_ZONE")

        # Test scheduler maps HIGH priority to >= 10 FPS, preventing skip
        scheduler = InferenceScheduler(self.camera_key)
        scheduler.state.update_priority(InferencePriority.HIGH, "test", time.time())
        self.assertEqual(scheduler.state.target_fps, 10.0)

    @patch("app.events.event_engine.AlertDispatcher")
    def test_event_reaches_event_engine_and_dispatcher(self, mock_dispatcher_class):
        """
        7. Event reaches EventEngine
        8. Event reaches AlertDispatcher
        9. Cooldown prevents duplicate dispatch
        """
        mock_disp = mock_dispatcher_class.return_value
        engine = EventEngine(dispatcher=mock_disp, cooldown_seconds=5.0)

        events = [
            {
                "eventType": "ZONE_ENTRY",
                "cameraId": self.camera_key,
                "zoneId": "6a806eed50b097b930590bb7",
                "zoneType": "RESTRICTED",
                "zoneName": "bvx",
                "trackId": 1,
                "timestamp": 1000.0
            }
        ]

        # First alert dispatch
        engine.process_events(events, None, self.zones, 1000.0)
        self.assertEqual(mock_disp.dispatch_alert.call_count, 1)

        # Alert within cooldown (2s later) should be blocked
        engine.process_events(events, None, self.zones, 1002.0)
        self.assertEqual(mock_disp.dispatch_alert.call_count, 1)

        # Alert after cooldown (6s later) should be dispatched
        engine.process_events(events, None, self.zones, 1006.0)
        self.assertEqual(mock_disp.dispatch_alert.call_count, 2)

    def test_multi_camera_isolation(self):
        """
        10. Multi-camera state remains isolated
        """
        engine = ZoneRulesEngine()
        
        # Camera A evaluation
        dets_a = [{"trackId": 1, "footPoint": {"x": 544, "y": 288}, "bbox": {"x1": 500, "y1": 150, "x2": 588, "y2": 288}}]
        events_a = engine.evaluate("CAMERA_A", self.zones, dets_a, self.width, self.height, 1000.0)
        self.assertEqual(len(events_a), 1)
        self.assertEqual(events_a[0]["eventType"], "ZONE_ENTRY")

        # Camera B evaluation (same trackId 1 inside the zone) should register separate entry
        events_b = engine.evaluate("CAMERA_B", self.zones, dets_a, self.width, self.height, 1000.0)
        self.assertEqual(len(events_b), 1)
        self.assertEqual(events_b[0]["eventType"], "ZONE_ENTRY")

if __name__ == "__main__":
    unittest.main()
