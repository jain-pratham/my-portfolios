import time
import threading
import cv2
from fastapi import FastAPI
from app.config import settings
from app.utils.logger import setup_logging, get_logger
from app.camera.stream import CameraStream
from app.detection.person_detector import PersonDetector
from app.alerts.dispatcher import AlertDispatcher
from app.api.routes import health, camera, detection

# Setup log configuration
setup_logging()
logger = get_logger("System")

app = FastAPI(
    title="CoreWatch AI Security Service",
    description="FastAPI container orchestrating YOLO-based real-time security stream monitoring.",
    version="1.0.0"
)

# Register routers
app.include_router(health.router, tags=["Health"])
app.include_router(camera.router, prefix="/api", tags=["Camera"])
app.include_router(detection.router, prefix="/api", tags=["Detection"])

# Global thread orchestration states
detection_thread = None
running = False

def run_detection_loop():
    """
    Main processing loop running in a background thread.
    Exposes frames, runs YOLO inference, draws annotations, and triggers alert dispatches.
    """
    global running
    logger.info("Starting real-time security detection loop thread...")

    stream = CameraStream()
    detector = PersonDetector()
    dispatcher = AlertDispatcher()

    # Open camera stream
    if not stream.open():
        logger.error("Could not establish initial connection to camera stream. Loop will retry dynamically.")

    window_name = f"CoreWatch Live Security - ({settings.CAMERA_KEY})"
    has_display = settings.DISPLAY_WINDOW

    if has_display:
        try:
            cv2.namedWindow(window_name, cv2.WINDOW_NORMAL)
            logger.info("OpenCV GUI window initialized successfully.")
        except Exception as e:
            logger.warning(f"Could not build OpenCV graphical window (GUI unavailable or running headless): {e}")
            has_display = False

    while running:
        try:
            frame = stream.read_frame()
            if frame is None:
                logger.warning("Frame read was empty. Retrying...")
                time.sleep(0.5)
                continue

            # Run YOLO person detection
            detections = detector.detect_persons(frame)
            person_detected = len(detections) > 0

            # Draw annotations (bounding boxes, confidence scores)
            for det in detections:
                x1, y1, x2, y2 = det["box"]
                conf = det["confidence"]

                # Draw bounding box (Green)
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)

                # Draw label header
                label = f"Human Detected: {conf:.2%}"
                label_size, _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 1)
                cv2.rectangle(frame, (x1, y1 - label_size[1] - 10), (x1 + label_size[0], y1), (0, 255, 0), cv2.FILLED)
                cv2.putText(
                    frame,
                    label,
                    (x1, y1 - 5),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.5,
                    (0, 0, 0),
                    1,
                    cv2.LINE_AA
                )

            # Trigger non-blocking cooldown alert
            if person_detected:
                now = time.time()
                if dispatcher.can_trigger_alert(settings.CAMERA_KEY, now):
                    logger.info("🚨 Human intrusion detected! Triggering background alert thread...")
                    dispatcher.dispatch_alert(
                        frame=frame, 
                        camera_key=settings.CAMERA_KEY, 
                        message="Human detected in shop!"
                    )

            # Display frame inside window if display is active
            if has_display:
                cv2.imshow(window_name, frame)
                # Listen to keyboard event (exit on 'q' press)
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    logger.info("Key 'q' pressed in display window. Terminating detection loop...")
                    running = False
                    break
            else:
                # Idle delay to reduce CPU overhead when running headless
                time.sleep(0.01)

        except Exception as e:
            logger.error(f"Error encountered inside detection loop thread: {e}", exc_info=True)
            time.sleep(1)

    # Release stream resources
    stream.release()
    if has_display:
        try:
            cv2.destroyAllWindows()
            logger.info("OpenCV GUI windows closed.")
        except Exception as e:
            logger.error(f"Failed to destroy OpenCV windows: {e}")

    logger.info("Detection loop background thread terminated.")


@app.on_event("startup")
def startup_event():
    """
    Spawns the background camera stream reading and YOLO detection loop thread.
    """
    global detection_thread, running
    logger.info("Initializing CoreWatch AI backend service...")
    
    running = True
    detection_thread = threading.Thread(target=run_detection_loop, daemon=True)
    detection_thread.start()


@app.on_event("shutdown")
def shutdown_event():
    """
    Signals background worker thread to stop and releases active resources.
    """
    global running
    logger.info("Shutting down CoreWatch AI backend service...")
    
    running = False
    if detection_thread is not None:
        detection_thread.join(timeout=3.0)
    logger.info("Service cleanup sequence complete.")
