"use client";

import { memo, useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { MapPin, BadgeCheck, Heart, Search, X, LocateFixed } from "lucide-react";
import type { Business } from "@/lib/types";
import { CATEGORIES, getCategoryInfo, categoryLabel, categoryLabelPlural } from "@/lib/categories";
import { getDictionary } from "@/lib/i18n/dictionary";
import { cityName } from "@/lib/i18n/place-names";
import { localeHref, type Locale } from "@/lib/i18n/locale";
import { distanceKm, matchesQuery, searchHaystack } from "@/lib/map-search";

import { PIN_COLORS } from "@/lib/map-colors";
import InteractiveMap from "./LazyInteractiveMap";

type RowProps = {
  b: Business;
  selected: boolean;
  km: number | null;
  locale: Locale;
  onPick: (id: string) => void;
  onHover: (id: string) => void;
};

// Una riga è ridisegnata solo se cambia lei: passando col mouse sulla lista o
// sui pin si aggiornano due righe, non tutte.
const Row = memo(function Row({ b, selected, km, locale, onPick, onHover }: RowProps) {
  const en = locale === "en";
  const cat = getCategoryInfo(b.category);
  return (
    <li id={`aic-row-${b.id}`} className={selected ? "bg-brand-soft" : ""}>
      <button
        type="button"
        onClick={() => onPick(b.id)}
        onMouseEnter={() => onHover(b.id)}
        className="block w-full p-4 text-left"
        aria-label={`${b.name}, ${cityName(b.city, locale)}`}
        aria-current={selected ? "true" : undefined}
      >
        <span className="flex items-start justify-between gap-2">
          <span className="min-w-0">
            <span className="eyebrow flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="inline-block h-2 w-2 rounded-full"
                style={{ background: PIN_COLORS[b.category] ?? PIN_COLORS.ristorante }}
              />
              {cat ? categoryLabel(cat, locale) : ""}
            </span>
            <span className="mt-0.5 block font-semibold text-ink">{b.name}</span>
          </span>
          <span className="flex shrink-0 flex-col items-end gap-1">
            {b.aicCertified ? (
              <span className="chip chip-brand">
                <BadgeCheck size={12} /> AIC
              </span>
            ) : (
              <span className="chip shrink-0 text-accent-dark" style={{ background: "var(--gf-accent-soft)" }}>
                <Heart size={12} /> {getDictionary(locale).business.communityVerifiedShort}
              </span>
            )}
            {km !== null && <span className="text-xs font-medium text-ink-soft">{km < 10 ? km.toFixed(1) : Math.round(km)} km</span>}
          </span>
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
});

/**
 * Esploratore mappa + elenco, usato nella home (tutti i locali) e nella pagina
 * dei ristoranti AIC (solo aderenti, già filtrati dal server). Qui si cerca
 * mentre si scrive (nome, città, provincia, indirizzo), si filtra per tipo e
 * città, si ordina per distanza con "Vicino a me"; mappa ed elenco restano
 * sempre sincronizzati.
 */
export default function BusinessMapExplorer({
  businesses,
  locale,
  variant = "all",
}: {
  businesses: Business[];
  locale: Locale;
  /** "aic": solo locali AIC (testi dedicati); "all": directory completa. */
  variant?: "aic" | "all";
}) {
  const en = locale === "en";
  const aic = variant === "aic";
  const [query, setQuery] = useState("");
  const [type, setType] = useState<string>("tutti");
  const [city, setCity] = useState<string>("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [focusId, setFocusId] = useState<string | null>(null);
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [geoState, setGeoState] = useState<"idle" | "loading" | "denied">("idle");
  const listRef = useRef<HTMLUListElement>(null);

  // Il testo da cercare di ogni locale si calcola una volta sola.
  const haystacks = useMemo(() => new Map(businesses.map((b) => [b.id, searchHaystack(b)])), [businesses]);

  // La digitazione resta fluida: il filtro lavora su un valore "differito".
  const deferredQuery = useDeferredValue(query);

  const byQuery = useMemo(
    () => (deferredQuery.trim() ? businesses.filter((b) => matchesQuery(haystacks.get(b.id) ?? "", deferredQuery)) : businesses),
    [businesses, haystacks, deferredQuery],
  );
  const byType = useMemo(() => byQuery.filter((b) => type === "tutti" || b.category === type), [byQuery, type]);

  const cityCounts = useMemo(() => {
    const m = new Map<string, number>();
    for (const b of byType) m.set(b.city, (m.get(b.city) ?? 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [byType]);

  // Se i filtri svuotano la città scelta, si torna a "tutte".
  const effectiveCity = cityCounts.some(([c]) => c === city) ? city : "";

  const { visible, distances } = useMemo(() => {
    const list = byType.filter((b) => !effectiveCity || b.city === effectiveCity);
    const d = new Map<string, number>();
    if (userPos) for (const b of list) d.set(b.id, distanceKm(userPos, [b.lat, b.lng]));
    list.sort((a, b) =>
      userPos ? (d.get(a.id) ?? 0) - (d.get(b.id) ?? 0) : a.city.localeCompare(b.city) || a.name.localeCompare(b.name),
    );
    return { visible: list, distances: d };
  }, [byType, effectiveCity, userPos]);

  const countOf = (t: string) => byQuery.filter((b) => t === "tutti" || b.category === t).length;
  // Solo i tipi che esistono davvero nei dati, nell'ordine delle categorie del sito.
  const typeOptions = useMemo(() => {
    const present = new Set(businesses.map((b) => b.category));
    return [
      { id: "tutti", label: en ? "All" : "Tutti" },
      ...CATEGORIES.filter((c) => present.has(c.slug)).map((c) => ({ id: c.slug, label: categoryLabelPlural(c, locale) })),
    ];
  }, [businesses, en, locale]);

  const onHover = useCallback((id: string) => setActiveId(id), []);
  const onPick = useCallback((id: string) => {
    setActiveId(id);
    setFocusId(id);
  }, []);
  // Un clic sul pin evidenzia e porta in vista la riga corrispondente.
  const onSelectFromMap = useCallback((id: string) => {
    setActiveId(id);
    document.getElementById(`aic-row-${id}`)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, []);

  // Il pin selezionato che sparisce dai risultati non resta "attivo".
  useEffect(() => {
    if (activeId && !visible.some((b) => b.id === activeId)) setActiveId(null);
  }, [visible, activeId]);

  const locate = () => {
    if (!("geolocation" in navigator)) {
      setGeoState("denied");
      return;
    }
    setGeoState("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos([pos.coords.latitude, pos.coords.longitude]);
        setGeoState("idle");
        setCity("");
        listRef.current?.scrollTo({ top: 0 });
      },
      () => setGeoState("denied"),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 },
    );
  };

  const reset = () => {
    setQuery("");
    setType("tutti");
    setCity("");
    setUserPos(null);
  };

  const filtered = query.trim() !== "" || type !== "tutti" || effectiveCity !== "" || userPos !== null;
  const chip = (selected: boolean) => `chip ${selected ? "chip-brand" : "chip-neutral"}`;

  return (
    <section aria-label={aic ? (en ? "Interactive map of AIC restaurants" : "Mappa interattiva dei ristoranti AIC") : en ? "Interactive map of gluten-free venues" : "Mappa interattiva dei locali senza glutine"}>
      <div className="card card-soft p-3 sm:p-4">
        <div className="flex flex-col gap-2 sm:flex-row">
          <div role="search" className="relative flex-1">
            <Search size={18} aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={en ? "Search by name, city or address…" : "Cerca per nome, città o indirizzo…"}
              aria-label={aic ? (en ? "Search AIC venues" : "Cerca tra i locali AIC") : en ? "Search venues" : "Cerca tra i locali"}
              autoComplete="off"
              enterKeyHint="search"
              className="h-12 w-full rounded-xl border border-line-strong bg-surface pl-11 pr-11 text-base text-ink placeholder:text-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label={en ? "Clear search" : "Cancella la ricerca"}
                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-muted hover:bg-surface-2 hover:text-ink"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={locate}
            aria-pressed={userPos !== null}
            disabled={geoState === "loading"}
            className={`btn h-12 shrink-0 ${userPos ? "btn-primary" : "btn-outline"}`}
          >
            <LocateFixed size={16} />
            {geoState === "loading" ? (en ? "Locating…" : "Cerco la posizione…") : en ? "Near me" : "Vicino a me"}
          </button>
        </div>
        {geoState === "denied" && (
          <p role="status" className="mt-2 text-sm text-accent-dark">
            {en
              ? "We couldn't get your position. Allow location access in the browser, or search by city."
              : "Non riesco a leggere la tua posizione. Consenti l'accesso alla posizione nel browser, oppure cerca per città."}
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2" role="group" aria-label={en ? "Venue type" : "Tipo di locale"}>
          {typeOptions.filter((o) => o.id === "tutti" || o.id === type || countOf(o.id) > 0).map((o) => (
            <button key={o.id} type="button" aria-pressed={type === o.id} onClick={() => setType(o.id)} className={chip(type === o.id)}>
              {o.id !== "tutti" && (
                <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full" style={{ background: PIN_COLORS[o.id] ?? PIN_COLORS.ristorante }} />
              )}
              {o.label} ({countOf(o.id)})
            </button>
          ))}
        </div>
        <div
          className="-mx-1 mt-2 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:thin]"
          role="group"
          aria-label={en ? "City" : "Città"}
        >
          <button type="button" aria-pressed={effectiveCity === ""} onClick={() => setCity("")} className={`${chip(effectiveCity === "")} shrink-0`}>
            {en ? "All cities" : "Tutte le città"} ({byType.length})
          </button>
          {cityCounts.map(([c, n]) => (
            <button key={c} type="button" aria-pressed={effectiveCity === c} onClick={() => setCity(c)} className={`${chip(effectiveCity === c)} shrink-0`}>
              {cityName(c, locale)} ({n})
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="card card-soft relative aspect-[4/3] overflow-hidden bg-brand-soft lg:aspect-auto lg:min-h-[560px]">
          <InteractiveMap
            businesses={visible}
            activeId={activeId}
            onSelect={onSelectFromMap}
            focusId={focusId}
            userPos={userPos}
            locale={locale}
          />
          <p className="pointer-events-none absolute bottom-3 right-3 z-[500] rounded-full bg-surface/90 px-3 py-1 text-[11px] font-medium text-ink shadow-sm backdrop-blur">
            {en
              ? `${visible.length} ${aic ? "AIC " : ""}${visible.length === 1 ? "venue" : "venues"} on the map`
              : `${visible.length} ${visible.length === 1 ? "locale" : "locali"}${aic ? " AIC" : ""} sulla mappa`}
          </p>
        </div>

        <div className="flex min-h-0 flex-col">
          <div className="mb-2 flex items-center justify-between gap-2 px-1 text-sm text-muted">
            <p aria-live="polite">
              {visible.length === 0
                ? en ? "No results" : "Nessun risultato"
                : en
                  ? `${visible.length} ${visible.length === 1 ? "venue" : "venues"}${userPos ? ", nearest first" : ""}`
                  : `${visible.length} ${visible.length === 1 ? "locale" : "locali"}${userPos ? ", dal più vicino" : ""}`}
            </p>
            {filtered && (
              <button type="button" onClick={reset} className="font-medium text-brand underline-offset-2 hover:underline">
                {en ? "Reset filters" : "Azzera i filtri"}
              </button>
            )}
          </div>
          {visible.length === 0 ? (
            <div className="card card-soft p-6 text-center">
              <p className="font-semibold text-ink">{aic ? (en ? "No AIC venue matches your search" : "Nessun locale AIC corrisponde alla ricerca") : en ? "No venue matches your search" : "Nessun locale corrisponde alla ricerca"}</p>
              <p className="mt-1 text-sm text-muted">
                {en
                  ? "Try a shorter word, a nearby city, or remove a filter. The map only lists the venues we have checked."
                  : "Prova con una parola più corta, una città vicina o togli un filtro. La mappa elenca solo i locali che abbiamo verificato."}
              </p>
              <button type="button" onClick={reset} className="btn btn-outline mt-4">
                {en ? "Show all venues" : "Mostra tutti i locali"}
              </button>
            </div>
          ) : (
            <ul ref={listRef} className="card card-soft max-h-[520px] divide-y divide-line overflow-y-auto lg:max-h-[560px]">
              {visible.map((b) => (
                <Row
                  key={b.id}
                  b={b}
                  selected={b.id === activeId}
                  km={distances.get(b.id) ?? null}
                  locale={locale}
                  onPick={onPick}
                  onHover={onHover}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
