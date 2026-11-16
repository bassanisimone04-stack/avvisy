"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MapPin, BadgeCheck } from "lucide-react";
import type { Business } from "@/lib/types";
import { getCategoryInfo, categoryLabel } from "@/lib/categories";
import { cityName } from "@/lib/i18n/place-names";
import { localeHref, type Locale } from "@/lib/i18n/locale";

import InteractiveMap from "./LazyInteractiveMap";

type TypeFilter = "tutti" | "ristorante" | "pizzeria";

/**
 * Mappa interattiva dei soli ristoranti e pizzerie aderenti al programma AIC.
 * L'elenco arriva già filtrato dal server (solo aicCertified): qui si possono
 * restringere città e tipo, e la mappa si riadatta ai locali rimasti.
 */
export default function AicRestaurantsMap({ businesses, locale }: { businesses: Business[]; locale: Locale }) {
  const en = locale === "en";
  const [type, setType] = useState<TypeFilter>("tutti");
  const [city, setCity] = useState<string>("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [focusId, setFocusId] = useState<string | null>(null);

  const byType = useMemo(() => businesses.filter((b) => type === "tutti" || b.category === type), [businesses, type]);

  const cityCounts = useMemo(() => {
    const m = new Map<string, number>();
    for (const b of byType) m.set(b.city, (m.get(b.city) ?? 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [byType]);

  // Se il filtro tipo svuota la città scelta, si torna a "tutte".
  const effectiveCity = cityCounts.some(([c]) => c === city) ? city : "";
  const visible = useMemo(
    () =>
      byType
        .filter((b) => !effectiveCity || b.city === effectiveCity)
        .sort((a, b) => a.city.localeCompare(b.city) || a.name.localeCompare(b.name)),
    [byType, effectiveCity],
  );

  const countOf = (t: TypeFilter) => businesses.filter((b) => t === "tutti" || b.category === t).length;
  const typeOptions: { id: TypeFilter; label: string }[] = [
    { id: "tutti", label: en ? "All" : "Tutti" },
    { id: "ristorante", label: en ? "Restaurants" : "Ristoranti" },
    { id: "pizzeria", label: en ? "Pizzerias" : "Pizzerie" },
  ];

  const chip = (selected: boolean) => `chip ${selected ? "chip-brand" : "chip-neutral"}`;

  return (
    <section aria-label={en ? "Interactive map of AIC restaurants" : "Mappa interattiva dei ristoranti AIC"}>
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label={en ? "Venue type" : "Tipo di locale"}>
        {typeOptions.map((o) => (
          <button key={o.id} type="button" aria-pressed={type === o.id} onClick={() => setType(o.id)} className={chip(type === o.id)}>
            {o.label} ({countOf(o.id)})
          </button>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2" role="group" aria-label={en ? "City" : "Città"}>
        <button type="button" aria-pressed={effectiveCity === ""} onClick={() => setCity("")} className={chip(effectiveCity === "")}>
          {en ? "All cities" : "Tutte le città"} ({byType.length})
        </button>
        {cityCounts.map(([c, n]) => (
          <button key={c} type="button" aria-pressed={effectiveCity === c} onClick={() => setCity(c)} className={chip(effectiveCity === c)}>
            {cityName(c, locale)} ({n})
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="card card-soft relative aspect-[4/3] overflow-hidden bg-brand-soft lg:aspect-auto lg:min-h-[520px]">
          <InteractiveMap businesses={visible} activeId={activeId} onSelect={setActiveId} focusId={focusId} />
          <p className="pointer-events-none absolute bottom-3 right-3 z-[500] rounded-full bg-white/85 px-3 py-1 text-[11px] text-ink-soft backdrop-blur">
            {en ? `${visible.length} AIC venues on the map` : `${visible.length} locali AIC sulla mappa`}
          </p>
        </div>

        <ul className="card card-soft max-h-[520px] divide-y divide-line overflow-y-auto" aria-live="polite">
          {visible.map((b) => {
            const cat = getCategoryInfo(b.category);
            const selected = b.id === activeId;
            return (
              <li key={b.id} className={selected ? "bg-brand-soft" : ""}>
                <button
                  type="button"
                  onClick={() => {
                    setActiveId(b.id);
                    setFocusId(b.id);
                  }}
                  onMouseEnter={() => setActiveId(b.id)}
                  className="block w-full p-4 text-left"
                  aria-label={`${b.name}, ${cityName(b.city, locale)}`}
                >
                  <span className="flex items-start justify-between gap-2">
                    <span className="min-w-0">
                      <span className="eyebrow block">{cat ? categoryLabel(cat, locale) : ""}</span>
                      <span className="mt-0.5 block font-semibold text-ink">{b.name}</span>
                    </span>
                    <span className="chip chip-brand shrink-0"><BadgeCheck size={12} /> AIC</span>
                  </span>
                  <span className="mt-1 flex items-center gap-1 text-sm text-muted">
                    <MapPin size={13} className="shrink-0" /> {b.address}, {cityName(b.city, locale)}
                  </span>
                </button>
                {selected && (
                  <div className="px-4 pb-4">
                    <p className="text-sm leading-relaxed text-ink-soft">{b.shortDescription}</p>
                    <Link href={localeHref(locale, `/directory/${b.slug}`)} className="btn btn-primary mt-3">
                      {en ? "View listing" : "Vai alla scheda"}
                    </Link>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
