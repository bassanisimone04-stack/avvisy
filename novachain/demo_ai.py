"""
AI Guardian v2 demo — a trained Isolation Forest catching fraud.

Run:  python3 demo_ai.py

Trains the ML guardian on ~300 normal transactions, then scores a mix of normal
and clearly fraudulent transactions and shows the model separating them.
"""
from novachain.ai_guardian_ml import MLGuardian, synthetic_normal_stream
from novachain.transaction import Transaction


def main() -> None:
    sender = "nova1demo_account_0001"
    guardian = MLGuardian()

    # Train on a stream of normal behaviour (small payments to known recipients).
    stream = synthetic_normal_stream(sender, n=300)
    guardian.train(stream)
    print(f"Trained IsolationForest on {len(stream)} normal transactions.\n")

    last_t = stream[-1][0].timestamp
    balance = 10_000.0

    def show(label: str, tx: Transaction) -> None:
        risk = guardian.score(tx, balance)
        flag = "  <-- QUARANTINED" if guardian.is_quarantined(risk) else ""
        print(f"  {label:<42} risk={risk:.3f}{flag}")

    print("Scoring NORMAL transactions (should be low risk):")
    show("normal 48 to known recipient", Transaction(sender, "nova1known01", 48, 0.1, 0, timestamp=last_t + 300))
    show("normal 55 to known recipient", Transaction(sender, "nova1known03", 55, 0.1, 0, timestamp=last_t + 800))

    print("\nScoring SUSPICIOUS transactions (should be high risk):")
    show("huge amount (5000) to NEW address", Transaction(sender, "nova1thief_new", 5000, 0.1, 0, timestamp=last_t + 300))
    show("account drain (9990) to NEW address", Transaction(sender, "nova1thief_new", 9990, 0.1, 0, timestamp=last_t + 300))
    show("rapid-fire burst (2s gap), new addr", Transaction(sender, "nova1thief_new", 200, 0.1, 0, timestamp=last_t + 2))

    print("\nThe model learned 'normal' from data alone — no fraud labels needed.")
    print("It stays advisory: consensus never depends on its verdict.")


if __name__ == "__main__":
    main()
