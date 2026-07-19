"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import LotCard from "./LotCard";
import FavoriteButton from "./FavoriteButton";
import { ConditionChip, VerifiedBadge } from "./badges";
import LotImage from "./LotImage";
import { LotCardSkeleton, RowSkeleton } from "./Skeleton";
import { notify } from "./Toaster";
import { IconMapPin, IconSearch, IconClose } from "./icons";
import { categories, categoryName, companyById } from "@/lib/mock-data";
import { formatEuro, formatNumber } from "@/lib/format";
import { lotTotal, type Lot, type MerchandiseCondition } from "@/lib/types";
import { useStore } from "@/lib/store";
import { useDebounce, useSimulatedLoading } from "@/lib/hooks";
import {
  countActiveFilters,
  emptyFilters,
  filterLots,
  paginate,
  publicLots,
  sortLots,
  type LotFilters,
  type SortKey,
} from "@/lib/services";

const regions = [
  "Lombardia",
  "Veneto",
  "Emilia-Romagna",
  "Piemonte",
  "Toscana",
  "Abruzzo",
  "Campania",
];

const conditions: MerchandiseCondition[] = [
  "Nuovo",
  "Come nuovo",
  "Usato - buono",
  "Usato - funzionante",
  "Ricondizionato",
  "Fine serie",
];

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "recenti", label: "Più recenti" },
  { value: "prezzo-asc", label: "Prezzo crescente" },
  { value: "prezzo-desc", label: "Prezzo decrescente" },
  { value: "quantita", label: "Quantità maggiore" },
  { value: "visualizzati", label: "Più visualizzati" },
  { value: "offerte", label: "Più richiesti" },
];

const PER_PAGE = 9;

export default function MarketplaceClient({
  initialQuery = "",
  initialCategory = "",
  initialRegion = "",
}: {
  initialQuery?: string;
  initialCategory?: string;
  initialRegion?: string;
}) {
  const { state, dispatch } = useStore();
  const [filters, setFilters] = useState<LotFilters>({
    ...emptyFilters,
    q: initialQuery,
    category: initialCategory,
    region: initialRegion,
  });
  const [sort, setSort] = useState<SortKey>("recenti");
  const [view, setView] = useState<"griglia" | "elenco">("griglia");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [saving, setSaving] = useState(false);

  const debouncedQ = useDebounce(filters.q, 250);
  const loading = useSimulatedLoading(500, [
    debouncedQ,
    filters.category,
    filters.region,
    filters.priceMin,
    filters.priceMax,
    filters.qtyMin,
    filters.conditions.join(),
    filters.verifiedOnly,
    filters.shipping,
    filters.pickup,
    filters.negotiable,
    sort,
  ]);

  function patch(p: Partial<LotFilters>) {
    setFilters((f) => ({ ...f, ...p }));
    setPage(1);
  }

  function toggleCond(c: string) {
    setFilters((f) => ({
      ...f,
      conditions: f.conditions.includes(c)
        ? f.conditions.filter((x) => x !== c)
        : [...f.conditions, c],
    }));
    setPage(1);
  }

  function reset() {
    setFilters({ ...emptyFilters });
    setPage(1);
  }

  const base = useMemo(() => publicLots(state.lots), [state.lots]);
  const results = useMemo(
    () => sortLots(filterLots(base, { ...filters, q: debouncedQ }), sort),
    [base, filters, debouncedQ, sort],
  );

  const totalPages = Math.max(1, Math.ceil(results.length / PER_PAGE));
  const pageItems = paginate(results, Math.min(page, totalPages), PER_PAGE);
  const activeFilters = countActiveFilters(filters);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  function saveSearch() {
    const label =
      [
        filters.q.trim(),
        filters.category ? categoryName(filters.category) : "",
        filters.region,
      ]
        .filter(Boolean)
        .join(" · ") || "Ricerca marketplace";
    setSaving(true);
    dispatch({
      type: "ADD_SAVED_SEARCH",
      search: { id: `ss-${Date.now()}`, label, query: filters.q, alerts: true },
    });
    notify("Ricerca salvata. La trovi nell'area compratore.");
    setTimeout(() => setSaving(false), 1200);
  }

  const filtersPanel = (
    <div className="space-y-6">
      <FilterGroup title="Categoria">
        <select value={filters.category} onChange={(e) => patch({ category: e.target.value })} className="field">
          <option value="">Tutte</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </FilterGroup>

      <FilterGroup title="Regione">
        <select value={filters.region} onChange={(e) => patch({ region: e.target.value })} className="field">
          <option value="">Tutte</option>
          {regions.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </FilterGroup>

      <FilterGroup title="Prezzo unitario (€)">
        <div className="flex items-center gap-2">
          <input type="number" min={0} placeholder="Min" value={filters.priceMin} onChange={(e) => patch({ priceMin: e.target.value })} className="field" />
          <span className="text-muted">–</span>
          <input type="number" min={0} placeholder="Max" value={filters.priceMax} onChange={(e) => patch({ priceMax: e.target.value })} className="field" />
        </div>
      </FilterGroup>

      <FilterGroup title="Quantità minima">
        <input type="number" min={0} placeholder="Es. 100" value={filters.qtyMin} onChange={(e) => patch({ qtyMin: e.target.value })} className="field" />
      </FilterGroup>

      <FilterGroup title="Condizione">
        <div className="space-y-2">
          {conditions.map((c) => (
            <Check key={c} checked={filters.conditions.includes(c)} onChange={() => toggleCond(c)} label={c} />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Opzioni">
        <div className="space-y-2">
          <Check checked={filters.verifiedOnly} onChange={() => patch({ verifiedOnly: !filters.verifiedOnly })} label="Solo venditori verificati" />
          <Check checked={filters.shipping} onChange={() => patch({ shipping: !filters.shipping })} label="Spedizione disponibile" />
          <Check checked={filters.pickup} onChange={() => patch({ pickup: !filters.pickup })} label="Ritiro in sede" />
          <Check checked={filters.negotiable} onChange={() => patch({ negotiable: !filters.negotiable })} label="Prezzo negoziabile" />
        </div>
      </FilterGroup>

      {activeFilters > 0 && (
        <button onClick={reset} className="btn btn-ghost btn-sm w-full text-danger">
          Cancella tutti i filtri ({activeFilters})
        </button>
      )}
    </div>
  );

  return (
    <div className="container-page py-8">
      <div className="card card-soft flex flex-col gap-3 p-3 md:flex-row md:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-lg bg-surface-2 px-3">
          <IconSearch className="text-muted" width={18} height={18} />
          <input
            value={filters.q}
            onChange={(e) => patch({ q: e.target.value })}
            placeholder="Cerca per titolo, codice, descrizione o categoria…"
            className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-muted"
            aria-label="Ricerca lotti"
          />
          {filters.q && (
            <button onClick={() => patch({ q: "" })} aria-label="Pulisci ricerca">
              <IconClose className="text-muted" width={16} height={16} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowFilters(true)} className="btn btn-outline btn-sm lg:hidden">
            Filtri{activeFilters > 0 ? ` (${activeFilters})` : ""}
          </button>
          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="field !w-auto !py-2 text-sm" aria-label="Ordina">
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <div className="hidden rounded-lg border border-line-strong p-0.5 sm:flex">
            {(["griglia", "elenco"] as const).map((v) => (
              <button key={v} onClick={() => setView(v)} className={`rounded-md px-3 py-1.5 text-sm font-medium capitalize ${view === v ? "bg-brand text-white" : "text-muted"}`}>
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:block">
          <div className="card sticky top-20 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wide text-ink-soft">Filtri</h2>
            </div>
            {filtersPanel}
          </div>
        </aside>

        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted" aria-live="polite">
              {loading ? (
                "Aggiornamento risultati…"
              ) : (
                <>
                  <span className="font-semibold text-ink">{results.length}</span>{" "}
                  {results.length === 1 ? "lotto trovato" : "lotti trovati"}
                </>
              )}
            </p>
            <button onClick={saveSearch} disabled={saving} className="btn btn-ghost btn-sm text-brand-dark disabled:opacity-60">
              {saving ? "Salvata ✓" : "Salva questa ricerca"}
            </button>
          </div>

          {loading ? (
            view === "griglia" ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => <LotCardSkeleton key={i} />)}
              </div>
            ) : (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => <RowSkeleton key={i} />)}
              </div>
            )
          ) : results.length === 0 ? (
            <div className="card flex flex-col items-center gap-3 p-12 text-center">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-surface-2 text-muted">
                <IconSearch />
              </span>
              <h3 className="text-lg font-semibold text-ink">Nessun lotto corrisponde ai filtri</h3>
              <p className="max-w-sm text-sm text-muted">
                Prova ad allargare la ricerca o cancella i filtri per vedere tutti i lotti disponibili.
              </p>
              <button onClick={reset} className="btn btn-outline btn-sm">Cancella i filtri</button>
            </div>
          ) : (
            <>
              {view === "griglia" ? (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {pageItems.map((lot) => <LotCard key={lot.id} lot={lot} />)}
                </div>
              ) : (
                <div className="space-y-3">
                  {pageItems.map((lot) => <LotRow key={lot.id} lot={lot} />)}
                </div>
              )}

              {totalPages > 1 && (
                <Pagination page={Math.min(page, totalPages)} totalPages={totalPages} onChange={setPage} />
              )}
            </>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
          <div className="absolute inset-y-0 left-0 w-[85%] max-w-sm overflow-y-auto bg-surface p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Filtri</h2>
              <button onClick={() => setShowFilters(false)} aria-label="Chiudi"><IconClose /></button>
            </div>
            {filtersPanel}
            <button onClick={() => setShowFilters(false)} className="btn btn-primary btn-block mt-6">
              Vedi {results.length} risultati
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}) {
  return (
    <nav className="mt-8 flex items-center justify-center gap-1.5" aria-label="Paginazione">
      <button onClick={() => onChange(page - 1)} disabled={page === 1} className="btn btn-outline btn-sm disabled:opacity-40">
        Precedente
      </button>
      {Array.from({ length: totalPages }).map((_, i) => (
        <button
          key={i}
          onClick={() => onChange(i + 1)}
          aria-current={page === i + 1 ? "page" : undefined}
          className={`h-9 w-9 rounded-lg text-sm font-medium ${page === i + 1 ? "bg-brand text-white" : "text-ink-soft hover:bg-surface-2"}`}
        >
          {i + 1}
        </button>
      ))}
      <button onClick={() => onChange(page + 1)} disabled={page === totalPages} className="btn btn-outline btn-sm disabled:opacity-40">
        Successiva
      </button>
    </nav>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="field-label">{title}</p>
      {children}
    </div>
  );
}

function Check({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-soft">
      <input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 rounded border-line-strong accent-[var(--s-brand)]" />
      {label}
    </label>
  );
}

function LotRow({ lot }: { lot: Lot }) {
  const seller = companyById(lot.sellerId);
  return (
    <article className="card card-soft flex flex-col gap-4 p-3 sm:flex-row">
      <Link href={`/lotto/${lot.id}`} className="relative sm:w-56 shrink-0">
        <LotImage category={lot.category} seed={lot.images[0] ?? 1} ratio="aspect-[4/3] sm:aspect-[16/10]" className="rounded-lg" />
        <div className="absolute right-2 top-2"><FavoriteButton lotId={lot.id} /></div>
      </Link>
      <div className="flex flex-1 flex-col">
        <div className="flex flex-wrap items-center gap-2">
          <span className="chip bg-surface-2 text-ink-soft">{categoryName(lot.category)}</span>
          <ConditionChip condition={lot.condition} />
          {seller?.verification === "Verificata" && <VerifiedBadge size="xs" />}
        </div>
        <h3 className="mt-2 font-semibold text-ink">
          <Link href={`/lotto/${lot.id}`} className="hover:text-brand-dark">{lot.title}</Link>
        </h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-muted">
          <IconMapPin width={14} height={14} /> {lot.province}, {lot.region}
        </p>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-3">
          <div className="flex gap-6 text-sm">
            <div>
              <p className="text-xs text-muted">Quantità</p>
              <p className="font-semibold text-ink">{formatNumber(lot.quantity)} {lot.unit}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Prezzo unitario</p>
              <p className="font-semibold text-ink">{formatEuro(lot.unitPrice)}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Totale</p>
              <p className="font-semibold text-brand-dark">{formatEuro(lotTotal(lot), true)}</p>
            </div>
          </div>
          <Link href={`/lotto/${lot.id}`} className="btn btn-outline btn-sm">Visualizza lotto</Link>
        </div>
      </div>
    </article>
  );
}
