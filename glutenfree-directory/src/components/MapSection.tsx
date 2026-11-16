"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, BadgeCheck, Heart } from "lucide-react";
import type { Business } from "@/lib/types";
import { getCategoryInfo, categoryLabel } from "@/lib/categories";
import { cityName } from "@/lib/i18n/place-names";
import { localeHref } from "@/lib/i18n/locale";
import { useDictionary } from "@/lib/i18n/useLocale";
import { tf } from "@/lib/i18n/dictionary";
import RatingStars from "./RatingStars";

import InteractiveMap from "./LazyInteractiveMap";

export default function MapSection({ businesses }: { businesses: Business[] }) {
  const [activeId, setActiveId] = useState<string | null>(businesses[0]?.id ?? null);
  const active = businesses.find((b) => b.id === activeId);
  const { locale, t } = useDictionary();

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div className="card card-soft relative aspect-[4/5] max-h-[520px] overflow-hidden bg-brand-soft sm:aspect-[5/4] lg:aspect-auto">
        <InteractiveMap businesses={businesses} activeId={activeId} onSelect={setActiveId} />
        <p className="pointer-events-none absolute bottom-3 right-3 z-[500] rounded-full bg-white/85 px-3 py-1 text-[11px] text-ink-soft backdrop-blur">
          {tf(t.map.caption, { n: businesses.length })}
        </p>
      </div>

      <div className="card card-soft flex flex-col p-5">
        {active ? (
          <>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="eyebrow">{(() => { const c = getCategoryInfo(active.category); return c ? categoryLabel(c, locale) : ""; })()}</p>
                <h3 className="mt-1 text-lg font-semibold text-ink">{active.name}</h3>
              </div>
              {active.aicCertified ? (
                <span className="chip chip-brand shrink-0"><BadgeCheck size={12} /> AIC</span>
              ) : (
                <span className="chip shrink-0 text-accent-dark" style={{ background: "var(--gf-accent-soft)" }}><Heart size={12} /> {t.business.communityVerified}</span>
              )}
            </div>
            <p className="mt-2 flex items-center gap-1 text-sm text-muted">
              <MapPin size={14} /> {active.address}, {cityName(active.city, locale)} ({active.provinceCode})
            </p>
            <div className="mt-2 flex items-center gap-2">
              <RatingStars rating={active.rating} />
              <span className="text-sm text-muted">{active.rating} · {active.reviewCount} {t.common.reviews}</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">{active.shortDescription}</p>
            <Link href={localeHref(locale, `/directory/${active.slug}`)} className="btn btn-primary mt-auto self-start">
              {t.map.viewBusiness}
            </Link>
          </>
        ) : (
          <p className="text-sm text-muted">{t.map.emptyHint}</p>
        )}
        <div className="mt-5 flex flex-wrap gap-2 border-t border-line pt-4">
          {businesses.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setActiveId(b.id)}
              className={`chip ${b.id === activeId ? "chip-brand" : "chip-neutral"}`}
            >
              {cityName(b.city, locale)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
