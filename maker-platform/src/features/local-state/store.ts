"use client";

/**
 * DEMO-ONLY client state for cart and favorites, persisted in localStorage.
 * It is per-browser and never reaches a server. Phase 2 moves favorites to
 * Supabase; Phase 4 moves the cart to a server-validated Stripe Checkout.
 */
import { useSyncExternalStore } from "react";
import type { LicenseType } from "@/features/catalog/types";

export interface CartItem {
  slug: string;
  license: LicenseType;
}

export interface FavoriteRef {
  kind: "product" | "business";
  slug: string;
}

interface State {
  cart: CartItem[];
  favorites: FavoriteRef[];
}

const KEY = "maker-platform:v1";
const empty: State = { cart: [], favorites: [] };
let state: State = empty;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<State>;
      state = {
        cart: Array.isArray(parsed.cart) ? parsed.cart.filter((i) => typeof i?.slug === "string") : [],
        favorites: Array.isArray(parsed.favorites) ? parsed.favorites.filter((f) => typeof f?.slug === "string") : [],
      };
    }
  } catch {
    state = empty;
  }
}

function commit(next: State) {
  state = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable (private mode) — keep in memory only */
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  load();
  listeners.add(l);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      loaded = false;
      load();
      l();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
}

const getSnapshot = () => {
  load();
  return state;
};
const getServerSnapshot = () => empty;

export function useLocalState() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export const actions = {
  addToCart(item: CartItem) {
    const cart = state.cart.filter((i) => i.slug !== item.slug);
    commit({ ...state, cart: [...cart, item] });
  },
  removeFromCart(slug: string) {
    commit({ ...state, cart: state.cart.filter((i) => i.slug !== slug) });
  },
  setLicense(slug: string, license: LicenseType) {
    commit({ ...state, cart: state.cart.map((i) => (i.slug === slug ? { ...i, license } : i)) });
  },
  toggleFavorite(ref: FavoriteRef) {
    const exists = state.favorites.some((f) => f.kind === ref.kind && f.slug === ref.slug);
    commit({
      ...state,
      favorites: exists ? state.favorites.filter((f) => !(f.kind === ref.kind && f.slug === ref.slug)) : [...state.favorites, ref],
    });
  },
};

export function isFavorite(s: State, ref: FavoriteRef) {
  return s.favorites.some((f) => f.kind === ref.kind && f.slug === ref.slug);
}
