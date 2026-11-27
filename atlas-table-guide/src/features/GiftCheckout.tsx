"use client";

import { useState } from "react";
import { Notice } from "@/components/ui/ui";
import { tx } from "@/i18n";

type Card = { slug: string; name: string; values: number[]; currency: string };
const field = "min-h-11 w-full rounded-[8px] border border-line bg-white px-3 text-sm";

/** Gift-card form → Stripe Checkout (TEST MODE). Redirects to Stripe; nothing is charged for real. */
export function GiftCheckout({ locale, cards }: { locale: string; cards: Card[] }) {
  const T = (en: string, it: string) => tx(locale, en, it);
  const [card, setCard] = useState(cards[0]?.slug ?? "");
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const current = cards.find((c) => c.slug === card);
  return (
    <form className="space-y-3" onSubmit={async (e) => {
      e.preventDefault();
      setState("loading");
      const fd = new FormData(e.currentTarget);
      try {
        const res = await fetch("/api/checkout/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...Object.fromEntries(fd.entries()), locale }) });
        const j = (await res.json()) as { url?: string };
        if (!res.ok || !j.url) throw new Error();
        window.location.href = j.url;
      } catch { setState("error"); }
    }}>
      <div><label htmlFor="g-card" className="mb-1 block text-sm font-semibold">{T("Gift card", "Gift card")}</label>
        <select id="g-card" name="card" value={card} onChange={(e) => setCard(e.target.value)} className={field}>{cards.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label htmlFor="g-value" className="mb-1 block text-sm font-semibold">{T("Value", "Importo")}</label>
          <select id="g-value" name="value" className={field}>{current?.values.map((v) => <option key={v} value={v}>{v} {current.currency}</option>)}</select></div>
        <div><label htmlFor="g-design" className="mb-1 block text-sm font-semibold">{T("Design", "Grafica")}</label>
          <select id="g-design" name="design" className={field}><option value="carmine">Carmine</option><option value="garnet">Garnet</option><option value="ivory">Ivory</option></select></div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><label htmlFor="g-name" className="mb-1 block text-sm font-semibold">{T("Your name", "Il tuo nome")}</label><input id="g-name" name="name" autoComplete="name" className={field} /></div>
        <div><label htmlFor="g-email" className="mb-1 block text-sm font-semibold">{T("Your email", "La tua email")} *</label><input id="g-email" name="email" type="email" required autoComplete="email" className={field} /></div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><label htmlFor="g-rec" className="mb-1 block text-sm font-semibold">{T("Recipient's name", "Nome del destinatario")}</label><input id="g-rec" name="recipient" className={field} /></div>
        <div><label htmlFor="g-date" className="mb-1 block text-sm font-semibold">{T("Delivery date", "Data di consegna")}</label><input id="g-date" name="delivery_date" type="date" className={field} /></div>
      </div>
      <div><label htmlFor="g-msg" className="mb-1 block text-sm font-semibold">{T("Message for the recipient", "Messaggio per il destinatario")}</label><textarea id="g-msg" name="message" rows={3} maxLength={400} className={`${field} py-2`} /></div>
      <button type="submit" disabled={state === "loading"} className="inline-flex min-h-11 items-center rounded-[8px] bg-carmine px-5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">{state === "loading" ? T("Redirecting…", "Reindirizzamento…") : T("Continue to test checkout", "Continua al pagamento di prova")}</button>
      {state === "error" && <Notice tone="error">{T("Checkout is temporarily unavailable. Nothing was charged.", "Il pagamento non è al momento disponibile. Non è stato addebitato nulla.")}</Notice>}
    </form>
  );
}
