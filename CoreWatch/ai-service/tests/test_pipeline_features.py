import unittest
import time
import numpy as np
from datetime import datetime
from unittest.mock import MagicMock, patch

from app.tracking.track_manager import TrackManager, TrackState
from app.zones.polygon import point_in_polygon, inside_zone
from app.zones.zone_rules import ZoneRulesEngine, ZoneState
from app.zones.zone_manager import ZoneManager
from app.events.risk_engine import get_risk_severity
from app.events.event_engine import EventEngine
from app.camera_security.offline_detector import CameraOfflineDetector
from app.camera_security.tampering_detector import CameraTamperingDetector
from app.behavior.movement import MovementTracker
from app.behavior.suspicious import SuspiciousMovementDetector
from app.security.after_hours import is_after_hours, OperatingHoursProvider

class TestPipelineFeatures(unittest.TestCase):
    def test_coordinate_scaling_and_containment(self):
        # 1. Point in polygon boundary check
        poly = [(0, 0), (10, 0), (10, 10), (0, 10)]
        self.assertTrue(point_in_polygon((5, 5), poly))
        self.assertFalse(point_in_polygon((12, 5), poly))
        
        # 2. Normalized coordinate scaling
        norm_poly = [{'x': 0.0, 'y': 0.0}, {'x': 1.0, 'y': 0.0}, {'x': 1.0, 'y': 1.0}, {'x': 0.0, 'y': 1.0}]
        foot_pt = {'x': 50, 'y': 50}
        self.assertTrue(inside_zone(foot_pt, norm_poly, 100, 100))
        self.assertFalse(inside_zone({'x': 150, 'y': 50}, norm_poly, 100, 100))

    def test_tracking_and_independent_cameras(self):
        manager_a = TrackManager(track_lost_grace_seconds=1.0)
        manager_b = TrackManager(track_lost_grace_seconds=1.0)
        
        det_a = [{"trackId": 5, "footPoint": {"x": 100, "y": 100}, "bbox": {"x1": 50, "y1": 50, "x2": 150, "y2": 100}, "confidence": 0.9}]
        det_b = [{"trackId": 5, "footPoint": {"x": 200, "y": 200}, "bbox": {"x1": 150, "y1": 150, "x2": 250, "y2": 200}, "confidence": 0.8}]
        
        now = time.time()
        res_a = manager_a.update_tracks(det_a, now)
        res_b = manager_b.update_tracks(det_b, now)
        
        self.assertEqual(res_a[0]["trackId"], 5)
        self.assertEqual(res_b[0]["trackId"], 5)
        
        # State should be isolated: camera A is at (100,100), camera B is at (200,200)
        self.assertEqual(manager_a.tracks[5].current_position, (100, 100))
        self.assertEqual(manager_b.tracks[5].current_position, (200, 200))

    @patch("app.zones.zone_manager.requests.get")
    def test_zone_manager_caching_and_auth_failure(self, mock_get):
        manager = ZoneManager("CAM-TEST-123")
        
        # Auth failure (401)
        mock_response_401 = MagicMock()
        mock_response_401.status_code = 401
        mock_get.return_value = mock_response_401
        
        self.assertFalse(manager.fetch_zones())
        self.assertTrue(manager.auth_failed)
        self.assertFalse(manager.is_available)
        
        # Valid zones response
        mock_response_200 = MagicMock()
        mock_response_200.status_code = 200
        mock_response_200.json.return_value = {
            "success": True,
            "data": [
                {"_id": "z1", "cameraId": "CAM-TEST-123", "enabled": True, "type": "RESTRICTED", "points": [{"x": 0, "y": 0}]}
            ]
        }
        mock_get.return_value = mock_response_200
        
        self.assertTrue(manager.fetch_zones())
        self.assertFalse(manager.auth_failed)
        self.assertTrue(manager.is_available)
        self.assertEqual(len(manager.zones), 1)

    def test_zone_rules_dwell_transitions_and_grace_period(self):
        engine = ZoneRulesEngine(track_lost_grace_seconds=1.0)
        zones = [
            {
                "_id": "z1", 
                "type": "RESTRICTED", 
                "name": "Zone A", 
                "enabled": True, 
                "points": [{"x": 0.0, "y": 0.0}, {"x": 1.0, "y": 0.0}, {"x": 1.0, "y": 1.0}, {"x": 0.0, "y": 1.0}], 
                "rules": {"alertAfterSeconds": 2}
            }
        ]
        
        # Track enters (T=0)
        t0 = time.time()
        dets = [{"trackId": 7, "footPoint": {"x": 50, "y": 50}, "bbox": {"x1": 10, "y1": 10, "x2": 90, "y2": 90}, "confidence": 0.9}]
        events = engine.evaluate("CAM-1", zones, dets, 100, 100, t0)
        
        self.assertEqual(len(events), 1)
        self.assertEqual(events[0]["eventType"], "ZONE_ENTRY")
        self.assertEqual(engine.states[("CAM-1", "z1", 7)]["state"], ZoneState.ENTERED)
        
        # Dwelling (T=1.0) - no alert (cooldown duration < 2)
        events = engine.evaluate("CAM-1", zones, dets, 100, 100, t0 + 1.0)
        self.assertEqual(len(events), 0)
        
        # Dwelling (T=2.1) - triggers DWELL alert
        events = engine.evaluate("CAM-1", zones, dets, 100, 100, t0 + 2.1)
        self.assertEqual(len(events), 1)
        self.assertEqual(events[0]["eventType"], "ZONE_DWELL")
        
        # Track missing briefly (T=2.6) - inside 1s grace window, no exit triggered
        events = engine.evaluate("CAM-1", zones, [], 100, 100, t0 + 2.6)
        self.assertEqual(len(events), 0)
        
        # Track missing persistently (T=4.0) - grace expired, EXITED event fired
        events = engine.evaluate("CAM-1", zones, [], 100, 100, t0 + 4.0)
        self.assertEqual(len(events), 1)
        self.assertEqual(events[0]["eventType"], "ZONE_EXIT")

    def test_risk_severity_mapping(self):
        self.assertEqual(get_risk_severity("ZONE_ENTRY", "RESTRICTED"), "HIGH")
        self.assertEqual(get_risk_severity("ZONE_ENTRY", "VALUABLE"), "HIGH")
        self.assertEqual(get_risk_severity("ZONE_ENTRY", "CASH_COUNTER"), "MEDIUM")
        self.assertEqual(get_risk_severity("CAMERA_OFFLINE"), "HIGH")
        self.assertEqual(get_risk_severity("CAMERA_ONLINE"), "LOW")

    @patch("app.events.event_engine.AlertDispatcher")
    def test_event_engine_cooldown(self, mock_dispatcher_class):
        mock_disp = mock_dispatcher_class.return_value
        engine = EventEngine(dispatcher=mock_disp, cooldown_seconds=5)
        
        events = [
            {"eventType": "ZONE_ENTRY", "cameraId": "CAM-1", "zoneId": "z1", "zoneType": "RESTRICTED", "trackId": 12, "timestamp": 1000.0}
        ]
        
        # Emit initial alert
        engine.process_events(events, None, [], 1000.0)
        self.assertEqual(mock_disp.dispatch_alert.call_count, 1)
        
        # Event within cooldown window is skipped
        engine.process_events(events, None, [], 1002.0)
        self.assertEqual(mock_disp.dispatch_alert.call_count, 1)
        
        # Event after cooldown expires triggers
        engine.process_events(events, None, [], 1006.0)
        self.assertEqual(mock_disp.dispatch_alert.call_count, 2)

    def test_camera_offline_online_transitions(self):
        detector = CameraOfflineDetector("CAM-TEST", threshold_seconds=5)
        
        now = time.time()
        # Stream active
        events = detector.update(True, now)
        self.assertEqual(len(events), 0)
        
        # Stream dropped for 6 seconds
        events = detector.update(False, now + 6)
        self.assertEqual(len(events), 1)
        self.assertEqual(events[0]["eventType"], "CAMERA_OFFLINE")
        
        # Retains offline status silently
        events = detector.update(False, now + 10)
        self.assertEqual(len(events), 0)
        
        # Stream recovers
        events = detector.update(True, now + 12)
        self.assertEqual(len(events), 1)
        self.assertEqual(events[0]["eventType"], "CAMERA_ONLINE")

    def test_camera_tampering_heuristics(self):
        detector = CameraTamperingDetector("CAM-TEST")
        detector.tampering_duration = 2
        
        # Establish reference frame
        frame_ref = np.zeros((100, 100, 3), dtype=np.uint8)
        detector.update(frame_ref, 1000)
        
        # Camera covered (black frame)
        frame_black = np.zeros((100, 100, 3), dtype=np.uint8)
        events = detector.update(frame_black, 1001)
        self.assertEqual(len(events), 0)
        
        # Persistent tamper past duration
        events = detector.update(frame_black, 1003)
        self.assertEqual(len(events), 1)
        self.assertEqual(events[0]["eventType"], "CAMERA_TAMPERING")

    def test_behavior_suspicious_movement(self):
        # Suspicious pacing
        suspicious = SuspiciousMovementDetector(direction_changes_threshold=3, min_distance=100.0)
        metrics = {"direction_changes": 2, "distance_traveled": 120.0}
        self.assertFalse(suspicious.check_suspicious_movement(1, metrics))
        
        metrics = {"direction_changes": 3, "distance_traveled": 120.0}
        self.assertTrue(suspicious.check_suspicious_movement(1, metrics))

    def test_timezone_aware_after_hours(self):
        # 2:00 PM (open)
        dt_day = datetime(2026, 8, 14, 14, 0, 0)
        self.assertFalse(is_after_hours("CAM-1", dt_day))
        
        # 11:00 PM (after-hours)
        dt_night = datetime(2026, 8, 14, 23, 0, 0)
        self.assertTrue(is_after_hours("CAM-1", dt_night))
