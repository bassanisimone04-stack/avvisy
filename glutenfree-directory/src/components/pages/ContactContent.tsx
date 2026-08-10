"use client";

import { useState } from "react";
import { Mail, MapPin, CheckCircle2 } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import type { Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionary";

const CONTACT_EMAIL = "info@mappasenzaglutine.it";

export default function ContactContent({ locale }: { locale: Locale }) {
  const [sent, setSent] = useState(false);
  const t = getDictionary(locale);
  const en = locale === "en";

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const message = String(data.get("message") ?? "");
    const subject = en ? `Message from ${name} via the site` : `Messaggio da ${name} tramite il sito`;
    const body = `${message}\n\n${en ? "Reply to" : "Rispondi a"}: ${email}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <div className="container-page py-10">
      <Breadcrumbs locale={locale} items={[{ name: t.footer.contact, path: "/contatti" }]} />
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <h1 className="text-3xl font-bold text-ink sm:text-4xl">{en ? "Contact us" : "Contattaci"}</h1>
          <p className="mt-3 max-w-md text-ink-soft">
            {en ? "Have questions, suggestions or want to report a business? Write to us directly, or use the form below to open a pre-filled email." : "Hai domande, suggerimenti o vuoi segnalare un'attività? Scrivici direttamente, oppure usa il modulo qui sotto per aprire un'email precompilata."}
          </p>
          <div className="mt-6 space-y-3 text-sm text-ink-soft">
            <p className="flex items-center gap-2"><Mail size={16} className="text-brand" /> {CONTACT_EMAIL}</p>
            <p className="flex items-center gap-2"><MapPin size={16} className="text-brand" /> {en ? "Milan, Italy" : "Milano, Italia"}</p>
          </div>
        </div>
        <div className="card card-soft p-6">
          {sent ? (
            <div className="flex items-center gap-2 text-brand-dark"><CheckCircle2 size={20} /> {en ? `We opened your email client with the message ready to send. If nothing opened, write to us directly at ${CONTACT_EMAIL}.` : `Abbiamo aperto il tuo client email con il messaggio pronto da inviare. Se non si è aperto nulla, scrivici direttamente a ${CONTACT_EMAIL}.`}</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="field-label">{en ? "Name" : "Nome"}</label>
                <input id="name" name="name" className="field" required />
              </div>
              <div>
                <label htmlFor="email" className="field-label">Email</label>
                <input id="email" name="email" type="email" className="field" required />
              </div>
              <div>
                <label htmlFor="message" className="field-label">{en ? "Message" : "Messaggio"}</label>
                <textarea id="message" name="message" className="field" rows={5} required />
              </div>
              <button type="submit" className="btn btn-primary btn-block">{en ? "Open email to send" : "Apri email per inviare"}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
