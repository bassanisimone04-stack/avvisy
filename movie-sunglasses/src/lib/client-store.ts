"use client";
import { useCallback, useSyncExternalStore } from "react";

/** Tiny localStorage-backed list shared across components and tabs. Always safe if storage is blocked. */
const EVT = "ss-store";
const cache = new Map<string, { raw: string | null; val: string[] }>();

function read(key: string): string[] {
  let raw: string | null = null;
  try { raw = localStorage.getItem(key); } catch { /* blocked */ }
  const hit = cache.get(key);
  if (hit && hit.raw === raw) return hit.val;
  let val: string[] = [];
  try { const p = raw ? JSON.parse(raw) : []; if (Array.isArray(p)) val = p.filter((x) => typeof x === "string"); } catch { /* corrupt */ }
  cache.set(key, { raw, val });
  return val;
}
const EMPTY: string[] = [];

export function writeList(key: string, val: string[]) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* blocked: state stays per-tab via cache below */ cache.set(key, { raw: JSON.stringify(val), val }); }
  window.dispatchEvent(new Event(EVT));
}

export function useList(key: string): string[] {
  const subscribe = useCallback((cb: () => void) => {
    window.addEventListener(EVT, cb); window.addEventListener("storage", cb);
    return () => { window.removeEventListener(EVT, cb); window.removeEventListener("storage", cb); };
  }, []);
  return useSyncExternalStore(subscribe, () => read(key), () => EMPTY);
}

export const COMPARE_KEY = "ss-compare";
export const SAVED_KEY = "ss-saved";
export const RECENT_KEY = "ss-recent";
export const COMPARE_MAX = 3;

export function toggleId(key: string, id: string, max = 50): "added" | "removed" | "full" {
  const cur = read(key);
  if (cur.includes(id)) { writeList(key, cur.filter((x) => x !== id)); return "removed"; }
  if (cur.length >= max) return "full";
  writeList(key, [...cur, id]);
  return "added";
}

/** Events fired before a lazily loaded component mounted are parked here and consumed on mount. */
type PendingWindow = Window & { __ssPending?: Set<string>; __ssMounted?: Set<string> };
export function parkEvent(name: string) {
  const w = window as PendingWindow;
  if (w.__ssMounted?.has(name)) return; // the component is already listening itself
  (w.__ssPending ??= new Set()).add(name);
}
/** Called by a lazy component when it starts listening; returns the cleanup. Also drains a parked request. */
export function markMounted(name: string): { parked: boolean; unmount: () => void } {
  const w = window as PendingWindow;
  (w.__ssMounted ??= new Set()).add(name);
  const parked = !!w.__ssPending?.delete(name);
  return { parked, unmount: () => { w.__ssMounted?.delete(name); } };
}
