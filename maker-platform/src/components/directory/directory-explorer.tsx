"use client";

import { ChevronLeft, ChevronRight, List, Map as MapIcon, MapPin, Search, SlidersHorizontal, X } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BusinessRow } from "@/components/directory/business-row";
import { Checkbox, Select } from "@/components/ui/field";
import { directoryCategories, fileFormatOptions, flagFilters, materialOptions } from "@/features/directory/categories";
import { demoPlaceLabels, type Bounds } from "@/features/directory/geo";
import { RADIUS_OPTIONS, searchDirectory, serializeDirectoryQuery, type DirectoryQuery } from "@/features/directory/search";
import type { Business, BusinessFlag, DirectoryCategorySlug } from "@/features/directory/types";
import { cn } from "@/lib/utils";

const DirectoryMap = dynamic(() => import("@/components/maps/directory-map"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center bg-[#E3E8E0] text-sm text-muted" role="status">
      Loading map…
    </div>
  ),
});

const BASE = "/explore/us/woodworking";

export function DirectoryExplorer({ businesses, initialQuery }: { businesses: Business[]; initialQuery: DirectoryQuery }) {
  const [query, setQuery] = useState<DirectoryQuery>(initialQuery);
  const [text, setText] = useState(initialQuery.q ?? "");
  const [near, setNear] = useState(initialQuery.near ?? "");
  const [bounds, setBounds] = useState<Bounds | null>(null);
  const [searchOnMove, setSearchOnMove] = useState(false);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"list" | "map">("list");
  const [sheetOpen, setSheetOpen] = useState(false);
  const listTop = useRef<HTMLDivElement>(null);

  const result = useMemo(() => searchDirectory(businesses, { ...query, bounds: searchOnMove ? bounds : null }), [businesses, query, bounds, searchOnMove]);

  // keep the URL shareable without a server round-trip
  useEffect(() => {
    const url = `${BASE}${serializeDirectoryQuery(query)}`;
    if (url !== `${window.location.pathname}${window.location.search}`) window.history.replaceState(null, "", url);
  }, [query]);

  // debounce free text
  useEffect(() => {
    const t = setTimeout(() => setQuery((q) => (q.q === text ? q : { ...q, q: text, page: 1 })), 300);
    return () => clearTimeout(t);
  }, [text]);

  const update = useCallback((patch: Partial<DirectoryQuery>) => {
    setQuery((q) => ({ ...q, ...patch, page: patch.page ?? 1 }));
    setActiveId(null);
  }, []);

  const toggleFlag = (f: BusinessFlag) => {
    const flags = query.flags ?? [];
    update({ flags: flags.includes(f) ? flags.filter((x) => x !== f) : [...flags, f] });
  };

  const indexOf = useMemo(() => new Map(result.all.map((r, i) => [r.business.slug, i + 1])), [result.all]);
  const points = useMemo(
    () =>
      result.all.map((r) => ({
        id: r.business.slug,
        lat: r.business.coordinates.lat,
        lng: r.business.coordinates.lng,
        label: r.business.name,
        index: indexOf.get(r.business.slug),
      })),
    [result.all, indexOf],
  );
  const fitKey = JSON.stringify({ ...query, page: 0 });

  const selectFromMap = useCallback(
    (id: string) => {
      setActiveId(id);
      const pos = result.all.findIndex((r) => r.business.slug === id);
      const pageSize = 8;
      const page = Math.floor(pos / pageSize) + 1;
      if (page !== result.page) setQuery((q) => ({ ...q, page }));
      setSheetOpen(true);
      requestAnimationFrame(() =>
        Array.from(document.querySelectorAll<HTMLElement>(`[id="biz-${id}"]`))
          .find((el) => el.offsetParent !== null)
          ?.scrollIntoView({ behavior: "smooth", block: "nearest" }),
      );
    },
    [result.all, result.page],
  );

  const activeChips: { label: string; clear: () => void }[] = [
    ...(query.category ? [{ label: directoryCategories.find((c) => c.slug === query.category)?.plural ?? query.category, clear: () => update({ category: "" }) }] : []),
    ...(query.flags ?? []).map((f) => ({ label: flagFilters.find((x) => x.key === f)!.label, clear: () => toggleFlag(f) })),
    ...(query.cnc ? [{ label: "CNC on site", clear: () => update({ cnc: false }) }] : []),
    ...(query.format ? [{ label: `Accepts ${query.format}`, clear: () => update({ format: "" }) }] : []),
    ...(query.material ? [{ label: query.material, clear: () => update({ material: "" }) }] : []),
  ];
  const moreCount = (query.flags?.length ?? 0) + (query.cnc ? 1 : 0) + (query.format ? 1 : 0) + (query.material ? 1 : 0);

  const resetAll = () => {
    setText("");
    setNear("");
    setSearchOnMove(false);
    setQuery({ q: "", near: "", radius: 25, category: "", flags: [], cnc: false, format: "", material: "", page: 1 });
  };

  const summary = (
    <p className="text-sm text-muted" aria-live="polite">
      <strong className="nums font-semibold text-forest">{result.total}</strong> {result.total === 1 ? "place" : "places"}
      {result.place ? (
        <>
          {" "}
          within {query.radius} mi of <span className="text-forest">{result.place.label}</span>
        </>
      ) : null}
      {searchOnMove && bounds ? " in the map area" : null}
    </p>
  );

  const list = (
    <div className="space-y-3">
      {result.placeNotFound ? (
        <div role="alert" className="rounded-md border border-[#EBD9A6] bg-[#FFF8E6] p-4 text-sm text-warning">
          We couldn&apos;t place “{query.near}”. The demo location search only knows {demoPlaceLabels.join(", ")} and their ZIP codes. Real geocoding arrives with live data.
        </div>
      ) : null}
      {result.items.length ? (
        result.items.map((r) => (
          <BusinessRow
            key={r.business.slug}
            business={r.business}
            distance={r.distance}
            index={indexOf.get(r.business.slug)}
            active={activeId === r.business.slug || hoverId === r.business.slug}
            onHover={setHoverId}
          />
        ))
      ) : (
        <div className="rounded-md border border-dashed border-line-strong bg-white/60 px-6 py-12 text-center">
          <p className="font-display text-2xl text-forest">Nothing here yet.</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">Try a wider radius, fewer filters or another city. If you know a great shop that belongs here, tell us.</p>
          <div className="mt-5 flex justify-center gap-3">
            <button type="button" onClick={resetAll} className="rounded-sm bg-forest px-4 py-2 text-sm font-medium text-ivory">
              Clear all filters
            </button>
            <Link href="/for-business" className="rounded-sm border border-line-strong px-4 py-2 text-sm font-medium text-forest">
              Suggest a place
            </Link>
          </div>
        </div>
      )}

      {result.pageCount > 1 ? (
        <nav aria-label="Pagination" className="flex items-center justify-between pt-4">
          <PageLink disabled={result.page <= 1} query={{ ...query, page: result.page - 1 }} onGo={(p) => { update({ page: p }); listTop.current?.scrollIntoView({ block: "start" }); }}>
            <ChevronLeft className="size-4" aria-hidden /> Previous
          </PageLink>
          <span className="nums text-sm text-muted">
            Page {result.page} of {result.pageCount}
          </span>
          <PageLink disabled={result.page >= result.pageCount} query={{ ...query, page: result.page + 1 }} onGo={(p) => { update({ page: p }); listTop.current?.scrollIntoView({ block: "start" }); }}>
            Next <ChevronRight className="size-4" aria-hidden />
          </PageLink>
        </nav>
      ) : null}
    </div>
  );

  const map = (
    <DirectoryMap
      points={points}
      activeId={activeId}
      hoverId={hoverId}
      onSelect={selectFromMap}
      onBoundsChange={searchOnMove ? setBounds : undefined}
      fitKey={fitKey}
    />
  );

  return (
    <div>
      {/* ——— Filter bar: a plain GET form, so it also works without JavaScript ——— */}
      <form
        action={BASE}
        method="get"
        onSubmit={(e) => {
          e.preventDefault();
          update({ q: text, near });
        }}
        className="z-30 border-y border-line bg-ivory/95 backdrop-blur-md lg:sticky lg:top-[4.5rem]"
        aria-label="Directory filters"
      >
        <div className="flex flex-wrap items-center gap-2 px-4 py-3 md:px-6 xl:px-8">
          <label className="flex h-10 min-w-0 flex-[1_1_14rem] items-center gap-2 rounded-sm border border-line-strong bg-white px-3 focus-within:border-forest">
            <Search className="size-4 shrink-0 text-sage-ink" aria-hidden />
            <span className="sr-only">Keyword</span>
            <input name="q" value={text} onChange={(e) => setText(e.target.value)} placeholder="CNC router, walnut, classes…" className="w-full bg-transparent text-sm focus:outline-none" />
          </label>
          <label className="flex h-10 min-w-0 flex-[1_1_12rem] items-center gap-2 rounded-sm border border-line-strong bg-white px-3 focus-within:border-forest">
            <MapPin className="size-4 shrink-0 text-sage-ink" aria-hidden />
            <span className="sr-only">City, state or ZIP code</span>
            <input
              name="near"
              value={near}
              onChange={(e) => setNear(e.target.value)}
              onBlur={() => near !== query.near && update({ near })}
              placeholder="City, state or ZIP"
              list="demo-places"
              className="w-full bg-transparent text-sm focus:outline-none"
            />
            <datalist id="demo-places">
              {demoPlaceLabels.map((p) => (
                <option key={p} value={p} />
              ))}
            </datalist>
          </label>
          <label className="sr-only" htmlFor="radius">
            Distance
          </label>
          <Select id="radius" name="radius" value={query.radius} onChange={(e) => update({ radius: Number(e.target.value) })} className="h-10 w-auto flex-none text-sm" disabled={!query.near}>
            {RADIUS_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {r} mi
              </option>
            ))}
          </Select>
          <label className="sr-only" htmlFor="category">
            Category
          </label>
          <Select id="category" name="category" value={query.category ?? ""} onChange={(e) => update({ category: e.target.value as DirectoryCategorySlug | "" })} className="h-10 w-auto max-w-[14rem] flex-none text-sm">
            <option value="">All categories</option>
            {directoryCategories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.plural}
              </option>
            ))}
          </Select>

          <details className="group relative">
            <summary className="flex h-10 cursor-pointer list-none items-center gap-2 rounded-sm border border-line-strong bg-white px-3.5 text-sm font-medium text-forest hover:border-forest [&::-webkit-details-marker]:hidden">
              <SlidersHorizontal className="size-4" aria-hidden /> Filters
              {moreCount ? <span className="nums grid size-5 place-items-center rounded-full bg-forest text-[0.6875rem] text-ivory">{moreCount}</span> : null}
            </summary>
            <div className="fixed inset-x-3 top-32 z-40 max-h-[70vh] overflow-auto rounded-md border border-line bg-white p-5 shadow-lift sm:absolute sm:inset-x-auto sm:top-12 sm:right-0 sm:w-[30rem] lg:right-auto lg:left-0">
              <fieldset>
                <legend className="eyebrow mb-2">Access & services</legend>
                <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
                  {flagFilters.map((f) => (
                    <Checkbox key={f.key} name="f" value={f.key} checked={(query.flags ?? []).includes(f.key)} onChange={() => toggleFlag(f.key)} label={f.label} />
                  ))}
                  <Checkbox name="cnc" value="1" checked={Boolean(query.cnc)} onChange={() => update({ cnc: !query.cnc })} label="CNC machine on site" />
                </div>
              </fieldset>
              <div className="mt-5 grid grid-cols-2 gap-4 border-t border-line pt-5">
                <div>
                  <label htmlFor="format" className="mb-1.5 block text-[0.8125rem] font-medium text-forest">
                    Accepted file format
                  </label>
                  <Select id="format" name="format" value={query.format ?? ""} onChange={(e) => update({ format: e.target.value })} className="h-10 text-sm">
                    <option value="">Any</option>
                    {fileFormatOptions.map((f) => (
                      <option key={f}>{f}</option>
                    ))}
                  </Select>
                </div>
                <div>
                  <label htmlFor="material" className="mb-1.5 block text-[0.8125rem] font-medium text-forest">
                    Material
                  </label>
                  <Select id="material" name="material" value={query.material ?? ""} onChange={(e) => update({ material: e.target.value })} className="h-10 text-sm">
                    <option value="">Any</option>
                    {materialOptions.map((m) => (
                      <option key={m}>{m}</option>
                    ))}
                  </Select>
                </div>
              </div>
              <noscript>
                <button type="submit" className="mt-5 w-full rounded-sm bg-forest py-2.5 text-sm font-medium text-ivory">
                  Apply filters
                </button>
              </noscript>
            </div>
          </details>

          <button type="submit" className="h-10 rounded-sm bg-forest px-4 text-sm font-medium text-ivory hover:bg-forest-deep">
            Search
          </button>
        </div>

        {activeChips.length ? (
          <div className="flex flex-wrap items-center gap-2 px-4 pb-3 md:px-6 xl:px-8">
            {activeChips.map((c) => (
              <button key={c.label} type="button" onClick={c.clear} className="inline-flex items-center gap-1.5 rounded-full bg-forest/[0.07] py-1 pr-2 pl-3 text-[0.8125rem] text-forest hover:bg-forest/[0.12]">
                {c.label} <X className="size-3.5" aria-label={`Remove ${c.label}`} />
              </button>
            ))}
            <button type="button" onClick={resetAll} className="ml-1 text-[0.8125rem] text-clay-ink underline-offset-2 hover:underline">
              Clear all
            </button>
          </div>
        ) : null}
      </form>

      {/* ——— Mobile view switcher ——— */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 lg:hidden">
        {summary}
        <div role="tablist" aria-label="View" className="inline-flex rounded-sm border border-line-strong bg-white p-0.5 text-sm">
          {(["list", "map"] as const).map((v) => (
            <button
              key={v}
              role="tab"
              type="button"
              aria-selected={mobileView === v}
              onClick={() => setMobileView(v)}
              className={cn("inline-flex items-center gap-1.5 rounded-[4px] px-3 py-1.5 font-medium capitalize", mobileView === v ? "bg-forest text-ivory" : "text-muted")}
            >
              {v === "list" ? <List className="size-4" aria-hidden /> : <MapIcon className="size-4" aria-hidden />}
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] xl:grid-cols-[minmax(0,46rem)_1fr]">
        {/* list column */}
        <div ref={listTop} className={cn("scroll-mt-40 px-4 pt-1 pb-10 lg:pt-4 md:px-6 lg:block xl:px-8", mobileView === "map" && "hidden")}>
          <div className="mb-4 hidden items-center justify-between lg:flex">
            {summary}
            <span className="text-xs text-muted">{result.place ? "Sorted by distance" : "Sorted by city"}</span>
          </div>
          {list}
        </div>

        {/* map column — sticky on desktop, full-screen with bottom sheet on mobile */}
        <div
          className={cn(
            "relative lg:sticky lg:top-[8.25rem] lg:block lg:h-[calc(100dvh-8.25rem)] lg:border-l lg:border-line",
            mobileView === "map" ? "fixed inset-0 z-50 block lg:inset-auto lg:z-auto" : "hidden",
          )}
        >
          {map}

          <p className="absolute bottom-8 left-3 z-10 hidden rounded-xs bg-white/90 px-2 py-1 text-[0.6875rem] text-muted shadow-hairline lg:block">Demo basemap: state boundaries only</p>

          <div className="absolute top-3 right-14 left-3 z-10 flex flex-wrap items-center gap-2">
            {mobileView === "map" ? (
              <button
                type="button"
                onClick={() => {
                  setMobileView("list");
                  setSheetOpen(false);
                }}
                className="inline-flex items-center gap-1.5 rounded-sm bg-forest px-3 py-2 text-[0.8125rem] font-medium text-ivory shadow-soft lg:hidden"
              >
                <List className="size-4" aria-hidden /> Back to list
              </button>
            ) : null}
          <label className="flex items-center gap-2 rounded-sm bg-white/95 px-3 py-2 text-[0.8125rem] font-medium text-forest shadow-soft">
              <input type="checkbox" className="size-4 accent-[#263B32]" checked={searchOnMove} onChange={(e) => { setSearchOnMove(e.target.checked); if (!e.target.checked) setBounds(null); }} />
              <span className="max-sm:hidden">Search as I move the map</span>
              <span className="sm:hidden">Search this area</span>
            </label>
          </div>

          {/* mobile bottom sheet */}
          <div className="absolute inset-x-0 bottom-0 z-20 lg:hidden">
            <div className={cn("rounded-t-lg border-t border-line bg-ivory shadow-[0_-12px_30px_-18px_rgb(27_42_36/0.45)] transition-[max-height] duration-300", sheetOpen ? "max-h-[62%]" : "max-h-16")} style={{ maxHeight: sheetOpen ? "62vh" : undefined }}>
              <button type="button" aria-expanded={sheetOpen} aria-controls="sheet-list" onClick={() => setSheetOpen((o) => !o)} className="flex w-full flex-col items-center gap-1.5 px-4 pt-2 pb-3">
                <span className="h-1 w-10 rounded-full bg-line-strong" aria-hidden />
                <span className="text-sm font-medium text-forest">
                  {sheetOpen ? "Hide results" : `Show ${result.total} ${result.total === 1 ? "place" : "places"}`}
                </span>
              </button>
              {sheetOpen && mobileView === "map" ? (
                <div id="sheet-list" className="max-h-[calc(62vh-3.5rem)] overflow-auto px-4 pb-6">
                  {list}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PageLink({ disabled, query, onGo, children }: { disabled: boolean; query: DirectoryQuery; onGo: (page: number) => void; children: React.ReactNode }) {
  if (disabled) return <span className="inline-flex items-center gap-1 text-sm text-subtle">{children}</span>;
  return (
    <Link
      href={`${BASE}${serializeDirectoryQuery(query)}`}
      scroll={false}
      onClick={(e) => {
        e.preventDefault();
        onGo(query.page ?? 1);
      }}
      className="inline-flex items-center gap-1 rounded-sm border border-line-strong bg-white px-3 py-2 text-sm font-medium text-forest hover:border-forest"
    >
      {children}
    </Link>
  );
}
