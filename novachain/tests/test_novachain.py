"""
Core invariants for NovaChain. Run:  python3 -m pytest -q   (or python3 tests/test_novachain.py)
"""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from novachain import Blockchain, Wallet


def fresh_chain():
    alice, validator = Wallet(), Wallet()
    chain = Blockchain(genesis_allocations={alice.address: 1000.0, validator.address: 500.0})
    chain.stake(validator.address, 500.0)
    return chain, alice, validator


def mine_mempool(chain):
    who = chain.select_validator()
    block = chain.forge_block(who)
    ok, _ = chain.add_block(block)
    assert ok
    return block


def test_signature_required():
    chain, alice, _ = fresh_chain()
    bob = Wallet()
    tx = alice.create_transaction(bob.address, 10, 0.1, 0)
    tx.signature = ""  # tamper
    ok, reason = chain.add_transaction(tx)
    assert not ok and "signature" in reason


def test_cannot_forge_someone_elses_tx():
    """Attaching your own public key to another address must fail."""
    chain, alice, _ = fresh_chain()
    bob, mallory = Wallet(), Wallet()
    tx = alice.create_transaction(bob.address, 10, 0.1, 0)
    tx.public_key = mallory.public_key  # try to substitute keys
    assert not tx.is_signature_valid()


def test_balances_conserve():
    chain, alice, validator = fresh_chain()
    bob = Wallet()
    tx = alice.create_transaction(bob.address, 100, 1.0, 0)
    ok, _ = chain.add_transaction(tx)
    assert ok
    mine_mempool(chain)
    assert chain.balance_of(alice.address) == 1000.0 - 101.0
    assert chain.balance_of(bob.address) == 100.0


def test_nonce_replay_protection():
    chain, alice, validator = fresh_chain()
    bob = Wallet()
    tx = alice.create_transaction(bob.address, 10, 0.1, 0)
    assert chain.add_transaction(tx)[0]
    mine_mempool(chain)
    # Re-submitting the same signed tx (nonce 0) must be rejected.
    ok, reason = chain.add_transaction(tx)
    assert not ok and "nonce" in reason


def test_double_spend_blocked():
    chain, alice, _ = fresh_chain()
    bob = Wallet()
    ok1, _ = chain.add_transaction(alice.create_transaction(bob.address, 800, 0.1, 0))
    # Second tx would overspend once the first is counted.
    ok2, reason = chain.add_transaction(alice.create_transaction(bob.address, 800, 0.1, 1))
    assert ok1 and not ok2 and "balance" in reason


def test_ai_guardian_flags_drain():
    chain, alice, validator = fresh_chain()
    bob = Wallet()
    # Teach the guardian a normal pattern.
    for i, amt in enumerate((20, 25, 18, 22, 30)):
        assert chain.add_transaction(alice.create_transaction(bob.address, amt, 0.1, i))[0]
    mine_mempool(chain)
    # Now a full-balance drain to a new address should be quarantined.
    drain = alice.create_transaction(Wallet().address, chain.balance_of(alice.address) - 1, 0.1, 5)
    ok, reason = chain.add_transaction(drain)
    assert not ok and "quarantine" in reason.lower()
    assert drain.risk_score > 0.75


def test_p2p_adopt_heaviest_chain():
    """A node replays and adopts a peer's longer valid chain from genesis."""
    alice, validator = Wallet(), Wallet()
    genesis = {alice.address: 1000.0, validator.address: 100.0}
    stakes = {validator.address: 100.0}

    # Node A builds two blocks.
    node_a = Blockchain.bootstrap(genesis, stakes)
    bob = Wallet()
    for i in range(2):
        node_a.add_transaction(alice.create_transaction(bob.address, 10, 0.1, i))
        node_a.add_block(node_a.forge_block(validator.address))

    # Node B starts empty and adopts A's chain.
    node_b = Blockchain.bootstrap(genesis, stakes)
    assert node_b.weight() == 1  # just genesis
    assert node_b.try_adopt(node_a.export_chain(), stakes)
    assert node_b.weight() == node_a.weight() == 3
    assert node_b.balance_of(bob.address) == node_a.balance_of(bob.address)

    # A tampered chain must be rejected wholesale.
    tampered = node_a.export_chain()
    tampered[1]["transactions"][0]["amount"] = 999999  # forge a reward
    node_c = Blockchain.bootstrap(genesis, stakes)
    assert not node_c.try_adopt(tampered, stakes)


def test_ml_guardian_separates_fraud():
    """The trained IsolationForest scores obvious fraud far above normal spend."""
    from novachain.ai_guardian_ml import MLGuardian, synthetic_normal_stream
    from novachain import Transaction

    sender = "nova1ml_test_account"
    g = MLGuardian()
    stream = synthetic_normal_stream(sender, n=300)
    g.train(stream)
    t = stream[-1][0].timestamp

    normal = g.score(Transaction(sender, "nova1known01", 50, 0.1, 0, timestamp=t + 300), 10_000)
    drain = g.score(Transaction(sender, "nova1thief_new", 9990, 0.1, 0, timestamp=t + 300), 10_000)

    assert normal < 0.3
    assert drain > 0.6
    assert g.is_quarantined(drain) and not g.is_quarantined(normal)


def test_ml_guardian_plugs_into_chain():
    """A Blockchain can run with the ML guardian and still quarantines a drain."""
    from novachain.ai_guardian_ml import MLGuardian, synthetic_normal_stream

    alice, validator = Wallet(), Wallet()
    g = MLGuardian()
    g.train(synthetic_normal_stream(alice.address, n=300))
    chain = Blockchain(genesis_allocations={alice.address: 10_000.0,
                                            validator.address: 100.0}, guardian=g)
    chain.stake(validator.address, 100.0)

    # A full-balance drain should be quarantined by the ML guardian.
    drain = alice.create_transaction(Wallet().address, 9900, 0.1, 0)
    ok, reason = chain.add_transaction(drain)
    assert not ok and "quarantine" in reason.lower()


def test_chain_stays_valid():
    chain, alice, _ = fresh_chain()
    bob = Wallet()
    for i in range(3):
        chain.add_transaction(alice.create_transaction(bob.address, 10, 0.1, i))
    mine_mempool(chain)
    assert chain.is_valid()


if __name__ == "__main__":
    fns = [v for k, v in sorted(globals().items()) if k.startswith("test_")]
    passed = 0
    for fn in fns:
        fn()
        print(f"  PASS  {fn.__name__}")
        passed += 1
    print(f"\n{passed}/{len(fns)} tests passed")
