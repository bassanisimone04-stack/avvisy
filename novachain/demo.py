"""
End-to-end NovaChain demo.

Run:  python3 demo.py

It shows, in order:
  1. Wallet + address creation (secp256k1, like Bitcoin).
  2. Genesis allocation of coins.
  3. Staking to become a validator.
  4. Normal transactions flowing into blocks via Proof-of-Stake (no mining!).
  5. The AI guardian learning normal behaviour...
  6. ...then catching a fraudulent "drain the whole account" transaction and
     quarantining it BEFORE it can be mined.
  7. Full-chain integrity verification.
"""
from novachain import Blockchain, Wallet


def line() -> None:
    print("-" * 68)


def main() -> None:
    # 1. Actors
    alice = Wallet()
    bob = Wallet()
    validator = Wallet()

    print("NovaChain demo — PoS cryptocurrency with an AI fraud guardian")
    line()
    print(f"Alice     : {alice.address}")
    print(f"Bob       : {bob.address}")
    print(f"Validator : {validator.address}")
    line()

    # 2. Genesis: fund Alice and the validator.
    chain = Blockchain(genesis_allocations={
        alice.address: 1000.0,
        validator.address: 500.0,
    })
    print(f"Genesis funded. Alice={chain.balance_of(alice.address)}  "
          f"Validator={chain.balance_of(validator.address)}")

    # 3. Validator stakes 500 coins to earn the right to forge blocks.
    chain.stake(validator.address, 500.0)
    print(f"Validator staked 500. Eligible validators: {list(chain.stakes)}")
    line()

    # 4. A handful of normal, healthy payments from Alice to Bob.
    print("Alice makes several NORMAL payments to Bob (the guardian learns):")
    nonce = 0
    for amount in (20.0, 25.0, 18.0, 22.0, 30.0):
        tx = alice.create_transaction(bob.address, amount, fee=0.1, nonce=nonce)
        ok, reason = chain.add_transaction(tx)
        print(f"  send {amount:>5} -> {reason}")
        nonce += 1

    # The selected validator forges a block with the pending transactions.
    who = chain.select_validator()
    block = chain.forge_block(who)
    ok, reason = chain.add_block(block)
    line()
    print(f"Validator {who[:16]}... forged block #{block.height}: {reason}")
    print(f"Alice balance : {chain.balance_of(alice.address):.2f}")
    print(f"Bob balance   : {chain.balance_of(bob.address):.2f}")
    print(f"Validator earned reward+fees -> {chain.balance_of(validator.address):.2f} "
          f"(staked coins are locked separately)")
    line()

    # 5 & 6. Now a FRAUDULENT transaction: someone drains ~all of Alice's
    # remaining balance in one shot to a brand-new address. This is exactly the
    # signature of a stolen key. The guardian should catch it.
    thief_target = Wallet().address
    drain_amount = chain.balance_of(alice.address) - 1  # take almost everything
    fraud = alice.create_transaction(thief_target, drain_amount, fee=0.1, nonce=nonce)
    ok, reason = chain.add_transaction(fraud)
    print("Suspicious transaction: drain almost the entire balance to a new address")
    print(f"  amount {drain_amount:.2f} -> {reason}")
    print(f"  risk_score = {fraud.risk_score}  "
          f"(quarantined: {chain.guardian.is_quarantined(fraud.risk_score)})")
    print(f"  Mempool still clean: {len(chain.mempool)} tx waiting, "
          f"{len(chain.quarantine)} in quarantine")
    line()

    # 7. Chain integrity.
    print(f"Chain height        : {chain.last_block.height}")
    print(f"Total coins minted  : {chain.minted:.2f}")
    print(f"Chain is valid      : {chain.is_valid()}")
    line()

    # 8. The headline number: energy vs Bitcoin.
    from novachain.energy import compare
    print(compare().pretty())
    print("(This saving comes from Proof-of-Stake — architecture, not AI.)")
    line()
    print("Done. Energy spent mining: 0. That's the point. ⚡")


if __name__ == "__main__":
    main()
