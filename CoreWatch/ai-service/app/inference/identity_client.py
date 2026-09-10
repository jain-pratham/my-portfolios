import time

class IdentityResult:
    def __init__(self, identity_status: str, identity_id: str = None, confidence: float = 0.0, verified_at: float = None):
        self.identity_status = identity_status # "UNKNOWN", "TRUSTED", "UNTRUSTED", "UNCERTAIN"
        self.identity_id = identity_id
        self.confidence = confidence
        self.verified_at = verified_at if verified_at is not None else time.time()

    def to_dict(self) -> dict:
        return {
            "identityStatus": self.identity_status,
            "identityId": self.identity_id,
            "confidence": self.confidence,
            "verifiedAt": self.verified_at
        }

class IdentityClient:
    """
    Interface for future identity verification and face recognition integrations.
    Defaults to UNKNOWN for production. Support mock simulation mappings for testing.
    """
    def __init__(self):
        # Dict mapping track_id -> IdentityResult
        self._simulated_identities = {}

    def verify_identity(self, track_id: int, frame, bbox) -> IdentityResult:
        """
        Queries the identity status of a track.
        """
        # If simulated for testing, return simulation config
        if track_id in self._simulated_identities:
            return self._simulated_identities[track_id]

        # Default production fallback is always UNKNOWN
        return IdentityResult(
            identity_status="UNKNOWN",
            identity_id=None,
            confidence=0.0
        )

    def simulate_track_identity(self, track_id: int, status: str, identity_id: str = "sim-id", confidence: float = 0.95):
        """
        Helper method to register simulated identities for tests.
        """
        self._simulated_identities[track_id] = IdentityResult(
            identity_status=status,
            identity_id=identity_id,
            confidence=confidence
        )

    def clear_simulations(self):
        self._simulated_identities.clear()
