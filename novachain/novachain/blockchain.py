"""
The NovaChain ledger: Proof-of-Stake consensus + account state + AI guardian.

CONSENSUS (Proof-of-Stake)
--------------------------
Instead of burning electricity to solve a hash puzzle (Bitcoin's Proof-of-Work),
NovaChain picks the next block producer ("validator") in proportion to how many
coins they have staked. The selection is a *deterministic* weighted draw seeded
by the previous block's hash, so every honest node independently computes the
same validator for the same height — no communication needed, and no energy
wasted. This is the core "sensibly better than BTC" claim: same security model
(economic stake instead of hash power) at a rounding-error of the energy cost.

WHERE THE AI SITS
-----------------
When a transaction enters the mempool the AI guardian scores it. Consensus rules
below stay fully deterministic (signatures, balances, nonces). The guardian is an
extra, advisory safety net: transactions it flags as hostile are quarantined
rather than mined, but the ledger's validity never depends on a model's opinion.
"""
from __future__ import annotations

import random

from .block import Block
from .transaction import Transaction
from .ai_guardian import AIGuardian


# --- protocol parameters -----------------------------------------------------
BLOCK_REWARD = 10.0          # coins minted to the validator per block
MAX_TXS_PER_BLOCK = 100
TOTAL_SUPPLY_CAP = 21_000_000  # a hard cap, in the spirit of Bitcoin's scarcity


class Blockchain:
    def __init__(self, genesis_allocations: dict[str, float] | None = None) -> None:
        self.chain: list[Block] = []
        self.mempool: list[Transaction] = []
        self.balances: dict[str, float] = {}
        self.nonces: dict[str, int] = {}
        self.stakes: dict[str, float] = {}
        self.minted: float = 0.0
        self.guardian = AIGuardian()
        self.quarantine: list[Transaction] = []
        self.genesis_allocations: dict[str, float] = dict(genesis_allocations or {})
        self._create_genesis(self.genesis_allocations)

    # --- genesis -------------------------------------------------------------

    def _create_genesis(self, allocations: dict[str, float]) -> None:
        # Genesis MUST be byte-for-byte identical on every node, otherwise their
        # genesis hashes differ and the whole network can never agree. So we pin
        # every timestamp to 0 and iterate allocations in a fixed (sorted) order.
        txs = [
            Transaction(sender="NETWORK", recipient=addr, amount=amt, fee=0.0,
                        nonce=0, timestamp=0.0)
            for addr, amt in sorted(allocations.items())
        ]
        genesis = Block(height=0, previous_hash="0" * 64, transactions=txs,
                        validator="GENESIS", timestamp=0.0)
        genesis.seal()
        self.chain.append(genesis)
        for addr, amt in allocations.items():
            self.balances[addr] = self.balances.get(addr, 0.0) + amt
            self.minted += amt
        # The guardian learns from genesis funding too, so baselines start sane.
        for tx in txs:
            self.guardian.observe(tx)

    # --- accessors -----------------------------------------------------------

    @property
    def last_block(self) -> Block:
        return self.chain[-1]

    def balance_of(self, address: str) -> float:
        return self.balances.get(address, 0.0)

    def _pending_nonce(self, address: str) -> int:
        """The nonce a *new* transaction from `address` must use: the confirmed
        nonce plus however many of the sender's transactions already sit in the
        mempool. This lets a sender queue several transactions into one block."""
        base = self.nonces.get(address, 0)
        return base + sum(1 for t in self.mempool if t.sender == address)

    def _available_balance(self, address: str) -> float:
        """Confirmed balance minus what the sender's queued mempool txs will
        spend, so we don't accept transactions that overdraw once mined."""
        reserved = sum(t.amount + t.fee for t in self.mempool if t.sender == address)
        return self.balance_of(address) - reserved

    def stake(self, address: str, amount: float) -> bool:
        """Lock coins as stake to become eligible as a validator."""
        if self.balance_of(address) < amount or amount <= 0:
            return False
        self.balances[address] -= amount
        self.stakes[address] = self.stakes.get(address, 0.0) + amount
        return True

    # --- mempool / transactions ---------------------------------------------

    def add_transaction(self, tx: Transaction) -> tuple[bool, str]:
        """Validate a transaction and route it to the mempool or quarantine.
        Returns (accepted, reason)."""
        if not tx.is_signature_valid():
            return False, "invalid signature"
        if tx.amount <= 0 or tx.fee < 0:
            return False, "non-positive amount or negative fee"
        if tx.nonce != self._pending_nonce(tx.sender):
            return False, f"bad nonce (expected {self._pending_nonce(tx.sender)})"
        if self._available_balance(tx.sender) < tx.amount + tx.fee:
            return False, "insufficient balance"

        # AI guardian: score, but do NOT let it override deterministic rules.
        tx.risk_score = self.guardian.score(tx, self.balance_of(tx.sender))
        if self.guardian.is_quarantined(tx.risk_score):
            self.quarantine.append(tx)
            return False, f"quarantined by AI guardian (risk {tx.risk_score})"

        self.mempool.append(tx)
        return True, f"accepted (risk {tx.risk_score})"

    # --- consensus: deterministic Proof-of-Stake validator selection ---------

    def select_validator(self) -> str | None:
        """Weighted-by-stake, deterministic draw seeded by the last block hash.
        Every node computes the same result for the same chain tip."""
        if not self.stakes:
            return None
        total = sum(self.stakes.values())
        seed = int(self.last_block.hash, 16)
        rng = random.Random(seed)
        pick = rng.uniform(0, total)
        cumulative = 0.0
        for addr, stake in sorted(self.stakes.items()):  # sorted => order-independent
            cumulative += stake
            if pick <= cumulative:
                return addr
        return None

    # --- block production ----------------------------------------------------

    def forge_block(self, validator: str) -> Block | None:
        """The selected validator assembles the next block from the mempool."""
        if validator != self.select_validator():
            return None  # not this validator's turn

        selected = self.mempool[:MAX_TXS_PER_BLOCK]
        total_fees = sum(t.fee for t in selected)

        # Coinbase: block reward + collected fees, respecting the supply cap.
        reward = BLOCK_REWARD if self.minted + BLOCK_REWARD <= TOTAL_SUPPLY_CAP else 0.0
        coinbase = Transaction(
            sender="NETWORK", recipient=validator,
            amount=reward + total_fees, fee=0.0, nonce=0,
        )

        block = Block(
            height=self.last_block.height + 1,
            previous_hash=self.last_block.hash,
            transactions=[coinbase] + selected,
            validator=validator,
        )
        block.seal()
        return block

    def add_block(self, block: Block) -> tuple[bool, str]:
        """Validate a forged block against consensus rules and, if good, commit
        it, updating account state."""
        if block.previous_hash != self.last_block.hash:
            return False, "previous hash mismatch"
        if not block.is_hash_valid():
            return False, "invalid block hash"
        if block.height != self.last_block.height + 1:
            return False, "non-sequential height"
        if block.validator != self.select_validator():
            return False, "validator not selected for this height"

        # Re-validate every transaction against a scratch copy of the state, so a
        # bad block can't half-apply.
        scratch_bal = dict(self.balances)
        scratch_nonce = dict(self.nonces)
        for tx in block.transactions:
            if tx.sender == "NETWORK":
                scratch_bal[tx.recipient] = scratch_bal.get(tx.recipient, 0.0) + tx.amount
                continue
            if not tx.is_signature_valid():
                return False, "block contains invalid signature"
            if tx.nonce != scratch_nonce.get(tx.sender, 0):
                return False, "block contains bad nonce"
            if scratch_bal.get(tx.sender, 0.0) < tx.amount + tx.fee:
                return False, "block contains overspend"
            scratch_bal[tx.sender] -= tx.amount + tx.fee
            scratch_bal[tx.recipient] = scratch_bal.get(tx.recipient, 0.0) + tx.amount
            scratch_nonce[tx.sender] = scratch_nonce.get(tx.sender, 0) + 1

        # Commit.
        self.balances = scratch_bal
        self.nonces = scratch_nonce
        for tx in block.transactions:
            if tx.sender == "NETWORK":
                self.minted += tx.amount
            else:
                self.guardian.observe(tx)  # learn only from confirmed activity

        mined = {t.hash() for t in block.transactions}
        self.mempool = [t for t in self.mempool if t.hash() not in mined]
        self.chain.append(block)
        return True, "block added"

    # --- full-chain verification --------------------------------------------

    def is_valid(self) -> bool:
        for i in range(1, len(self.chain)):
            cur, prev = self.chain[i], self.chain[i - 1]
            if cur.previous_hash != prev.hash:
                return False
            if not cur.is_hash_valid():
                return False
        return True

    # --- P2P support: chain weight and replay-based import -------------------

    def weight(self) -> int:
        """How 'heavy' this chain is for fork resolution. For this prototype the
        longest valid chain wins (each block already required a legitimately
        selected, staked validator to produce it)."""
        return len(self.chain)

    def export_chain(self) -> list[dict]:
        return [b.to_dict() for b in self.chain]

    @classmethod
    def bootstrap(cls, genesis_allocations: dict[str, float],
                  validator_stakes: dict[str, float]) -> "Blockchain":
        """Create a fresh node from the shared network config: identical genesis
        allocations and validator stake set on every node, so Proof-of-Stake
        validator selection is reproducible network-wide."""
        chain = cls(genesis_allocations=genesis_allocations)
        for addr, amount in validator_stakes.items():
            chain.stake(addr, amount)
        return chain

    def try_adopt(self, block_dicts: list[dict],
                  validator_stakes: dict[str, float]) -> bool:
        """Given another node's exported chain, rebuild it from genesis by
        replaying every block through the full consensus checks. If it is valid
        AND heavier than ours, adopt it and return True. A candidate that fails
        any check is rejected wholesale — we never partially trust a peer."""
        if not block_dicts:
            return False
        candidate = Blockchain.bootstrap(self.genesis_allocations, validator_stakes)
        # block_dicts[0] is the peer's genesis; it must match ours exactly.
        if block_dicts[0]["hash"] != candidate.last_block.hash:
            return False
        for d in block_dicts[1:]:
            ok, _ = candidate.add_block(Block.from_dict(d))
            if not ok:
                return False
        if candidate.weight() <= self.weight():
            return False
        # Adopt the heavier valid chain.
        self.chain = candidate.chain
        self.balances = candidate.balances
        self.nonces = candidate.nonces
        self.minted = candidate.minted
        self.guardian = candidate.guardian
        mined = {t.hash() for b in self.chain for t in b.transactions}
        self.mempool = [t for t in self.mempool if t.hash() not in mined]
        return True
