"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CloseIcon, SearchIcon } from "@/components/ui/icons";
import { useFocusTrap } from "./useFocusTrap";

type Hit = { type: string; id: string; title: string; subtitle: string; href: string };
type Labels = { title: string; placeholder: string; recent: string; popular: string; noResults: string; tryInstead: string; types: Record<string, string>; close: string; seeAll: string };

export function GlobalSearch({ locale, labels, popular, open, onClose }: { locale: string; labels: Labels; popular: { title: string; href: string }[]; open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const router = useRouter();
  const listId = useId();
  useFocusTrap(ref, open, onClose);

  useEffect(() => {
    if (!open) return;
    try { setRecent(JSON.parse(localStorage.getItem("atg:recent") ?? "[]")); } catch { setRecent([]); }
  }, [open]);

  useEffect(() => {
    if (!q.trim()) { setHits([]); setError(false); return; }
    const ctl = new AbortController();
    setLoading(true);
    const id = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q)}&locale=${locale}`, { signal: ctl.signal })
        .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
        .then((j: { hits: Hit[] }) => { setHits(j.hits); setActive(0); setError(false); })
        .catch((e) => { if (e?.name !== "AbortError") setError(true); })
        .finally(() => setLoading(false));
    }, 160);
    return () => { clearTimeout(id); ctl.abort(); };
  }, [q, locale]);

  const remember = useCallback((term: string) => {
    if (!term.trim()) return;
    const next = [term, ...recent.filter((r) => r !== term)].slice(0, 6);
    setRecent(next);
    try { localStorage.setItem("atg:recent", JSON.stringify(next)); } catch { /* ignore */ }
  }, [recent]);

  const go = (href: string) => { remember(q); onClose(); router.push(href); };
  const allHref = `/${locale}/restaurants/?q=${encodeURIComponent(q)}`;

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] bg-ink/50 p-0 md:p-6" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div ref={ref} role="dialog" aria-modal="true" aria-label={labels.title} className="mx-auto flex h-full max-w-2xl flex-col overflow-hidden bg-white shadow-card md:h-auto md:max-h-[80vh] md:rounded-[12px]">
        <form className="flex items-center gap-2 border-b border-line px-4" role="search" onSubmit={(e) => { e.preventDefault(); const h = hits[active]; go(h ? h.href : allHref); }}>
          <SearchIcon className="text-stone" />
          <label htmlFor="gs-input" className="sr-only">{labels.placeholder}</label>
          <input
            id="gs-input"
            data-autofocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, hits.length - 1)); }
              if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
            }}
            placeholder={labels.placeholder}
            className="min-h-14 flex-1 bg-transparent text-base outline-none"
            role="combobox"
            aria-expanded={hits.length > 0}
            aria-controls={listId}
            aria-activedescendant={hits[active] ? `${listId}-${active}` : undefined}
            aria-autocomplete="list"
            autoComplete="off"
          />
          <button type="button" onClick={onClose} className="grid h-11 w-11 place-items-center rounded-full hover:bg-sand" aria-label={labels.close}><CloseIcon /></button>
        </form>
        <div className="overflow-y-auto p-2">
          {q.trim() === "" && (
            <div className="space-y-4 p-2">
              {recent.length > 0 && (
                <div>
                  <p className="eyebrow mb-2">{labels.recent}</p>
                  <ul className="flex flex-wrap gap-2">{recent.map((r) => <li key={r}><button type="button" onClick={() => setQ(r)} className="min-h-9 rounded-full border border-line px-3 text-sm hover:border-carmine">{r}</button></li>)}</ul>
                </div>
              )}
              <div>
                <p className="eyebrow mb-2">{labels.popular}</p>
                <ul className="flex flex-wrap gap-2">{popular.map((p) => <li key={p.href}><button type="button" onClick={() => go(p.href)} className="min-h-9 rounded-full border border-line px-3 text-sm hover:border-carmine">{p.title}</button></li>)}</ul>
              </div>
            </div>
          )}
          {loading && hits.length === 0 && <p className="p-3 text-sm text-stone" role="status">…</p>}
          {error && <p className="p-3 text-sm text-carmine" role="alert">Search is temporarily unavailable.</p>}
          {q.trim() !== "" && !loading && !error && hits.length === 0 && (
            <div className="p-3 text-sm">
              <p>{labels.noResults.replace("{q}", q)}</p>
              <p className="mt-2 text-stone">{labels.tryInstead}</p>
              <ul className="mt-2 flex flex-wrap gap-2">{popular.slice(0, 5).map((p) => <li key={p.href}><button type="button" onClick={() => go(p.href)} className="min-h-9 rounded-full border border-line px-3 text-sm hover:border-carmine">{p.title}</button></li>)}</ul>
            </div>
          )}
          {hits.length > 0 && (
            <ul id={listId} role="listbox" aria-label={labels.title}>
              {hits.map((h, i) => (
                <li key={`${h.type}-${h.id}`} id={`${listId}-${i}`} role="option" aria-selected={i === active}>
                  <button type="button" onMouseEnter={() => setActive(i)} onClick={() => go(h.href)} className={`flex w-full items-center justify-between gap-3 rounded-[8px] px-3 py-2.5 text-left ${i === active ? "bg-blush" : "hover:bg-sand"}`}>
                    <span><span className="block font-semibold">{h.title}</span><span className="block text-sm text-stone">{h.subtitle}</span></span>
                    <span className="shrink-0 text-xs uppercase tracking-wide text-stone">{labels.types[h.type] ?? h.type}</span>
                  </button>
                </li>
              ))}
              <li><button type="button" onClick={() => go(allHref)} className="mt-1 w-full rounded-[8px] px-3 py-2.5 text-left text-sm font-semibold text-carmine hover:bg-sand">{labels.seeAll.replace("{q}", q)}</button></li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
