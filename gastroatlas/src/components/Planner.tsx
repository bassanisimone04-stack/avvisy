"use client";

import { useState } from "react";
import { RestaurantCard } from "./Cards";
import { Notice } from "./Section";
import { cities, restaurants } from "@/data/catalog";
import { T, money, type Locale } from "@/lib/i18n";
import { demoCopy } from "@/lib/demo";

type Plan = { city: string; date: string; guests: number; options: typeof restaurants };

/** Draft itinerary from the demo catalogue: destination, guests, budget per guest and an optional date. */
export function Planner({ locale }: { locale: Locale }) {
  const t = T(locale);
  const [plan, setPlan] = useState<Plan | null>(null);
  return (
    <>
      <p className="lead">{t("Build a draft from the demo catalogue. Final prices and availability require independent confirmation.", "Crea una bozza dal catalogo demo. Prezzi finali e disponibilità vanno verificati separatamente.")}</p>
      <form id="planner" className="details" onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const city = cities.find((c) => c.slug === f.get("city")) ?? cities[0]!;
        const budget = Number(f.get("budget"));
        const date = String(f.get("date") ?? "");
        setPlan({ city: city.name[locale], guests: Number(f.get("guests")), date: date ? new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`)) : "", options: restaurants.filter((r) => r.city === city && r.price <= budget).sort((a, b) => a.price - b.price) });
      }}>
        <div className="row">
          <label>{t("Destination", "Destinazione")}<select name="city">{cities.map((c) => <option key={c.slug} value={c.slug}>{c.name[locale]}</option>)}</select></label>
          <label>{t("Guests", "Ospiti")}<input type="number" min="1" max="20" name="guests" defaultValue={2} required /></label>
          <label>{t("Budget per guest (€)", "Budget a persona (€)")}<input type="number" min="1" max="10000" name="budget" defaultValue={150} required /></label>
          <label>{t("Date (optional)", "Data (facoltativa)")}<input type="date" name="date" /></label>
        </div>
        <button className="primary">{t("Build itinerary", "Crea itinerario")}</button>
      </form>
      <section id="plan-results" aria-live="polite">
        {plan && <>
          <h2>{plan.city}{plan.date ? ` · ${plan.date}` : ""}</h2>
          <Notice>{demoCopy(locale).notice}</Notice>
          {plan.options.length ? <div className="grid">{plan.options.map((r) => <div key={r.slug}><RestaurantCard r={r} locale={locale} /><p>{t("Illustrative group total", "Totale indicativo per il gruppo")}: {money(r.price * plan.guests, locale)}</p></div>)}</div> : <Notice>{t("No demo options within this budget.", "Nessuna proposta demo per questo budget.")}</Notice>}
        </>}
      </section>
    </>
  );
}
