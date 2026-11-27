"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { RestaurantCard } from "./Cards";
import { CompareLink } from "./Controls";
import { Notice } from "./Section";
import { cities, cuisines, restaurants } from "@/data/catalog";
import { T, url, type Locale } from "@/lib/i18n";
import { emptyFilters, filterRestaurants, parseFilters, serializeFilters, type Filters } from "@/lib/filters";
import { demoCopy } from "@/lib/demo";

/**
 * Restaurant directory. Filters live in the URL (?q=&city=&cuisine=&level=&max=&rooms=1&sort=),
 * so any result is shareable; typing or choosing updates the list instantly without a page reload.
 */
export function Directory({ locale, forcedCity }: { locale: Locale; forcedCity?: string }) {
  const t = T(locale);
  const sp = useSearchParams();
  const [f, setF] = useState<Filters>(() => parseFilters(sp, forcedCity));
  const [gen, setGen] = useState(0); // remounts the form on reset so every input returns to empty
  const formRef = useRef<HTMLFormElement>(null);
  const results = filterRestaurants(restaurants, f, locale);

  const apply = () => {
    const form = formRef.current;
    if (!form) return;
    const d = new FormData(form);
    const next: Filters = parseFilters(new URLSearchParams([...d.entries()].filter(([, v]) => typeof v === "string" && v !== "").map(([k, v]) => [k, v as string])));
    setF(next);
    const qs = serializeFilters(next);
    window.history.replaceState(null, "", `${url(locale, "restaurants")}${qs ? `?${qs}` : ""}`);
  };
  const reset = () => { setF(emptyFilters); setGen((g) => g + 1); window.history.replaceState(null, "", url(locale, "restaurants")); };
  const sel = (v: string) => ({ value: v });

  return (
    <div className="directory">
      <form key={gen} id="filters" className="filters" ref={formRef} role="search" aria-label={t("Filters", "Filtri")} onSubmit={(e) => { e.preventDefault(); apply(); }} onChange={apply}>
        {/* keyed by the committed filters so “Reset” and URL-driven values refresh the inputs */}
        <label>{t("Search", "Cerca")}<input name="q" defaultValue={f.q} autoComplete="off" /></label>
        <label>{t("City", "Città")}<select name="city" defaultValue={f.city}><option value="">{t("All cities", "Tutte le città")}</option>{cities.map((c) => <option key={c.slug} {...sel(c.slug)}>{c.name[locale]}</option>)}</select></label>
        <label>{t("Cuisine", "Cucina")}<select name="cuisine" defaultValue={f.cuisine}><option value="">{t("All cuisines", "Tutte le cucine")}</option>{cuisines.map((c) => <option key={c.key} {...sel(c.key)}>{c.name[locale]}</option>)}</select></label>
        <label>{t("Demo distinction", "Distinzione dimostrativa")}<select name="level" defaultValue={f.level}><option value="">{t("Any level", "Tutti i livelli")}</option>{["1", "2", "3"].map((n) => <option key={n} {...sel(n)}>{n}</option>)}</select></label>
        <label>{t("Price below (€)", "Prezzo sotto (€)")}<input name="max" type="number" min="1" defaultValue={f.max} /></label>
        <label>{t("Sort", "Ordina")}<select name="sort" defaultValue={f.sort}><option value="">{t("Featured", "In evidenza")}</option><option value="price">{t("Lowest price", "Prezzo crescente")}</option><option value="high">{t("Highest price", "Prezzo decrescente")}</option><option value="name">{t("Name", "Nome")}</option></select></label>
        <label className="row"><input className="check" name="rooms" type="checkbox" value="1" defaultChecked={f.rooms} /> {t("With rooms", "Con camere")}</label>
        <button className="primary">{t("Apply filters", "Applica filtri")}</button>
        <Link className="btn topline" href={url(locale, "restaurants")} onClick={(e) => { e.preventDefault(); reset(); }}>{t("Reset", "Azzera")}</Link>
      </form>
      <div>
        <div className="row">
          <output id="count" aria-live="polite">{results.length} {t("results", "risultati")}</output>
          <CompareLink locale={locale} />
        </div>
        <div className="grid results" id="results">
          {results.length ? results.map((r) => <RestaurantCard key={r.slug} r={r} locale={locale} />) : <Notice>{t("No results. Try removing a filter.", "Nessun risultato. Prova a rimuovere un filtro.")}</Notice>}
        </div>
      </div>
    </div>
  );
}

/** Server-rendered, unfiltered list shown until the client takes over (also what a no-JS visitor sees). */
export function DirectoryFallback({ locale, city }: { locale: Locale; city?: string }) {
  const t = T(locale);
  const list = restaurants.filter((r) => !city || r.city.slug === city);
  return (
    <div className="directory">
      <div className="filters"><p className="muted">{t("Loading filters…", "Caricamento dei filtri…")}</p></div>
      <div><div className="row"><output>{list.length} {t("results", "risultati")}</output></div><div className="grid results">{list.map((r) => <RestaurantCard key={r.slug} r={r} locale={locale} />)}</div></div>
    </div>
  );
}

export const DemoNotice = ({ locale }: { locale: Locale }) => <Notice>{demoCopy(locale).notice}</Notice>;
