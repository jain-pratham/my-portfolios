import sys
import time
import cv2

from src.config import settings
from src.camera.camera_manager import CameraManager
from src.detection.person_detector import PersonDetector
from src.events.event_engine import EventEngine
from src.events.event_models import CameraEvent
from src.utils.visualization import draw_detections
from src.utils.logger import logger


def on_person_detected(event: CameraEvent) -> None:
    """Callback function registered as listener to print/process generated camera events."""
    logger.info(
        f"[EVENT HANDLER LOG] Camera: {event.camera_id} | "
        f"Detected {len(event.bounding_boxes)} person(s) | "
        f"Max Confidence: {event.confidence:.2f}"
    )


def main():
    logger.info("Initializing CoreWatch AI Service...")
    
    # 1. Initialize Event Engine and register callback
    event_engine = EventEngine()
    event_engine.register_listener(on_person_detected)

    # Initialize and register backend client
    from src.services.backend_client import BackendClient
    backend_client = BackendClient()
    event_engine.register_listener(backend_client.on_camera_event)

    # 2. Initialize Person Detector
    try:
        detector = PersonDetector(
            model_path=settings.YOLO_MODEL_PATH,
            confidence_threshold=settings.CONFIDENCE_THRESHOLD,
            device_id=settings.DEVICE_ID,
            use_gpu=settings.USE_GPU,
        )
    except RuntimeError as e:
        logger.critical(f"Critical initialization failure: {e}")
        sys.exit(1)

    # 3. Initialize Camera Manager
    camera_id = "cam_1"
    camera_manager = CameraManager(reconnect_interval=settings.RECONNECT_INTERVAL_SEC)
    camera_manager.add_camera(camera_id, settings.CAMERA_SOURCE)

    # Open camera stream
    success = camera_manager.open_camera(camera_id)
    if not success:
        logger.error(f"Failed to open camera '{camera_id}' initially. Auto-reconnect thread is active.")

    logger.info("CoreWatch AI Service is running. Press 'q' in the camera window or Ctrl+C in terminal to exit.")

    try:
        last_disconnect_log_time = 0.0

        while True:
            # Check connection status
            is_connected = camera_manager.is_camera_connected(camera_id)
            
            # Read current frame from camera
            success, frame = camera_manager.read_frame(camera_id)

            if not success or frame is None:
                current_time = time.time()
                # Log disconnection message every 5 seconds to avoid flooding console logs
                if current_time - last_disconnect_log_time > 5.0:
                    logger.warning(f"Camera '{camera_id}' stream is not available. Waiting for connection...")
                    last_disconnect_log_time = current_time
                
                time.sleep(0.1)
                continue

            # Run person detection
            detections = detector.detect(frame)

            # Process detections in event engine
            event_engine.process_detections(camera_id, frame, detections)

            # Display window if configured
            if settings.DISPLAY_WINDOW:
                # Draw bounding boxes and labels
                annotated_frame = draw_detections(frame, detections)
                
                # Show frame
                cv2.imshow(settings.WINDOW_NAME, annotated_frame)
                
                # Check for exit keypress
                key = cv2.waitKey(1) & 0xFF
                if key == ord("q"):
                    logger.info("Quit key 'q' pressed. Initiating shutdown...")
                    break
            else:
                # If headless, run a small yield sleep to prevent 100% CPU thread starvation
                time.sleep(0.01)

    except KeyboardInterrupt:
        logger.info("Keyboard interrupt received. Initiating shutdown...")
    finally:
        # Cleanup resources
        logger.info("Cleaning up resources...")
        if 'backend_client' in locals():
            backend_client.shutdown()
        camera_manager.close_all()
        if settings.DISPLAY_WINDOW:
            cv2.destroyAllWindows()
        logger.info("CoreWatch AI Service stopped.")


if __name__ == "__main__":
    main()