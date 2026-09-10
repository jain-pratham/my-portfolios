import requests
from app.config import settings
from app.utils.logger import get_logger

logger = get_logger("ImgBB")

def upload_to_imgbb(image_path: str, api_key: str = None) -> str:
    """
    Uploads a local image file to ImgBB using the provided or configured API key.
    
    Returns:
        str: The public URL of the uploaded image if successful, otherwise None.
    """
    key = api_key or settings.IMGBB_API_KEY
    if not key or key == "YOUR_IMGBB_API_KEY":
        logger.warning("ImgBB API key is not configured. Skipping image upload.")
        return None

    try:
        url = "https://api.imgbb.com/1/upload"
        payload = {"key": key}
        
        with open(image_path, "rb") as file:
            files = {"image": file}
            logger.info(f"Uploading alert snapshot '{image_path}' to ImgBB...")
            response = requests.post(url, params=payload, files=files, timeout=10)
            
        if response.status_code == 200:
            res_json = response.json()
            if res_json.get("success"):
                public_url = res_json["data"]["url"]
                logger.info(f"Upload successful! Public URL: {public_url}")
                return public_url
            else:
                logger.error(f"ImgBB upload rejected: {res_json.get('error', {}).get('message', 'Unknown error')}")
        else:
            logger.error(f"HTTP Error {response.status_code}: {response.text}")
    except Exception as e:
        logger.error(f"Exception occurred during ImgBB upload: {e}")
        
    return None
