"""
Transactions for NovaChain.

NovaChain uses an *account* model (like Ethereum), not Bitcoin's UTXO model.
That means each account has a balance and a `nonce` (a per-account counter).
The nonce is what stops replay attacks: every transaction from an account must
use the next expected nonce, so the same signed transaction can't be applied
twice.

Compared to Bitcoin this is a deliberate "sensible improvement": accounts make
smart contracts and balance reasoning far simpler than juggling UTXOs.
"""
from __future__ import annotations

import json
import time
from dataclasses import dataclass, field, asdict

from . import crypto


@dataclass
class Transaction:
    sender: str            # address, or "NETWORK" for coinbase/staking rewards
    recipient: str
    amount: float
    fee: float
    nonce: int
    timestamp: float = field(default_factory=time.time)
    public_key: str = ""   # sender's public key (needed to verify the signature)
    signature: str = ""

    # Set by the AI guardian at validation time; not part of the signed payload.
    risk_score: float = 0.0

    def signing_payload(self) -> bytes:
        """The exact bytes that get signed. Excludes signature + risk_score so
        that signing is deterministic and the AI verdict can't invalidate it."""
        payload = {
            "sender": self.sender,
            "recipient": self.recipient,
            "amount": self.amount,
            "fee": self.fee,
            "nonce": self.nonce,
            "timestamp": self.timestamp,
            "public_key": self.public_key,
        }
        return json.dumps(payload, sort_keys=True).encode()

    def hash(self) -> str:
        return crypto.sha256(self.signing_payload())

    def sign(self, private_key_hex: str) -> None:
        self.signature = crypto.sign(private_key_hex, self.signing_payload())

    def is_signature_valid(self) -> bool:
        if self.sender == "NETWORK":
            return True  # network-minted rewards are not signed by a user
        if not self.signature or not self.public_key:
            return False
        # The address must actually be derived from the presented public key,
        # otherwise anyone could spend from anyone by attaching their own key.
        if crypto.public_key_to_address(self.public_key) != self.sender:
            return False
        return crypto.verify(self.public_key, self.signature, self.signing_payload())

    def to_dict(self) -> dict:
        return asdict(self)

    @staticmethod
    def from_dict(d: dict) -> "Transaction":
        return Transaction(**d)
