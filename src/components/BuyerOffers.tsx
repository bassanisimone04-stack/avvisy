"use client";

import { useState } from "react";
import Link from "next/link";
import { OfferStatusPill } from "./badges";
import { EmptyState } from "./dash";
import { notify } from "./Toaster";
import { IconTag } from "./icons";
import {
  commission,
  commissionRateLabel,
  formatDate,
  formatEuro,
  formatNumber,
} from "@/lib/format";
import { companyById } from "@/lib/mock-data";
import { useStore } from "@/lib/store";
import type { OfferStatus } from "@/lib/types";

const openStatuses: OfferStatus[] = ["Inviata", "Visualizzata", "In valutazione", "Controproposta"];

export default function BuyerOffers() {
  const { state, dispatch, currentBuyerId } = useStore();
  const [filter, setFilter] = useState<"tutte" | "aperte" | "chiuse">("tutte");

  const offers = state.offers.filter((o) => o.buyerId === currentBuyerId);
  const list = offers.filter((o) => {
    if (filter === "aperte") return openStatuses.includes(o.status);
    if (filter === "chiuse") return !openStatuses.includes(o.status);
    return true;
  });

  return (
    <>
      <div className="mb-4 flex gap-2">
        {(["tutte", "aperte", "chiuse"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`btn btn-sm capitalize ${filter === f ? "btn-steel" : "btn-outline"}`}>
            {f}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={<IconTag />}
            title="Nessuna offerta in questa vista"
            text="Invia un'offerta da un lotto negoziabile del marketplace."
            action={<Link href="/marketplace" className="btn btn-primary btn-sm">Esplora il marketplace</Link>}
          />
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((o) => {
            const lot = state.lots.find((l) => l.id === o.lotId);
            const total = o.totalValue;
            const canWithdraw = ["Inviata", "Visualizzata", "In valutazione"].includes(o.status);
            const counter = o.status === "Controproposta" ? o.history[o.history.length - 1] : null;
            return (
              <div key={o.id} className="card p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Link href={`/lotto/${o.lotId}`} className="font-semibold text-ink hover:text-brand-dark">{lot?.title}</Link>
                      <OfferStatusPill status={o.status} />
                    </div>
                    <p className="mt-0.5 text-xs text-muted">{companyById(o.sellerId)?.displayName} · inviata il {formatDate(o.date)}</p>
                    {o.message && <p className="mt-2 rounded-lg bg-surface-2 p-2.5 text-sm text-ink-soft">“{o.message}”</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-ink">{formatEuro(o.unitPrice)}<span className="text-sm font-normal text-muted">/{lot?.unit}</span></p>
                    <p className="text-xs text-muted">{formatNumber(o.quantity)} {lot?.unit} · {formatEuro(total, true)}</p>
                    <p className="text-xs text-muted">Commissione {commissionRateLabel()}: {formatEuro(commission(total))}</p>
                  </div>
                </div>

                {counter && (
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#ddd6fe] bg-[#f5f3ff] p-3">
                    <p className="text-sm text-[#6d28d9]">
                      Il venditore propone <strong>{formatEuro(counter.unitPrice)}/{lot?.unit}</strong>
                      {counter.message ? ` — “${counter.message}”` : ""}.
                    </p>
                    <div className="flex gap-2">
                      <button onClick={() => { dispatch({ type: "BUYER_REJECT_COUNTER", offerId: o.id }); notify("Controproposta rifiutata.", "info"); }} className="btn btn-outline btn-sm text-danger">
                        Rifiuta
                      </button>
                      <button onClick={() => { dispatch({ type: "BUYER_ACCEPT_COUNTER", offerId: o.id }); notify("Controproposta accettata: ordine creato."); }} className="btn btn-primary btn-sm">
                        Accetta {formatEuro(counter.unitPrice)}
                      </button>
                    </div>
                  </div>
                )}

                {canWithdraw && (
                  <div className="mt-3 flex justify-end">
                    <button onClick={() => { dispatch({ type: "WITHDRAW_OFFER", offerId: o.id }); notify("Offerta ritirata.", "info"); }} className="btn btn-ghost btn-sm text-danger">
                      Ritira offerta
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
