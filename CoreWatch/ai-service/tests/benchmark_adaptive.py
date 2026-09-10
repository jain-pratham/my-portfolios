import time
import numpy as np
from app.config import settings
from app.inference.priority import InferencePriority
from app.inference.motion_gate import MotionGate
from app.inference.identity_client import IdentityClient
from app.inference.inference_scheduler import InferenceScheduler
from app.detection.person_detector import PersonDetector

def generate_mock_frame(has_motion=False):
    """
    Helper to generate raw images for MotionGate tests.
    """
    frame = np.zeros((480, 640, 3), dtype=np.uint8)
    if has_motion:
        # Fill a random quadrant with white pixels to simulate motion
        frame[100:300, 100:400] = 255
    return frame

def run_level1_simulation():
    """
    LEVEL 1: Dry Scheduler Simulation
    Runs 10 scenario flows and measures scheduling decisions without running deep learning models.
    """
    print("\n" + "="*50)
    print(" LEVEL 1: SCHEDULER DECISION SIMULATION ")
    print("="*50)
    
    # 10 Scenario Flows
    scenarios = {
        "A": {"name": "Empty static scene", "motion": False, "tracks": [], "event": False},
        "B": {"name": "Normal movement", "motion": True, "tracks": [], "event": False},
        "C": {"name": "Trusted person normal activity", "motion": True, "tracks": [{"trackId": 1, "identityStatus": "TRUSTED", "zoneType": None, "isNearRestricted": False, "hasSuspiciousBehavior": False}], "event": False},
        "D": {"name": "Unknown person", "motion": True, "tracks": [{"trackId": 2, "identityStatus": "UNKNOWN", "zoneType": None, "isNearRestricted": False, "hasSuspiciousBehavior": False}], "event": False},
        "E": {"name": "Unknown person near restricted", "motion": True, "tracks": [{"trackId": 2, "identityStatus": "UNKNOWN", "zoneType": None, "isNearRestricted": True, "hasSuspiciousBehavior": False}], "event": False},
        "F": {"name": "Person enters restricted zone", "motion": True, "tracks": [{"trackId": 3, "identityStatus": "UNKNOWN", "zoneType": "RESTRICTED", "isNearRestricted": True, "hasSuspiciousBehavior": False}], "event": False},
        "G": {"name": "Person stops inside restricted", "motion": False, "tracks": [{"trackId": 3, "identityStatus": "UNKNOWN", "zoneType": "RESTRICTED", "isNearRestricted": True, "hasSuspiciousBehavior": False}], "event": False},
        "H": {"name": "Multiple people (crowd boost)", "motion": True, "tracks": [{"trackId": i, "identityStatus": "UNKNOWN", "zoneType": None, "isNearRestricted": False, "hasSuspiciousBehavior": False} for i in range(5)], "event": False},
        "I": {"name": "Active security event override", "motion": False, "tracks": [], "event": True},
        "J": {"name": "Camera recovery (scene changed)", "motion": True, "tracks": [], "event": False}
    }

    scheduler = InferenceScheduler("CAM-BENCH-L1")
    scheduler.min_duration = 0.0 # disable hysteresis duration for clean instant checks
    scheduler.cooldown_duration = 0.0

    print(f"{'Key':<4} | {'Scenario Name':<35} | {'Priority':<10} | {'Target FPS':<10}")
    print("-" * 70)
    for key, spec in scenarios.items():
        context = {
            "motionDetected": spec["motion"],
            "motionScore": 0.3 if spec["motion"] else 0.0,
            "activeTracks": spec["tracks"],
            "activeSecurityEvent": spec["event"]
        }
        scheduler.should_run_inference(time.time(), context)
        print(f"{key:<4} | {spec['name']:<35} | {scheduler.state.current_priority.value:<10} | {scheduler.state.target_fps:<10.1f}")

def run_level2_comparison():
    """
    LEVEL 2: Real YOLO Execution Benchmark
    Compares Baseline (Fixed FPS) vs Adaptive (Optimization enabled).
    """
    print("\n" + "="*50)
    print(" LEVEL 2: REAL MODEL EXECUTION COMPARISON ")
    print("="*50)

    # Instantiate detector
    try:
        detector = PersonDetector(camera_key="CAM-BENCH-L2")
    except Exception as e:
        print(f"Skipping Level 2 because YOLO weights cannot be loaded: {e}")
        return

    # Simulate 30 frames (representing 3 scenarios: static, motion but trusted, and unknown intrusion)
    frames_sequence = []
    # Scene 1: Static (10 frames)
    for _ in range(10):
        frames_sequence.append((generate_mock_frame(False), {"motion": False, "tracks": [], "event": False}))
    # Scene 2: Trusted person in normal area (10 frames)
    for _ in range(10):
        frames_sequence.append((generate_mock_frame(True), {"motion": True, "tracks": [{"trackId": 1, "identityStatus": "TRUSTED", "zoneType": None, "isNearRestricted": False, "hasSuspiciousBehavior": False}], "event": False}))
    # Scene 3: Active threat event (10 frames)
    for _ in range(10):
        frames_sequence.append((generate_mock_frame(True), {"motion": True, "tracks": [{"trackId": 2, "identityStatus": "UNKNOWN", "zoneType": "RESTRICTED", "isNearRestricted": True, "hasSuspiciousBehavior": False}], "event": False}))

    # --- BASELINE RUN (Fixed FPS) ---
    print("Running BASELINE (YOLO on every frame)...")
    baseline_inference_count = 0
    start_t = time.time()
    for frame, _ in frames_sequence:
        detector.track_persons(frame)
        baseline_inference_count += 1
    baseline_duration = time.time() - start_t
    print(f"Baseline complete: {baseline_inference_count} inferences in {baseline_duration:.2f}s")

    # --- ADAPTIVE RUN (Optimized FPS) ---
    print("\nRunning ADAPTIVE Policy Optimization...")
    scheduler = InferenceScheduler("CAM-BENCH-L2")
    motion_gate = MotionGate()
    adaptive_inference_count = 0
    skipped_count = 0
    start_t = time.time()
    
    # Process sequence frame-by-frame with timing simulation (simulate 10 FPS stream, 0.1s delta)
    simulated_now = time.time()
    for frame, spec in frames_sequence:
        # Evaluate motion gate
        motion_res = motion_gate.update(frame)
        context = {
            "motionDetected": motion_res["motionDetected"],
            "motionScore": motion_res["motionScore"],
            "activeTracks": spec["tracks"],
            "activeSecurityEvent": spec["event"]
        }
        
        # Decide if YOLO should run
        if scheduler.should_run_inference(simulated_now, context):
            detector.track_persons(frame)
            scheduler.state.record_inference(simulated_now, 10.0)
            adaptive_inference_count += 1
        else:
            scheduler.state.record_skipped()
            skipped_count += 1
            
        simulated_now += 0.1 # advance timestamp by 100ms
        
    adaptive_duration = time.time() - start_t
    skip_ratio = (skipped_count / len(frames_sequence)) * 100.0

    print(f"Adaptive complete: {adaptive_inference_count} inferences, {skipped_count} skipped in {adaptive_duration:.2f}s")

    print("\n" + "="*50)
    print(" PERFORMANCE SUMMARY ")
    print("="*50)
    print(f"Total Frames Processed  : {len(frames_sequence)}")
    print(f"Baseline Inferences    : {baseline_inference_count}")
    print(f"Adaptive Inferences    : {adaptive_inference_count}")
    print(f"Frames Skipped          : {skipped_count} ({skip_ratio:.1f}%)")
    print(f"YOLO Inferences Reduced : {(baseline_inference_count - adaptive_inference_count)} calls")
    print(f"Baseline Duration      : {baseline_duration:.4f} seconds")
    print(f"Adaptive Duration      : {adaptive_duration:.4f} seconds")
    print(f"Optimization Factor     : {(baseline_duration / adaptive_duration):.2f}x speedup")
    print("="*50)

if __name__ == "__main__":
    run_level1_simulation()
    run_level2_comparison()
