# To run this script, first install the required packages:
# pip install opencv-python ultralytics

import cv2
from ultralytics import YOLO

# CAMERA_URL of your stream.
# Note: Root URL "/" serves an HTML web page which causes OpenCV to fail.
# Use the direct video stream path (typically "/video" or "/mjpeg").
CAMERA_URL = "http://192.0.0.4:8080/video"


def main():
    print(f"Connecting to camera stream at: {CAMERA_URL}")
    cap = cv2.VideoCapture(CAMERA_URL)

    if not cap.isOpened():
        print(f"Error: Unable to connect to stream at {CAMERA_URL}")
        return

    # Load pre-trained lightweight YOLOv8 nano model
    print("Loading YOLOv8n model...")
    model = YOLO("yolov8n.pt")
    
    # Class ID for 'person' in COCO dataset is 0
    PERSON_CLASS_ID = 0

    window_name = "Shop Security - Real-Time Human Detection"
    print("Starting stream processing. Press 'q' inside the video window to quit.")

    while True:
        ret, frame = cap.read()
        if not ret or frame is None:
            print("Failed to grab frame from camera stream. Reconnecting...")
            cap.release()
            cv2.waitKey(1000)
            cap = cv2.VideoCapture(CAMERA_URL)
            continue


        # Run inference (stream=True optimizes memory for loops)
        results = model.predict(source=frame, classes=[PERSON_CLASS_ID], verbose=False)

        # Loop through results and draw bounding boxes
        for result in results:
            boxes = result.boxes
            if boxes is None:
                continue
            for box in boxes:
                # Extract coordinates: x1, y1, x2, y2
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                confidence = float(box.conf[0])

                # Draw green bounding box (BGR: (0, 255, 0))
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)

                # Label text
                label = f"Human Detected: {confidence:.2%}"

                # Draw background rectangle for text readability
                label_size, base_line = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 1)
                cv2.rectangle(frame, (x1, y1 - label_size[1] - 10), (x1 + label_size[0], y1), (0, 255, 0), cv2.FILLED)

                # Write label text
                cv2.putText(
                    frame,
                    label,
                    (x1, y1 - 5),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.5,
                    (0, 0, 0), # black text
                    1,
                    cv2.LINE_AA
                )

        # Display output frame
        cv2.imshow(window_name, frame)

        # Keyboard listener to break loop on 'q'
        if cv2.waitKey(1) & 0xFF == ord('q'):
            print("Quitting...")
            break

    # Release resources
    cap.release()
    cv2.destroyAllWindows()
    print("Resources released. Script stopped.")

if __name__ == "__main__":
    main()
