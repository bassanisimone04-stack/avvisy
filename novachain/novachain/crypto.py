"""
Cryptographic primitives for NovaChain.

We use ECDSA over the secp256k1 curve — the same curve Bitcoin uses — so the
signature scheme is battle-tested. An address is the SHA-256 hash of the public
key, hex-encoded and prefixed with "nova1".

Nothing here is AI. This layer MUST stay 100% deterministic: every node has to
compute the exact same hash and reach the exact same verify() result, otherwise
the network can never agree on anything. The AI lives elsewhere (ai_guardian.py).
"""
from __future__ import annotations

import hashlib

from ecdsa import SigningKey, VerifyingKey, SECP256k1, BadSignatureError

ADDRESS_PREFIX = "nova1"


def sha256(data: bytes) -> str:
    """Hex SHA-256 digest of some bytes."""
    return hashlib.sha256(data).hexdigest()


def generate_keypair() -> tuple[str, str]:
    """Create a fresh (private_key_hex, public_key_hex) pair."""
    sk = SigningKey.generate(curve=SECP256k1)
    vk = sk.get_verifying_key()
    return sk.to_string().hex(), vk.to_string().hex()


def public_key_to_address(public_key_hex: str) -> str:
    """Derive a human-readable address from a public key."""
    digest = sha256(bytes.fromhex(public_key_hex))
    return ADDRESS_PREFIX + digest[:38]


def sign(private_key_hex: str, message: bytes) -> str:
    """Sign a message with a private key, returning a hex signature."""
    sk = SigningKey.from_string(bytes.fromhex(private_key_hex), curve=SECP256k1)
    return sk.sign(message).hex()


def verify(public_key_hex: str, signature_hex: str, message: bytes) -> bool:
    """Check that `signature` over `message` was made by `public_key`."""
    try:
        vk = VerifyingKey.from_string(bytes.fromhex(public_key_hex), curve=SECP256k1)
        return vk.verify(bytes.fromhex(signature_hex), message)
    except (BadSignatureError, ValueError):
        return False
