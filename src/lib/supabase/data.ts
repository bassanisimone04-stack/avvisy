"use client";

import { createClient } from "./client";
import {
  rowToCompany,
  rowToLot,
  rowToNotification,
  rowToOffer,
  rowToOrder,
  rowToReview,
  rowToSavedSearch,
} from "./mappers";
import type { StoreState } from "@/lib/store";

/**
 * Carica lo stato dell'app da Supabase. I dati pubblici (aziende, lotti,
 * recensioni) sono sempre leggibili; offerte/ordini/preferiti dipendono
 * dall'utente autenticato (RLS).
 */
export async function fetchStoreState(): Promise<Partial<StoreState> | null> {
  const supabase = createClient();
  if (!supabase) return null;

  const [companies, lots, offers, orders, notifications, reviews, favorites, searches] =
    await Promise.all([
      supabase.from("companies").select("*"),
      supabase.from("lots").select("*"),
      supabase.from("offers").select("*"),
      supabase.from("orders").select("*"),
      supabase.from("notifications").select("*").order("date", { ascending: false }),
      supabase.from("reviews").select("*"),
      supabase.from("favorites").select("lot_id"),
      supabase.from("saved_searches").select("*").order("created_at", { ascending: false }),
    ]);

  return {
    companies: (companies.data ?? []).map(rowToCompany),
    lots: (lots.data ?? []).map(rowToLot),
    offers: (offers.data ?? []).map(rowToOffer),
    orders: (orders.data ?? []).map(rowToOrder),
    notifications: (notifications.data ?? []).map(rowToNotification),
    reviews: (reviews.data ?? []).map(rowToReview),
    favorites: (favorites.data ?? []).map((r: { lot_id: string }) => r.lot_id),
    savedSearches: (searches.data ?? []).map(rowToSavedSearch),
  };
}

/** Azienda associata all'utente autenticato (o null). */
export async function fetchMyCompanyId(): Promise<string | null> {
  const supabase = createClient();
  if (!supabase) return null;
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;
  const { data } = await supabase
    .from("companies")
    .select("id")
    .eq("owner", auth.user.id)
    .maybeSingle();
  return data?.id ?? null;
}
