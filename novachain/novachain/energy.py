"""
Energy comparison: NovaChain (Proof-of-Stake) vs Bitcoin (Proof-of-Work).

WHY THIS MODULE EXISTS
----------------------
The single most cited, most *true* criticism of Bitcoin is its energy use. This
module lets you put real numbers on how much NovaChain saves — useful for honest
communication (especially in Europe, where energy/CO2 is scrutinised).

IMPORTANT HONESTY NOTE
----------------------
The energy saving comes from the CONSENSUS CHOICE (Proof-of-Stake), NOT from AI.
Anyone claiming "AI solves Bitcoin's energy problem" is wrong: AI cannot make a
Proof-of-Work puzzle cheaper without weakening its security. What removes the
waste is not doing the puzzle at all — which is exactly what PoS does. AI's honest
role on energy is secondary (see `ai_energy_roles()` below).

FIGURES
-------
All constants are ILLUSTRATIVE, order-of-magnitude estimates drawn from public
sources (e.g. Cambridge CBECI for Bitcoin; Ethereum Foundation's post-"Merge"
figures for a large PoS network). They move over time — treat them as ballpark,
not gospel. The comparison logic is what matters.
"""
from __future__ import annotations

from dataclasses import dataclass

# --- illustrative reference constants ---------------------------------------

# Bitcoin (Proof-of-Work). CBECI-style estimate, annualised.
BTC_ANNUAL_TWH = 150.0                 # terawatt-hours per year (order of magnitude)
BTC_TX_PER_YEAR = 120_000_000         # ~ a few hundred thousand tx/day

# A mature Proof-of-Stake network (Ethereum post-Merge is the public reference):
# roughly a 99.95% drop in energy vs its PoW past.
POS_REDUCTION_VS_POW = 0.9995

# Grid carbon intensity — EU average is far cleaner than the global crypto mix,
# but we use a neutral global-ish figure for CO2 illustration.
GRID_KG_CO2_PER_KWH = 0.4


@dataclass
class EnergyReport:
    btc_kwh_per_tx: float
    nova_kwh_per_tx: float
    reduction_pct: float
    btc_co2_kg_per_tx: float
    nova_co2_kg_per_tx: float

    def pretty(self) -> str:
        return (
            "Energy per transaction (illustrative estimates)\n"
            f"  Bitcoin (PoW)   : {self.btc_kwh_per_tx:,.1f} kWh   "
            f"(~{self.btc_co2_kg_per_tx:,.1f} kg CO2)\n"
            f"  NovaChain (PoS) : {self.nova_kwh_per_tx:.4f} kWh   "
            f"(~{self.nova_co2_kg_per_tx:.4f} kg CO2)\n"
            f"  Reduction       : {self.reduction_pct:.3f}%  "
            f"(~{self.btc_kwh_per_tx / max(self.nova_kwh_per_tx, 1e-9):,.0f}x less energy)"
        )


def btc_kwh_per_tx() -> float:
    """Bitcoin energy per transaction, in kWh."""
    return (BTC_ANNUAL_TWH * 1e9) / BTC_TX_PER_YEAR  # TWh -> kWh, divided by tx count


def compare() -> EnergyReport:
    """Build a per-transaction energy + CO2 comparison."""
    btc = btc_kwh_per_tx()
    nova = btc * (1.0 - POS_REDUCTION_VS_POW)
    return EnergyReport(
        btc_kwh_per_tx=btc,
        nova_kwh_per_tx=nova,
        reduction_pct=POS_REDUCTION_VS_POW * 100,
        btc_co2_kg_per_tx=btc * GRID_KG_CO2_PER_KWH,
        nova_co2_kg_per_tx=nova * GRID_KG_CO2_PER_KWH,
    )


def ai_energy_roles() -> list[str]:
    """Where AI *honestly* helps with energy/efficiency — secondary to PoS, but real."""
    return [
        "Load forecasting: predict transaction volume so the network doesn't "
        "over-provision validator resources during quiet periods.",
        "Smart batching: group and order transactions to minimise redundant "
        "state computation and storage writes.",
        "Anomaly-driven node health: spot misbehaving/looping nodes wasting "
        "cycles and flag them for operators.",
        "Green validator scheduling (research): preferentially weight validators "
        "running on verified renewable energy.",
    ]


if __name__ == "__main__":
    report = compare()
    print(report.pretty())
    print("\nWhat removes the waste: not mining (Proof-of-Stake). Not AI.")
    print("\nWhere AI honestly helps efficiency (secondary):")
    for role in ai_energy_roles():
        print(f"  - {role}")
