"use client";

import { useState } from "react";
import { contactAction } from "@/app/actions";
import { useFormAction } from "./useFormAction";

const RISKY = /(caparra|anticip|acconto|bonifico|ricarica|postepay|western union|paypal|iban|quota|fee)/i;

export function ContactForm({ listingId }: { listingId: number }) {
  const { state, onSubmit, pending } = useFormAction(contactAction);
  const [text, setText] = useState("");
  if (state?.ok) return <div className="alert alert-ok">{state.ok}</div>;
  return (
    <form onSubmit={onSubmit} className="stack">
      <input type="hidden" name="listingId" value={listingId} />
      <div className="field">
        <label htmlFor="msg">Messaggio all&apos;inserzionista</label>
        <textarea id="msg" name="message" required minLength={10} maxLength={2000} value={text} onChange={(e) => setText(e.target.value)} placeholder="Presentati brevemente: chi sei, per quanto tempo cerchi, quando potresti entrare." />
      </div>
      {RISKY.test(text) && (
        <div className="alert alert-danger">
          <strong>Attenzione ai pagamenti anticipati</strong>
          Se ti hanno chiesto soldi prima della visita, non pagare e segnalacelo: nessun pagamento è mai dovuto per vedere una casa.
        </div>
      )}
      {state?.error && <div className="alert alert-danger">{state.error}</div>}
      <button className="btn" type="submit" disabled={pending}>
        {pending ? "Invio…" : "Invia messaggio"}
      </button>
    </form>
  );
}
