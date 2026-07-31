from abc import ABC, abstractmethod
from typing import Tuple, Any


class CameraInterface(ABC):
    """Abstract base class defining the contract for CCTV camera input streams."""

    @abstractmethod
    def open(self) -> bool:
        """Opens the camera connection.

        Returns:
            bool: True if connection is successfully established, False otherwise.
        """
        pass

    @abstractmethod
    def close(self) -> None:
        """Closes the camera connection and releases resources."""
        pass

    @abstractmethod
    def read(self) -> Tuple[bool, Any]:
        """Reads a frame from the camera stream.

        Returns:
            Tuple[bool, Any]: (Success status, Frame image array or None)
        """
        pass

    @abstractmethod
    def is_opened(self) -> bool:
        """Checks if the camera reader is initialized.

        Returns:
            bool: True if initial connection was successfully set up.
        """
        pass

    @abstractmethod
    def is_connected(self) -> bool:
        """Checks if the camera stream is currently active and healthy.

        Returns:
            bool: True if frames are actively streaming, False if disconnected.
        """
        pass
