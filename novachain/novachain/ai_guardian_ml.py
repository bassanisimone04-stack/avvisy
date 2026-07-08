"""
AI Guardian v2 — a *trained* anomaly detector (Isolation Forest).

This upgrades the hand-tuned heuristic in ai_guardian.py to a real machine-
learning model: scikit-learn's IsolationForest, an unsupervised algorithm that
learns the shape of "normal" transactions and flags outliers. It needs no
labelled fraud data — it learns purely from normal behaviour.

Same contract as AIGuardian (score / is_quarantined / observe), so it is a
drop-in guardian for the Blockchain. And the same honesty principle applies:
this is an ADVISORY layer beside the chain, never part of consensus. If the model
is untrained, or an account is too new to judge, it transparently falls back to
the heuristic guardian so the network is never left unprotected.

Requires scikit-learn + numpy (see requirements.txt). If they are missing, the
factory `make_guardian()` returns the heuristic guardian instead.
"""
from __future__ import annotations

import math

from .ai_guardian import AIGuardian
from .transaction import Transaction


class MLGuardian:
    QUARANTINE_THRESHOLD = 0.60
    MIN_HISTORY = 3          # below this an account uses the heuristic fallback

    def __init__(self, n_estimators: int = 100, contamination: float = 0.02,
                 steepness: float = 14.0, random_state: int = 42) -> None:
        # The base guardian owns the behavioural profiles + feature engineering
        # and doubles as our cold-start / fallback scorer.
        self.base = AIGuardian()
        self._steepness = steepness
        self._n_estimators = n_estimators
        self._contamination = contamination
        self._random_state = random_state
        self.model = None
        self.trained = False

    # --- guardian interface (matches AIGuardian) -----------------------------

    def features(self, tx: Transaction, sender_balance: float) -> list[float]:
        return self.base.features(tx, sender_balance)

    def score(self, tx: Transaction, sender_balance: float) -> float:
        if tx.sender == "NETWORK":
            return 0.0
        # Fall back to the heuristic when we can't trust the model yet.
        if not self.trained or self.base._profile(tx.sender).count < self.MIN_HISTORY:
            return self.base.score(tx, sender_balance)

        import numpy as np
        x = np.array([self.features(tx, sender_balance)], dtype=float)
        # decision_function: > 0 for inliers, < 0 for anomalies. Squash into a
        # [0, 1] risk with a logistic curve so more-negative => higher risk.
        decision = float(self.model.decision_function(x)[0])
        risk = 1.0 / (1.0 + math.exp(self._steepness * decision))
        return round(risk, 4)

    def is_quarantined(self, score: float) -> bool:
        return score >= self.QUARANTINE_THRESHOLD

    def observe(self, tx: Transaction) -> None:
        self.base.observe(tx)

    # --- training ------------------------------------------------------------

    def train(self, normal_stream: list[tuple[Transaction, float]]) -> None:
        """Fit the model on a stream of NORMAL (tx, sender_balance) pairs. We
        replay the stream so each transaction's features reflect the profile
        state *before* it was confirmed — exactly how scoring sees them live."""
        import numpy as np
        from sklearn.ensemble import IsolationForest

        rows = []
        for tx, balance in normal_stream:
            rows.append(self.features(tx, balance))
            self.observe(tx)  # advance the baseline, just like real confirmation

        X = np.array(rows, dtype=float)
        self.model = IsolationForest(
            n_estimators=self._n_estimators,
            contamination=self._contamination,
            random_state=self._random_state,
        ).fit(X)
        self.trained = True


def make_guardian(**kwargs):
    """Return an ML guardian if scikit-learn is available, else the heuristic.
    Keeps the rest of the codebase agnostic about which one is in use."""
    try:
        import sklearn  # noqa: F401
        import numpy  # noqa: F401
        return MLGuardian(**kwargs)
    except ImportError:
        return AIGuardian()


def synthetic_normal_stream(sender: str, n: int = 300, seed: int = 7):
    """Generate a believable stream of NORMAL transactions for `sender`: modest
    amounts to a small set of familiar recipients, spaced out in time. Used to
    bootstrap the model before real history exists."""
    import random

    rng = random.Random(seed)
    recipients = [f"nova1known{ i:02d}" for i in range(5)]
    stream: list[tuple[Transaction, float]] = []
    t = 1_000_000.0
    balance = 10_000.0
    for _ in range(n):
        amount = max(1.0, rng.gauss(50, 15))          # typically ~50 units
        t += rng.uniform(60, 600)                       # a payment every few minutes
        tx = Transaction(sender=sender, recipient=rng.choice(recipients),
                         amount=round(amount, 2), fee=0.1, nonce=0, timestamp=t)
        stream.append((tx, balance))
    return stream
