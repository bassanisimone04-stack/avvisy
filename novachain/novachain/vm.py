"""
A minimal, deterministic smart-contract virtual machine for NovaChain.

WHY A VM
--------
Bitcoin's scripting is intentionally limited — you can't write real programmable
money on it. NovaChain's account model lets us bolt on a small VM so people can
deploy contracts (escrow, tokens, crowdfunding, ...). This is a *teaching-grade*
VM: a stack machine with a handful of opcodes and gas metering.

DETERMINISM (the non-negotiable rule)
-------------------------------------
Every node must execute a contract call and reach the EXACT same result, or the
chain forks. So the VM has NO source of nondeterminism: no clock, no randomness,
no network, no floating-point surprises beyond plain arithmetic. Given the same
(code, storage, args, caller, value) it always produces the same output. This is
also why the AI guardian is NOT allowed inside contract execution — it would
break this guarantee.

GAS
---
Each instruction costs gas. A call is given a gas limit; running out reverts the
whole call (all state changes undone). This stops infinite loops from freezing
the network — the same reason Ethereum has gas.
"""
from __future__ import annotations

from dataclasses import dataclass, field


class Revert(Exception):
    """Raised when a contract call fails; the engine rolls back all its effects."""


# Per-opcode gas cost. Storage writes and transfers are the expensive ones.
GAS_COST = {
    "STORE": 5, "SSTORE": 5, "TRANSFER": 10, "EMIT": 2,
}
DEFAULT_GAS = 1  # everything else


@dataclass
class Contract:
    address: str
    methods: dict[str, list[tuple]]        # method name -> list of instructions
    storage: dict = field(default_factory=dict)


@dataclass
class CallResult:
    logs: list[tuple]
    transfers: list[tuple]
    gas_used: int


class VM:
    """Executes a single method of a contract against a *copy* of its storage.
    Returns the new storage and any pending transfers/logs, or raises Revert."""

    MAX_STEPS = 100_000  # hard ceiling as a second safety net beyond gas

    def run(self, method_code: list[tuple], storage: dict, args: tuple,
            caller: str, value: float, gas_limit: int) -> tuple[dict, list, list, int]:
        stack: list = []
        logs: list[tuple] = []
        transfers: list[tuple] = []
        gas = gas_limit
        pc = 0
        steps = 0

        def pop():
            if not stack:
                raise Revert("stack underflow")
            return stack.pop()

        while pc < len(method_code):
            steps += 1
            if steps > self.MAX_STEPS:
                raise Revert("step limit exceeded")

            instr = method_code[pc]
            # Tolerate a zero-arg opcode written as a bare string ("HALT") in
            # addition to the canonical 1-tuple ("HALT",).
            if isinstance(instr, str):
                instr = (instr,)
            op, *arg = instr
            gas -= GAS_COST.get(op, DEFAULT_GAS)
            if gas < 0:
                raise Revert("out of gas")

            if op == "PUSH":
                stack.append(arg[0])
            elif op == "POP":
                pop()
            elif op == "DUP":
                v = pop(); stack.append(v); stack.append(v)
            elif op == "CALLER":
                stack.append(caller)
            elif op == "VALUE":
                stack.append(value)
            elif op == "ARG":
                idx = arg[0]
                if idx >= len(args):
                    raise Revert("missing argument")
                stack.append(args[idx])
            elif op == "LOAD":                      # static-key read
                stack.append(storage.get(arg[0], 0))
            elif op == "STORE":                     # static-key write
                storage[arg[0]] = pop()
            elif op == "SLOAD":                     # dynamic-key read (key on stack)
                stack.append(storage.get(pop(), 0))
            elif op == "SSTORE":                    # dynamic-key write: pop key, val
                key = pop(); storage[key] = pop()
            elif op == "ADD":
                b = pop(); a = pop(); stack.append(a + b)
            elif op == "SUB":
                b = pop(); a = pop(); stack.append(a - b)
            elif op == "MUL":
                b = pop(); a = pop(); stack.append(a * b)
            elif op == "EQ":
                b = pop(); a = pop(); stack.append(1 if a == b else 0)
            elif op == "LT":
                b = pop(); a = pop(); stack.append(1 if a < b else 0)
            elif op == "GT":
                b = pop(); a = pop(); stack.append(1 if a > b else 0)
            elif op == "NOT":
                stack.append(0 if pop() else 1)
            elif op == "CONCAT":
                b = pop(); a = pop(); stack.append(f"{a}{b}")
            elif op == "REQUIRE":
                if not pop():
                    raise Revert(arg[0] if arg else "requirement failed")
            elif op == "TRANSFER":                  # pop amount, pop recipient
                amount = pop(); to = pop()
                if amount < 0:
                    raise Revert("negative transfer")
                transfers.append((to, amount))
            elif op == "EMIT":                      # pop value; log (tag, value)
                logs.append((arg[0], pop()))
            elif op == "JMP":
                pc = arg[0]; continue
            elif op == "JMPIF":
                target = arg[0]
                if pop():
                    pc = target; continue
            elif op == "HALT":
                break
            else:
                raise Revert(f"unknown opcode {op}")
            pc += 1

        return storage, transfers, logs, gas_limit - gas


class ContractEngine:
    """Ties the VM to account balances so contract calls can move real coins.

    It operates on a balances dict (e.g. a Blockchain's `balances`). All effects
    of a call are computed first and only committed if the call succeeds; a Revert
    leaves balances and storage untouched — calls are atomic.
    """

    def __init__(self, balances: dict[str, float]) -> None:
        self.balances = balances
        self.contracts: dict[str, Contract] = {}

    def deploy(self, address: str, methods: dict[str, list[tuple]],
               init_storage: dict | None = None) -> Contract:
        contract = Contract(address=address, methods=methods,
                            storage=dict(init_storage or {}))
        self.contracts[address] = contract
        self.balances.setdefault(address, 0.0)
        return contract

    def call(self, address: str, method: str, caller: str, args: tuple = (),
             value: float = 0.0, gas_limit: int = 10_000) -> CallResult:
        contract = self.contracts.get(address)
        if contract is None:
            raise Revert("no such contract")
        if method not in contract.methods:
            raise Revert(f"no such method: {method}")
        if value < 0:
            raise Revert("negative value")
        if value > 0 and self.balances.get(caller, 0.0) < value:
            raise Revert("caller has insufficient funds for value")

        # Execute against a COPY of storage so a revert changes nothing.
        working = dict(contract.storage)
        new_storage, transfers, logs, gas_used = VM().run(
            contract.methods[method], working, args, caller, value, gas_limit)

        # Simulate all balance effects before committing anything.
        bal = dict(self.balances)
        bal[caller] = bal.get(caller, 0.0) - value
        bal[address] = bal.get(address, 0.0) + value
        for to, amount in transfers:
            if bal.get(address, 0.0) < amount:
                raise Revert("contract has insufficient balance for transfer")
            bal[address] -= amount
            bal[to] = bal.get(to, 0.0) + amount

        # Commit.
        self.balances.clear()
        self.balances.update(bal)
        contract.storage = new_storage
        return CallResult(logs=logs, transfers=transfers, gas_used=gas_used)
