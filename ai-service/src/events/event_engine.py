import time
from typing import List, Dict, Any, Callable
from src.events.event_models import CameraEvent
from src.utils.logger import logger


class EventEngine:
    """Orchestrates detection inputs, filters events, and dispatches them to registered listeners."""

    def __init__(self):
        self._listeners: List[Callable[[CameraEvent], None]] = []

    def register_listener(self, callback: Callable[[CameraEvent], None]) -> None:
        """Registers a callback function to listen to generated events.
        
        Args:
            callback: Callable that accepts a CameraEvent argument.
        """
        if callback not in self._listeners:
            self._listeners.append(callback)
            logger.info(f"Registered event listener: {callback.__name__ if hasattr(callback, '__name__') else callback}")

    def unregister_listener(self, callback: Callable[[CameraEvent], None]) -> None:
        """Removes a registered callback function.
        
        Args:
            callback: Callable to be removed.
        """
        if callback in self._listeners:
            self._listeners.remove(callback)
            logger.info(f"Unregistered event listener: {callback.__name__ if hasattr(callback, '__name__') else callback}")

    def process_detections(self, camera_id: str, frame: Any, detections: List[Dict[str, Any]]) -> None:
        """Evaluates model detections and dispatches events if criteria are met.
        
        Currently, triggers a 'person_detected' event if one or more people are found.
        
        Args:
            camera_id: Identifier of the source camera.
            frame: Numpy array of the raw camera frame.
            detections: List of detection dictionary results from the detector.
        """
        if not detections:
            return

        # Separate detections by class name just in case other classes creep in
        person_detections = [d for d in detections if d.get("class_name") == "person"]

        if not person_detections:
            return

        # Aggregate event properties
        max_confidence = max(d["confidence"] for d in person_detections)
        bounding_boxes = [d["box"] for d in person_detections]
        
        # Create event payload
        event = CameraEvent(
            timestamp=time.time(),
            camera_id=camera_id,
            event_type="person_detected",
            confidence=max_confidence,
            frame=frame,
            bounding_boxes=bounding_boxes
        )

        logger.info(
            f"Event Triggered: {event.event_type} on camera {event.camera_id} "
            f"(count: {len(person_detections)}, max_conf: {event.confidence:.2f})"
        )

        # Notify all active listeners
        self._dispatch_event(event)

    def _dispatch_event(self, event: CameraEvent) -> None:
        """Sends the event object to all registered callback functions."""
        for listener in self._listeners:
            try:
                listener(event)
            except Exception as e:
                logger.error(
                    f"Error running event listener '{listener.__name__ if hasattr(listener, '__name__') else listener}': {e}"
                )
