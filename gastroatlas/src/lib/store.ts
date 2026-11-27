"use client";

import { useSyncExternalStore } from "react";

/**
 * Tiny localStorage-backed list store shared by every component (and every tab, via the `storage` event).
 * Keys are the same as the original static site so existing visitors keep their favourites.
 */
export const KEYS = { saves: "atlas-saves", compare: "atlas-compare" } as const;

const EMPTY: readonly string[] = [];
const cache = new Map<string, { raw: string | null; value: readonly string[] }>();
const listeners = new Set<() => void>();

function read(key: string): readonly string[] {
  let raw: string | null = null;
  try { raw = localStorage.getItem(key); } catch { /* storage blocked */ }
  const hit = cache.get(key);
  if (hit && hit.raw === raw) return hit.value;
  let value: readonly string[] = EMPTY;
  try { const p = JSON.parse(raw ?? "[]"); if (Array.isArray(p)) value = p.filter((x): x is string => typeof x === "string"); } catch { /* corrupt → empty */ }
  cache.set(key, { raw, value });
  return value;
}

function write(key: string, value: readonly string[]) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* private mode: keep in memory */ cache.set(key, { raw: JSON.stringify(value), value }); }
  listeners.forEach((l) => l());
}

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => { if (e.key === null || Object.values(KEYS).includes(e.key as never)) cb(); };
  window.addEventListener("storage", onStorage);
  return () => { listeners.delete(cb); window.removeEventListener("storage", onStorage); };
};

export function useList(key: (typeof KEYS)[keyof typeof KEYS]) {
  const list = useSyncExternalStore(subscribe, () => read(key), () => EMPTY);
  return list;
}

export const toggleSaved = (slug: string) => { const l = read(KEYS.saves); write(KEYS.saves, l.includes(slug) ? l.filter((x) => x !== slug) : [...l, slug]); };

/** Returns false when adding a 5th item (max 4). */
export function setCompared(slug: string, on: boolean, max = 4): boolean {
  const l = read(KEYS.compare);
  if (on) { if (l.includes(slug)) return true; if (l.length >= max) return false; write(KEYS.compare, [...l, slug]); return true; }
  write(KEYS.compare, l.filter((x) => x !== slug));
  return true;
}

export const clearLocalData = () => { try { localStorage.removeItem(KEYS.saves); localStorage.removeItem(KEYS.compare); } catch { /* ignore */ } cache.clear(); listeners.forEach((l) => l()); };
