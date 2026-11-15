"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import type { Locale } from "@/lib/i18n/locale";

const CONTACT_EMAIL = "info@mappasenzaglutine.it";

/** Invio via email (stesso schema della pagina Contatti): nessun dato passa dal sito. */
export default function StoryForm({ locale }: { locale: Locale }) {
  const en = locale === "en";
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const subject = en ? "My story for Mappa Senza Glutine" : "La mia storia per Mappa Senza Glutine";
    const body = [
      `${en ? "Name to show" : "Nome da mostrare"}: ${d.get("name") ?? ""}`,
      `${en ? "Venue" : "Locale"}: ${d.get("venue") ?? ""}`,
      "",
      String(d.get("story") ?? ""),
      "",
      en
        ? "I confirm that the text and any attached photos are mine and I allow Mappa Senza Glutine to publish them."
        : "Confermo che il testo e le eventuali foto allegate sono miei e autorizzo Mappa Senza Glutine a pubblicarli.",
    ].join("\n");
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  if (sent) {
    return (
      <div className="card card-soft flex items-start gap-3 p-6 text-sm text-ink-soft">
        <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-brand" />
        <p>
          {en
            ? "Your email app should have opened with the message ready. If you want to add photos, attach them there before sending."
            : "Dovrebbe essersi aperta la tua app di posta con il messaggio pronto. Se vuoi aggiungere foto, allegale lì prima di inviare."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card card-soft space-y-4 p-6">
      <div>
        <label className="field-label" htmlFor="s-name">{en ? "Name to show (first name or initial)" : "Nome da mostrare (nome o iniziale)"}</label>
        <input id="s-name" name="name" className="field" required maxLength={40} />
      </div>
      <div>
        <label className="field-label" htmlFor="s-venue">{en ? "Venue you tried (optional)" : "Locale che hai provato (facoltativo)"}</label>
        <input id="s-venue" name="venue" className="field" maxLength={80} />
      </div>
      <div>
        <label className="field-label" htmlFor="s-story">{en ? "Your story" : "La tua storia"}</label>
        <textarea id="s-story" name="story" className="field min-h-36" required maxLength={2000} />
      </div>
      <label className="flex items-start gap-2 text-sm text-ink-soft">
        <input type="checkbox" required className="mt-1 h-4 w-4 accent-[var(--gf-brand)]" />
        {en
          ? "The text and any photos are mine, and I allow Mappa Senza Glutine to publish them with the name above."
          : "Il testo e le eventuali foto sono miei e autorizzo Mappa Senza Glutine a pubblicarli con il nome indicato."}
      </label>
      <button type="submit" className="btn btn-primary">{en ? "Prepare the email" : "Prepara l'email"}</button>
    </form>
  );
}
