"use client";

import { useState } from "react";
import { CheckCircle2, Store, TrendingUp, Users } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function BusinessOnboardingPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ name: "Per le aziende", path: "/per-le-aziende" }]} />
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <h1 className="text-3xl font-bold text-ink sm:text-4xl">Inserisci la tua attività</h1>
          <p className="mt-3 text-ink-soft">Raggiungi migliaia di persone celiache che cercano ogni giorno locali sicuri nella tua zona.</p>
          <div className="mt-6 space-y-4">
            {[
              { icon: Store, title: "Scheda gratuita", body: "Pubblica la scheda della tua attività con foto, menu e orari senza costi di attivazione." },
              { icon: Users, title: "Community qualificata", body: "Visibilità diretta verso utenti celiaci realmente interessati alla tua offerta." },
              { icon: TrendingUp, title: "Crescita misurabile", body: "Statistiche su visualizzazioni, click e recensioni per monitorare i risultati." },
            ].map((item) => (
              <div key={item.title} className="flex gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-dark"><item.icon size={18} /></span>
                <div>
                  <p className="font-semibold text-ink">{item.title}</p>
                  <p className="text-sm text-ink-soft">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card card-soft p-6">
          {sent ? (
            <div className="flex items-center gap-2 text-brand-dark"><CheckCircle2 size={20} /> Richiesta inviata! Il nostro team verificherà i requisiti entro 3 giorni lavorativi.</div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
              <div>
                <label htmlFor="ragione" className="field-label">Nome attività</label>
                <input id="ragione" className="field" required />
              </div>
              <div>
                <label htmlFor="categoria" className="field-label">Categoria</label>
                <select id="categoria" className="field">
                  <option>Ristorante</option>
                  <option>Pizzeria</option>
                  <option>Hotel</option>
                  <option>Farmacia</option>
                  <option>Supermercato</option>
                  <option>Negozio specializzato</option>
                </select>
              </div>
              <div>
                <label htmlFor="citta" className="field-label">Città</label>
                <input id="citta" className="field" required />
              </div>
              <div>
                <label htmlFor="email" className="field-label">Email di contatto</label>
                <input id="email" type="email" className="field" required />
              </div>
              <button type="submit" className="btn btn-primary btn-block">Richiedi l&apos;inserimento</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
