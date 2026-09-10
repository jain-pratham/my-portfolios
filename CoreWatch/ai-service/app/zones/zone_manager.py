import time
import requests
from app.config import settings
from app.utils.logger import get_logger

logger = get_logger("Zone")

class ZoneManager:
    """
    Manages zone configuration fetching, caching, and evaluation for a specific camera.
    """
    def __init__(self, camera_id: str):
        self.camera_id = camera_id
        self.api_url = f"{settings.BACKEND_API_URL}/api/zones"
        self.api_key = settings.AI_SERVICE_API_KEY
        self.refresh_interval = settings.ZONE_REFRESH_SECONDS

        self.zones = []  # List of cached zone dicts
        self.last_fetched = 0.0
        self.is_available = False  # Track if zone config fetching is successfully online
        self.auth_failed = False   # Track if authentication fails

    def fetch_zones(self) -> bool:
        """
        Fetches zone configuration from the Express backend API.
        Uses cached values if the fetch fails, ensuring we do not wipe configuration.
        """
        headers = {}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"
        else:
            logger.warning(f"[Zone] AI_SERVICE_API_KEY is not configured for camera {self.camera_id}.")

        try:
            logger.info(f"[Zone] Fetching zones for camera {self.camera_id} from {self.api_url}...")
            response = requests.get(
                self.api_url, 
                params={"cameraId": self.camera_id}, 
                headers=headers, 
                timeout=5
            )
            
            if response.status_code in (401, 403):
                self.auth_failed = True
                self.is_available = False
                logger.error(f"[Zone] ❌ Authentication failed (HTTP {response.status_code}) fetching zones for camera {self.camera_id}. Please verify AI_SERVICE_API_KEY.")
                return False
                
            if response.status_code == 200:
                res_json = response.json()
                if res_json.get("success"):
                    new_zones = res_json.get("data", [])
                    # Filter for active enabled zones
                    self.zones = [z for z in new_zones if z.get("enabled", True)]
                    self.last_fetched = time.time()
                    self.is_available = True
                    self.auth_failed = False
                    logger.info(f"[Zone] Loaded {len(self.zones)} active zones for camera {self.camera_id}.")
                    return True
                else:
                    logger.error(f"[Zone] Failed to parse backend zones response: {res_json}")
            else:
                logger.error(f"[Zone] Server returned HTTP {response.status_code} for camera {self.camera_id}")

        except Exception as e:
            logger.error(f"[Zone] Network exception occurred while fetching zones for camera {self.camera_id}: {e}")

        # Keep existing cached zones if backend goes down temporarily
        self.is_available = False
        if len(self.zones) > 0:
            logger.warning(f"[Zone] Backend unreachable. Keeping {len(self.zones)} cached zones for camera {self.camera_id}.")
            return True
        return False

    def get_active_zones(self) -> list:
        """
        Returns cached active zones. Refreshes cache if the refresh interval has elapsed.
        """
        now = time.time()
        if now - self.last_fetched > self.refresh_interval:
            self.fetch_zones()
        return self.zones
