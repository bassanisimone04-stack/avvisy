"use client";

import { useState } from "react";
import Link from "next/link";
import { OfferStatusPill } from "./badges";
import { notify } from "./Toaster";
import { commissionRateLabel, commission, formatDate, formatEuro, formatNumber } from "@/lib/format";
import { lotById } from "@/lib/mock-data";
import type { Offer, OfferStatus } from "@/lib/types";

export default function BuyerOffers({ initial }: { initial: Offer[] }) {
  const [offers, setOffers] = useState(initial);

  function update(id: string, status: OfferStatus) {
    setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  }

  return (
    <div className="space-y-3">
      {offers.map((o) => {
        const lot = lotById(o.lotId);
        const total = o.proposedUnitPrice * o.quantity;
        return (
          <div key={o.id} className="card p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Link href={`/lotto/${o.lotId}`} className="font-semibold text-ink hover:text-brand-dark">
                    {lot?.title}
                  </Link>
                  <OfferStatusPill status={o.status} />
                </div>
                <p className="mt-1 text-xs text-muted">Inviata il {formatDate(o.date)}</p>
                {o.message && (
                  <p className="mt-2 rounded-lg bg-surface-2 p-2.5 text-sm text-ink-soft">“{o.message}”</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-ink">
                  {formatEuro(o.proposedUnitPrice)}
                  <span className="text-sm font-normal text-muted">/{lot?.unit}</span>
                </p>
                <p className="text-xs text-muted">
                  {formatNumber(o.quantity)} {lot?.unit} · {formatEuro(total, true)}
                </p>
                <p className="text-xs text-muted">
                  Commissione {commissionRateLabel()}: {formatEuro(commission(total))}
                </p>
              </div>
            </div>

            {o.status === "Controproposta" && o.counterUnitPrice && (
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#ddd6fe] bg-[#f5f3ff] p-3">
                <p className="text-sm text-[#6d28d9]">
                  Il venditore propone <strong>{formatEuro(o.counterUnitPrice)}/{lot?.unit}</strong>.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => { update(o.id, "Rifiutata"); notify("Controproposta rifiutata.", "info"); }}
                    className="btn btn-outline btn-sm text-danger"
                  >
                    Rifiuta
                  </button>
                  <button
                    onClick={() => { update(o.id, "Accettata"); notify("Controproposta accettata: ordine creato."); }}
                    className="btn btn-primary btn-sm"
                  >
                    Accetta {formatEuro(o.counterUnitPrice)}
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
