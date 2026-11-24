"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MapPin, BadgeCheck, Heart } from "lucide-react";
import type { Business } from "@/lib/types";
import { CATEGORIES, categoryLabelPlural } from "@/lib/categories";
import { PIN_COLORS } from "@/lib/map-colors";
import { cityName } from "@/lib/i18n/place-names";
import { localeHref } from "@/lib/i18n/locale";
import { useDictionary } from "@/lib/i18n/useLocale";
import { tf } from "@/lib/i18n/dictionary";

import InteractiveMap from "./LazyInteractiveMap";

/**
 * Mappa dei risultati correnti della directory: mostra tutte le attività che
 * passano i filtri attivi, non solo quelle della pagina visibile, così il
 * filtro "Certificati AIC" produce davvero la mappa dei locali certificati.
 */
export default function DirectoryMap({ businesses }: { businesses: Business[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const { locale, t } = useDictionary();
  const active = businesses.find((b) => b.id === activeId);

  // Legenda: solo i tipi presenti tra i risultati, con il colore del loro pin.
  const legend = useMemo(() => {
    const counts = new Map<string, number>();
    for (const b of businesses) counts.set(b.category, (counts.get(b.category) ?? 0) + 1);
    return CATEGORIES.filter((c) => counts.has(c.slug)).map((c) => ({ slug: c.slug, label: categoryLabelPlural(c, locale), n: counts.get(c.slug) ?? 0 }));
  }, [businesses, locale]);

  if (businesses.length === 0) return null;

  return (
    <div className="card card-soft mb-8 overflow-hidden">
      <div className="relative aspect-[16/10] bg-brand-soft sm:aspect-[21/9]">
        <InteractiveMap businesses={businesses} activeId={activeId} onSelect={setActiveId} locale={locale} />
        <ul className="pointer-events-none absolute bottom-3 left-3 z-[500] flex max-w-[70%] flex-wrap gap-1.5">
          {legend.map((l) => (
            <li key={l.slug} className="flex items-center gap-1.5 rounded-full bg-surface/90 px-2.5 py-1 text-[11px] font-medium text-ink shadow-sm backdrop-blur">
              <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full ring-1 ring-white/70" style={{ background: PIN_COLORS[l.slug] }} />
              {l.label} · {l.n}
            </li>
          ))}
        </ul>
        <p className="pointer-events-none absolute bottom-3 right-3 z-[500] rounded-full bg-surface/90 px-3 py-1 text-[11px] font-medium text-ink shadow-sm backdrop-blur">
          {tf(t.map.caption, { n: businesses.length })}
        </p>
      </div>

      {active && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line p-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="truncate font-semibold text-ink">{active.name}</h2>
              {active.aicCertified ? (
                <span className="chip chip-brand shrink-0"><BadgeCheck size={12} /> AIC</span>
              ) : (
                <span className="chip shrink-0 text-accent-dark" style={{ background: "var(--gf-accent-soft)" }}>
                  <Heart size={12} /> {t.business.communityVerifiedShort}
                </span>
              )}
            </div>
            <p className="mt-1 flex items-center gap-1 truncate text-sm text-muted">
              <MapPin size={13} /> {active.address}, {cityName(active.city, locale)}
            </p>
          </div>
          <Link href={localeHref(locale, `/directory/${active.slug}`)} className="btn btn-primary shrink-0">
            {t.map.viewBusiness}
          </Link>
        </div>
      )}
    </div>
  );
}
