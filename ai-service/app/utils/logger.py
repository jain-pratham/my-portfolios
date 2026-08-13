import logging
import sys

def setup_logging():
    """
    Initializes root logging config.
    Logs will format as: [timestamp] [LEVEL] [Name] Message
    Example: [2026-08-12 10:20:00,123] [INFO] [Camera] Connecting to stream...
    """
    # Force basicConfig to use our format and standard output stream
    logging.basicConfig(
        level=logging.INFO,
        format="[%(asctime)s] [%(levelname)s] [%(name)s] %(message)s",
        handlers=[
            logging.StreamHandler(sys.stdout)
        ],
        force=True
    )

def get_logger(name: str) -> logging.Logger:
    """
    Returns a configured logger instance with the specified name tag.
    """
    return logging.getLogger(name)
