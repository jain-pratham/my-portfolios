import unittest
import time
from app.alerts.dispatcher import AlertDispatcher

class TestEventCooldown(unittest.TestCase):
    def test_alert_cooldown_triggering(self):
        """
        Validates that alerts are governed by cooldown limits to prevent request flooding.
        """
        cooldown_window = 2  # seconds
        dispatcher = AlertDispatcher(api_url="http://localhost:3000/api/alerts", cooldown_seconds=cooldown_window)
        camera_key = "CAM-SECURITY-01"

        now = time.time()
        
        # First dispatch check should pass
        self.assertTrue(dispatcher.can_trigger_alert(camera_key, now))

        # Check within cooldown window should fail
        self.assertFalse(dispatcher.can_trigger_alert(camera_key, now + 1.0))

        # Check after cooldown window elapsed should pass
        self.assertTrue(dispatcher.can_trigger_alert(camera_key, now + 3.0))

    def test_independent_cooldown_per_camera(self):
        """
        Ensures multiple cameras have isolated cooldown timers.
        """
        cooldown_window = 2
        dispatcher = AlertDispatcher(api_url="http://localhost:3000/api/alerts", cooldown_seconds=cooldown_window)
        cam_a = "CAM-ALPHA"
        cam_b = "CAM-BETA"

        now = time.time()

        # Cam A triggers alert
        self.assertTrue(dispatcher.can_trigger_alert(cam_a, now))

        # Cam B triggers alert concurrently (should pass because it is independent)
        self.assertTrue(dispatcher.can_trigger_alert(cam_b, now))

        # Cam A triggers alert again too quickly (should be blocked)
        self.assertFalse(dispatcher.can_trigger_alert(cam_a, now + 0.5))

        # Cam B triggers alert again too quickly (should be blocked)
        self.assertFalse(dispatcher.can_trigger_alert(cam_b, now + 0.5))

if __name__ == "__main__":
    unittest.main()
