import cv2
import numpy as np

def point_in_polygon(point: tuple, polygon_pixels: list) -> bool:
    """
    Checks if a point (x, y) is inside or on the boundary of a pixel-coordinate polygon.
    """
    if len(polygon_pixels) < 3:
        return False
        
    contour = np.array(polygon_pixels, dtype=np.int32).reshape((-1, 1, 2))
    check = cv2.pointPolygonTest(contour, (float(point[0]), float(point[1])), measureDist=False)
    # OpenCV pointPolygonTest returns:
    # >= 0 for inside/on edge
    # < 0 for outside
    return check >= 0

def inside_zone(foot_point: dict, normalized_zone_points: list, frame_width: int, frame_height: int) -> bool:
    """
    Scales a normalized zone polygon (x: 0->1, y: 0->1) to pixel coordinates
    and checks if the footPoint is inside.
    """
    # 1. Convert normalized zone points to pixel coordinates
    pixel_polygon = []
    for pt in normalized_zone_points:
        # Support dict format like {'x': ..., 'y': ...}
        x = pt.get('x', 0.0)
        y = pt.get('y', 0.0)
        px = int(x * frame_width)
        py = int(y * frame_height)
        pixel_polygon.append((px, py))

    # 2. Extract foot point coordinates
    foot_x = foot_point.get('x')
    foot_y = foot_point.get('y')
    
    if foot_x is None or foot_y is None:
        return False

    return point_in_polygon((foot_x, foot_y), pixel_polygon)
