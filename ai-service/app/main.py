import time
import threading
import cv2
import numpy as np
from fastapi import FastAPI
from app.config import settings
from app.utils.logger import setup_logging, get_logger
from app.camera.stream import CameraStream
from app.detection.person_detector import PersonDetector, YOLOModelManager
from app.tracking.track_manager import TrackManager
from app.zones.zone_manager import ZoneManager
from app.zones.zone_rules import ZoneRulesEngine
from app.behavior.movement import MovementTracker
from app.behavior.loitering import LoiteringDetector
from app.behavior.suspicious import SuspiciousMovementDetector
from app.camera_security.offline_detector import CameraOfflineDetector
from app.camera_security.tampering_detector import CameraTamperingDetector
from app.events.event_engine import EventEngine
from app.api.routes import health, camera, detection

# Setup logging
setup_logging()
logger = get_logger("System")

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="CoreWatch AI Security Service",
    description="FastAPI container orchestrating YOLO-based real-time security stream monitoring.",
    version="1.0.0"
)

# Enable CORS for frontend dashboard access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(health.router, tags=["Health"])
app.include_router(camera.router, prefix="/api", tags=["Camera"])
app.include_router(detection.router, prefix="/api", tags=["Detection"])


class CameraRuntime:
    """
    Manages the real-time processing thread for a single camera feed.
    """
    def __init__(self, camera_key: str, camera_url: str, detector: PersonDetector):
        self.camera_key = camera_key
        self.camera_url = camera_url
        self.detector = detector

        # Pipelines
        self.stream = CameraStream(self.camera_url)
        self.track_manager = TrackManager(track_lost_grace_seconds=2.0)
        self.zone_manager = ZoneManager(self.camera_key)
        self.zone_rules_engine = ZoneRulesEngine(track_lost_grace_seconds=2.0)
        
        # Behaviors
        self.movement_tracker = MovementTracker()
        self.loitering_detector = LoiteringDetector()
        self.suspicious_detector = SuspiciousMovementDetector()

        # Stream security monitors
        self.offline_detector = CameraOfflineDetector(self.camera_key)
        self.tampering_detector = CameraTamperingDetector(self.camera_key)

        # Dispatch engine
        self.event_engine = EventEngine()

        # Thread states
        self.running = False
        self.thread = None
        
        # Frame cache for GUI display
        self.last_frame = None
        self.last_annotated_frame = None
        self.active_tracks_count = 0
        self.last_ai_time = 0.0

    def start(self):
        self.running = True
        # Fetch initial zones before launching loop
        self.zone_manager.fetch_zones()
        self.thread = threading.Thread(target=self._loop, name=f"Runtime-{self.camera_key}", daemon=True)
        self.thread.start()
        logger.info(f"[System] Started camera runtime thread for {self.camera_key}")

    def stop(self):
        self.running = False
        if self.thread:
            self.thread.join(timeout=3.0)
        self.stream.release()
        logger.info(f"[System] Stopped camera runtime thread for {self.camera_key}")

    def _loop(self):
        time_per_frame = 1.0 / settings.AI_PROCESS_FPS
        
        # Open camera stream
        if not self.stream.open():
            logger.error(f"[Camera] Could not connect to camera stream for key {self.camera_key}. Loop will retry dynamically.")

        while self.running:
            try:
                frame = self.stream.read_frame()
                frame_received = frame is not None

                now = time.time()

                # 1. Update camera connectivity health
                offline_events = self.offline_detector.update(frame_received, now)
                if len(offline_events) > 0:
                    self.event_engine.process_events(offline_events, None, [], now)

                if not frame_received:
                    time.sleep(0.01)
                    continue

                self.last_frame = frame

                # 2. Enforce frame rate scheduler
                if now - self.last_ai_time >= time_per_frame:
                    self.last_ai_time = now

                    # 3. Check for camera visual tampering (black lens, frozen feed, view shift)
                    tamper_events = self.tampering_detector.update(frame, now)
                    if len(tamper_events) > 0:
                        self.event_engine.process_events(tamper_events, frame, [], now)

                    # 4. Run single-pass YOLO + ByteTrack tracking
                    detections = self.detector.track_persons(frame)

                    # 5. Enrich tracks with movement historical parameters
                    enriched_detections = self.track_manager.update_tracks(detections, now)
                    self.active_tracks_count = len(enriched_detections)

                    # 6. Retrieve active zones cache
                    zones = self.zone_manager.get_active_zones()

                    # 7. Evaluate polygon containment rules (foot points)
                    h, w = frame.shape[:2]
                    zone_events = self.zone_rules_engine.evaluate(
                        camera_id=self.camera_key,
                        zones=zones,
                        detections=enriched_detections,
                        width=w,
                        height=h,
                        timestamp=now
                    )

                    # 8. Evaluate behaviors (loitering, pacing)
                    behavior_events = []
                    for det in enriched_detections:
                        track_id = det.get("trackId")
                        if track_id is None:
                            continue

                        foot_pt = (det["footPoint"]["x"], det["footPoint"]["y"])
                        first_seen = det.get("firstSeen", now)

                        # Movement calculations
                        metrics = self.movement_tracker.update(track_id, foot_pt, now)

                        # Check loitering rule
                        if self.loitering_detector.check_loitering(track_id, first_seen, now):
                            behavior_events.append({
                                "eventType": "LOITERING",
                                "cameraId": self.camera_key,
                                "trackId": track_id,
                                "timestamp": now,
                                "bbox": det.get("bbox")
                            })

                        # Check suspicious pacing rule
                        if self.suspicious_detector.check_suspicious_movement(track_id, metrics):
                            behavior_events.append({
                                "eventType": "SUSPICIOUS_MOVEMENT_PATTERN",
                                "cameraId": self.camera_key,
                                "trackId": track_id,
                                "timestamp": now,
                                "bbox": det.get("bbox")
                            })

                    # Cleanup behavior instances for dead tracks
                    active_tids = {det.get("trackId") for det in enriched_detections if det.get("trackId") is not None}
                    dead_tracks = [tid for tid in self.movement_tracker.track_histories.keys() if tid not in active_tids]
                    self.movement_tracker.cleanup(dead_tracks)
                    for tid in dead_tracks:
                        self.loitering_detector.reset_track(tid)
                        self.suspicious_detector.reset_track(tid)

                    # 9. Process events
                    all_events = zone_events + behavior_events
                    if len(all_events) > 0:
                        self.event_engine.process_events(all_events, frame, zones, now)

                    # 10. Cache annotated preview frame
                    annotated_frame = frame.copy()
                    self._draw_annotations(annotated_frame, enriched_detections, zones)
                    self.last_annotated_frame = annotated_frame

                else:
                    time.sleep(0.001)

            except Exception as e:
                logger.error(f"[Camera] Error inside processing loop for camera {self.camera_key}: {e}", exc_info=True)
                time.sleep(1)

    def _draw_annotations(self, frame, detections, zones):
        """
        Draws zones boundaries and tracking details onto the debug preview.
        """
        h, w = frame.shape[:2]
        # Draw Zones
        for zone in zones:
            pts = []
            for pt in zone["points"]:
                px = int(pt.get("x", 0.0) * w)
                py = int(pt.get("y", 0.0) * h)
                pts.append([px, py])
            
            if len(pts) >= 3:
                pts_arr = np.array(pts, dtype=np.int32).reshape((-1, 1, 2))
                # Yellow border for zones
                cv2.polylines(frame, [pts_arr], isClosed=True, color=(0, 255, 255), thickness=2)
                cv2.putText(
                    frame, 
                    f"{zone.get('name')} [{zone.get('type')}]", 
                    (pts[0][0], pts[0][1] - 5), 
                    cv2.FONT_HERSHEY_SIMPLEX, 
                    0.5, 
                    (0, 255, 255), 
                    1, 
                    cv2.LINE_AA
                )

        # Draw Person Boxes and Tracks
        for det in detections:
            bbox = det["bbox"]
            x1, y1, x2, y2 = bbox["x1"], bbox["y1"], bbox["x2"], bbox["y2"]
            track_id = det.get("trackId")
            conf = det["confidence"]

            # Green box
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            
            label = f"Person ID: {track_id} ({conf:.1%})" if track_id is not None else f"Person ({conf:.1%})"
            cv2.putText(
                frame, 
                label, 
                (x1, y1 - 5), 
                cv2.FONT_HERSHEY_SIMPLEX, 
                0.4, 
                (0, 255, 0), 
                1, 
                cv2.LINE_AA
            )
            
            # Red circle on feet contact point
            foot = det["footPoint"]
            cv2.circle(frame, (foot["x"], foot["y"]), 4, (0, 0, 255), -1)


class CameraManager:
    """
    Manages, coordinates, and shuts down camera runtime loops.
    """
    def __init__(self):
        self.runtimes = {}
        self.detector = None
        self._lock = threading.Lock()

    def initialize(self):
        with self._lock:
            # Singleton model initialized once
            self.detector = PersonDetector()

    def register_camera(self, camera_key: str, camera_url: str):
        with self._lock:
            if not self.detector:
                self.detector = PersonDetector()
            
            if camera_key in self.runtimes:
                logger.warning(f"[System] Camera {camera_key} is already registered. Skipping.")
                return
            
            runtime = CameraRuntime(camera_key, camera_url, self.detector)
            self.runtimes[camera_key] = runtime
            runtime.start()
            logger.info(f"[System] Camera runtime registered: key={camera_key} url={camera_url}")

    def get_runtime(self, camera_key: str) -> CameraRuntime:
        return self.runtimes.get(camera_key)

    def shutdown(self):
        with self._lock:
            logger.info("[System] Releasing and shutting down all active camera streams...")
            for runtime in self.runtimes.values():
                runtime.stop()
            self.runtimes.clear()


# Global manager instances
camera_manager = CameraManager()
display_running = False

def run_opencv_display():
    """
    Updates window GUI displays for all active streams.
    Must execute on the main thread for OpenCV window stability.
    """
    global display_running
    logger.info("[System] Launching main thread OpenCV display loop...")
    display_running = True
    
    while display_running:
        active_keys = list(camera_manager.runtimes.keys())
        if not active_keys:
            time.sleep(0.1)
            continue

        for key in active_keys:
            runtime = camera_manager.get_runtime(key)
            if runtime and runtime.last_annotated_frame is not None:
                window_name = f"CoreWatch Live Security - ({key})"
                cv2.namedWindow(window_name, cv2.WINDOW_NORMAL)
                cv2.imshow(window_name, runtime.last_annotated_frame)

        # Poll keystroke. Terminate display if 'q' is pressed
        if cv2.waitKey(1) & 0xFF == ord('q'):
            logger.info("[System] Key 'q' pressed in preview window. Shutting down service...")
            display_running = False
            break
            
        time.sleep(0.01)

    cv2.destroyAllWindows()


@app.on_event("startup")
def startup_event():
    """
    FastAPI startup lifecycle handler. Loads YOLO and starts streaming cameras.
    """
    logger.info("[System] Starting CoreWatch AI backend service...")
    
    # Initialize the detector singleton
    camera_manager.initialize()

    # Register and start default stream
    camera_manager.register_camera(settings.CAMERA_KEY, settings.CAMERA_URL)

    # Spawn display window thread if GUI preview is enabled
    if settings.DISPLAY_WINDOW:
        # We start it as a daemon thread or call directly if FastAPI runs synchronously,
        # but to allow FastAPI to proceed, we spawn a separate thread for waitKey loop if needed.
        # Wait, if we spawn it as a thread, waitKey might have quirks on some OS, but on Windows
        # it is generally fine to run in a thread as long as it has a window, but running it in the main
        # thread or a separate thread is standard. Let's spawn it in a thread so FastAPI doesn't block.
        display_thread = threading.Thread(target=run_opencv_display, name="DisplayThread", daemon=True)
        display_thread.start()


@app.on_event("shutdown")
def shutdown_event():
    """
    FastAPI shutdown lifecycle handler. Stops threads and releases OpenCV captures.
    """
    global display_running
    logger.info("[System] Shutting down CoreWatch AI backend service...")
    display_running = False
    camera_manager.shutdown()
    logger.info("[System] Service cleanup sequence complete.")
