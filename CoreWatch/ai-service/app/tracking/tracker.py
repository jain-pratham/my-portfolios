from app.detection.person_detector import PersonDetector

class ByteTrackTracker:
    """
    Wrapper interface that runs detection + ByteTrack tracking.
    """
    def __init__(self, detector: PersonDetector = None):
        self.detector = detector or PersonDetector()

    def track(self, frame) -> list:
        """
        Runs tracking on the frame and returns tracked detections.
        """
        return self.detector.track_persons(frame)
