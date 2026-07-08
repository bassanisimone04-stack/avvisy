"""
The AI Guardian — NovaChain's distinctive feature.

WHAT IT IS (honestly)
---------------------
This is an *online, unsupervised anomaly detector*. For every account it keeps a
running behavioural baseline (how much this account usually sends, how often, to
how many distinct recipients). When a new transaction deviates sharply from that
baseline it gets a high `risk_score` in [0, 1]. It is real machine-learning of the
statistical kind (online z-score / robust deviation modelling), not a marketing
buzzword — and it needs no labelled fraud data to start working.

WHAT IT IS NOT
--------------
It is NOT part of consensus. It never decides whether a block is valid — that
would break determinism, because two nodes with slightly different models would
disagree and the chain would fork. Instead the guardian is *advisory*: it
annotates transactions with a risk score and can push very-high-risk transactions
into a quarantine that a policy layer (or a human) reviews. Consensus still runs
on plain, deterministic rules.

Roadmap: swap this heuristic core for a trained model (e.g. Isolation Forest /
autoencoder), and eventually make its verdict verifiable on-chain via ZKML.
"""
from __future__ import annotations

import math
from dataclasses import dataclass, field

from .transaction import Transaction


@dataclass
class AccountProfile:
    """Running behavioural baseline for a single account (Welford's algorithm)."""
    count: int = 0
    mean_amount: float = 0.0
    m2_amount: float = 0.0            # sum of squared deviations, for online variance
    last_timestamp: float | None = None
    known_recipients: set[str] = field(default_factory=set)

    def variance(self) -> float:
        return self.m2_amount / self.count if self.count > 1 else 0.0

    def std(self) -> float:
        return math.sqrt(self.variance())

    def update(self, tx: Transaction) -> None:
        """Fold a *confirmed* transaction into the baseline (online update)."""
        self.count += 1
        delta = tx.amount - self.mean_amount
        self.mean_amount += delta / self.count
        self.m2_amount += delta * (tx.amount - self.mean_amount)
        self.last_timestamp = tx.timestamp
        self.known_recipients.add(tx.recipient)


class AIGuardian:
    """Scores transactions for fraud/anomaly risk before they are trusted."""

    # Weighted contributions of each signal to the final score.
    W_AMOUNT_ANOMALY = 0.40
    W_VELOCITY = 0.25
    W_NEW_RECIPIENT = 0.15
    W_BALANCE_DRAIN = 0.20

    # A transaction at or above this score is treated as hostile.
    QUARANTINE_THRESHOLD = 0.75

    def __init__(self) -> None:
        self.profiles: dict[str, AccountProfile] = {}

    def _profile(self, address: str) -> AccountProfile:
        return self.profiles.setdefault(address, AccountProfile())

    def score(self, tx: Transaction, sender_balance: float) -> float:
        """Return a risk score in [0, 1]. Does NOT mutate the baseline — call
        `observe()` only once the transaction is actually confirmed."""
        if tx.sender == "NETWORK":
            return 0.0  # protocol-minted rewards are trusted by construction

        p = self._profile(tx.sender)

        # Cold start: we have no history for this account yet. Be mildly cautious
        # but don't cry wolf on every first transaction.
        if p.count < 3:
            drain = self._balance_drain_signal(tx, sender_balance)
            return round(0.20 + self.W_BALANCE_DRAIN * drain, 4)

        amount_anomaly = self._amount_anomaly_signal(tx, p)
        velocity = self._velocity_signal(tx, p)
        new_recipient = 1.0 if tx.recipient not in p.known_recipients else 0.0
        drain = self._balance_drain_signal(tx, sender_balance)

        raw = (
            self.W_AMOUNT_ANOMALY * amount_anomaly
            + self.W_VELOCITY * velocity
            + self.W_NEW_RECIPIENT * new_recipient
            + self.W_BALANCE_DRAIN * drain
        )
        return round(min(1.0, max(0.0, raw)), 4)

    def is_quarantined(self, score: float) -> bool:
        return score >= self.QUARANTINE_THRESHOLD

    def observe(self, tx: Transaction) -> None:
        """Learn from a confirmed transaction (moves the baseline forward)."""
        if tx.sender == "NETWORK":
            return
        self._profile(tx.sender).update(tx)

    # --- individual signals, each returning a value in [0, 1] -----------------

    def _amount_anomaly_signal(self, tx: Transaction, p: AccountProfile) -> float:
        """How many standard deviations above normal is this amount? A classic
        z-score, squashed into [0, 1] so ~3 sigma reads as strongly anomalous."""
        std = p.std()
        if std < 1e-9:
            # No spread yet: flag only if the amount jumps well above the mean.
            return 1.0 if tx.amount > p.mean_amount * 3 else 0.0
        z = (tx.amount - p.mean_amount) / std
        if z <= 0:
            return 0.0
        return 1.0 - math.exp(-z / 3.0)

    def _velocity_signal(self, tx: Transaction, p: AccountProfile) -> float:
        """Bursts of activity are suspicious. If this tx lands within a few
        seconds of the previous one, treat it as high velocity."""
        if p.last_timestamp is None:
            return 0.0
        gap = tx.timestamp - p.last_timestamp
        if gap < 0:
            return 1.0  # out-of-order timestamp: definitely weird
        return math.exp(-gap / 5.0)  # <5s gap -> high; minutes apart -> ~0

    def _balance_drain_signal(self, tx: Transaction, sender_balance: float) -> float:
        """Emptying (almost) the whole account in one move is a hallmark of a
        compromised key."""
        if sender_balance <= 0:
            return 0.0
        fraction = (tx.amount + tx.fee) / sender_balance
        return min(1.0, max(0.0, fraction))
