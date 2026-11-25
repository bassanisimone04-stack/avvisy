"use client";

import { ChevronDown, ChevronLeft, ChevronRight, List, Map as MapIcon, MapPin, Search, SlidersHorizontal, X } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BusinessRow } from "@/components/directory/business-row";
import { Checkbox, Select } from "@/components/ui/field";
import { directoryCategories, fileFormatOptions, flagFilters, materialOptions } from "@/features/directory/categories";
import { demoPlaceLabels, type Bounds } from "@/features/directory/geo";
import { RADIUS_OPTIONS, searchDirectory, serializeDirectoryQuery, type DirectoryQuery } from "@/features/directory/search";
import type { Business, BusinessFlag } from "@/features/directory/types";
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
  const [panelOpen, setPanelOpen] = useState(false);
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

  const field = "flex h-11 min-w-0 items-center gap-2.5 rounded-sm bg-white px-3 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ivory";
  const labelCls = "mb-2 block text-[0.6875rem] font-semibold tracking-[0.14em] text-ivory/75 uppercase";

  return (
    <div className="xl:grid xl:grid-cols-[19rem_minmax(0,1fr)]">
      {/* ——— Filter panel (forest). A plain GET form, so it also works without JavaScript ——— */}
      <aside className="bg-forest text-ivory xl:sticky xl:top-[4.5rem] xl:h-[calc(100dvh-4.5rem)] xl:overflow-y-auto">
        <noscript>
          <style>{"#filter-panel{display:block!important}"}</style>
        </noscript>
        <button
          type="button"
          aria-expanded={panelOpen}
          aria-controls="filter-panel"
          onClick={() => setPanelOpen((o) => !o)}
          className="flex w-full items-center justify-between px-4 py-4 text-left md:px-6 xl:hidden"
        >
          <span className="inline-flex items-center gap-2.5 font-medium">
            <SlidersHorizontal className="size-4" aria-hidden /> Search &amp; filters
            {activeChips.length ? <span className="nums grid size-5 place-items-center rounded-full bg-ivory text-[0.6875rem] text-forest">{activeChips.length}</span> : null}
          </span>
          <ChevronDown className={cn("size-5 transition-transform", panelOpen && "rotate-180")} aria-hidden />
        </button>

        <form
          id="filter-panel"
          action={BASE}
          method="get"
          aria-label="Directory filters"
          onSubmit={(e) => {
            e.preventDefault();
            update({ q: text, near });
            setPanelOpen(false);
          }}
          className={cn("px-4 pb-7 md:px-6 xl:block xl:p-6", panelOpen ? "block" : "hidden")}
        >
          <div className="grid gap-x-8 gap-y-6 md:grid-cols-2 xl:grid-cols-1">
            <div className="space-y-4">
              <div>
                <label htmlFor="dir-q" className={labelCls}>
                  Search
                </label>
                <div className={field}>
                  <Search className="size-4 shrink-0 text-forest" aria-hidden />
                  <input id="dir-q" name="q" value={text} onChange={(e) => setText(e.target.value)} placeholder="CNC router, walnut, classes…" className="w-full bg-transparent text-sm text-ink placeholder:text-subtle focus:outline-none" />
                </div>
              </div>
              <div>
                <label htmlFor="dir-near" className={labelCls}>
                  Place
                </label>
                <div className="grid grid-cols-[1fr_5.5rem] gap-2">
                  <div className={field}>
                    <MapPin className="size-4 shrink-0 text-forest" aria-hidden />
                    <input
                      id="dir-near"
                      name="near"
                      value={near}
                      onChange={(e) => setNear(e.target.value)}
                      onBlur={() => near !== query.near && update({ near })}
                      placeholder="City, state or ZIP"
                      list="demo-places"
                      className="w-full bg-transparent text-sm text-ink placeholder:text-subtle focus:outline-none"
                    />
                    <datalist id="demo-places">
                      {demoPlaceLabels.map((p) => (
                        <option key={p} value={p} />
                      ))}
                    </datalist>
                  </div>
                  <label className="sr-only" htmlFor="radius">
                    Distance
                  </label>
                  <Select id="radius" name="radius" value={query.radius} onChange={(e) => update({ radius: Number(e.target.value) })} className="h-11 border-0 text-sm" disabled={!query.near}>
                    {RADIUS_OPTIONS.map((r) => (
                      <option key={r} value={r}>
                        {r} mi
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
              <noscript>
                <label htmlFor="category" className={labelCls}>
                  Category
                </label>
                <Select id="category" name="category" defaultValue={query.category ?? ""} className="h-11 text-sm">
                  <option value="">All categories</option>
                  {directoryCategories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.plural}
                    </option>
                  ))}
                </Select>
              </noscript>
            </div>

            <fieldset>
              <legend className={labelCls}>Type of place</legend>
              <div className="flex flex-wrap gap-2">
                {directoryCategories.map((c) => {
                  const on = query.category === c.slug;
                  return (
                    <button
                      key={c.slug}
                      type="button"
                      aria-pressed={on}
                      onClick={() => update({ category: on ? "" : c.slug })}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-[0.8125rem] transition-colors",
                        on ? "border-ivory bg-ivory font-medium text-forest" : "border-ivory/35 text-ivory/90 hover:border-ivory hover:text-white",
                      )}
                    >
                      {c.plural}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset>
              <legend className={labelCls}>Refine available</legend>
              <div className="grid gap-x-4 sm:grid-cols-2 xl:grid-cols-1">
                {flagFilters.map((f) => (
                  <Checkbox key={f.key} tone="dark" name="f" value={f.key} checked={(query.flags ?? []).includes(f.key)} onChange={() => toggleFlag(f.key)} label={f.label} />
                ))}
                <Checkbox tone="dark" name="cnc" value="1" checked={Boolean(query.cnc)} onChange={() => update({ cnc: !query.cnc })} label="CNC machine on site" />
              </div>
            </fieldset>

            <div className="grid grid-cols-2 gap-3 self-start">
              <div>
                <label htmlFor="format" className={labelCls}>
                  File format
                </label>
                <Select id="format" name="format" value={query.format ?? ""} onChange={(e) => update({ format: e.target.value })} className="h-11 border-0 text-sm">
                  <option value="">Any</option>
                  {fileFormatOptions.map((f) => (
                    <option key={f}>{f}</option>
                  ))}
                </Select>
              </div>
              <div>
                <label htmlFor="material" className={labelCls}>
                  Material
                </label>
                <Select id="material" name="material" value={query.material ?? ""} onChange={(e) => update({ material: e.target.value })} className="h-11 border-0 text-sm">
                  <option value="">Any</option>
                  {materialOptions.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </Select>
              </div>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-3">
            <button type="button" onClick={resetAll} className="h-11 rounded-sm border border-ivory/40 text-sm font-medium text-ivory transition-colors hover:border-ivory hover:bg-ivory/10">
              Clear filters
            </button>
            <button type="submit" className="h-11 rounded-sm bg-ivory text-sm font-medium text-forest transition-colors hover:bg-white">
              Apply filters
            </button>
          </div>
        </form>
      </aside>

      <div className="min-w-0">
      {activeChips.length ? (
        <div className="flex flex-wrap items-center gap-2 px-4 pt-4 md:px-6 xl:px-8">
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

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] xl:grid-cols-[minmax(0,26rem)_1fr]">
        {/* list column */}
        <div ref={listTop} className={cn("scroll-mt-24 px-4 pt-1 pb-10 lg:pt-4 md:px-6 lg:block xl:px-6", mobileView === "map" && "hidden")}>
          <div className="mb-4 hidden items-center justify-between lg:flex">
            {summary}
            <span className="text-xs text-muted">{result.place ? "Sorted by distance" : "Sorted by city"}</span>
          </div>
          {list}
        </div>

        {/* map column — sticky on desktop, full-screen with bottom sheet on mobile */}
        <div
          className={cn(
            "relative lg:sticky lg:top-[4.5rem] lg:block lg:h-[calc(100dvh-4.5rem)] lg:border-l lg:border-line",
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
