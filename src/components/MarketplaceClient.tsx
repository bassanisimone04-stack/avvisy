"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import LotCard from "./LotCard";
import { ConditionChip, VerifiedBadge } from "./badges";
import LotImage from "./LotImage";
import { IconMapPin, IconSearch, IconClose } from "./icons";
import { categories, companyById, lotTotal } from "@/lib/mock-data";
import { categoryName } from "@/lib/mock-data";
import { formatEuro, formatNumber } from "@/lib/format";
import type { Lot, MerchandiseCondition } from "@/lib/types";

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

type Sort =
  | "recenti"
  | "prezzo-asc"
  | "prezzo-desc"
  | "quantita"
  | "visualizzati";

const sortOptions: { value: Sort; label: string }[] = [
  { value: "recenti", label: "Più recenti" },
  { value: "prezzo-asc", label: "Prezzo crescente" },
  { value: "prezzo-desc", label: "Prezzo decrescente" },
  { value: "quantita", label: "Quantità maggiore" },
  { value: "visualizzati", label: "Più visualizzati" },
];

export default function MarketplaceClient({
  allLots,
  initialQuery = "",
  initialCategory = "",
  initialRegion = "",
}: {
  allLots: Lot[];
  initialQuery?: string;
  initialCategory?: string;
  initialRegion?: string;
}) {
  const [q, setQ] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [region, setRegion] = useState(initialRegion);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [qtyMin, setQtyMin] = useState("");
  const [cond, setCond] = useState<Set<string>>(new Set());
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [shipping, setShipping] = useState(false);
  const [pickup, setPickup] = useState(false);
  const [immediate, setImmediate] = useState(false);
  const [negotiable, setNegotiable] = useState(false);
  const [sort, setSort] = useState<Sort>("recenti");
  const [view, setView] = useState<"griglia" | "elenco">("griglia");
  const [showFilters, setShowFilters] = useState(false);

  function toggleCond(c: string) {
    setCond((prev) => {
      const next = new Set(prev);
      next.has(c) ? next.delete(c) : next.add(c);
      return next;
    });
  }

  function reset() {
    setQ("");
    setCategory("");
    setRegion("");
    setPriceMin("");
    setPriceMax("");
    setQtyMin("");
    setCond(new Set());
    setVerifiedOnly(false);
    setShipping(false);
    setPickup(false);
    setImmediate(false);
    setNegotiable(false);
  }

  const results = useMemo(() => {
    let out = allLots.filter((lot) => {
      const seller = companyById(lot.sellerId);
      if (q.trim()) {
        const hay = `${lot.title} ${lot.description} ${categoryName(lot.category)}`.toLowerCase();
        if (!hay.includes(q.trim().toLowerCase())) return false;
      }
      if (category && lot.category !== category) return false;
      if (region && lot.region !== region) return false;
      if (priceMin && lot.unitPrice < Number(priceMin)) return false;
      if (priceMax && lot.unitPrice > Number(priceMax)) return false;
      if (qtyMin && lot.quantity < Number(qtyMin)) return false;
      if (cond.size > 0 && !cond.has(lot.condition)) return false;
      if (verifiedOnly && seller?.status !== "verificata") return false;
      if (shipping && !lot.shipping) return false;
      if (pickup && !lot.pickup) return false;
      if (immediate && lot.saleMode === "negoziabile") return false;
      if (negotiable && lot.saleMode === "immediato") return false;
      return true;
    });

    out = [...out].sort((a, b) => {
      switch (sort) {
        case "prezzo-asc":
          return a.unitPrice - b.unitPrice;
        case "prezzo-desc":
          return b.unitPrice - a.unitPrice;
        case "quantita":
          return b.quantity - a.quantity;
        case "visualizzati":
          return b.views - a.views;
        default:
          return +new Date(b.publishedAt) - +new Date(a.publishedAt);
      }
    });
    return out;
  }, [
    allLots,
    q,
    category,
    region,
    priceMin,
    priceMax,
    qtyMin,
    cond,
    verifiedOnly,
    shipping,
    pickup,
    immediate,
    negotiable,
    sort,
  ]);

  const activeFilters =
    (category ? 1 : 0) +
    (region ? 1 : 0) +
    (priceMin ? 1 : 0) +
    (priceMax ? 1 : 0) +
    (qtyMin ? 1 : 0) +
    cond.size +
    [verifiedOnly, shipping, pickup, immediate, negotiable].filter(Boolean).length;

  const filtersPanel = (
    <div className="space-y-6">
      <FilterGroup title="Categoria">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="field"
        >
          <option value="">Tutte</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </FilterGroup>

      <FilterGroup title="Regione">
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="field"
        >
          <option value="">Tutte</option>
          {regions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </FilterGroup>

      <FilterGroup title="Prezzo unitario (€)">
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            placeholder="Min"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="field"
          />
          <span className="text-muted">–</span>
          <input
            type="number"
            min={0}
            placeholder="Max"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="field"
          />
        </div>
      </FilterGroup>

      <FilterGroup title="Quantità minima">
        <input
          type="number"
          min={0}
          placeholder="Es. 100"
          value={qtyMin}
          onChange={(e) => setQtyMin(e.target.value)}
          className="field"
        />
      </FilterGroup>

      <FilterGroup title="Condizione">
        <div className="space-y-2">
          {conditions.map((c) => (
            <Check
              key={c}
              checked={cond.has(c)}
              onChange={() => toggleCond(c)}
              label={c}
            />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Opzioni">
        <div className="space-y-2">
          <Check checked={verifiedOnly} onChange={() => setVerifiedOnly((v) => !v)} label="Solo venditori verificati" />
          <Check checked={shipping} onChange={() => setShipping((v) => !v)} label="Spedizione disponibile" />
          <Check checked={pickup} onChange={() => setPickup((v) => !v)} label="Ritiro in sede" />
          <Check checked={immediate} onChange={() => setImmediate((v) => !v)} label="Acquisto immediato" />
          <Check checked={negotiable} onChange={() => setNegotiable((v) => !v)} label="Offerta negoziabile" />
        </div>
      </FilterGroup>

      {activeFilters > 0 && (
        <button onClick={reset} className="btn btn-ghost btn-sm w-full text-danger">
          Azzera filtri ({activeFilters})
        </button>
      )}
    </div>
  );

  return (
    <div className="container-page py-8">
      {/* Barra ricerca + ordinamento */}
      <div className="card card-soft flex flex-col gap-3 p-3 md:flex-row md:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-lg bg-surface-2 px-3">
          <IconSearch className="text-muted" width={18} height={18} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cerca merci e componenti…"
            className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-muted"
          />
          {q && (
            <button onClick={() => setQ("")} aria-label="Pulisci">
              <IconClose className="text-muted" width={16} height={16} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(true)}
            className="btn btn-outline btn-sm lg:hidden"
          >
            Filtri{activeFilters > 0 ? ` (${activeFilters})` : ""}
          </button>
          <label className="sr-only" htmlFor="sort">
            Ordina
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="field !w-auto !py-2 text-sm"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <div className="hidden rounded-lg border border-line-strong p-0.5 sm:flex">
            {(["griglia", "elenco"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium capitalize ${
                  view === v ? "bg-brand text-white" : "text-muted"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Filtri desktop */}
        <aside className="hidden lg:block">
          <div className="card sticky top-20 p-5">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-ink-soft">
              Filtri
            </h2>
            {filtersPanel}
          </div>
        </aside>

        {/* Risultati */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted">
              <span className="font-semibold text-ink">{results.length}</span>{" "}
              {results.length === 1 ? "lotto trovato" : "lotti trovati"}
            </p>
          </div>

          {results.length === 0 ? (
            <div className="card flex flex-col items-center gap-3 p-12 text-center">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-surface-2 text-muted">
                <IconSearch />
              </span>
              <h3 className="text-lg font-semibold text-ink">
                Nessun lotto corrisponde ai filtri
              </h3>
              <p className="max-w-sm text-sm text-muted">
                Prova ad allargare la ricerca o azzera i filtri per vedere tutti
                i lotti disponibili.
              </p>
              <button onClick={reset} className="btn btn-outline btn-sm">
                Azzera filtri
              </button>
            </div>
          ) : view === "griglia" ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((lot) => (
                <LotCard key={lot.id} lot={lot} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((lot) => (
                <LotRow key={lot.id} lot={lot} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filtri mobile (drawer) */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink/40"
            onClick={() => setShowFilters(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[85%] max-w-sm overflow-y-auto bg-surface p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Filtri</h2>
              <button onClick={() => setShowFilters(false)} aria-label="Chiudi">
                <IconClose />
              </button>
            </div>
            {filtersPanel}
            <button
              onClick={() => setShowFilters(false)}
              className="btn btn-primary btn-block mt-6"
            >
              Vedi {results.length} risultati
            </button>
          </div>
        </div>
      )}
    </div>
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

function Check({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-soft">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-line-strong accent-[var(--s-brand)]"
      />
      {label}
    </label>
  );
}

function LotRow({ lot }: { lot: Lot }) {
  const seller = companyById(lot.sellerId);
  return (
    <article className="card card-soft flex flex-col gap-4 p-3 sm:flex-row">
      <Link href={`/lotto/${lot.id}`} className="sm:w-56 shrink-0">
        <LotImage
          category={lot.category}
          seed={lot.imageSeed}
          ratio="aspect-[4/3] sm:aspect-[16/10]"
          className="rounded-lg"
        />
      </Link>
      <div className="flex flex-1 flex-col">
        <div className="flex flex-wrap items-center gap-2">
          <span className="chip bg-surface-2 text-ink-soft">
            {categoryName(lot.category)}
          </span>
          <ConditionChip condition={lot.condition} />
          {seller?.status === "verificata" && <VerifiedBadge size="xs" />}
        </div>
        <h3 className="mt-2 font-semibold text-ink">
          <Link href={`/lotto/${lot.id}`} className="hover:text-brand-dark">
            {lot.title}
          </Link>
        </h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-muted">
          <IconMapPin width={14} height={14} /> {lot.city}, {lot.region}
        </p>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-3">
          <div className="flex gap-6 text-sm">
            <div>
              <p className="text-xs text-muted">Quantità</p>
              <p className="font-semibold text-ink">
                {formatNumber(lot.quantity)} {lot.unit}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted">Prezzo unitario</p>
              <p className="font-semibold text-ink">{formatEuro(lot.unitPrice)}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Totale</p>
              <p className="font-semibold text-brand-dark">
                {formatEuro(lotTotal(lot), true)}
              </p>
            </div>
          </div>
          <Link href={`/lotto/${lot.id}`} className="btn btn-outline btn-sm">
            Visualizza lotto
          </Link>
        </div>
      </div>
    </article>
  );
}
