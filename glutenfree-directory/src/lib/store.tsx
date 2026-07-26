"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { AppUser } from "./types";

interface NotificationItem {
  id: string;
  text: string;
  date: string;
  read: boolean;
}

interface StoreState {
  user: AppUser | null;
  favorites: string[];
  notifications: NotificationItem[];
}

interface StoreValue extends StoreState {
  login: (name: string, email: string) => void;
  logout: () => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  markAllNotificationsRead: () => void;
}

const STORAGE_KEY = "gfd-store-v1";

const defaultState: StoreState = {
  user: null,
  favorites: [],
  notifications: [
    { id: "n1", text: "Nuovo ristorante certificato AIC aggiunto a Milano.", date: "2026-07-20", read: false },
    { id: "n2", text: "La tua recensione per Osteria Senza Confini è stata pubblicata.", date: "2026-07-15", read: false },
    { id: "n3", text: "Nuovo articolo: Come leggere le etichette alimentari.", date: "2026-07-10", read: true },
  ],
};

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StoreState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState(JSON.parse(raw));
    } catch {
      // localStorage non disponibile: si prosegue con lo stato di default
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const login = useCallback((name: string, email: string) => {
    setState((s) => ({
      ...s,
      user: { id: "u1", name, email, avatarSeed: name.length + 700, role: "utente", favorites: s.favorites, joinedAt: new Date().toISOString() },
    }));
  }, []);

  const logout = useCallback(() => {
    setState((s) => ({ ...s, user: null }));
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      favorites: s.favorites.includes(id) ? s.favorites.filter((f) => f !== id) : [...s.favorites, id],
    }));
  }, []);

  const isFavorite = useCallback((id: string) => state.favorites.includes(id), [state.favorites]);

  const markAllNotificationsRead = useCallback(() => {
    setState((s) => ({ ...s, notifications: s.notifications.map((n) => ({ ...n, read: true })) }));
  }, []);

  const value = useMemo<StoreValue>(
    () => ({ ...state, login, logout, toggleFavorite, isFavorite, markAllNotificationsRead }),
    [state, login, logout, toggleFavorite, isFavorite, markAllNotificationsRead],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore deve essere usato dentro StoreProvider");
  return ctx;
}
