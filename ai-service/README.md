# CoreWatch AI CCTV Security Service

Professional modular Python service for real-time video streaming, YOLOv8 human detection, and alert notification dispatching.

---

## 1. Purpose
This service integrates IP-based CCTV cameras with AI threat recognition. It detects human intrusion in monitored security zones, packages threat evidence snapshots, uploads them to cloud hosting, and dispatches real-time webhooks to the CoreWatch Node.js/Next.js portal.

---

## 2. Architecture & Design
The application is orchestrated by a **FastAPI** web server, with the core camera acquisition and AI inference executing in a dedicated, isolated background thread. This decoupling keeps API routes responsive (e.g. GET `/health` probes) while guaranteeing that slow network I/O operations (image uploads and webhook dispatching) do not block or stutter the real-time CCTV video feed processing.

---

## 3. Folder Structure
```
ai-service/
├── app/
│   ├── main.py                # Main FastAPI app initialization & thread orchestration
│   ├── config/
│   │   └── settings.py        # Safe environment configurations
│   ├── api/                   # FastAPI routes & schema definitions (camera, detection, health)
│   ├── camera/                # Stream acquisition, reconnection loops, and health stubs
│   ├── detection/             # YOLO models loader (PersonDetector, ObjectDetector stubs)
│   ├── tracking/              # Object tracking history and logic stubs
│   ├── zones/                 # Region-of-interest (ROI) boundary calculations
│   ├── behavior/              # Suspicious movement detection stubs
│   ├── safety/                # Fire and smoke detection model stubs
│   ├── security/              # Business logic stubs (after-hours, cash counters, doors)
│   ├── camera_security/       # Camera offline/tampering detection stubs
│   ├── events/                # Alarms event routing and risk level compilation stubs
│   ├── alerts/                # Image uploader (ImgBB) & dispatch logic (Next.js webhook)
│   └── utils/                 # Logger formats and helper utilities
├── models/                    # Model weights storage (.gitkeep)
├── datasets/                  # Custom training datasets (.gitkeep)
├── notebooks/                 # Jupyter notebooks for model testing and training
├── tests/                     # Unit test suites (detection, zones, cooldown events)
├── requirements.txt           # Python application package dependencies
├── .env.example               # Template environment configuration
├── .gitignore                 # Excluded environments and binary weights
├── Dockerfile                 # Docker container assembly script
└── README.md                  # This file
```

---

## 4. Installation
Ensure Python 3.8+ is installed on your system.

1. **Navigate to the AI service directory:**
   ```bash
   cd ai-service
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment:**
   - **Windows:**
     ```powershell
     .\venv\Scripts\activate
     ```
   - **Linux/macOS:**
     ```bash
     source venv/bin/activate
     ```

4. **Install required dependencies:**
   ```bash
   pip install --upgrade pip
   ```
   ```bash
   pip install -r requirements.txt
   ```

---

## 5. Environment Variables
Copy `.env.example` to `.env` to configure your service parameters. Never commit `.env` containing real keys:
```bash
cp .env.example .env
```

| Key | Description | Default |
| --- | --- | --- |
| `CAMERA_URL` | The HTTP video feed stream URL | `http://192.0.0.4:8080/video` |
| `CAMERA_KEY` | Unique ID of this camera from Next.js | `CAM-48X8WB` |
| `IMGBB_API_KEY` | Free API Key for snapshot image hosting | *None* |
| `NEXTJS_ALERT_API`| Next.js alert router webhook | `http://localhost:3000/api/alerts` |
| `ALERT_COOLDOWN` | Cooldown window (seconds) between alerts | `10` |
| `YOLO_MODEL` | Filename of weights | `yolov8n.pt` |
| `CONFIDENCE_THRESHOLD` | Threshold confidence for filtering detections | `0.5` |
| `DISPLAY_WINDOW` | Toggles showing live OpenCV video window | `true` |

---

## 6. How to Run

### Development Mode (Direct Python)
Run the application using Uvicorn locally:
```bash
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
- Access the FastAPI Swagger documentation: `http://127.0.0.1:8000/docs`
- Health check API: `http://127.0.0.1:8000/health`

### Headless Server Mode (e.g. Production or VM)
If running on a remote virtual machine without a graphical display unit, disable the OpenCV window GUI by setting `DISPLAY_WINDOW=false` in your `.env`.

### Docker Mode
1. Build the Docker image:
   ```bash
   docker build -t corewatch-ai-service .
   ```
2. Spin up the container, loading your environment file:
   ```bash
   docker run -p 8000:8000 --env-file .env corewatch-ai-service
   ```

---

## 7. Operational Details

### Camera Stream & Reconnection
- Stream acquisition is performed by `app/camera/stream.py` which wraps `cv2.VideoCapture`.
- If a frame read fails (e.g., due to connection dropouts), it stops, releases resources, and delegates to `app/camera/reconnect.py` to poll the video stream URL at regular intervals. Once back online, the capture seamlessly resumes.

### YOLO Detection
- On startup, `app/detection/person_detector.py` loads `YOLOv8n` (nano) weights. It uses class ID `0` (person) and runs prediction.
- Annotated overlays (bounding boxes, class labels, confidence scores) are drawn on the active frame.

### Cooldowns & Alert Webhooks
- Once a human is detected, the system calls `app/alerts/dispatcher.py`.
- It validates the event against a thread-safe camera-specific cooldown map (`_last_alert_times`).
- If outside the cooldown window, it spawns a background thread that writes the annotated frame to disk, uploads it to ImgBB via `app/alerts/image_uploader.py`, and posts the payload to the Next.js API server (`NEXTJS_ALERT_API`).

---

## 8. Jupyter Notebooks
Located in the `notebooks/` directory:
- **`01_yolo_testing.ipynb`**: Inferencing on sample camera feeds, validating classes and boundaries.
- **`02_dataset_analysis.ipynb`**: Analyzes dataset ratios for smoke, fire, and objects.
- **`03_fire_smoke_training.ipynb`**: Guide to train customized fire/smoke classification heads.
- **`04_custom_object_training.ipynb`**: Fine-tunes custom object classification models.
- **`05_model_evaluation.ipynb`**: Performance evaluation benchmarks (mAP, confusion matrices).

---

## 9. Future AI Modules
The code provides skeleton modules with defined folder locations and imports:
- **`app/tracking/`**: Track-to-track matching across frames.
- **`app/zones/`**: Arbitrary polygon drawing and containment validation rules.
- **`app/behavior/`**: Motion anomaly and pacing path analysis.
- **`app/safety/`**: Custom smoke/fire alarm triggers.
- **`app/security/`**: After-hours schedules, cash register monitoring, and asset bounds.
- **`app/camera_security/`**: Disconnection tracking, feed distortion, and angle alterations.
- **`app/events/`**: Central event risk classification and event queues.
