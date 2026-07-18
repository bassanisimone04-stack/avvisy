"use client";

import { useState } from "react";
import Modal from "./Modal";
import { notify } from "./Toaster";
import { IconBolt, IconCheck, IconMessage, IconTag } from "./icons";
import { commission, commissionRateLabel, formatEuro, formatNumber } from "@/lib/format";
import type { Lot } from "@/lib/types";

type Dialog = null | "buy" | "offer" | "info";

export default function LotActions({ lot }: { lot: Lot }) {
  const [dialog, setDialog] = useState<Dialog>(null);
  const [saved, setSaved] = useState(false);

  return (
    <>
      <div className="space-y-2">
        <button
          onClick={() => setDialog("buy")}
          className="btn btn-primary btn-block"
        >
          <IconBolt width={18} height={18} />
          Acquista ora
        </button>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setDialog("offer")}
            className="btn btn-steel btn-sm"
            disabled={lot.saleMode === "immediato"}
            title={lot.saleMode === "immediato" ? "Lotto ad acquisto immediato" : undefined}
          >
            <IconTag width={16} height={16} />
            Invia offerta
          </button>
          <button
            onClick={() => setDialog("info")}
            className="btn btn-outline btn-sm"
          >
            <IconMessage width={16} height={16} />
            Informazioni
          </button>
        </div>
        <button
          onClick={() => {
            setSaved((s) => !s);
            notify(saved ? "Lotto rimosso dai salvati." : "Lotto salvato nei preferiti.");
          }}
          className={`btn btn-block btn-sm ${saved ? "btn-outline text-brand-dark" : "btn-ghost"}`}
        >
          {saved ? <IconCheck width={16} height={16} /> : null}
          {saved ? "Lotto salvato" : "Salva lotto"}
        </button>
      </div>

      <BuyDialog lot={lot} open={dialog === "buy"} onClose={() => setDialog(null)} />
      <OfferDialog lot={lot} open={dialog === "offer"} onClose={() => setDialog(null)} />
      <InfoDialog lot={lot} open={dialog === "info"} onClose={() => setDialog(null)} />
    </>
  );
}

function Summary({ total }: { total: number }) {
  const fee = commission(total);
  return (
    <dl className="space-y-2 rounded-lg bg-surface-2 p-4 text-sm">
      <div className="flex justify-between">
        <dt className="text-muted">Valore merce</dt>
        <dd className="font-semibold text-ink">{formatEuro(total)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-muted">
          Commissione Scortvia ({commissionRateLabel()})
        </dt>
        <dd className="font-semibold text-ink">{formatEuro(fee)}</dd>
      </div>
      <div className="flex justify-between border-t border-line pt-2">
        <dt className="font-semibold text-ink">Totale stimato</dt>
        <dd className="text-base font-bold text-brand-dark">
          {formatEuro(total + fee)}
        </dd>
      </div>
    </dl>
  );
}

function BuyDialog({ lot, open, onClose }: { lot: Lot; open: boolean; onClose: () => void }) {
  const [qty, setQty] = useState(lot.minQuantity);
  const [done, setDone] = useState(false);
  const total = qty * lot.unitPrice;

  function confirm() {
    setDone(true);
    notify("Acquisto simulato confermato. Trovi l'ordine nella tua area compratore.");
  }

  function close() {
    onClose();
    setTimeout(() => setDone(false), 200);
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title={done ? "Ordine confermato" : "Acquista ora"}
      footer={
        done ? (
          <button onClick={close} className="btn btn-primary btn-block">
            Chiudi
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={close} className="btn btn-outline flex-1">
              Annulla
            </button>
            <button onClick={confirm} className="btn btn-primary flex-1">
              Conferma acquisto
            </button>
          </div>
        )
      }
    >
      {done ? (
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft text-brand-dark">
            <IconCheck width={28} height={28} />
          </span>
          <p className="text-ink">
            Hai acquistato <strong>{formatNumber(qty)} {lot.unit}</strong> di{" "}
            <strong>{lot.title}</strong>.
          </p>
          <p className="text-sm text-muted">
            Pagamento simulato in deposito presso il partner. Nessun addebito
            reale è stato effettuato.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted">
            Acquisto immediato al prezzo di listino. Quantità minima{" "}
            {formatNumber(lot.minQuantity)} {lot.unit}.
          </p>
          <div>
            <label className="field-label">Quantità ({lot.unit})</label>
            <input
              type="number"
              min={lot.minQuantity}
              max={lot.quantity}
              value={qty}
              onChange={(e) =>
                setQty(
                  Math.max(
                    lot.minQuantity,
                    Math.min(lot.quantity, Number(e.target.value) || 0),
                  ),
                )
              }
              className="field"
            />
            <p className="mt-1 text-xs text-muted">
              Disponibili {formatNumber(lot.quantity)} {lot.unit} · {formatEuro(lot.unitPrice)}/{lot.unit}
            </p>
          </div>
          <Summary total={total} />
        </div>
      )}
    </Modal>
  );
}

function OfferDialog({ lot, open, onClose }: { lot: Lot; open: boolean; onClose: () => void }) {
  const [qty, setQty] = useState(lot.minQuantity);
  const [price, setPrice] = useState(lot.unitPrice);
  const [msg, setMsg] = useState("");
  const [done, setDone] = useState(false);
  const total = qty * price;

  function submit() {
    setDone(true);
    notify("Offerta inviata al venditore. Riceverai una risposta a breve.");
  }
  function close() {
    onClose();
    setTimeout(() => setDone(false), 200);
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title={done ? "Offerta inviata" : "Invia offerta"}
      footer={
        done ? (
          <button onClick={close} className="btn btn-primary btn-block">
            Chiudi
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={close} className="btn btn-outline flex-1">
              Annulla
            </button>
            <button onClick={submit} className="btn btn-steel flex-1">
              Invia offerta
            </button>
          </div>
        )
      }
    >
      {done ? (
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-steel-soft text-steel">
            <IconTag width={26} height={26} />
          </span>
          <p className="text-ink">
            Offerta di <strong>{formatEuro(price)}/{lot.unit}</strong> per{" "}
            <strong>{formatNumber(qty)} {lot.unit}</strong> inviata.
          </p>
          <p className="text-sm text-muted">
            Stato iniziale: <strong>Inviata</strong>. Puoi seguire la trattativa
            dall&apos;area compratore.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="field-label">Quantità richiesta ({lot.unit})</label>
              <input
                type="number"
                min={lot.minQuantity}
                max={lot.quantity}
                value={qty}
                onChange={(e) => setQty(Number(e.target.value) || 0)}
                className="field"
              />
            </div>
            <div>
              <label className="field-label">Prezzo proposto (€/{lot.unit})</label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value) || 0)}
                className="field"
              />
            </div>
          </div>
          <div>
            <label className="field-label">Messaggio al venditore</label>
            <textarea
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              rows={3}
              placeholder="Es. Interessati a un ordine ricorrente con ritiro programmato…"
              className="field resize-none"
            />
          </div>
          <Summary total={total} />
        </div>
      )}
    </Modal>
  );
}

function InfoDialog({ lot, open, onClose }: { lot: Lot; open: boolean; onClose: () => void }) {
  const [msg, setMsg] = useState("");
  const [done, setDone] = useState(false);
  function send() {
    setDone(true);
    notify("Richiesta inviata. Il venditore ti risponderà nei messaggi.");
  }
  function close() {
    onClose();
    setTimeout(() => setDone(false), 200);
  }
  return (
    <Modal
      open={open}
      onClose={close}
      title="Richiedi informazioni"
      footer={
        done ? (
          <button onClick={close} className="btn btn-primary btn-block">
            Chiudi
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={close} className="btn btn-outline flex-1">
              Annulla
            </button>
            <button onClick={send} className="btn btn-steel flex-1" disabled={!msg.trim()}>
              Invia richiesta
            </button>
          </div>
        )
      }
    >
      {done ? (
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-steel-soft text-steel">
            <IconMessage width={26} height={26} />
          </span>
          <p className="text-ink">Richiesta inviata al venditore.</p>
          <p className="text-sm text-muted">
            Troverai la conversazione nella sezione Messaggi.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted">
            Fai una domanda sul lotto <strong>{lot.title}</strong>: disponibilità,
            documenti, logistica o condizioni di ritiro.
          </p>
          <textarea
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            rows={4}
            placeholder="Scrivi la tua richiesta…"
            className="field resize-none"
          />
        </div>
      )}
    </Modal>
  );
}
