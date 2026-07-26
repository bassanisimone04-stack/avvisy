"use client";

import { useState } from "react";
import { Mail, CheckCircle2 } from "lucide-react";

export default function NewsletterForm({ dark = false }: { dark?: boolean }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    setSent(true);
  }

  if (sent) {
    return (
      <div className={`flex items-center gap-2 rounded-full px-5 py-3.5 text-sm font-medium ${dark ? "bg-white/10 text-white" : "bg-brand-soft text-brand-dark"}`}>
        <CheckCircle2 size={18} /> Iscrizione confermata! Controlla la tua casella email.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
      <div className="relative flex-1">
        <Mail size={17} className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 ${dark ? "text-white/60" : "text-muted"}`} />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="La tua email"
          aria-label="Indirizzo email per la newsletter"
          className={`w-full rounded-full py-3 pl-11 pr-4 text-sm outline-none ${dark ? "border border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:border-white/50" : "field"}`}
        />
      </div>
      <button type="submit" className={dark ? "btn btn-accent" : "btn btn-primary"}>
        Iscriviti gratis
      </button>
    </form>
  );
}
