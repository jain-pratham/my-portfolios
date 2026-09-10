import unittest
import cv2
import numpy as np

class TestZonesContainment(unittest.TestCase):
    def test_point_polygon_containment(self):
        """
        Validates the OpenCV pointPolygonTest ROI boundary checking logic.
        Ensures feet coordinates inside/outside the rectangle return expected values.
        """
        # Rectangular restricted zone ROI coordinates
        roi_polygon = [(100, 150), (500, 150), (500, 450), (100, 450)]
        roi_contour = np.array(roi_polygon, dtype=np.int32).reshape((-1, 1, 2))

        # Test feet coordinate inside the zone
        feet_inside = (300, 300)
        inside_check = cv2.pointPolygonTest(roi_contour, feet_inside, measureDist=False)
        self.assertTrue(inside_check >= 0, "Coordinate should be inside the restricted polygon contour.")

        # Test feet coordinate outside the zone
        feet_outside = (50, 80)
        outside_check = cv2.pointPolygonTest(roi_contour, feet_outside, measureDist=False)
        self.assertTrue(outside_check < 0, "Coordinate should be outside the restricted polygon contour.")

        # Test feet coordinate exactly on the boundary
        feet_on_boundary = (100, 150)
        boundary_check = cv2.pointPolygonTest(roi_contour, feet_on_boundary, measureDist=False)
        self.assertTrue(boundary_check >= 0, "Coordinate on the boundary should register as >= 0.")

if __name__ == "__main__":
    unittest.main()
