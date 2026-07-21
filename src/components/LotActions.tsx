"use client";

import { useId, useState } from "react";
import Modal from "./Modal";
import CheckoutModal from "./CheckoutModal";
import FavoriteButton from "./FavoriteButton";
import { notify } from "./Toaster";
import { IconBolt, IconMessage, IconTag } from "./icons";
import {
  commission,
  commissionRateLabel,
  formatEuro,
  formatNumber,
  formatPercent,
  percentDiff,
} from "@/lib/format";
import { useStore } from "@/lib/store";
import { createOffer, validateOffer } from "@/lib/services";
import { hasContactInfo } from "@/lib/moderation";
import type { Lot } from "@/lib/types";

type Dialog = null | "buy" | "offer" | "info" | "report";

export default function LotActions({ lot }: { lot: Lot }) {
  const [dialog, setDialog] = useState<Dialog>(null);
  const available = lot.status === "Pubblicato";

  return (
    <>
      <div className="space-y-2">
        <button
          onClick={() => setDialog("buy")}
          className="btn btn-primary btn-block"
          disabled={!available}
        >
          <IconBolt width={18} height={18} />
          Acquista
        </button>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setDialog("offer")}
            className="btn btn-steel btn-sm"
            disabled={!available || !lot.negotiable}
            title={!lot.negotiable ? "Prezzo non negoziabile" : undefined}
          >
            <IconTag width={16} height={16} />
            Fai un&apos;offerta
          </button>
          <button onClick={() => setDialog("info")} className="btn btn-outline btn-sm">
            <IconMessage width={16} height={16} />
            Contatta
          </button>
        </div>
        <FavoriteButton lotId={lot.id} variant="inline" />
        <div className="flex items-center justify-center gap-4 pt-1 text-xs">
          <ShareButton />
          <button onClick={() => setDialog("report")} className="text-muted hover:text-danger">
            Segnala annuncio
          </button>
        </div>
        {!available && (
          <p className="rounded-lg bg-surface-2 p-2.5 text-center text-xs text-muted">
            Lotto <strong>{lot.status.toLowerCase()}</strong>: acquisto e offerte non disponibili.
          </p>
        )}
      </div>

      {/* Barra azioni fissa su mobile */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t border-line bg-surface/95 p-3 backdrop-blur lg:hidden">
        <button onClick={() => setDialog("info")} className="btn btn-outline btn-sm shrink-0" aria-label="Contatta il venditore">
          <IconMessage width={18} height={18} />
        </button>
        <button onClick={() => setDialog("offer")} className="btn btn-steel flex-1" disabled={!available || !lot.negotiable}>
          Fai un&apos;offerta
        </button>
        <button onClick={() => setDialog("buy")} className="btn btn-primary flex-1" disabled={!available}>
          Acquista
        </button>
      </div>

      <CheckoutModal ctx={{ mode: "buy", lot }} open={dialog === "buy"} onClose={() => setDialog(null)} />
      <OfferDialog lot={lot} open={dialog === "offer"} onClose={() => setDialog(null)} />
      <InfoDialog lot={lot} open={dialog === "info"} onClose={() => setDialog(null)} />
      <ReportDialog open={dialog === "report"} onClose={() => setDialog(null)} />
    </>
  );
}

function ShareButton() {
  return (
    <button
      onClick={() => {
        try {
          navigator.clipboard?.writeText(window.location.href);
        } catch {
          /* no-op */
        }
        notify("Link del lotto copiato negli appunti.", "info");
      }}
      className="text-muted hover:text-brand-dark"
    >
      Condividi
    </button>
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
        <dt className="text-muted">Commissione Scortvia ({commissionRateLabel()})</dt>
        <dd className="font-semibold text-ink">{formatEuro(fee)}</dd>
      </div>
      <div className="flex justify-between border-t border-line pt-2">
        <dt className="font-semibold text-ink">Totale stimato</dt>
        <dd className="text-base font-bold text-brand-dark">{formatEuro(total + fee)}</dd>
      </div>
    </dl>
  );
}

function OfferDialog({ lot, open, onClose }: { lot: Lot; open: boolean; onClose: () => void }) {
  const { dispatch, currentBuyerId } = useStore();
  const uid = useId();
  const [qty, setQty] = useState(lot.minQuantity);
  const [price, setPrice] = useState(lot.unitPrice);
  const [msg, setMsg] = useState("");
  const [days, setDays] = useState(7);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const total = qty * price;
  const diff = percentDiff(price, lot.unitPrice);

  function submit() {
    const errs = validateOffer(lot, { quantity: qty, unitPrice: price });
    if (errs.length) {
      setErrors(errs);
      return;
    }
    const expires = new Date();
    expires.setDate(expires.getDate() + days);
    dispatch({
      type: "SEND_OFFER",
      offer: createOffer({
        lotId: lot.id,
        buyerId: currentBuyerId,
        sellerId: lot.sellerId,
        quantity: qty,
        unitPrice: price,
        message: msg,
        expiresAt: expires.toISOString().slice(0, 10),
      }),
    });
    setDone(true);
    notify("Offerta inviata al venditore.");
  }
  function close() {
    onClose();
    setTimeout(() => {
      setDone(false);
      setErrors([]);
    }, 200);
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title={done ? "Offerta inviata" : "Fai un'offerta"}
      footer={
        done ? (
          <a href="/compratore/offerte" className="btn btn-primary btn-block">Segui la trattativa</a>
        ) : (
          <div className="flex gap-2">
            <button onClick={close} className="btn btn-outline flex-1">Annulla</button>
            <button onClick={submit} className="btn btn-steel flex-1">Invia offerta</button>
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
            Offerta di <strong>{formatEuro(price)}/{lot.unit}</strong> per <strong>{formatNumber(qty)} {lot.unit}</strong> inviata.
          </p>
          <p className="text-sm text-muted">Stato iniziale: <strong>Inviata</strong>. La trovi nell&apos;area compratore.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {errors.length > 0 && (
            <ul className="space-y-1 rounded-lg bg-danger-soft p-3 text-sm text-danger" role="alert">
              {errors.map((e) => <li key={e}>• {e}</li>)}
            </ul>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${uid}-qty`} className="field-label">Quantità ({lot.unit})</label>
              <input id={`${uid}-qty`} type="number" min={lot.minQuantity} max={lot.quantity} value={qty} onChange={(e) => setQty(Number(e.target.value) || 0)} className="field" />
            </div>
            <div>
              <label htmlFor={`${uid}-price`} className="field-label">Prezzo proposto (€/{lot.unit})</label>
              <input id={`${uid}-price`} type="number" min={0} step="0.01" value={price} onChange={(e) => setPrice(Number(e.target.value) || 0)} className="field" />
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-surface-2 px-3 py-2 text-sm">
            <span className="text-muted">Rispetto al prezzo richiesto</span>
            <span className={`font-semibold ${diff < 0 ? "text-danger" : diff > 0 ? "text-brand-dark" : "text-ink"}`}>
              {formatPercent(diff)}
            </span>
          </div>
          <div>
            <label htmlFor={`${uid}-days`} className="field-label">Scadenza offerta</label>
            <select id={`${uid}-days`} value={days} onChange={(e) => setDays(Number(e.target.value))} className="field">
              <option value={3}>3 giorni</option>
              <option value={7}>7 giorni</option>
              <option value={14}>14 giorni</option>
              <option value={30}>30 giorni</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${uid}-msg`} className="field-label">Messaggio (facoltativo)</label>
            <textarea id={`${uid}-msg`} value={msg} onChange={(e) => setMsg(e.target.value)} rows={2} placeholder="Es. ordine ricorrente con ritiro programmato…" className="field resize-none" />
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
    notify("Richiesta inviata: la trovi nei messaggi.");
  }
  function close() {
    onClose();
    setTimeout(() => setDone(false), 200);
  }
  return (
    <Modal
      open={open}
      onClose={close}
      title="Contatta il venditore"
      footer={
        done ? (
          <button onClick={close} className="btn btn-primary btn-block">Chiudi</button>
        ) : (
          <div className="flex gap-2">
            <button onClick={close} className="btn btn-outline flex-1">Annulla</button>
            <button onClick={send} className="btn btn-steel flex-1" disabled={!msg.trim()}>Invia richiesta</button>
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
          <p className="text-sm text-muted">Troverai la conversazione nella sezione Messaggi.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted">
            Fai una domanda sul lotto <strong>{lot.title}</strong>: disponibilità, documenti o logistica.
          </p>
          <textarea value={msg} onChange={(e) => setMsg(e.target.value)} rows={4} placeholder="Scrivi la tua richiesta…" className="field resize-none" />
          {hasContactInfo(msg) && (
            <p className="text-xs text-signal">
              Telefono, email e link verranno oscurati: mantieni la trattativa in piattaforma con pagamento protetto.
            </p>
          )}
        </div>
      )}
    </Modal>
  );
}

function ReportDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [done, setDone] = useState(false);
  function close() {
    onClose();
    setTimeout(() => setDone(false), 200);
  }
  return (
    <Modal
      open={open}
      onClose={close}
      title="Segnala annuncio"
      footer={
        done ? (
          <button onClick={close} className="btn btn-primary btn-block">Chiudi</button>
        ) : (
          <div className="flex gap-2">
            <button onClick={close} className="btn btn-outline flex-1">Annulla</button>
            <button onClick={() => { setDone(true); notify("Segnalazione inviata al team di moderazione.", "info"); }} className="btn btn-steel flex-1">Invia segnalazione</button>
          </div>
        )
      }
    >
      {done ? (
        <p className="py-4 text-center text-sm text-muted">
          Grazie: la segnalazione è stata inviata al team di moderazione (simulato).
        </p>
      ) : (
        <div className="space-y-3">
          <label className="field-label">Motivo</label>
          <select className="field">
            <option>Descrizione fuorviante</option>
            <option>Prezzo o quantità sospetti</option>
            <option>Possibile duplicato</option>
            <option>Contatti fuori piattaforma</option>
            <option>Altro</option>
          </select>
          <textarea rows={3} placeholder="Dettagli (facoltativo)…" className="field resize-none" />
        </div>
      )}
    </Modal>
  );
}
