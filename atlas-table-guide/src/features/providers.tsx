"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Rates } from "@/lib/price";
import { COMPARE_MAX } from "@/lib/compare-url";

type Units = "metric" | "imperial";
type CompareItem = { slug: string; name: string };
type Ctx = {
  rates: Rates;
  currency: string;
  setCurrency: (c: string) => void;
  units: Units;
  setUnits: (u: Units) => void;
  favourites: string[];
  toggleFavourite: (key: string) => void;
  compare: CompareItem[];
  toggleCompare: (item: CompareItem) => boolean;
  clearCompare: () => void;
  announce: (msg: string) => void;
};

const AppCtx = createContext<Ctx | null>(null);
export const useApp = () => {
  const c = useContext(AppCtx);
  if (!c) throw new Error("useApp outside AppProvider");
  return c;
};

const read = <T,>(k: string, d: T): T => {
  try {
    const v = localStorage.getItem(k);
    return v ? (JSON.parse(v) as T) : d;
  } catch {
    return d;
  }
};
const write = (k: string, v: unknown) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {
    /* storage unavailable (private mode) — state stays in memory */
  }
};

export function AppProvider({ rates, defaultCurrency, children }: { rates: Rates; defaultCurrency: string; children: ReactNode }) {
  const [currency, setCurrencyState] = useState(defaultCurrency);
  const [units, setUnitsState] = useState<Units>("metric");
  const [favourites, setFavourites] = useState<string[]>([]);
  const [compare, setCompare] = useState<CompareItem[]>([]);
  const [message, setMessage] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    setCurrencyState(read("atg:currency", defaultCurrency));
    setUnitsState(read<Units>("atg:units", "metric"));
    setFavourites(read<string[]>("atg:favs", []));
    setCompare(read<CompareItem[]>("atg:compare", []));
    const onStorage = (e: StorageEvent) => {
      if (e.key === "atg:favs") setFavourites(read("atg:favs", []));
      if (e.key === "atg:compare") setCompare(read("atg:compare", []));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [defaultCurrency]);

  const announce = useCallback((msg: string) => {
    setMessage("");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(msg), 30);
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      rates,
      currency,
      setCurrency: (c) => { setCurrencyState(c); write("atg:currency", c); document.cookie = `atg_currency=${c};path=/;max-age=31536000;samesite=lax`; },
      units,
      setUnits: (u) => { setUnitsState(u); write("atg:units", u); },
      favourites,
      toggleFavourite: (key) => setFavourites((prev) => { const next = prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]; write("atg:favs", next); return next; }),
      compare,
      toggleCompare: (item) => {
        let ok = true;
        setCompare((prev) => {
          if (prev.some((p) => p.slug === item.slug)) { const n = prev.filter((p) => p.slug !== item.slug); write("atg:compare", n); return n; }
          if (prev.length >= COMPARE_MAX) { ok = false; return prev; }
          const n = [...prev, item]; write("atg:compare", n); return n;
        });
        return ok;
      },
      clearCompare: () => { setCompare([]); write("atg:compare", []); },
      announce,
    }),
    [rates, currency, units, favourites, compare, announce],
  );

  return (
    <AppCtx.Provider value={value}>
      {children}
      <div aria-live="polite" role="status" className="sr-only">{message}</div>
      {message && (
        <div className="pointer-events-none fixed inset-x-0 top-[calc(var(--header-h)+12px)] z-[70] flex justify-center px-4" aria-hidden="true">
          <div className="rounded-[10px] bg-ink px-4 py-2 text-sm text-white shadow-card">{message}</div>
        </div>
      )}
    </AppCtx.Provider>
  );
}
