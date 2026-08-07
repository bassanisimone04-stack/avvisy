"use client";

import { useState } from "react";
import { Mail, MapPin, CheckCircle2 } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import type { Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionary";

export default function ContactContent({ locale }: { locale: Locale }) {
  const [sent, setSent] = useState(false);
  const t = getDictionary(locale);
  const en = locale === "en";

  return (
    <div className="container-page py-10">
      <Breadcrumbs locale={locale} items={[{ name: t.footer.contact, path: "/contatti" }]} />
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <h1 className="text-3xl font-bold text-ink sm:text-4xl">{en ? "Contact us" : "Contattaci"}</h1>
          <p className="mt-3 max-w-md text-ink-soft">
            {en ? "Have questions, suggestions or want to report a business? Write to us, we'll reply within 48 business hours." : "Hai domande, suggerimenti o vuoi segnalare un'attività? Scrivici, ti risponderemo entro 48 ore lavorative."}
          </p>
          <div className="mt-6 space-y-3 text-sm text-ink-soft">
            <p className="flex items-center gap-2"><Mail size={16} className="text-brand" /> info@mappasenzaglutine.it</p>
            <p className="flex items-center gap-2"><MapPin size={16} className="text-brand" /> {en ? "Milan, Italy" : "Milano, Italia"}</p>
          </div>
        </div>
        <div className="card card-soft p-6">
          {sent ? (
            <div className="flex items-center gap-2 text-brand-dark"><CheckCircle2 size={20} /> {en ? "Message sent, thanks for writing to us!" : "Messaggio inviato, grazie per averci scritto!"}</div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
              <div>
                <label htmlFor="name" className="field-label">{en ? "Name" : "Nome"}</label>
                <input id="name" className="field" required />
              </div>
              <div>
                <label htmlFor="email" className="field-label">Email</label>
                <input id="email" type="email" className="field" required />
              </div>
              <div>
                <label htmlFor="message" className="field-label">{en ? "Message" : "Messaggio"}</label>
                <textarea id="message" className="field" rows={5} required />
              </div>
              <button type="submit" className="btn btn-primary btn-block">{en ? "Send message" : "Invia messaggio"}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
