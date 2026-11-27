import Link from "next/link";
import type { Locale } from "@/config/brand";
import { SITE } from "@/config/site";
import type { Dataset } from "@/db/types";
import { t } from "@/db/types";
import type { Dict } from "@/i18n/en";
import { fmt } from "@/i18n";
import type { Rates } from "@/lib/price";
import { activeFilterCount, serializeFilters, type Filters } from "@/lib/filters";
import { RestaurantCard } from "@/components/cards/RestaurantCard";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { buildFaqJsonLd, buildItemListJsonLd, buildPlaceJsonLd } from "@/seo/jsonld";
import { EmptyState, Chip, Notice } from "@/components/ui/ui";
import { CloseIcon, GridIcon, MapIcon } from "@/components/ui/icons";
import { FilterPanel } from "./FilterPanel";
import { NearMeButton, SortSelect } from "./Toolbar";
import { MapSplit } from "./MapSplit";
import { DirectoryShell, PendingResults } from "./DirectoryShell";
import { cardInfo } from "@/features/helpers";
import { buildAlt } from "@/lib/alt";
import { priceFrom, formatMoney } from "@/lib/price";
import type { hubModel } from "./model";

type Model = ReturnType<typeof hubModel>;

export function DirectoryView({ m, locale, dict, data, rates, extraParams }: { m: Model; locale: Locale; dict: Dict; data: Dataset; rates: Rates; extraParams: { date?: string; guests?: string } }) {
  const D = dict.directory;
  const f = m.f;
  const href = (p: Partial<Filters>) => { const qs = serializeFilters({ ...f, ...p, country: undefined, region: undefined, city: undefined }); return `${m.hubPath}${qs ? `?${qs}` : ""}`; };
  const chips: { label: string; href: string }[] = [];
  if (f.q) chips.push({ label: `“${f.q}”`, href: href({ q: undefined, page: 1 }) });
  f.recognition.forEach((l) => chips.push({ label: l ? `${D.f.recognition} ${l}` : D.f.none, href: href({ recognition: f.recognition.filter((x) => x !== l), page: 1 }) }));
  if (f.selection) chips.push({ label: D.f.selection, href: href({ selection: false, page: 1 }) });
  f.cuisine.forEach((c) => chips.push({ label: t(data.cuisines.find((x) => x.slug === c)?.name, locale) || c, href: href({ cuisine: f.cuisine.filter((x) => x !== c), page: 1 }) }));
  (["lunch", "dinner", "wine"] as const).forEach((k) => { const r = f[k]; if (r.min != null || r.max != null) chips.push({ label: `${D.f[k]}: ${r.min ?? 0}–${r.max ?? "∞"}`, href: href({ [k]: {}, page: 1 } as Partial<Filters>) }); });
  f.diet.forEach((k) => chips.push({ label: D.diet[k], href: href({ diet: f.diet.filter((x) => x !== k), page: 1 }) }));
  f.features.forEach((k) => chips.push({ label: D.features[k], href: href({ features: f.features.filter((x) => x !== k), page: 1 }) }));
  if (f.reservation) chips.push({ label: D.reservation[f.reservation], href: href({ reservation: undefined, page: 1 }) });
  if (f.bbox) chips.push({ label: D.searchArea, href: href({ bbox: undefined, page: 1 }) });
  const clearHref = href({ q: undefined, recognition: [], selection: false, cuisine: [], lunch: {}, dinner: {}, wine: {}, diet: [], features: [], reservation: undefined, bbox: undefined, page: 1 });
  const cityLabel = (slug: string) => t(data.cities.find((c) => c.slug === slug)?.name, locale);
  const countryLabel = (slug: string) => t(data.countries.find((c) => c.slug === slug)?.name, locale);
  const localeRoot = `/${locale}`;
  const options = {
    locations: data.countries.filter((c) => data.restaurants.some((r) => r.countrySlug === c.slug)).flatMap((c) => [
      { value: c.slug, label: `${t(c.name, locale)} — ${dict.common.viewAll.toLowerCase()}`, group: t(c.name, locale) },
      ...data.cities.filter((ci) => ci.countrySlug === c.slug).map((ci) => ({ value: `${c.slug}/${ci.slug}`, label: t(ci.name, locale), group: t(c.name, locale) })),
    ]),
    currentLocation: m.scope.city ? `${m.scope.country}/${m.scope.city}` : m.scope.region ? `${m.scope.country}/${m.scope.region}` : m.scope.country ?? "",
    cuisines: m.cuisineOptions, recognition: m.counts.recognition, features: m.counts.features, diet: m.counts.diet,
  };
  const pageItems = m.page.items;
  const count = m.results.length;

  return (
    <div className="container-page py-8 md:py-12">
      <Breadcrumbs items={m.breadcrumbs} />
      <header className="mt-4 max-w-3xl">
        <h1 className="text-2xl md:text-3xl">{m.h1}</h1>
        <p className="mt-2 text-stone">{count === 1 ? D.resultsOne : fmt(D.results, { n: count })}{!m.decision.index && activeFilterCount(f) > 0 ? ` · ${D.faq.noindexNote}` : ""}</p>
        {m.answer && <p className="mt-4 rounded-[10px] border border-line bg-white p-4 text-sm leading-relaxed" data-answer-first>{m.answer}</p>}
      </header>
      {(extraParams.date || extraParams.guests) && (
        <div className="mt-4"><Notice tone="info">Live table availability is not connected yet{extraParams.date ? ` for ${extraParams.date}` : ""}. Use <Link href={`/${locale}/concierge/`} className="underline">the concierge</Link> to request a table — we never show availability we have not confirmed.</Notice></div>
      )}

      <DirectoryShell>
      <div className="mt-8 flex gap-8">
        <FilterPanel basePath={m.hubPath} localeRoot={localeRoot} filters={f} opts={options} scopeQuery="" labels={{ ...D, clearAll: dict.common.clearAll, apply: dict.common.apply, close: dict.common.close, any: D.f.any }} />
        <div className="min-w-0 flex-1">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="lg:hidden"><span className="sr-only">{D.filters}</span></div>
              <SortSelect basePath={m.hubPath} filters={{ ...f, country: undefined, city: undefined, region: undefined }} labels={D.sorts} sortLabel={D.sort} />
              <NearMeButton basePath={m.hubPath} filters={{ ...f, country: undefined, city: undefined, region: undefined }} labels={D} />
            </div>
            <div className="sticky top-[calc(var(--header-h)+8px)] z-20 inline-flex rounded-[8px] border border-line bg-white p-1" role="group" aria-label={`${D.grid} / ${D.map}`}>
              <Link href={href({ view: "grid", page: 1 })} aria-current={f.view === "grid" ? "true" : undefined} className={`inline-flex min-h-10 items-center gap-1.5 rounded-[6px] px-3 text-sm ${f.view === "grid" ? "bg-carmine text-white" : "text-ink"}`}><GridIcon size={16} />{D.grid}</Link>
              <Link href={href({ view: "map", page: 1 })} aria-current={f.view === "map" ? "true" : undefined} className={`inline-flex min-h-10 items-center gap-1.5 rounded-[6px] px-3 text-sm ${f.view === "map" ? "bg-carmine text-white" : "text-ink"}`}><MapIcon size={16} />{D.map}</Link>
            </div>
          </div>

          {chips.length > 0 && (
            <div className="mb-5 flex flex-wrap items-center gap-2" aria-label={D.activeFilters}>
              <span className="text-sm font-semibold">{D.activeFilters}:</span>
              {chips.map((c) => <Chip key={c.href + c.label} href={c.href} active aria-label={`${dict.compare.remove}: ${c.label}`}>{c.label}<CloseIcon size={14} /></Chip>)}
              <Link href={clearHref} className="min-h-9 text-sm text-carmine underline-offset-4 hover:underline">{dict.common.clearAll}</Link>
            </div>
          )}

          <PendingResults loadingLabel={dict.common.loading}>
          {count === 0 ? (
            <EmptyState title={D.emptyTitle} body={D.emptyBody}>
              {data.cities.slice(0, 6).map((c) => <Chip key={c.slug} href={`/${locale}/restaurants/${c.countrySlug}/${c.slug}/`}>{t(c.name, locale)}</Chip>)}
            </EmptyState>
          ) : f.view === "map" ? (
            <MapSplit styleUrl={SITE.mapStyleUrl} basePath={m.hubPath} filters={{ ...f, country: undefined, city: undefined, region: undefined }}
              labels={{ searchArea: D.searchArea, mapUnavailable: D.mapUnavailable, mapListAlt: D.mapListAlt, illustrative: dict.common.illustrative, mapLabel: `${D.map}: ${m.h1}` }}
              items={m.results.slice(0, 200).map((r) => { const pf = priceFrom(r); return { slug: r.slug, name: r.name, href: `/${locale}/restaurant/${r.slug}/`, lat: r.lat, lng: r.lng, subtitle: `${cityLabel(r.citySlug)}, ${countryLabel(r.countrySlug)}`, meta: [cardInfo(data, r, locale).cuisines.join(" · "), pf ? formatMoney(pf.amount, pf.currency, locale) : ""].filter(Boolean).join(" · "), imageKey: r.images[0]!.key, alt: buildAlt(r.images[0]!, { name: r.name, city: cityLabel(r.citySlug), locale }) }; })} />
          ) : (
            <>
              <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
                {pageItems.map((r, i) => <li key={r.slug}><RestaurantCard r={r} locale={locale} dict={dict} {...cardInfo(data, r, locale)} priority={i < 2 && f.page === 1} headingLevel={2} /></li>)}
              </ul>
              {m.page.pages > 1 && (
                <nav aria-label="Pagination" className="mt-10 flex flex-wrap items-center justify-center gap-1">
                  {m.page.page > 1 && <Link rel="prev" href={href({ page: m.page.page - 1 })} className="inline-flex min-h-11 items-center rounded-[8px] border border-line bg-white px-3 text-sm">{dict.common.previous}</Link>}
                  {Array.from({ length: m.page.pages }, (_, i) => i + 1).map((p) => (
                    <Link key={p} href={href({ page: p })} aria-current={p === m.page.page ? "page" : undefined} aria-label={fmt(dict.common.page, { n: p })} className={`grid h-11 min-w-11 place-items-center rounded-[8px] border text-sm ${p === m.page.page ? "border-carmine bg-carmine text-white" : "border-line bg-white"}`}>{p}</Link>
                  ))}
                  {m.page.page < m.page.pages && <Link rel="next" href={href({ page: m.page.page + 1 })} className="inline-flex min-h-11 items-center rounded-[8px] border border-line bg-white px-3 text-sm">{dict.common.next}</Link>}
                </nav>
              )}
            </>
          )}
          </PendingResults>
          <p className="mt-6 text-xs text-stone">{rates.source === "live" ? "" : rates.source === "demo-reference" ? dict.prefs.fxDemo : dict.prefs.fxNone}</p>
        </div>
      </div>
      </DirectoryShell>

      {(m.intro || m.faq.length > 0) && (
        <div className="mt-16 grid gap-10 border-t border-line pt-10 lg:grid-cols-2">
          {m.intro && (
            <section aria-labelledby="intro-title">
              <h2 id="intro-title" className="font-serif text-2xl">{fmt(D.introTitle, { place: m.placeName })}</h2>
              <p className="mt-3 leading-relaxed text-ink">{m.intro}</p>
            </section>
          )}
          {m.faq.length > 0 && (
            <section aria-labelledby="faq-title">
              <h2 id="faq-title" className="font-serif text-2xl">{D.faqTitle}</h2>
              <dl className="mt-3 divide-y divide-line">
                {m.faq.map((q) => <div key={q.q} className="py-3"><dt className="font-semibold">{q.q}</dt><dd className="mt-1 text-stone">{q.a}</dd></div>)}
              </dl>
            </section>
          )}
        </div>
      )}

      <JsonLd data={buildItemListJsonLd(m.h1, (f.view === "map" ? m.results.slice(0, 200) : pageItems).map((r) => ({ name: r.name, path: `/${locale}/restaurant/${r.slug}/` })))} />
      {m.faq.length > 0 && <JsonLd data={buildFaqJsonLd(m.faq)} />}
      {m.city && m.country && <JsonLd data={buildPlaceJsonLd(m.city, m.country, locale, m.hubPath, `/images/generated/${m.city.image.key}.webp`)} />}
    </div>
  );
}
