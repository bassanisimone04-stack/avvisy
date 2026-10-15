"use client";
import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { RECENT_KEY, useList, writeList } from "@/lib/client-store";

interface Hit { type: string; label: string; sub: string; href: string }
const GROUP: Record<string, string> = { model: "Sunglasses", movie: "Movies & TV", actor: "Actors", character: "Characters", brand: "Brands", article: "Guides", recent: "Recent searches", popular: "Popular" };
const POPULAR: Hit[] = [
  { type: "popular", label: "Top Gun", sub: "Film · 1986", href: "/movies/top-gun" },
  { type: "popular", label: "Wayfarer", sub: "Style", href: "/styles/wayfarer" },
  { type: "popular", label: "Persol 714 Steve McQueen", sub: "Persol", href: "/sunglasses/persol-714-steve-mcqueen" },
  { type: "popular", label: "Affordable alternatives", sub: "Under $50 · $100 · $200", href: "/affordable-alternatives" },
];

export function SearchBox({ variant = "compact", autoFocus = false, onNavigate }: { variant?: "hero" | "compact"; autoFocus?: boolean; onNavigate?: () => void }) {
  const router = useRouter();
  const uid = useId();
  const listId = `${uid}-list`;
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [busy, setBusy] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const recent = useList(RECENT_KEY);

  const searching = q.trim().length >= 2;
  const recents: Hit[] = recent.map((r) => { const [label, href] = r.split("\t"); return { type: "recent", label, sub: "", href }; }).filter((r) => r.href);
  const items: Hit[] = searching ? hits : recents.length ? recents : POPULAR;

  useEffect(() => {
    if (!searching) { setHits([]); setBusy(false); return; }
    setBusy(true);
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const r = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: ctrl.signal });
        if (r.ok) { setHits((await r.json()).hits); setActive(-1); setOpen(true); }
      } catch { /* aborted */ } finally { setBusy(false); }
    }, 140);
    return () => { clearTimeout(t); ctrl.abort(); };
  }, [q, searching]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const remember = (h: Hit) => {
    if (h.type === "popular") return;
    const entry = `${h.label}\t${h.href}`;
    writeList(RECENT_KEY, [entry, ...recent.filter((r) => r !== entry)].slice(0, 5));
  };
  const go = (h: Hit | string) => {
    setOpen(false);
    if (typeof h !== "string") remember(h);
    onNavigate?.();
    router.push(typeof h === "string" ? h : h.href);
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setActive((a) => Math.min(a + 1, items.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, -1)); }
    else if (e.key === "Escape") setOpen(false);
    else if (e.key === "Enter") { e.preventDefault(); if (active >= 0 && items[active]) go(items[active]); else if (q.trim()) go(`/search?q=${encodeURIComponent(q.trim())}`); }
  };
  const hero = variant === "hero";
  let lastType = "";
  const listVisible = open && (searching || items.length > 0);
  return (
    <div ref={box} className="relative w-full">
      <form role="search" action="/search" onSubmit={(e) => { e.preventDefault(); if (active < 0 && q.trim()) go(`/search?q=${encodeURIComponent(q.trim())}`); }}>
        <label htmlFor={`${uid}-q`} className="sr-only">Search movies, actors, brands and sunglasses</label>
        <div className={`flex items-center gap-3 border transition focus-within:border-champagne ${hero ? "rounded-full border-white/25 bg-white/10 px-6 py-4 backdrop-blur-md" : "rounded-full border-line bg-white px-4 py-2"}`}>
          <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={hero ? "text-champagne" : "text-mist"}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" strokeLinecap="round" /></svg>
          <input id={`${uid}-q`} name="q" type="search" autoComplete="off" autoFocus={autoFocus} value={q}
            onChange={(e) => setQ(e.target.value)} onKeyDown={onKey} onFocus={() => setOpen(true)}
            placeholder={hero ? "Try “Top Gun”, “Tom Cruise”, “Persol 714”…" : "Search movies, actors, models"}
            role="combobox" aria-expanded={listVisible} aria-controls={listId} aria-autocomplete="list"
            aria-activedescendant={active >= 0 ? `${uid}-opt-${active}` : undefined}
            className={`w-full bg-transparent outline-none placeholder:text-mist ${hero ? "text-lg text-white placeholder:text-white/50" : "text-sm"}`} />
          {busy && <span aria-hidden className="h-4 w-4 animate-spin rounded-full border-2 border-champagne border-t-transparent" />}
          {recents.length > 0 && !searching && open && <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => writeList(RECENT_KEY, [])} className={`shrink-0 text-xs underline ${hero ? "text-white/60" : "text-mist"}`}>Clear</button>}
        </div>
      </form>
      <div role="status" aria-live="polite" className="sr-only">{listVisible && searching ? `${hits.length} suggestions available` : ""}</div>
      {listVisible && (
        <ul id={listId} role="listbox" aria-label="Search suggestions" className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 max-h-[26rem] overflow-auto rounded-xl border border-line bg-white py-2 text-left text-ink shadow-2xl">
          {searching && hits.length === 0 && !busy && <li className="px-4 py-3 text-sm text-slate">No matches yet. Try a film, actor or brand.</li>}
          {items.map((h, i) => {
            const header = h.type !== lastType ? GROUP[h.type] : null;
            lastType = h.type;
            return (
              <li key={h.href + h.label + i} role="presentation">
                {header && <div className="eyebrow px-4 pb-1 pt-3">{header}</div>}
                <a id={`${uid}-opt-${i}`} role="option" aria-selected={i === active} href={h.href}
                  onClick={(e) => { e.preventDefault(); go(h); }} onMouseEnter={() => setActive(i)}
                  className={`flex items-baseline justify-between gap-4 px-4 py-2 text-sm ${i === active ? "bg-champagne-light/60" : ""}`}>
                  <span className="font-medium">{h.label}</span><span className="truncate text-xs text-slate">{h.sub}</span>
                </a>
              </li>
            );
          })}
          {searching && hits.length > 0 && <li role="presentation" className="border-t border-line px-4 py-2 text-xs"><a href={`/search?q=${encodeURIComponent(q)}`} className="text-champagne-text underline">See all results for “{q}”</a></li>}
        </ul>
      )}
    </div>
  );
}
