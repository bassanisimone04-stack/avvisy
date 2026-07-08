"""
A simple wallet: holds a keypair and builds signed transactions.
"""
from __future__ import annotations

from . import crypto
from .transaction import Transaction


class Wallet:
    def __init__(self, private_key: str | None = None) -> None:
        if private_key:
            self.private_key = private_key
            # Recover the public key from the private key.
            from ecdsa import SigningKey, SECP256k1
            sk = SigningKey.from_string(bytes.fromhex(private_key), curve=SECP256k1)
            self.public_key = sk.get_verifying_key().to_string().hex()
        else:
            self.private_key, self.public_key = crypto.generate_keypair()
        self.address = crypto.public_key_to_address(self.public_key)

    def create_transaction(self, recipient: str, amount: float, fee: float, nonce: int) -> Transaction:
        tx = Transaction(
            sender=self.address,
            recipient=recipient,
            amount=amount,
            fee=fee,
            nonce=nonce,
            public_key=self.public_key,
        )
        tx.sign(self.private_key)
        return tx

    def __repr__(self) -> str:
        return f"Wallet({self.address})"
