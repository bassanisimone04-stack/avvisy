"use client";

import { useEffect, useRef, useState } from "react";

/** Ritarda l'aggiornamento di un valore (usato per la ricerca). */
export function useDebounce<T>(value: T, delay = 250): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

/** true dopo il mount, per evitare mismatch di idratazione. */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

/**
 * Simula un caricamento asincrono: parte in `loading` e passa a `false` dopo
 * `ms`, oppure ogni volta che cambia una delle `deps`.
 */
export function useSimulatedLoading(ms = 600, deps: unknown[] = []): boolean {
  const [loading, setLoading] = useState(true);
  const first = useRef(true);
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), first.current ? ms : Math.min(ms, 400));
    first.current = false;
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return loading;
}
