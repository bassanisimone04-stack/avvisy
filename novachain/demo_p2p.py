"""
NovaChain P2P demo — real networked nodes talking over HTTP.

Run:  python3 demo_p2p.py

It spins up three nodes on localhost, connects them as peers, then shows:
  1. A transaction submitted to node A gossiping to B and C.
  2. Node A forging a block; B and C receiving and accepting it via gossip.
  3. A fourth node joining LATE and catching up by adopting the heaviest chain.
"""
import time

from novachain.node import Node, _get, _post
from novachain.wallet import Wallet


def height(url: str) -> int:
    return _get(f"{url}/status")["height"]


def main() -> None:
    alice = Wallet()
    bob = Wallet()
    validator = Wallet()

    # Shared network config: every node starts from the SAME genesis + stake set.
    genesis = {alice.address: 1000.0, validator.address: 100.0}
    stakes = {validator.address: 100.0}

    nodes = [Node("127.0.0.1", 5001 + i, genesis, stakes) for i in range(3)]
    for n in nodes:
        n.start()
    time.sleep(0.3)
    a, b, c = (n.address for n in nodes)

    # Fully connect the three nodes as peers.
    for n in nodes:
        for other in nodes:
            if other is not n:
                n.add_peer(other.address)

    print("Three nodes online:", a, b, c)
    print("Initial heights:", [height(u) for u in (a, b, c)])
    print("-" * 60)

    # 1. Submit a transaction to node A; it should gossip to B and C.
    tx = alice.create_transaction(bob.address, 50.0, 0.1, nonce=0)
    _post(f"{a}/transactions", tx.to_dict())
    time.sleep(0.3)
    print("Tx submitted to A. Mempool sizes A/B/C:",
          [_get(f"{u}/status")["mempool"] for u in (a, b, c)])

    # 2. Node A forges a block; gossip should carry it to B and C.
    block = nodes[0].forge_and_broadcast(validator.address)
    time.sleep(0.3)
    print(f"A forged block #{block.height}. Heights A/B/C:",
          [height(u) for u in (a, b, c)])
    print("-" * 60)

    # 3. A fourth node joins LATE and must catch up.
    latecomer = Node("127.0.0.1", 5004, genesis, stakes)
    latecomer.start()
    time.sleep(0.2)
    latecomer.add_peer(a)
    print("Latecomer joins at height:", height(latecomer.address))
    _post(f"{latecomer.address}/resolve", {})   # pull peers' chains, adopt heaviest
    time.sleep(0.3)
    print("Latecomer after /resolve:", height(latecomer.address))
    print("-" * 60)

    all_heights = [height(u) for u in (a, b, c, latecomer.address)]
    print("Final heights (A/B/C/latecomer):", all_heights)
    print("Consensus reached:", len(set(all_heights)) == 1)

    for n in nodes + [latecomer]:
        n.stop()


if __name__ == "__main__":
    main()
