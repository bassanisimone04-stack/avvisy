"use client";

import { useId, useMemo, useState } from "react";
import Modal from "./Modal";
import { notify } from "./Toaster";
import { IconCheck, IconShield, IconWallet } from "./icons";
import { commission, commissionRateLabel, formatEuro, formatNumber } from "@/lib/format";
import { orderBreakdown } from "@/lib/services";
import { paymentsEnabled } from "@/lib/stripe/config";
import { useStore } from "@/lib/store";
import type { Lot, Order } from "@/lib/types";

type Ctx =
  | { mode: "buy"; lot: Lot }
  | { mode: "order"; order: Order };

const methods = [
  { key: "card", label: "Carta di credito", icon: "💳", hint: "Visa, Mastercard" },
  { key: "bank", label: "Bonifico bancario", icon: "🏦", hint: "SEPA · 1-2 giorni" },
  { key: "wallet", label: "Saldo Scortvia", icon: "⬡", hint: "Credito simulato" },
];

export default function CheckoutModal({
  ctx,
  open,
  onClose,
}: {
  ctx: Ctx | null;
  open: boolean;
  onClose: () => void;
}) {
  const { dispatch, currentBuyerId } = useStore();
  const uid = useId();

  const lot = ctx?.mode === "buy" ? ctx.lot : undefined;
  const order = ctx?.mode === "order" ? ctx.order : undefined;

  const [qty, setQty] = useState(lot?.minQuantity ?? order?.quantity ?? 1);
  const [method, setMethod] = useState("card");
  const [card, setCard] = useState({ number: "", exp: "", cvc: "", holder: "" });
  const [errors, setErrors] = useState<string[]>([]);
  const [phase, setPhase] = useState<"form" | "processing" | "done" | "created">("form");

  const unitPrice = lot?.unitPrice ?? order?.unitPrice ?? 0;
  const quantity = lot ? qty : order?.quantity ?? 0;
  const b = useMemo(() => orderBreakdown(unitPrice, quantity), [unitPrice, quantity]);

  function reset() {
    setPhase("form");
    setErrors([]);
    setCard({ number: "", exp: "", cvc: "", holder: "" });
    setQty(lot?.minQuantity ?? order?.quantity ?? 1);
    setMethod("card");
  }
  function close() {
    onClose();
    setTimeout(reset, 200);
  }

  function validate(): string[] {
    const e: string[] = [];
    if (lot) {
      if (qty < lot.minQuantity) e.push(`Quantità minima ${lot.minQuantity} ${lot.unit}.`);
      if (qty > lot.quantity) e.push(`Disponibili solo ${lot.quantity} ${lot.unit}.`);
    }
    if (!paymentsEnabled && method === "card") {
      const digits = card.number.replace(/\s/g, "");
      if (digits.length < 15) e.push("Inserisci un numero di carta valido.");
      if (!/^\d{2}\/\d{2}$/.test(card.exp)) e.push("Scadenza nel formato MM/AA.");
      if (card.cvc.length < 3) e.push("CVC non valido.");
      if (!card.holder.trim()) e.push("Inserisci l'intestatario della carta.");
    }
    return e;
  }

  // Pagamento reale tramite Stripe (checkout ospitato).
  async function payWithStripe() {
    const e = validate();
    if (e.length) {
      setErrors(e);
      return;
    }
    setErrors([]);

    // Acquisto immediato: creiamo prima l'ordine (non pagato), poi si paga
    // dalla sezione ordini per evitare disallineamenti.
    if (ctx?.mode === "buy") {
      dispatch({ type: "BUY_NOW", lotId: ctx.lot.id, quantity: qty, buyerId: currentBuyerId });
      setPhase("created");
      return;
    }

    if (ctx?.mode === "order") {
      setPhase("processing");
      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: ctx.order.id }),
        });
        const data = await res.json();
        if (res.ok && data.url) {
          window.location.href = data.url;
          return;
        }
        setErrors([data.error ?? "Impossibile avviare il pagamento."]);
        setPhase("form");
      } catch {
        setErrors(["Errore di rete durante il pagamento."]);
        setPhase("form");
      }
    }
  }

  function pay() {
    const e = validate();
    if (e.length) {
      setErrors(e);
      return;
    }
    setErrors([]);
    setPhase("processing");
    const label =
      method === "card"
        ? `Carta ·· ${card.number.replace(/\s/g, "").slice(-4) || "0000"}`
        : method === "bank"
          ? "Bonifico SEPA"
          : "Saldo Scortvia";
    setTimeout(() => {
      if (ctx?.mode === "buy") {
        dispatch({ type: "CHECKOUT_BUY", lotId: ctx.lot.id, quantity: qty, buyerId: currentBuyerId, method: label });
      } else if (ctx?.mode === "order") {
        dispatch({ type: "PAY_ORDER", orderId: ctx.order.id, method: label });
      }
      setPhase("done");
      notify("Pagamento simulato completato.");
    }, 1500);
  }

  function fmtCard(v: string) {
    return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  }
  function fmtExp(v: string) {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title={phase === "done" ? "Pagamento completato" : phase === "created" ? "Ordine creato" : "Cassa · Scortvia Pay"}
      footer={
        phase === "done" || phase === "created" ? (
          <a href="/compratore/ordini" className="btn btn-primary btn-block">Vai ai tuoi ordini</a>
        ) : phase === "processing" ? (
          <button disabled className="btn btn-primary btn-block opacity-80">Elaborazione…</button>
        ) : (
          <div className="flex gap-2">
            <button onClick={close} className="btn btn-outline flex-1">Annulla</button>
            <button onClick={paymentsEnabled ? payWithStripe : pay} className="btn btn-primary flex-[2]">
              {paymentsEnabled && ctx?.mode === "buy" ? "Crea ordine" : `Paga ${formatEuro(b.total)}`}
            </button>
          </div>
        )
      }
    >
      {phase === "processing" ? (
        <div className="flex flex-col items-center gap-4 py-10 text-center">
          <span className="h-12 w-12 animate-spin rounded-full border-[3px] border-brand-soft border-t-brand" />
          <p className="font-medium text-ink">Elaborazione del pagamento…</p>
          <p className="text-sm text-muted">Comunicazione con il partner di pagamento (simulata).</p>
        </div>
      ) : phase === "done" ? (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <span className="animate-[pop_.5s_ease] inline-flex h-16 w-16 items-center justify-center rounded-full bg-verified-soft text-verified">
            <IconCheck width={32} height={32} />
          </span>
          <p className="font-display text-lg font-bold text-ink">Ordine confermato</p>
          <p className="max-w-xs text-sm text-muted">
            Hai pagato <strong>{formatEuro(b.total)}</strong> (di cui {formatEuro(b.commission)} di
            commissione Scortvia). Nessun addebito reale è stato effettuato.
          </p>
        </div>
      ) : phase === "created" ? (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft text-brand-dark">
            <IconCheck width={32} height={32} />
          </span>
          <p className="font-display text-lg font-bold text-ink">Ordine creato</p>
          <p className="max-w-xs text-sm text-muted">
            Trovi l&apos;ordine nella sezione <strong>Ordini</strong>: da lì completa il pagamento sicuro con Stripe.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {errors.length > 0 && (
            <ul className="space-y-1 rounded-lg bg-danger-soft p-3 text-sm text-danger" role="alert">
              {errors.map((e) => <li key={e}>• {e}</li>)}
            </ul>
          )}

          {/* Riepilogo */}
          <div className="rounded-lg border border-line p-4">
            <p className="text-sm font-semibold text-ink">
              {lot ? lot.title : order?.lotTitle}
            </p>
            {lot && (
              <div className="mt-3 flex items-center gap-2">
                <label htmlFor={`${uid}-q`} className="text-sm text-muted">Quantità</label>
                <input
                  id={`${uid}-q`}
                  type="number"
                  min={lot.minQuantity}
                  max={lot.quantity}
                  value={qty}
                  onChange={(e) => setQty(Math.max(lot.minQuantity, Math.min(lot.quantity, Number(e.target.value) || 0)))}
                  className="field !w-28 !py-1.5"
                />
                <span className="text-sm text-muted">{lot.unit} · {formatEuro(unitPrice)}/{lot.unit}</span>
              </div>
            )}
            <dl className="mt-3 space-y-1.5 border-t border-line pt-3 text-sm">
              <div className="flex justify-between"><dt className="text-muted">Subtotale ({formatNumber(quantity)})</dt><dd className="font-semibold text-ink">{formatEuro(b.subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Commissione ({commissionRateLabel()})</dt><dd className="font-semibold text-ink">{formatEuro(commission(b.subtotal))}</dd></div>
              <div className="flex justify-between border-t border-line pt-1.5"><dt className="font-semibold text-ink">Totale</dt><dd className="font-display text-base font-extrabold text-brand">{formatEuro(b.total)}</dd></div>
            </dl>
          </div>

          {paymentsEnabled ? (
            <div className="rounded-lg border border-line bg-surface-2/50 p-4 text-sm text-ink-soft">
              <p className="flex items-center gap-2 font-semibold text-ink">
                <IconShield width={16} height={16} className="text-verified" /> Pagamento sicuro con Stripe
              </p>
              <p className="mt-1.5">Verrai reindirizzato alla pagina di pagamento protetta di Stripe per completare l&apos;acquisto con carta.</p>
            </div>
          ) : (
          <>
          {/* Metodo */}
          <div>
            <p className="field-label">Metodo di pagamento</p>
            <div className="grid grid-cols-3 gap-2">
              {methods.map((m) => (
                <button
                  key={m.key}
                  onClick={() => setMethod(m.key)}
                  className={`rounded-lg border p-2.5 text-center transition-colors ${method === m.key ? "border-brand bg-brand-soft/40" : "border-line hover:bg-surface-2"}`}
                >
                  <span className="text-lg">{m.icon}</span>
                  <span className="mt-1 block text-[0.72rem] font-semibold text-ink">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form carta */}
          {method === "card" ? (
            <div className="space-y-3">
              <div>
                <label htmlFor={`${uid}-num`} className="field-label">Numero carta</label>
                <input id={`${uid}-num`} inputMode="numeric" value={card.number} onChange={(e) => setCard({ ...card, number: fmtCard(e.target.value) })} placeholder="4242 4242 4242 4242" className="field mono" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label htmlFor={`${uid}-exp`} className="field-label">Scadenza</label>
                  <input id={`${uid}-exp`} inputMode="numeric" value={card.exp} onChange={(e) => setCard({ ...card, exp: fmtExp(e.target.value) })} placeholder="MM/AA" className="field mono" />
                </div>
                <div className="col-span-1">
                  <label htmlFor={`${uid}-cvc`} className="field-label">CVC</label>
                  <input id={`${uid}-cvc`} inputMode="numeric" value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) })} placeholder="123" className="field mono" />
                </div>
                <div className="col-span-1">
                  <label htmlFor={`${uid}-hold`} className="field-label">Intestatario</label>
                  <input id={`${uid}-hold`} value={card.holder} onChange={(e) => setCard({ ...card, holder: e.target.value })} placeholder="Mario Rossi" className="field" />
                </div>
              </div>
              <p className="mono text-xs text-muted">Carta di test: 4242 4242 4242 4242 · qualsiasi scadenza/CVC.</p>
            </div>
          ) : method === "bank" ? (
            <div className="rounded-lg bg-surface-2 p-3 text-sm text-ink-soft">
              Riceverai le coordinate IBAN del deposito. L&apos;ordine si conferma alla ricezione del bonifico (simulato).
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-lg bg-surface-2 p-3 text-sm text-ink-soft">
              <IconWallet width={18} height={18} className="text-brand" /> Addebito sul saldo Scortvia simulato.
            </div>
          )}
          </>
          )}

          <p className="flex items-center gap-1.5 text-xs text-muted">
            <IconShield width={14} height={14} className="text-verified" />
            {paymentsEnabled
              ? "Pagamento protetto elaborato da Stripe."
              : "Pagamento simulato · Scortvia Pay (demo). Nessun dato o addebito reale."}
          </p>
        </div>
      )}
    </Modal>
  );
}
