"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { DIET_KEYS, FEATURE_KEYS, serializeFilters, type Filters } from "@/lib/filters";
import { CloseIcon, FilterIcon } from "@/components/ui/icons";
import { useFocusTrap } from "../useFocusTrap";
import { useDirectoryNav } from "./DirectoryShell";
import type { Dict } from "@/i18n/en";

export type FilterOptions = {
  locations: { value: string; label: string; group: string }[]; // value = "country" or "country/city"
  currentLocation: string;
  cuisines: { slug: string; name: string; count: number }[];
  recognition: Record<number, number>;
  features: Record<string, number>;
  diet: Record<string, number>;
};
type Labels = Dict["directory"] & { clearAll: string; apply: string; close: string; any: string };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-b border-line py-4">
      <legend className="mb-2 float-left w-full text-sm font-semibold">{title}</legend>
      <div className="clear-both">{children}</div>
    </fieldset>
  );
}

function Check({ name, checked, onChange, label, count }: { name: string; checked: boolean; onChange: (v: boolean) => void; label: string; count?: number }) {
  return (
    <label className="flex min-h-9 cursor-pointer items-center justify-between gap-2 text-sm">
      <span className="inline-flex items-center gap-2"><input type="checkbox" name={name} checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-[var(--red-600)]" />{label}</span>
      {count !== undefined && <span className="text-xs text-stone">{count}</span>}
    </label>
  );
}

function FilterFields({ f, set, opts, L, onLocation, idp }: { f: Filters; set: (p: Partial<Filters>) => void; opts: FilterOptions; L: Labels; onLocation: (v: string) => void; idp: string }) {
  const toggle = <T,>(arr: T[], v: T, on: boolean) => (on ? [...new Set([...arr, v])] : arr.filter((x) => x !== v));
  const rangeInput = (key: "lunch" | "dinner" | "wine", label: string) => (
    <Section title={label}>
      <div className="flex items-center gap-2">
        {(["min", "max"] as const).map((b) => (
          <label key={b} className="flex-1 text-xs text-stone">
            {L.f[b]}
            <input type="number" inputMode="numeric" min={0} step={10} value={f[key][b] ?? ""} onChange={(e) => set({ [key]: { ...f[key], [b]: e.target.value === "" ? undefined : Number(e.target.value) } } as Partial<Filters>)}
              className="mt-1 block min-h-10 w-full rounded-[8px] border border-line bg-white px-2 text-sm text-ink" />
          </label>
        ))}
      </div>
    </Section>
  );
  return (
    <div>
      <div className="border-b border-line pb-4">
        <label htmlFor={`${idp}-q`} className="mb-1 block text-sm font-semibold">{L.f.keyword}</label>
        <input id={`${idp}-q`} type="search" defaultValue={f.q ?? ""} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); set({ q: (e.target as HTMLInputElement).value || undefined }); } }} onBlur={(e) => { if ((e.target.value || undefined) !== f.q) set({ q: e.target.value || undefined }); }} className="min-h-10 w-full rounded-[8px] border border-line bg-white px-3 text-sm" />
      </div>
      <div className="border-b border-line py-4">
        <label htmlFor={`${idp}-loc`} className="mb-1 block text-sm font-semibold">{L.f.location}</label>
        <select id={`${idp}-loc`} value={opts.currentLocation} onChange={(e) => onLocation(e.target.value)} className="min-h-10 w-full rounded-[8px] border border-line bg-white px-2 text-sm">
          <option value="">{L.any}</option>
          {[...new Set(opts.locations.map((l) => l.group))].map((g) => (
            <optgroup key={g} label={g}>{opts.locations.filter((l) => l.group === g).map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}</optgroup>
          ))}
        </select>
      </div>
      <Section title={L.f.recognition}>
        {[3, 2, 1, 0].map((lvl) => <Check key={lvl} name="rec" label={lvl ? `${L.f.recognition} ${lvl}` : L.f.none} count={opts.recognition[lvl] ?? 0} checked={f.recognition.includes(lvl)} onChange={(on) => set({ recognition: toggle(f.recognition, lvl, on) })} />)}
        <Check name="sel" label={L.f.selection} checked={f.selection} onChange={(on) => set({ selection: on })} />
      </Section>
      <Section title={L.f.cuisine}>
        <div className="max-h-56 overflow-y-auto pr-1">
          {opts.cuisines.map((c) => <Check key={c.slug} name="cuisine" label={c.name} count={c.count} checked={f.cuisine.includes(c.slug)} onChange={(on) => set({ cuisine: toggle(f.cuisine, c.slug, on) })} />)}
        </div>
      </Section>
      {rangeInput("lunch", L.f.lunch)}
      {rangeInput("dinner", L.f.dinner)}
      {rangeInput("wine", L.f.wine)}
      <p className="pt-2 text-xs text-stone">{L.priceNote}</p>
      <Section title={L.f.dietary}>
        {DIET_KEYS.map((k) => <Check key={k} name="diet" label={L.diet[k]} count={opts.diet[k] ?? 0} checked={f.diet.includes(k)} onChange={(on) => set({ diet: toggle(f.diet, k, on) })} />)}
      </Section>
      <Section title={L.f.features}>
        {FEATURE_KEYS.map((k) => <Check key={k} name="feat" label={L.features[k]} count={opts.features[k] ?? 0} checked={f.features.includes(k)} onChange={(on) => set({ features: toggle(f.features, k, on) })} />)}
      </Section>
      <Section title={L.f.reservation}>
        <select aria-label={L.f.reservation} value={f.reservation ?? ""} onChange={(e) => set({ reservation: (e.target.value || undefined) as Filters["reservation"] })} className="min-h-10 w-full rounded-[8px] border border-line bg-white px-2 text-sm">
          <option value="">{L.any}</option>
          {(["online", "phone", "email"] as const).map((m) => <option key={m} value={m}>{L.reservation[m]}</option>)}
        </select>
      </Section>
    </div>
  );
}

/**
 * Desktop: sticky sidebar, applies on change (URL-synced, shareable).
 * Mobile: bottom-sheet drawer with live result count on the Apply button.
 */
export function FilterPanel({ basePath, localeRoot, filters, opts, labels, scopeQuery }: { basePath: string; localeRoot: string; filters: Filters; opts: FilterOptions; labels: Labels; scopeQuery: string }) {
  const navigate = useDirectoryNav();
  const [sheet, setSheet] = useState(false);
  const [draft, setDraft] = useState<Filters>(filters);
  const [draftPath, setDraftPath] = useState(basePath);
  const [count, setCount] = useState<number | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  useFocusTrap(sheetRef, sheet, () => setSheet(false));
  // Optimistic sidebar state: controls reflect the click immediately while the URL navigation runs.
  const [live, setLive] = useState<Filters>(filters);
  useEffect(() => { setDraft(filters); setDraftPath(basePath); setLive(filters); }, [filters, basePath]);

  const keep = useMemo(() => ({ sort: filters.sort, view: filters.view, near: filters.near }), [filters]);
  const href = (path: string, f: Filters) => { const qs = serializeFilters({ ...f, ...keep, page: 1 }); return `${path}${qs ? `?${qs}` : ""}`; };
  const pathFor = (loc: string) => (loc ? `${localeRoot}/restaurants/${loc}/` : `${localeRoot}/restaurants/`);

  // live count for the mobile sheet
  useEffect(() => {
    if (!sheet) return;
    const ctl = new AbortController();
    const segs = draftPath.replace(`${localeRoot}/restaurants/`, "").split("/").filter(Boolean);
    const scope = new URLSearchParams();
    if (segs[0]) scope.set("_country", segs[0]);
    if (segs[1]) scope.set("_place", segs[1]);
    const qs = serializeFilters(draft, ["page", "view", "sort"]);
    fetch(`/api/restaurants/count/?${scope}&${qs}`, { signal: ctl.signal }).then((r) => r.json()).then((j: { count: number }) => setCount(j.count)).catch(() => setCount(null));
    return () => ctl.abort();
  }, [draft, draftPath, sheet, localeRoot]);

  const applyNow = (p: Partial<Filters>) => { const next = { ...live, ...p }; setLive(next); navigate(href(basePath, next)); };
  void scopeQuery;
  const cleared: Filters = { ...filters, q: undefined, recognition: [], selection: false, cuisine: [], lunch: {}, dinner: {}, wine: {}, diet: [], features: [], reservation: undefined, bbox: undefined, page: 1 };

  return (
    <>
      <aside aria-label={labels.filters} className="sticky top-[calc(var(--header-h)+16px)] hidden max-h-[calc(100vh-var(--header-h)-32px)] w-[280px] shrink-0 overflow-y-auto pr-2 lg:block">
        <div className="mb-2 flex items-center justify-between"><h2 className="font-sans text-base font-bold">{labels.filters}</h2><button type="button" onClick={() => navigate(href(basePath, cleared))} className="min-h-9 text-sm text-carmine underline-offset-4 hover:underline">{labels.clearAll}</button></div>
        <FilterFields idp="side" f={live} set={applyNow} opts={opts} L={labels} onLocation={(v) => navigate(href(pathFor(v), filters))} />
      </aside>

      <button type="button" onClick={() => setSheet(true)} className="inline-flex min-h-11 items-center gap-2 rounded-[8px] border border-line bg-white px-4 text-sm font-semibold lg:hidden" aria-haspopup="dialog" aria-expanded={sheet}>
        <FilterIcon size={18} /> {labels.filters}
      </button>

      {sheet && (
        <div className="fixed inset-0 z-[70] bg-ink/40 lg:hidden" onMouseDown={(e) => { if (e.target === e.currentTarget) setSheet(false); }}>
          <div ref={sheetRef} role="dialog" aria-modal="true" aria-labelledby="sheet-title" className="absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col rounded-t-[16px] bg-ivory">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <h2 id="sheet-title" className="font-sans text-base font-bold">{labels.filters}</h2>
              <button type="button" onClick={() => setSheet(false)} className="grid h-11 w-11 place-items-center rounded-full hover:bg-sand" aria-label={labels.close} data-autofocus><CloseIcon /></button>
            </div>
            <div className="overflow-y-auto px-4">
              <FilterFields idp="sheet" f={draft} set={(p) => setDraft((d) => ({ ...d, ...p }))} opts={opts} L={labels} onLocation={(v) => setDraftPath(pathFor(v))} />
            </div>
            <div className="flex gap-2 border-t border-line bg-white p-3">
              <button type="button" onClick={() => { setDraft(cleared); }} className="min-h-11 flex-1 rounded-[8px] border border-carmine px-4 text-sm font-semibold text-carmine">{labels.clearAll}</button>
              <button type="button" onClick={() => { setSheet(false); navigate(href(draftPath, draft)); }} className={clsx("min-h-11 flex-[2] rounded-[8px] bg-carmine px-4 text-sm font-semibold text-white")} aria-live="polite">
                {count === null ? labels.apply.replace(" {n}", "").replace("{n} ", "") : labels.apply.replace("{n}", String(count))}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
