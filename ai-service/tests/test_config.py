import os
import unittest
from unittest.mock import patch


class TestConfig(unittest.TestCase):
    """Tests the parsing and validation logic in settings.py."""

    def test_parse_bool(self):
        """Tests that boolean values are parsed correctly."""
        from src.config.settings import _parse_bool

        self.assertTrue(_parse_bool("true", False))
        self.assertTrue(_parse_bool("1", False))
        self.assertTrue(_parse_bool("yes", False))
        self.assertFalse(_parse_bool("false", True))
        self.assertFalse(_parse_bool("0", True))
        self.assertFalse(_parse_bool("no", True))
        self.assertTrue(_parse_bool(None, True))
        self.assertFalse(_parse_bool(None, False))

    @patch.dict(os.environ, {"CAMERA_SOURCE": "rtsp://test_stream"})
    def test_rtsp_camera_source_parsing(self):
        """Tests that string/RTSP camera sources are parsed correctly as strings."""
        import importlib
        import src.config.settings as settings
        
        # Force reload config with mock env
        importlib.reload(settings)
        self.assertEqual(settings.CAMERA_SOURCE, "rtsp://test_stream")

    @patch.dict(os.environ, {"CAMERA_SOURCE": "2"})
    def test_numeric_camera_source_parsing(self):
        """Tests that numeric camera sources are parsed as integers."""
        import importlib
        import src.config.settings as settings
        
        # Force reload config with mock env
        importlib.reload(settings)
        self.assertEqual(settings.CAMERA_SOURCE, 2)


if __name__ == "__main__":
    unittest.main()
