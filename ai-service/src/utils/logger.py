import os
import logging
from logging.handlers import RotatingFileHandler


def setup_logger(
    name: str = "corewatch",
    log_file: str = "logs/corewatch_ai.log",
    level: str = "INFO",
    max_bytes: int = 10 * 1024 * 1024,  # 10 MB
    backup_count: int = 5,
) -> logging.Logger:
    """Sets up a production-grade rotating logger with console and file handlers."""
    logger = logging.getLogger(name)
    
    # Avoid duplicate handlers if already setup
    if logger.handlers:
        return logger

    # Set base level
    numeric_level = getattr(logging, level.upper(), logging.INFO)
    logger.setLevel(numeric_level)

    # Formatter
    formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - [%(filename)s:%(lineno)d] - %(message)s"
    )

    # Console Handler
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)

    # File Handler
    if log_file:
        log_dir = os.path.dirname(log_file)
        if log_dir and not os.path.exists(log_dir):
            os.makedirs(log_dir, exist_ok=True)

        try:
            file_handler = RotatingFileHandler(
                log_file, maxBytes=max_bytes, backupCount=backup_count, encoding="utf-8"
            )
            file_handler.setFormatter(formatter)
            logger.addHandler(file_handler)
        except Exception as e:
            logger.error(f"Failed to setup file logging to {log_file}: {e}")

    return logger


# Global logger instance
logger = setup_logger()
