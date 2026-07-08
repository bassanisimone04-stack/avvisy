"""
Smart-contract demo on NovaChain's VM.

Run:  python3 demo_contracts.py

Shows an on-chain ESCROW and a TOKEN running on the deterministic VM, using real
account balances from a Blockchain instance.
"""
from novachain import Blockchain, Wallet
from novachain.vm import ContractEngine, Revert
from novachain import contracts


def line():
    print("-" * 60)


def main() -> None:
    buyer, seller = Wallet(), Wallet()
    chain = Blockchain(genesis_allocations={buyer.address: 500.0})
    engine = ContractEngine(chain.balances)

    # --- ESCROW -------------------------------------------------------------
    escrow_addr = "nova1escrow_contract_0001"
    engine.deploy(escrow_addr, contracts.escrow(),
                  init_storage={"seller": seller.address, "state": 0})
    print("ESCROW deployed. seller =", seller.address[:20], "...")
    print(f"Buyer balance before deposit: {chain.balance_of(buyer.address):.1f}")

    # Buyer deposits 200 coins into escrow.
    engine.call(escrow_addr, "deposit", caller=buyer.address, value=200.0)
    print(f"Buyer deposits 200. Buyer={chain.balance_of(buyer.address):.1f}  "
          f"Escrow={chain.balance_of(escrow_addr):.1f}")

    # A stranger tries to release the funds — must be rejected.
    try:
        engine.call(escrow_addr, "release", caller=Wallet().address)
        print("  stranger released funds?!  (BUG)")
    except Revert as e:
        print(f"  stranger blocked from releasing: {e}")

    # The buyer releases funds to the seller.
    res = engine.call(escrow_addr, "release", caller=buyer.address)
    print(f"Buyer releases. Seller={chain.balance_of(seller.address):.1f}  "
          f"Escrow={chain.balance_of(escrow_addr):.1f}  logs={res.logs}")
    line()

    # --- TOKEN --------------------------------------------------------------
    owner = Wallet()
    alice, bob = Wallet(), Wallet()
    token_addr = "nova1token_contract_0001"
    engine.deploy(token_addr, contracts.token(),
                  init_storage={"owner": owner.address, "supply": 0})
    engine.call(token_addr, "mint", caller=owner.address, args=(alice.address, 1000))
    print("TOKEN: minted 1000 to Alice.")

    engine.call(token_addr, "transfer", caller=alice.address, args=(bob.address, 300))
    a = engine.call(token_addr, "balanceOf", caller=alice.address, args=(alice.address,))
    b = engine.call(token_addr, "balanceOf", caller=alice.address, args=(bob.address,))
    print(f"After Alice -> Bob 300 tokens:  Alice={a.logs[0][1]}  Bob={b.logs[0][1]}")

    # Bob tries to overspend — must be rejected atomically.
    try:
        engine.call(token_addr, "transfer", caller=bob.address, args=(alice.address, 9999))
    except Revert as e:
        print(f"  Bob overspend blocked: {e}")
    line()
    print("All contract state is deterministic — every node computes the same result.")


if __name__ == "__main__":
    main()
