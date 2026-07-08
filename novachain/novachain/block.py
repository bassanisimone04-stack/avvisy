"""
Blocks for NovaChain.

Each block commits to: its height, the previous block's hash (the chain link),
the list of transactions, and — crucially — the address of the *validator* that
produced it under Proof-of-Stake. There is no `nonce`/mining puzzle like Bitcoin,
because we do not burn energy to find a hash below a target. That is the single
biggest efficiency improvement over BTC.
"""
from __future__ import annotations

import json
import time
from dataclasses import dataclass, field

from . import crypto
from .transaction import Transaction


@dataclass
class Block:
    height: int
    previous_hash: str
    transactions: list[Transaction]
    validator: str                       # address of the staker who forged this block
    timestamp: float = field(default_factory=time.time)
    hash: str = ""

    def compute_hash(self) -> str:
        payload = {
            "height": self.height,
            "previous_hash": self.previous_hash,
            "transactions": [t.hash() for t in self.transactions],
            "validator": self.validator,
            "timestamp": self.timestamp,
        }
        return crypto.sha256(json.dumps(payload, sort_keys=True).encode())

    def seal(self) -> None:
        """Finalize the block by fixing its hash."""
        self.hash = self.compute_hash()

    def is_hash_valid(self) -> bool:
        return self.hash == self.compute_hash()

    def to_dict(self) -> dict:
        return {
            "height": self.height,
            "previous_hash": self.previous_hash,
            "transactions": [t.to_dict() for t in self.transactions],
            "validator": self.validator,
            "timestamp": self.timestamp,
            "hash": self.hash,
        }

    @staticmethod
    def from_dict(d: dict) -> "Block":
        b = Block(
            height=d["height"],
            previous_hash=d["previous_hash"],
            transactions=[Transaction.from_dict(t) for t in d["transactions"]],
            validator=d["validator"],
            timestamp=d["timestamp"],
        )
        b.hash = d["hash"]
        return b
