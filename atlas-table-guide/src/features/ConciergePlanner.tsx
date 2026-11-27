"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Plan } from "@/lib/concierge";
import { formatMoney } from "@/lib/price";
import { Notice } from "@/components/ui/ui";
import { tx } from "@/i18n";
import { ShareButton } from "./ItineraryTools";

type Opt = { value: string; label: string };
const field = "min-h-11 w-full rounded-[8px] border border-line bg-white px-3 text-sm";

export function ConciergePlanner({ locale, cities, cuisines, llmConfigured, initial, labels }: { locale: string; cities: Opt[]; cuisines: Opt[]; llmConfigured: boolean; initial: { destination?: string; restaurant?: string }; labels: { share: string; copied: string } }) {
  const T = (en: string, it: string) => tx(locale, en, it);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get("destination")) void run(Object.fromEntries(p.entries()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  async function run(v: Record<string, string>) {
    setStatus("loading");
    try {
      const body = { destination: v.destination, days: Number(v.days ?? 2), guests: Number(v.guests ?? 2), budgetPerPersonEUR: v.budget ? Number(v.budget) : undefined, cuisine: v.cuisine || undefined, dietary: (v.dietary ?? "").split(",").filter(Boolean), minRecognition: v.rec ? Number(v.rec) : undefined, hotel: v.hotel === "1" || v.hotel === "on", occasion: v.occasion || undefined, restaurant: v.restaurant || undefined, locale };
      const res = await fetch("/api/concierge/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error(String(res.status));
      const j = (await res.json()) as { plan: Plan };
      setPlan(j.plan); setStatus("idle"); setSaved(false);
    } catch { setStatus("error"); }
  }
  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <form className="space-y-3 rounded-[12px] border border-line bg-white p-5 lg:col-span-4" onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const v: Record<string, string> = {};
        for (const [k, val] of fd.entries()) v[k] = k === "dietary" ? [v[k], String(val)].filter(Boolean).join(",") : String(val);
        const qs = new URLSearchParams(v);
        window.history.replaceState(null, "", `?${qs}`);
        void run(v);
      }}>
        <div><label htmlFor="c-dest" className="mb-1 block text-sm font-semibold">{T("Destination", "Destinazione")}</label><select id="c-dest" name="destination" required defaultValue={initial.destination ?? ""} className={field}><option value="" disabled>—</option>{cities.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}</select></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label htmlFor="c-days" className="mb-1 block text-sm font-semibold">{T("Days", "Giorni")}</label><input id="c-days" name="days" type="number" min={1} max={7} defaultValue={2} className={field} /></div>
          <div><label htmlFor="c-guests" className="mb-1 block text-sm font-semibold">{T("Guests", "Ospiti")}</label><input id="c-guests" name="guests" type="number" min={1} max={12} defaultValue={2} className={field} /></div>
        </div>
        <div><label htmlFor="c-budget" className="mb-1 block text-sm font-semibold">{T("Max per meal per person (€)", "Massimo a pasto a persona (€)")}</label><input id="c-budget" name="budget" type="number" min={0} step={10} className={field} /></div>
        <div><label htmlFor="c-cuisine" className="mb-1 block text-sm font-semibold">{T("Cuisine", "Cucina")}</label><select id="c-cuisine" name="cuisine" className={field} defaultValue=""><option value="">{T("Any", "Qualsiasi")}</option>{cuisines.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}</select></div>
        <fieldset><legend className="mb-1 text-sm font-semibold">{T("Dietary", "Alimentazione")}</legend><div className="flex flex-wrap gap-x-4">{[["vegetarian", T("Vegetarian", "Vegetariano")], ["vegan", T("Vegan", "Vegano")], ["glutenFree", T("Gluten-free", "Senza glutine")]].map(([v, l]) => <label key={v} className="inline-flex min-h-9 items-center gap-2 text-sm"><input type="checkbox" name="dietary" value={v} className="h-4 w-4 accent-[var(--red-600)]" />{l}</label>)}</div></fieldset>
        <div><label htmlFor="c-rec" className="mb-1 block text-sm font-semibold">{T("Minimum recognition level", "Livello minimo di riconoscimento")}</label><select id="c-rec" name="rec" className={field} defaultValue=""><option value="">{T("Any", "Qualsiasi")}</option><option value="1">1+</option><option value="2">2+</option><option value="3">3</option></select></div>
        <label className="flex min-h-9 items-center gap-2 text-sm"><input type="checkbox" name="hotel" value="1" defaultChecked className="h-4 w-4 accent-[var(--red-600)]" />{T("Include a hotel", "Includi un hotel")}</label>
        <div><label htmlFor="c-occ" className="mb-1 block text-sm font-semibold">{T("Occasion", "Occasione")}</label><input id="c-occ" name="occasion" maxLength={80} className={field} placeholder={T("Anniversary, business dinner…", "Anniversario, cena di lavoro…")} /></div>
        {initial.restaurant && <input type="hidden" name="restaurant" value={initial.restaurant} />}
        <button type="submit" disabled={status === "loading"} className="min-h-11 w-full rounded-[8px] bg-carmine text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">{status === "loading" ? T("Planning…", "Sto pianificando…") : T("Plan my trip", "Pianifica il mio viaggio")}</button>
        <p className="text-xs text-stone">{llmConfigured ? T("AI-assisted: the assistant may only choose from records in our database.", "Con assistenza AI: l'assistente può scegliere solo tra le schede del nostro database.") : T("AI concierge not configured — using our rule-based planner over the same data.", "Concierge AI non configurato: uso il nostro pianificatore a regole sugli stessi dati.")}</p>
      </form>
      <div className="lg:col-span-8" aria-live="polite">
        {status === "error" && <Notice tone="error">{T("The planner is temporarily unavailable. Please try again.", "Il pianificatore non è al momento disponibile. Riprova.")}</Notice>}
        {!plan && status !== "error" && <div className="grid h-full min-h-48 place-items-center rounded-[12px] border border-dashed border-line p-8 text-center text-stone">{T("Choose a destination to build a draft plan.", "Scegli una destinazione per creare una bozza di piano.")}</div>}
        {plan && (
          <div className="rounded-[12px] border border-line bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-serif text-2xl">{plan.title}</h2>
              <div className="no-print flex gap-2">
                <button type="button" onClick={() => { try { localStorage.setItem("atg:plans", JSON.stringify([{ at: new Date().toISOString(), url: window.location.href, plan }, ...JSON.parse(localStorage.getItem("atg:plans") ?? "[]")].slice(0, 10))); setSaved(true); } catch { /* storage unavailable */ } }} className="min-h-11 rounded-[8px] border border-line px-4 text-sm font-semibold hover:border-carmine">{saved ? T("Saved", "Salvato") : T("Save", "Salva")}</button>
                <ShareButton label={labels.share} copied={labels.copied} title={plan.title} />
                <button type="button" onClick={() => window.print()} className="min-h-11 rounded-[8px] border border-line px-4 text-sm font-semibold hover:border-carmine">PDF</button>
              </div>
            </div>
            <ul className="mt-3 space-y-1">{plan.caveats.map((c) => <li key={c} className="text-sm text-stone">• {c}</li>)}</ul>
            <ol className="mt-4 divide-y divide-line">
              {plan.items.map((i) => (
                <li key={`${i.day}-${i.time}-${i.slug}`} className="flex gap-4 py-3">
                  <span className="w-20 shrink-0 text-sm font-semibold">{T("Day", "Giorno")} {i.day}<br /><span className="font-normal text-stone">{i.time}</span></span>
                  <div className="min-w-0 flex-1"><Link href={i.path} className="font-semibold underline-offset-4 hover:underline">{i.name}</Link><p className="text-sm text-stone">{i.note}</p></div>
                  <span className="shrink-0 text-sm">{i.estimateEUR != null ? `≈ ${formatMoney(Math.round(i.estimateEUR), "EUR", locale)}` : "—"}</span>
                </li>
              ))}
            </ol>
            {plan.totalEstimateEUR != null && <p className="mt-3 border-t border-line pt-3 text-right text-sm">{T("Estimated total per person", "Totale stimato a persona")}: <strong>≈ {formatMoney(plan.totalEstimateEUR, "EUR", locale)}</strong> <span className="text-stone">({T("estimate", "stima")})</span></p>}
          </div>
        )}
      </div>
    </div>
  );
}
