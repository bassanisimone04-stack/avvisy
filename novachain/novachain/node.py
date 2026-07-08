"""
A NovaChain P2P node.

This turns the single-process ledger into a real networked node that can:
  - expose its chain over HTTP,
  - accept transactions and gossip them to peers,
  - accept forged blocks and gossip them to peers,
  - resolve forks by adopting the heaviest valid chain among its peers.

Design notes
------------
* Transport is plain HTTP + JSON using ONLY the Python standard library
  (http.server + urllib), so there are no extra dependencies to run a node.
* The validator set (who may forge, and their stake) is shared network config,
  passed to every node at start-up. That keeps Proof-of-Stake validator
  selection reproducible across the network. On-chain staking is a roadmap item.
* Consensus safety lives in `Blockchain.try_adopt`: an incoming chain is replayed
  from genesis through every check before it can be adopted. A node never trusts
  a peer's word — it re-verifies.
"""
from __future__ import annotations

import json
import threading
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

from .blockchain import Blockchain
from .block import Block
from .transaction import Transaction


class Node:
    def __init__(self, host: str, port: int,
                 genesis_allocations: dict[str, float],
                 validator_stakes: dict[str, float]) -> None:
        self.host = host
        self.port = port
        self.address = f"http://{host}:{port}"
        self.validator_stakes = dict(validator_stakes)
        self.chain = Blockchain.bootstrap(genesis_allocations, self.validator_stakes)
        self.peers: set[str] = set()
        self._server: ThreadingHTTPServer | None = None
        self._thread: threading.Thread | None = None

    # --- peer gossip ---------------------------------------------------------

    def add_peer(self, peer_url: str) -> None:
        if peer_url and peer_url != self.address:
            self.peers.add(peer_url.rstrip("/"))

    def _broadcast(self, path: str, payload: dict) -> None:
        for peer in list(self.peers):
            try:
                _post(f"{peer}{path}", payload, timeout=2)
            except Exception:
                pass  # a peer being down must never crash the local node

    # --- transaction / block handling ---------------------------------------

    def submit_transaction(self, tx: Transaction, gossip: bool = True) -> tuple[bool, str]:
        ok, reason = self.chain.add_transaction(tx)
        if ok and gossip:
            self._broadcast("/transactions", tx.to_dict())
        return ok, reason

    def receive_block(self, block: Block, gossip: bool = True) -> tuple[bool, str]:
        ok, reason = self.chain.add_block(block)
        if ok and gossip:
            self._broadcast("/blocks", block.to_dict())
        return ok, reason

    def forge_and_broadcast(self, validator: str) -> Block | None:
        block = self.chain.forge_block(validator)
        if block is None:
            return None
        ok, _ = self.chain.add_block(block)
        if not ok:
            return None
        self._broadcast("/blocks", block.to_dict())
        return block

    # --- consensus: pull peers' chains and adopt the heaviest valid one ------

    def resolve_conflicts(self) -> bool:
        """Classic longest-(heaviest-)chain resolution. Returns True if we
        switched to a peer's chain."""
        adopted = False
        for peer in list(self.peers):
            try:
                data = _get(f"{peer}/chain", timeout=3)
            except Exception:
                continue
            if self.chain.try_adopt(data.get("chain", []), self.validator_stakes):
                adopted = True
        return adopted

    # --- HTTP server lifecycle ----------------------------------------------

    def start(self) -> None:
        node = self

        class Handler(BaseHTTPRequestHandler):
            def log_message(self, *args):  # silence default logging
                pass

            def _send(self, code: int, body: dict) -> None:
                raw = json.dumps(body).encode()
                self.send_response(code)
                self.send_header("Content-Type", "application/json")
                self.send_header("Content-Length", str(len(raw)))
                self.end_headers()
                self.wfile.write(raw)

            def _read_json(self) -> dict:
                length = int(self.headers.get("Content-Length", 0))
                return json.loads(self.rfile.read(length) or b"{}")

            def do_GET(self):
                if self.path == "/chain":
                    self._send(200, {"length": node.chain.weight(),
                                     "chain": node.chain.export_chain()})
                elif self.path == "/peers":
                    self._send(200, {"peers": sorted(node.peers)})
                elif self.path == "/status":
                    self._send(200, {
                        "address": node.address,
                        "height": node.chain.last_block.height,
                        "mempool": len(node.chain.mempool),
                        "quarantine": len(node.chain.quarantine),
                        "peers": sorted(node.peers),
                    })
                else:
                    self._send(404, {"error": "not found"})

            def do_POST(self):
                try:
                    payload = self._read_json()
                except Exception:
                    return self._send(400, {"error": "bad json"})

                if self.path == "/transactions":
                    ok, reason = node.submit_transaction(
                        Transaction.from_dict(payload), gossip=True)
                    self._send(200 if ok else 409, {"accepted": ok, "reason": reason})
                elif self.path == "/blocks":
                    ok, reason = node.receive_block(Block.from_dict(payload), gossip=True)
                    self._send(200 if ok else 409, {"accepted": ok, "reason": reason})
                elif self.path == "/peers":
                    node.add_peer(payload.get("peer", ""))
                    self._send(200, {"peers": sorted(node.peers)})
                elif self.path == "/resolve":
                    switched = node.resolve_conflicts()
                    self._send(200, {"switched": switched,
                                     "height": node.chain.last_block.height})
                else:
                    self._send(404, {"error": "not found"})

        self._server = ThreadingHTTPServer((self.host, self.port), Handler)
        self._thread = threading.Thread(target=self._server.serve_forever, daemon=True)
        self._thread.start()

    def stop(self) -> None:
        if self._server:
            self._server.shutdown()
            self._server.server_close()


# --- tiny HTTP client helpers ------------------------------------------------

def _post(url: str, payload: dict, timeout: float = 5) -> dict:
    data = json.dumps(payload).encode()
    req = urllib.request.Request(url, data=data,
                                 headers={"Content-Type": "application/json"},
                                 method="POST")
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read() or b"{}")


def _get(url: str, timeout: float = 5) -> dict:
    with urllib.request.urlopen(url, timeout=timeout) as resp:
        return json.loads(resp.read() or b"{}")
