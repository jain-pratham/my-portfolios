import cv2
from typing import List, Dict, Any


def draw_detections(frame: cv2.Mat, detections: List[Dict[str, Any]]) -> cv2.Mat:
    """Draws bounding boxes and labels for person detections on the frame.
    
    Args:
        frame: The raw image frame array.
        detections: List of detection dictionaries.
        
    Returns:
        cv2.Mat: Annotated frame.
    """
    annotated_frame = frame.copy()

    for det in detections:
        box = det["box"]
        conf = det["confidence"]
        
        # Coordinates
        xmin, ymin, xmax, ymax = map(int, box)

        # Drawing details
        color = (0, 255, 0)  # Green for detected people
        thickness = 2
        
        # Draw bounding box
        cv2.rectangle(annotated_frame, (xmin, ymin), (xmax, ymax), color, thickness)

        # Create label text
        label = f"Person: {conf:.2f}"
        font = cv2.FONT_HERSHEY_SIMPLEX
        font_scale = 0.5
        font_thickness = 1
        
        # Get label text size
        (text_width, text_height), baseline = cv2.getTextSize(
            label, font, font_scale, font_thickness
        )
        
        # Determine background rectangle coordinates for text visibility
        text_xmin = xmin
        text_ymin = max(ymin - text_height - 10, 10)
        text_xmax = xmin + text_width + 10
        text_ymax = text_ymin + text_height + 10

        # Draw text background box
        cv2.rectangle(
            annotated_frame, 
            (text_xmin, text_ymin), 
            (text_xmax, text_ymax), 
            color, 
            cv2.FILLED
        )

        # Write text label in white
        cv2.putText(
            annotated_frame,
            label,
            (text_xmin + 5, text_ymax - 5),
            font,
            font_scale,
            (255, 255, 255),
            font_thickness,
            lineType=cv2.LINE_AA
        )

    return annotated_frame
