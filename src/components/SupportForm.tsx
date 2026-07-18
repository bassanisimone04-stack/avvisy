"use client";

import { useState } from "react";
import { notify } from "./Toaster";
import { IconCheck } from "./icons";

export default function SupportForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand-dark">
          <IconCheck width={24} height={24} />
        </span>
        <p className="font-semibold text-ink">Richiesta inviata</p>
        <p className="max-w-sm text-sm text-muted">
          Il nostro team di assistenza (simulato) ti risponderà entro un giorno
          lavorativo all&apos;indirizzo indicato.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
        notify("Richiesta di assistenza inviata.");
      }}
      className="space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label">Nome e cognome</label>
          <input required className="field" placeholder="Mario Rossi" />
        </div>
        <div>
          <label className="field-label">Email aziendale</label>
          <input required type="email" className="field" placeholder="nome@azienda.it" />
        </div>
      </div>
      <div>
        <label className="field-label">Argomento</label>
        <select className="field">
          <option>Verifica azienda</option>
          <option>Pubblicazione lotto</option>
          <option>Offerte e ordini</option>
          <option>Pagamenti e commissioni</option>
          <option>Altro</option>
        </select>
      </div>
      <div>
        <label className="field-label">Messaggio</label>
        <textarea required rows={4} className="field resize-none" placeholder="Descrivi la tua richiesta…" />
      </div>
      <button type="submit" className="btn btn-primary btn-block">
        Invia richiesta
      </button>
    </form>
  );
}
