"use client";

import { useState } from "react";
import Modal from "./Modal";
import { notify } from "./Toaster";
import { OfferStatusPill } from "./badges";
import { EmptyState } from "./dash";
import { IconTag } from "./icons";
import {
  commission,
  commissionRateLabel,
  formatDate,
  formatEuro,
  formatNumber,
  formatPercent,
  percentDiff,
} from "@/lib/format";
import { companyById } from "@/lib/mock-data";
import { useStore } from "@/lib/store";
import type { Offer, OfferStatus } from "@/lib/types";

const openStatuses: OfferStatus[] = ["Inviata", "Visualizzata", "In valutazione", "Controproposta"];

export default function OffersManager() {
  const { state, dispatch, currentSellerId } = useStore();
  const [counter, setCounter] = useState<Offer | null>(null);
  const [filter, setFilter] = useState<"tutte" | "aperte" | "chiuse">("tutte");

  const offers = state.offers.filter((o) => o.sellerId === currentSellerId);
  const filtered = offers.filter((o) => {
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

      {filtered.length === 0 ? (
        <div className="card">
          <EmptyState icon={<IconTag />} title="Nessuna offerta in questa vista" text="Le offerte ricevute dai compratori compariranno qui." />
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((o) => {
            const lot = state.lots.find((l) => l.id === o.lotId);
            const buyer = companyById(o.buyerId);
            const total = o.totalValue;
            const isOpen = openStatuses.includes(o.status);
            const diff = lot ? percentDiff(o.unitPrice, lot.unitPrice) : 0;
            return (
              <div key={o.id} className="card p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-ink">{buyer?.displayName ?? "Compratore"}</p>
                      <OfferStatusPill status={o.status} />
                    </div>
                    <p className="mt-0.5 truncate text-sm text-muted">{lot?.title}</p>
                    <p className="mt-1 text-xs text-muted">Ricevuta il {formatDate(o.date)} · scade il {formatDate(o.expiresAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-ink">
                      {formatEuro(o.unitPrice)}<span className="text-sm font-normal text-muted">/{lot?.unit}</span>
                    </p>
                    <p className="text-xs text-muted">
                      {formatNumber(o.quantity)} {lot?.unit} · totale {formatEuro(total, true)}
                    </p>
                    {lot && (
                      <p className={`text-xs font-medium ${diff < 0 ? "text-danger" : "text-brand-dark"}`}>
                        {formatPercent(diff)} sul richiesto
                      </p>
                    )}
                  </div>
                </div>

                {o.message && <p className="mt-3 rounded-lg bg-surface-2 p-3 text-sm text-ink-soft">“{o.message}”</p>}

                {o.history.length > 1 && (
                  <div className="mt-3 space-y-1 border-l-2 border-line pl-3 text-xs text-muted">
                    {o.history.map((h, i) => (
                      <p key={i}>
                        <span className="font-medium text-ink-soft">{h.by === "seller" ? "Tu" : "Compratore"}:</span>{" "}
                        {formatEuro(h.unitPrice)}/{lot?.unit} × {formatNumber(h.quantity)} · {formatDate(h.date)}
                      </p>
                    ))}
                  </div>
                )}

                <div className="mt-3 flex items-center justify-between">
                  <p className="text-xs text-muted">Commissione {commissionRateLabel()}: {formatEuro(commission(total))}</p>
                  {isOpen && (
                    <div className="flex gap-2">
                      <button onClick={() => { dispatch({ type: "SELLER_REJECT_OFFER", offerId: o.id }); notify("Offerta rifiutata.", "info"); }} className="btn btn-outline btn-sm text-danger">
                        Rifiuta
                      </button>
                      <button onClick={() => setCounter(o)} className="btn btn-outline btn-sm">Rilancia</button>
                      <button onClick={() => { dispatch({ type: "SELLER_ACCEPT_OFFER", offerId: o.id }); notify("Offerta accettata: ordine generato."); }} className="btn btn-primary btn-sm">
                        Accetta
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <CounterModal offer={counter} onClose={() => setCounter(null)} />
    </>
  );
}

function CounterModal({ offer, onClose }: { offer: Offer | null; onClose: () => void }) {
  const { state, dispatch } = useStore();
  const lot = offer ? state.lots.find((l) => l.id === offer.lotId) : undefined;
  const [price, setPrice] = useState(0);
  const [message, setMessage] = useState("");

  return (
    <Modal
      open={!!offer}
      onClose={onClose}
      title="Rilancia con controproposta"
      footer={
        <div className="flex gap-2">
          <button onClick={onClose} className="btn btn-outline flex-1">Annulla</button>
          <button
            onClick={() => {
              if (offer) {
                dispatch({
                  type: "SELLER_COUNTER_OFFER",
                  offerId: offer.id,
                  unitPrice: price || offer.unitPrice,
                  message: message || undefined,
                });
                notify("Controproposta inviata al compratore.");
              }
              onClose();
            }}
            className="btn btn-primary flex-1"
          >
            Invia controproposta
          </button>
        </div>
      }
    >
      {offer && lot && (
        <div className="space-y-4" key={offer.id}>
          <p className="text-sm text-muted">
            Offerta attuale: {formatEuro(offer.unitPrice)}/{lot.unit} per {formatNumber(offer.quantity)} {lot.unit}.
          </p>
          <div>
            <label className="field-label">Il tuo prezzo (€/{lot.unit})</label>
            <input type="number" step="0.01" defaultValue={offer.unitPrice} onChange={(e) => setPrice(Number(e.target.value) || 0)} className="field" />
          </div>
          <div>
            <label className="field-label">Messaggio (facoltativo)</label>
            <textarea rows={2} onChange={(e) => setMessage(e.target.value)} placeholder="Motiva la controproposta…" className="field resize-none" />
          </div>
          <p className="text-xs text-muted">Il compratore potrà accettare la controproposta o rifiutarla.</p>
        </div>
      )}
    </Modal>
  );
}
