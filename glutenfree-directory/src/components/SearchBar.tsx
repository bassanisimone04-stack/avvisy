"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Newspaper, Tag, Building2, Landmark } from "lucide-react";
import { searchAutocomplete, type SearchResult, type SearchResultType } from "@/lib/search";

const ICONS: Record<SearchResultType, React.ComponentType<{ size?: number; className?: string }>> = {
  attivita: Building2,
  articolo: Newspaper,
  citta: MapPin,
  regione: Landmark,
  categoria: Tag,
};

const LABELS: Record<SearchResultType, string> = {
  attivita: "Attività",
  articolo: "Articolo",
  citta: "Città",
  regione: "Regione",
  categoria: "Categoria",
};

export default function SearchBar({
  size = "lg",
  placeholder = "Cerca ristoranti, città, prodotti, articoli…",
}: {
  size?: "lg" | "sm";
  placeholder?: string;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setResults(searchAutocomplete(query));
    setActiveIndex(-1);
  }, [query]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function go(result: SearchResult) {
    setOpen(false);
    setQuery("");
    router.push(result.href);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (activeIndex >= 0 && results[activeIndex]) {
      go(results[activeIndex]);
    } else if (query.trim()) {
      router.push(`/directory?q=${encodeURIComponent(query.trim())}`);
      setOpen(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIndex((i) => Math.min(i + 1, results.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setActiveIndex((i) => Math.max(i - 1, 0)); }
    if (e.key === "Escape") setOpen(false);
  }

  const pad = size === "lg" ? "py-3.5 pl-12 pr-4 text-base" : "py-2.5 pl-10 pr-3 text-sm";

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={onSubmit} role="search" aria-label="Ricerca sul sito">
        <div className="relative">
          <Search size={size === "lg" ? 20 : 16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            aria-label="Cerca"
            aria-autocomplete="list"
            aria-expanded={open}
            className={`field w-full rounded-full shadow-sm ${pad}`}
          />
        </div>
      </form>
      {open && results.length > 0 && (
        <ul
          role="listbox"
          className="card card-soft absolute z-30 mt-2 w-full max-h-96 overflow-y-auto py-2"
        >
          {results.map((r, i) => {
            const Icon = ICONS[r.type];
            return (
              <li key={`${r.type}-${r.href}-${r.label}`} role="option" aria-selected={i === activeIndex}>
                <button
                  type="button"
                  onClick={() => go(r)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm ${i === activeIndex ? "bg-surface-2" : ""}`}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-dark">
                    <Icon size={15} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-ink">{r.label}</span>
                    {r.sublabel && <span className="block truncate text-xs text-muted">{r.sublabel}</span>}
                  </span>
                  <span className="chip chip-neutral shrink-0">{LABELS[r.type]}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
