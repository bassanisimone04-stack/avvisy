"""
Example smart contracts for the NovaChain VM (see vm.py).

Each contract is just a dict of {method_name: [instructions]}. These are written
directly in the VM's little instruction set to keep the prototype transparent —
a real deployment would compile a higher-level language down to these opcodes.
"""
from __future__ import annotations


def counter() -> dict[str, list[tuple]]:
    """A trivial contract: a stored counter you can increment or add to.
    Demonstrates persistent storage and arithmetic."""
    return {
        "inc": [
            ("LOAD", "count"), ("PUSH", 1), ("ADD"), ("STORE", "count"), ("HALT",),
        ],
        "add": [  # arg0 = amount to add
            ("LOAD", "count"), ("ARG", 0), ("ADD"), ("STORE", "count"), ("HALT",),
        ],
        "get": [
            ("LOAD", "count"), ("EMIT", "count"), ("HALT",),
        ],
    }


def escrow() -> dict[str, list[tuple]]:
    """A buyer deposits coins; only the buyer can release them to the seller, and
    only the seller can refund the buyer. Demonstrates value transfer, access
    control, and a state machine. Initial storage must set 'seller'.

    state: 0 = created, 1 = funded, 2 = released, 3 = refunded
    """
    return {
        "deposit": [  # buyer calls with value attached
            ("LOAD", "state"), ("PUSH", 0), ("EQ"), ("REQUIRE", "already funded"),
            ("CALLER"), ("STORE", "buyer"),
            ("VALUE"), ("STORE", "amount"),
            ("PUSH", 1), ("STORE", "state"),
            ("HALT",),
        ],
        "release": [  # only the buyer may release funds to the seller
            ("CALLER"), ("LOAD", "buyer"), ("EQ"), ("REQUIRE", "only buyer"),
            ("LOAD", "state"), ("PUSH", 1), ("EQ"), ("REQUIRE", "not funded"),
            ("LOAD", "seller"), ("LOAD", "amount"), ("TRANSFER"),
            ("LOAD", "amount"), ("EMIT", "released"),
            ("PUSH", 2), ("STORE", "state"),
            ("HALT",),
        ],
        "refund": [  # only the seller may refund the buyer
            ("CALLER"), ("LOAD", "seller"), ("EQ"), ("REQUIRE", "only seller"),
            ("LOAD", "state"), ("PUSH", 1), ("EQ"), ("REQUIRE", "not funded"),
            ("LOAD", "buyer"), ("LOAD", "amount"), ("TRANSFER"),
            ("PUSH", 3), ("STORE", "state"),
            ("HALT",),
        ],
    }


def token() -> dict[str, list[tuple]]:
    """A minimal fungible token with balances stored under 'bal:<address>' keys.
    Demonstrates dynamic (computed-key) storage. Initial storage must set 'owner'.
    """
    def bal_key_of_caller():
        return [("PUSH", "bal:"), ("CALLER"), ("CONCAT")]

    def bal_key_of_arg(i):
        return [("PUSH", "bal:"), ("ARG", i), ("CONCAT")]

    return {
        "mint": [  # only owner; args: (to, amount)
            ("CALLER"), ("LOAD", "owner"), ("EQ"), ("REQUIRE", "only owner"),
            *bal_key_of_arg(0), ("SLOAD"), ("ARG", 1), ("ADD"),   # newbal
            *bal_key_of_arg(0), ("SSTORE"),                        # bal[to] = newbal
            ("LOAD", "supply"), ("ARG", 1), ("ADD"), ("STORE", "supply"),
            ("HALT",),
        ],
        "transfer": [  # args: (to, amount); sender is CALLER
            *bal_key_of_caller(), ("SLOAD"), ("ARG", 1), ("LT"), ("NOT"),
            ("REQUIRE", "insufficient token balance"),
            *bal_key_of_caller(), ("SLOAD"), ("ARG", 1), ("SUB"),  # new sender bal
            *bal_key_of_caller(), ("SSTORE"),
            *bal_key_of_arg(0), ("SLOAD"), ("ARG", 1), ("ADD"),    # new recipient bal
            *bal_key_of_arg(0), ("SSTORE"),
            ("HALT",),
        ],
        "balanceOf": [  # arg0 = address
            *bal_key_of_arg(0), ("SLOAD"), ("EMIT", "balance"), ("HALT",),
        ],
    }
