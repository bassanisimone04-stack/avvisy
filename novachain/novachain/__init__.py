"""NovaChain — a Proof-of-Stake cryptocurrency prototype with an AI fraud guardian."""

from .blockchain import Blockchain
from .wallet import Wallet
from .transaction import Transaction
from .block import Block
from .ai_guardian import AIGuardian
from .node import Node

__all__ = ["Blockchain", "Wallet", "Transaction", "Block", "AIGuardian", "Node"]
__version__ = "0.1.0"
