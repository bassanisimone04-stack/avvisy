"use client";

import { useState } from "react";
import Modal from "./Modal";
import { notify } from "./Toaster";
import { OfferStatusPill } from "./badges";
import { EmptyState } from "./dash";
import { IconTag } from "./icons";
import { commission, commissionRateLabel, formatDate, formatEuro, formatNumber } from "@/lib/format";
import { lotById } from "@/lib/mock-data";
import type { Offer, OfferStatus } from "@/lib/types";

export default function OffersManager({ initial }: { initial: Offer[] }) {
  const [offers, setOffers] = useState(initial);
  const [counter, setCounter] = useState<Offer | null>(null);
  const [filter, setFilter] = useState<"tutte" | "aperte" | "chiuse">("tutte");

  function setStatus(id: string, status: OfferStatus, counterPrice?: number) {
    setOffers((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, status, counterUnitPrice: counterPrice ?? o.counterUnitPrice } : o,
      ),
    );
  }

  const open = new Set<OfferStatus>(["Inviata", "In valutazione", "Controproposta"]);
  const filtered = offers.filter((o) => {
    if (filter === "aperte") return open.has(o.status);
    if (filter === "chiuse") return !open.has(o.status);
    return true;
  });

  return (
    <>
      <div className="mb-4 flex gap-2">
        {(["tutte", "aperte", "chiuse"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`btn btn-sm capitalize ${filter === f ? "btn-steel" : "btn-outline"}`}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={<IconTag />}
            title="Nessuna offerta in questa vista"
            text="Le offerte ricevute dai compratori compariranno qui."
          />
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((o) => {
            const lot = lotById(o.lotId);
            const total = o.proposedUnitPrice * o.quantity;
            const isOpen = open.has(o.status);
            return (
              <div key={o.id} className="card p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-ink">{o.buyerCompany}</p>
                      <OfferStatusPill status={o.status} />
                    </div>
                    <p className="mt-0.5 truncate text-sm text-muted">{lot?.title}</p>
                    <p className="mt-1 text-xs text-muted">Ricevuta il {formatDate(o.date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-ink">
                      {formatEuro(o.proposedUnitPrice)}
                      <span className="text-sm font-normal text-muted">/{lot?.unit}</span>
                    </p>
                    <p className="text-xs text-muted">
                      {formatNumber(o.quantity)} {lot?.unit} · totale {formatEuro(total, true)}
                    </p>
                    {o.counterUnitPrice && (
                      <p className="mt-0.5 text-xs font-medium text-[#6d28d9]">
                        Controproposta: {formatEuro(o.counterUnitPrice)}/{lot?.unit}
                      </p>
                    )}
                  </div>
                </div>

                {o.message && (
                  <p className="mt-3 rounded-lg bg-surface-2 p-3 text-sm text-ink-soft">
                    “{o.message}”
                  </p>
                )}

                <div className="mt-3 flex items-center justify-between">
                  <p className="text-xs text-muted">
                    Commissione {commissionRateLabel()}: {formatEuro(commission(total))}
                  </p>
                  {isOpen && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setStatus(o.id, "Rifiutata");
                          notify("Offerta rifiutata.", "info");
                        }}
                        className="btn btn-outline btn-sm text-danger"
                      >
                        Rifiuta
                      </button>
                      <button
                        onClick={() => setCounter(o)}
                        className="btn btn-outline btn-sm"
                      >
                        Rilancia
                      </button>
                      <button
                        onClick={() => {
                          setStatus(o.id, "Accettata");
                          notify("Offerta accettata: ordine generato.");
                        }}
                        className="btn btn-primary btn-sm"
                      >
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

      <CounterModal
        offer={counter}
        onClose={() => setCounter(null)}
        onSend={(price) => {
          if (counter) {
            setStatus(counter.id, "Controproposta", price);
            notify("Controproposta inviata al compratore.");
          }
          setCounter(null);
        }}
      />
    </>
  );
}

function CounterModal({
  offer,
  onClose,
  onSend,
}: {
  offer: Offer | null;
  onClose: () => void;
  onSend: (price: number) => void;
}) {
  const lot = offer ? lotById(offer.lotId) : undefined;
  const [price, setPrice] = useState(0);

  return (
    <Modal
      open={!!offer}
      onClose={onClose}
      title="Rilancia con controproposta"
      footer={
        <div className="flex gap-2">
          <button onClick={onClose} className="btn btn-outline flex-1">Annulla</button>
          <button
            onClick={() => onSend(price || (offer?.proposedUnitPrice ?? 0))}
            className="btn btn-primary flex-1"
          >
            Invia controproposta
          </button>
        </div>
      }
    >
      {offer && lot && (
        <div className="space-y-4">
          <p className="text-sm text-muted">
            Offerta attuale di <strong>{offer.buyerCompany}</strong>:{" "}
            {formatEuro(offer.proposedUnitPrice)}/{lot.unit} per{" "}
            {formatNumber(offer.quantity)} {lot.unit}.
          </p>
          <div>
            <label className="field-label">Il tuo prezzo (€/{lot.unit})</label>
            <input
              type="number"
              step="0.01"
              defaultValue={offer.proposedUnitPrice}
              onChange={(e) => setPrice(Number(e.target.value) || 0)}
              className="field"
            />
          </div>
          <p className="text-xs text-muted">
            Il compratore riceverà la controproposta e potrà accettarla o
            rilanciare a sua volta.
          </p>
        </div>
      )}
    </Modal>
  );
}
