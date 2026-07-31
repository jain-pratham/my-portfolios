import base64
import os
import queue
import time
import uuid
import threading
from typing import Dict, Any
import cv2
import requests

from src.config import settings
from src.events.event_models import CameraEvent
from src.utils.logger import logger


class BackendClient:
    """Sends CCTV security events to the CoreWatch Backend API.
    
    Generates snapshots locally, packages events into JSON, queues them,
    and runs a background thread to POST payloads to the backend with auto-retry.
    """

    def __init__(self):
        self.camera_id = settings.CAMERA_ID
        self.customer_id = settings.CUSTOMER_ID
        self.backend_url = f"{settings.BACKEND_API_URL.rstrip('/')}/events"
        self.snapshot_dir = "snapshots"

        if not os.path.exists(self.snapshot_dir):
            os.makedirs(self.snapshot_dir, exist_ok=True)

        # Cooldown management (throttle alerts to once every 5 seconds per event type per camera)
        self.cooldown_interval = 5.0
        self._last_sent_timestamps: Dict[str, float] = {}

        # Thread-safe queue for background posting
        self._queue: queue.Queue = queue.Queue()
        self._stop_event = threading.Event()
        self._worker_thread = threading.Thread(
            target=self._worker_loop,
            name="BackendClientWorker",
            daemon=True
        )
        self._worker_thread.start()
        logger.info("BackendClient initialized and background poster worker started.")

    def on_camera_event(self, event: CameraEvent) -> None:
        """Callback registered with the EventEngine. Runs instantly and queues the event."""
        try:
            # Cooldown check
            cooldown_key = f"{event.camera_id}_{event.event_type}"
            current_time = time.time()
            if current_time - self._last_sent_timestamps.get(cooldown_key, 0.0) < self.cooldown_interval:
                return  # Throttle event transmission
            
            # Update last sent timestamp
            self._last_sent_timestamps[cooldown_key] = current_time

            # 1. Save snapshot locally to snapshots/
            timestamp_str = time.strftime("%Y%m%d_%H%M%S")
            unique_id = uuid.uuid4().hex[:6]
            filename = f"event_{timestamp_str}_{unique_id}.jpg"
            local_path = os.path.join(self.snapshot_dir, filename)

            # Write frame to file
            success = cv2.imwrite(local_path, event.frame)
            if not success:
                logger.error(f"Failed to write local snapshot file to {local_path}")
                return

            logger.info(f"Saved local snapshot to {local_path}")

            # 2. Convert frame to base64 string
            success, buffer = cv2.imencode(".jpg", event.frame)
            if not success:
                logger.error("Failed to encode frame for base64 payload conversion")
                return

            base64_str = base64.b64encode(buffer).decode("utf-8")
            base64_data_url = f"data:image/jpeg;base64,{base64_str}"

            # 3. Create POST JSON payload
            payload = {
                "cameraId": self.camera_id,
                "customerId": self.customer_id,
                "eventType": event.event_type,
                "confidence": event.confidence,
                "personCount": len(event.bounding_boxes),
                "snapshot": base64_data_url
            }

            # Queue payload for background transmission
            self._queue.put(payload)
            logger.info(f"Security event queued for transmission to backend (Queue size: {self._queue.qsize()})")

        except Exception as e:
            logger.error(f"Error handling camera event in BackendClient: {e}")

    def _worker_loop(self) -> None:
        """Background thread loop that pops events and posts them to the backend."""
        while not self._stop_event.is_set():
            try:
                # Wait for an item in the queue (timeout to check stop event)
                payload = self._queue.get(timeout=1.0)
            except queue.Empty:
                continue

            # Process posting with auto-retry
            success = self._post_with_retry(payload)
            if success:
                self._queue.task_done()
            else:
                # Re-queue the failed payload to try again
                logger.warning("Failed to deliver event after retries. Re-queuing payload.")
                self._queue.put(payload)
                self._queue.task_done()  # Complete current task context
                time.sleep(5.0)  # Wait a bit before immediately picking it back up

    def _post_with_retry(self, payload: Dict[str, Any], max_retries: int = 5) -> bool:
        """Sends the HTTP POST request, retrying with exponential backoff if backend is unavailable."""
        retry_delay = 2.0  # Initial delay
        
        for attempt in range(1, max_retries + 1):
            if self._stop_event.is_set():
                return False

            try:
                logger.info(f"Sending event to backend: {self.backend_url} (Attempt {attempt}/{max_retries})")
                
                # Exclude base64 string from console logs for cleanliness
                log_payload = {k: v for k, v in payload.items() if k != "snapshot"}
                logger.debug(f"Payload: {log_payload}")

                response = requests.post(
                    self.backend_url,
                    json=payload,
                    timeout=5.0  # 5-second request timeout
                )

                if response.status_code == 201:
                    logger.info("Security event successfully accepted by backend.")
                    return True
                else:
                    logger.error(
                        f"Backend rejected event with code {response.status_code}: {response.text}"
                    )
                    # If it's a validation error (400) or not found (404), retrying won't help
                    if response.status_code in (400, 404):
                        return False

            except (requests.exceptions.ConnectionError, requests.exceptions.Timeout) as e:
                logger.warning(f"Backend is currently unreachable: {e}")
            except Exception as e:
                logger.error(f"Unexpected error posting event: {e}")

            # Backoff before retrying
            if attempt < max_retries:
                logger.info(f"Retrying in {retry_delay}s...")
                time.sleep(retry_delay)
                retry_delay = min(retry_delay * 2, 30.0)  # Max backoff caps at 30 seconds

        logger.error(f"Failed to post security event after {max_retries} attempts.")
        return False

    def shutdown(self) -> None:
        """Stops the worker thread."""
        logger.info("Shutting down BackendClient worker...")
        self._stop_event.set()
        self._worker_thread.join(timeout=3.0)
        logger.info("BackendClient worker stopped.")
