"use client";

import { useState } from "react";
import { Mail, MapPin, CheckCircle2 } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ name: "Contatti", path: "/contatti" }]} />
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <h1 className="text-3xl font-bold text-ink sm:text-4xl">Contattaci</h1>
          <p className="mt-3 max-w-md text-ink-soft">Hai domande, suggerimenti o vuoi segnalare un&apos;attività? Scrivici, ti risponderemo entro 48 ore lavorative.</p>
          <div className="mt-6 space-y-3 text-sm text-ink-soft">
            <p className="flex items-center gap-2"><Mail size={16} className="text-brand" /> info@glutenfreedirectory.it</p>
            <p className="flex items-center gap-2"><MapPin size={16} className="text-brand" /> Milano, Italia</p>
          </div>
        </div>
        <div className="card card-soft p-6">
          {sent ? (
            <div className="flex items-center gap-2 text-brand-dark"><CheckCircle2 size={20} /> Messaggio inviato, grazie per averci scritto!</div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
              <div>
                <label htmlFor="name" className="field-label">Nome</label>
                <input id="name" className="field" required />
              </div>
              <div>
                <label htmlFor="email" className="field-label">Email</label>
                <input id="email" type="email" className="field" required />
              </div>
              <div>
                <label htmlFor="message" className="field-label">Messaggio</label>
                <textarea id="message" className="field" rows={5} required />
              </div>
              <button type="submit" className="btn btn-primary btn-block">Invia messaggio</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
