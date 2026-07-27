"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, BadgeCheck } from "lucide-react";
import type { Business } from "@/lib/types";
import { getCategoryInfo, categoryLabel } from "@/lib/categories";
import { cityName } from "@/lib/i18n/place-names";
import { localeHref } from "@/lib/i18n/locale";
import { useDictionary } from "@/lib/i18n/useLocale";
import { tf } from "@/lib/i18n/dictionary";
import RatingStars from "./RatingStars";

const LAT_MIN = 36.4, LAT_MAX = 47.2, LNG_MIN = 6.5, LNG_MAX = 18.6;

function project(lat: number, lng: number) {
  const x = ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * 100;
  const y = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * 100;
  return { x: Math.min(96, Math.max(4, x)), y: Math.min(96, Math.max(4, y)) };
}

export default function MapSection({ businesses }: { businesses: Business[] }) {
  const [activeId, setActiveId] = useState<string | null>(businesses[0]?.id ?? null);
  const active = businesses.find((b) => b.id === activeId);
  const { locale, t } = useDictionary();

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div className="card card-soft relative aspect-[4/5] max-h-[520px] overflow-hidden bg-brand-soft sm:aspect-[5/4] lg:aspect-auto">
        <div className="grid-texture absolute inset-0 opacity-70" />
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden="true">
          <path
            d="M46 4 C50 3 54 6 55 10 C57 15 62 16 63 20 C64 25 60 27 61 31 C62 36 68 37 69 42 C70 47 65 49 66 54 C67 59 72 61 71 66 C70 71 64 70 62 74 C60 78 62 82 58 85 C55 87 53 84 51 87 C49 90 51 93 47 94 C44 95 43 91 41 89 C38 86 34 88 33 84 C32 80 36 78 35 74 C34 70 29 69 30 64 C31 60 36 60 37 55 C38 50 34 47 36 43 C38 39 43 40 44 35 C45 31 41 28 43 24 C45 20 44 16 45 12 C45.5 9 43 6 46 4 Z"
            fill="var(--gf-brand-light)"
            fillOpacity="0.35"
            stroke="var(--gf-brand)"
            strokeWidth="0.6"
          />
        </svg>
        {businesses.map((b) => {
          const { x, y } = project(b.lat, b.lng);
          const isActive = b.id === activeId;
          return (
            <button
              key={b.id}
              type="button"
              onMouseEnter={() => setActiveId(b.id)}
              onFocus={() => setActiveId(b.id)}
              style={{ left: `${x}%`, top: `${y}%` }}
              aria-label={`${b.name}, ${cityName(b.city, locale)}`}
              className={`absolute -translate-x-1/2 -translate-y-full transition-transform ${isActive ? "z-10 scale-125" : "z-0"}`}
            >
              <MapPin
                size={isActive ? 30 : 24}
                className={isActive ? "fill-accent text-accent-dark drop-shadow-md" : "fill-brand text-brand-dark drop-shadow-sm"}
              />
            </button>
          );
        })}
        <p className="absolute bottom-3 right-3 rounded-full bg-white/85 px-3 py-1 text-[11px] text-ink-soft backdrop-blur">
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
              {active.aicCertified && (
                <span className="chip chip-brand shrink-0"><BadgeCheck size={12} /> AIC</span>
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
