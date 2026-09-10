import math

def calculate_distance(p1, p2) -> float:
    return math.sqrt((p1[0] - p2[0])**2 + (p1[1] - p2[1])**2)

class MovementTracker:
    """
    Computes kinematics details for tracked objects (distance, velocity vectors, pacing).
    """
    def __init__(self):
        self.track_histories = {}  # track_id -> list of (timestamp, position)

    def update(self, track_id: int, position: tuple, timestamp: float) -> dict:
        if track_id not in self.track_histories:
            self.track_histories[track_id] = []
            
        self.track_histories[track_id].append((timestamp, position))
        
        # Limit history size to prevent memory leaks
        if len(self.track_histories[track_id]) > 100:
            self.track_histories[track_id].pop(0)

        history = self.track_histories[track_id]
        if len(history) < 2:
            return {"speed": 0.0, "distance_traveled": 0.0, "direction_changes": 0}

        # Calculate total cumulative distance traveled
        total_dist = 0.0
        for i in range(1, len(history)):
            total_dist += calculate_distance(history[i-1][1], history[i][1])

        # Calculate current speed (pixels/second)
        dt = history[-1][0] - history[-2][0]
        speed = 0.0
        if dt > 0:
            speed = calculate_distance(history[-1][1], history[-2][1]) / dt

        # Count direction changes (changes in velocity direction)
        direction_changes = 0
        if len(history) >= 3:
            for i in range(2, len(history)):
                dx1 = history[i-1][1][0] - history[i-2][1][0]
                dy1 = history[i-1][1][1] - history[i-2][1][1]
                dx2 = history[i][1][0] - history[i-1][1][0]
                dy2 = history[i][1][1] - history[i-1][1][1]
                
                # Check for significant angle change (e.g. > 90 degrees)
                angle1 = math.atan2(dy1, dx1)
                angle2 = math.atan2(dy2, dx2)
                
                diff = abs(angle2 - angle1)
                if diff > math.pi:
                    diff = 2 * math.pi - diff
                    
                if diff > math.pi / 2:
                    direction_changes += 1

        return {
            "speed": speed,
            "distance_traveled": total_dist,
            "direction_changes": direction_changes
        }

    def cleanup(self, dead_track_ids: list):
        for tid in dead_track_ids:
            if tid in self.track_histories:
                del self.track_histories[tid]
