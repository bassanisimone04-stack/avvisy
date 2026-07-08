"""NovaChain — a Proof-of-Stake cryptocurrency prototype with an AI fraud guardian."""

from .blockchain import Blockchain
from .wallet import Wallet
from .transaction import Transaction
from .block import Block
from .ai_guardian import AIGuardian
from .ai_guardian_ml import MLGuardian, make_guardian
from .node import Node

__all__ = ["Blockchain", "Wallet", "Transaction", "Block", "AIGuardian",
           "MLGuardian", "make_guardian", "Node"]
__version__ = "0.1.0"
