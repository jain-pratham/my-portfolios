import os
import time
import unittest
from unittest.mock import MagicMock, patch
import numpy as np

from src.services.backend_client import BackendClient
from src.events.event_models import CameraEvent


class TestBackendClient(unittest.TestCase):
    """Unit tests for the BackendClient HTTP poster and queue worker."""

    @patch("src.services.backend_client.cv2.imwrite")
    @patch("src.services.backend_client.cv2.imencode")
    @patch("src.services.backend_client.requests.post")
    def test_on_camera_event_serialization_and_queue(self, mock_post, mock_imencode, mock_imwrite):
        """Tests that camera events are parsed, saved as snapshots, and posted to the queue."""
        # Setup mocks
        mock_imwrite.return_value = True
        mock_imencode.return_value = (True, np.array([1, 2, 3], dtype=np.uint8))
        
        # Mock successful post
        mock_response = MagicMock()
        mock_response.status_code = 201
        mock_post.return_value = mock_response

        # Instantiate client (starts background thread)
        client = BackendClient()

        # Create dummy frame and event
        dummy_frame = np.zeros((10, 10, 3), dtype=np.uint8)
        event = CameraEvent(
            timestamp=time.time(),
            camera_id="cam_test",
            event_type="person_detected",
            confidence=0.89,
            frame=dummy_frame,
            bounding_boxes=[[10.0, 20.0, 30.0, 40.0]]
        )

        # Trigger event handler
        client.on_camera_event(event)

        # Give background queue worker a moment to process the item
        time.sleep(0.5)

        # Verify imwrite was called to save local snapshot
        mock_imwrite.assert_called_once()
        file_path_arg = mock_imwrite.call_args[0][0].replace("\\", "/")
        self.assertTrue(file_path_arg.startswith("snapshots/event_"))

        # Verify POST request was triggered by queue worker
        mock_post.assert_called_once()
        post_args = mock_post.call_args[1]
        self.assertEqual(post_args["timeout"], 5.0)
        
        # Verify POST JSON body matches specifications
        payload = post_args["json"]
        self.assertEqual(payload["cameraId"], client.camera_id)
        self.assertEqual(payload["customerId"], client.customer_id)
        self.assertEqual(payload["eventType"], "person_detected")
        self.assertEqual(payload["confidence"], 0.89)
        self.assertEqual(payload["personCount"], 1)
        self.assertTrue(payload["snapshot"].startswith("data:image/jpeg;base64,"))

        # Cleanup
        client.shutdown()

    @patch("src.services.backend_client.cv2.imwrite")
    @patch("src.services.backend_client.cv2.imencode")
    @patch("src.services.backend_client.requests.post")
    def test_post_retry_exponential_backoff(self, mock_post, mock_imencode, mock_imwrite):
        """Tests that the background poster retries when backend is unreachable."""
        # Setup mocks
        mock_imwrite.return_value = True
        mock_imencode.return_value = (True, np.array([1, 2, 3], dtype=np.uint8))
        
        # Mock post failure followed by success
        mock_response_fail = MagicMock()
        mock_response_fail.status_code = 500
        mock_response_fail.text = "Internal Server Error"
        
        mock_response_success = MagicMock()
        mock_response_success.status_code = 201

        # Return fail, then success
        mock_post.side_effect = [mock_response_fail, mock_response_success]

        client = BackendClient()

        # Post directly using retry helper with small delay for testing
        payload = {"test": "data", "snapshot": "base64_data"}
        
        # Patch sleep to speed up test execution
        with patch("src.services.backend_client.time.sleep") as mock_sleep:
            success = client._post_with_retry(payload, max_retries=2)
            
            # Assert successful delivery after 2nd attempt
            self.assertTrue(success)
            self.assertEqual(mock_post.call_count, 2)
            mock_sleep.assert_called_once_with(2.0)  # Check initial sleep delay was run

        client.shutdown()


if __name__ == "__main__":
    unittest.main()
