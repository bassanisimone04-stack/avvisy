"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import AccountShell from "@/components/AccountShell";

export default function ReportErrorPage() {
  const [sent, setSent] = useState(false);

  return (
    <AccountShell>
      <h1 className="text-2xl font-bold text-ink">Segnala un errore</h1>
      <p className="mt-1 text-ink-soft">Hai trovato un indirizzo, un orario o un&apos;informazione non corretta? Segnalacelo.</p>

      <div className="card card-soft mt-6 max-w-xl p-6">
        {sent ? (
          <div className="flex items-center gap-2 text-brand-dark"><CheckCircle2 size={20} /> Grazie, la tua segnalazione è stata inviata al nostro team.</div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
            <div>
              <label htmlFor="url" className="field-label">Link della pagina interessata</label>
              <input id="url" className="field" placeholder="https://www.glutenfreedirectory.it/directory/…" />
            </div>
            <div>
              <label htmlFor="tipo" className="field-label">Tipo di errore</label>
              <select id="tipo" className="field">
                <option>Indirizzo o orari non corretti</option>
                <option>Attività chiusa definitivamente</option>
                <option>Informazioni sulla certificazione errate</option>
                <option>Contenuto inappropriato</option>
                <option>Altro</option>
              </select>
            </div>
            <div>
              <label htmlFor="desc" className="field-label">Descrizione</label>
              <textarea id="desc" className="field" rows={4} required placeholder="Descrivi il problema riscontrato…" />
            </div>
            <button type="submit" className="btn btn-primary">Invia segnalazione</button>
          </form>
        )}
      </div>
    </AccountShell>
  );
}
