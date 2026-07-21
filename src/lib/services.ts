// Servizi simulati: funzioni pure per ricerca, filtri, ordinamento e creazione
// di entità (lotti, offerte, ordini, notifiche). Nessuna chiamata esterna.

import { categoryName, companyById } from "./mock-data";
import { commission } from "./format";
import { COMMISSION_RATE } from "./types";
import type {
  Company,
  DeliveryMode,
  Lot,
  LotStatus,
  Notification,
  Offer,
  Order,
} from "./types";

// ---------------------------------------------------------------------------
// Ricerca e filtri
// ---------------------------------------------------------------------------

export interface LotFilters {
  q: string;
  category: string;
  region: string;
  conditions: string[];
  priceMin: string;
  priceMax: string;
  qtyMin: string;
  verifiedOnly: boolean;
  shipping: boolean;
  pickup: boolean;
  negotiable: boolean;
}

export const emptyFilters: LotFilters = {
  q: "",
  category: "",
  region: "",
  conditions: [],
  priceMin: "",
  priceMax: "",
  qtyMin: "",
  verifiedOnly: false,
  shipping: false,
  pickup: false,
  negotiable: false,
};

export type SortKey =
  | "recenti"
  | "prezzo-asc"
  | "prezzo-desc"
  | "quantita"
  | "visualizzati"
  | "offerte";

export function countActiveFilters(f: LotFilters): number {
  return (
    (f.category ? 1 : 0) +
    (f.region ? 1 : 0) +
    (f.priceMin ? 1 : 0) +
    (f.priceMax ? 1 : 0) +
    (f.qtyMin ? 1 : 0) +
    f.conditions.length +
    [f.verifiedOnly, f.shipping, f.pickup, f.negotiable].filter(Boolean).length
  );
}

function matchesQuery(lot: Lot, q: string): boolean {
  if (!q.trim()) return true;
  const hay = [
    lot.title,
    lot.code,
    lot.shortDescription,
    lot.description,
    lot.subcategory,
    categoryName(lot.category),
  ]
    .join(" ")
    .toLowerCase();
  return q
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .every((term) => hay.includes(term));
}

/** Lotti visibili pubblicamente nel marketplace. */
export function publicLots(lots: Lot[]): Lot[] {
  return lots.filter((l) => l.status === "Pubblicato");
}

export function filterLots(lots: Lot[], f: LotFilters): Lot[] {
  return lots.filter((lot) => {
    const seller = companyById(lot.sellerId);
    if (!matchesQuery(lot, f.q)) return false;
    if (f.category && lot.category !== f.category) return false;
    if (f.region && lot.region !== f.region) return false;
    if (f.priceMin && lot.unitPrice < Number(f.priceMin)) return false;
    if (f.priceMax && lot.unitPrice > Number(f.priceMax)) return false;
    if (f.qtyMin && lot.quantity < Number(f.qtyMin)) return false;
    if (f.conditions.length > 0 && !f.conditions.includes(lot.condition)) return false;
    if (f.verifiedOnly && seller?.verification !== "Verificata") return false;
    if (f.shipping && lot.delivery === "Ritiro in sede") return false;
    if (f.pickup && lot.delivery === "Spedizione") return false;
    if (f.negotiable && !lot.negotiable) return false;
    return true;
  });
}

export function sortLots(lots: Lot[], key: SortKey): Lot[] {
  const out = [...lots];
  out.sort((a, b) => {
    switch (key) {
      case "prezzo-asc":
        return a.unitPrice - b.unitPrice;
      case "prezzo-desc":
        return b.unitPrice - a.unitPrice;
      case "quantita":
        return b.quantity - a.quantity;
      case "visualizzati":
        return b.views - a.views;
      case "offerte":
        return b.offersCount - a.offersCount;
      default:
        return +new Date(b.publishedAt) - +new Date(a.publishedAt);
    }
  });
  return out;
}

export function paginate<T>(items: T[], page: number, perPage: number): T[] {
  const start = (page - 1) * perPage;
  return items.slice(start, start + perPage);
}

export function similarLots(lots: Lot[], lot: Lot, limit = 3): Lot[] {
  return publicLots(lots)
    .filter((l) => l.category === lot.category && l.id !== lot.id)
    .slice(0, limit);
}

/**
 * Nome visualizzato di un'azienda: prima dallo stato (dati reali Supabase),
 * poi dai dati demo. Evita di mostrare UUID grezzi in modalità Supabase.
 */
export function companyDisplayName(companies: Company[], id: string | undefined): string {
  if (!id) return "";
  return (
    companies.find((c) => c.id === id)?.displayName ??
    companyById(id)?.displayName ??
    "Azienda"
  );
}

/** true se il lotto corrisponde ai termini di una ricerca salvata (testo). */
export function lotMatchesQuery(lot: Lot, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const hay = `${lot.title} ${lot.shortDescription} ${lot.description} ${lot.category} ${lot.subcategory} ${lot.region} ${lot.province}`.toLowerCase();
  return q.split(/\s+/).filter(Boolean).every((term) => hay.includes(term));
}

// ---------------------------------------------------------------------------
// Calcoli economici
// ---------------------------------------------------------------------------

export function offerTotal(unitPrice: number, quantity: number): number {
  return Math.round(unitPrice * quantity * 100) / 100;
}

export interface OrderBreakdown {
  subtotal: number;
  commission: number;
  total: number;
}

export function orderBreakdown(unitPrice: number, quantity: number): OrderBreakdown {
  const subtotal = offerTotal(unitPrice, quantity);
  const fee = commission(subtotal);
  return { subtotal, commission: fee, total: subtotal + fee };
}

export { COMMISSION_RATE };

// ---------------------------------------------------------------------------
// Validazione offerta
// ---------------------------------------------------------------------------

export interface OfferInput {
  quantity: number;
  unitPrice: number;
}

export function validateOffer(lot: Lot, input: OfferInput): string[] {
  const errors: string[] = [];
  if (!input.quantity || input.quantity <= 0)
    errors.push("Inserisci una quantità valida.");
  else {
    if (input.quantity < lot.minQuantity)
      errors.push(`La quantità minima è ${lot.minQuantity} ${lot.unit}.`);
    if (input.quantity > lot.quantity)
      errors.push(`Disponibili solo ${lot.quantity} ${lot.unit}.`);
  }
  if (!input.unitPrice || input.unitPrice <= 0)
    errors.push("Il prezzo proposto deve essere maggiore di zero.");
  return errors;
}

// ---------------------------------------------------------------------------
// Factory di entità (id progressivi lato client)
// ---------------------------------------------------------------------------

function rand(): string {
  return Math.random().toString(36).slice(2, 8);
}

/** Id univoco: uuid reale quando disponibile (compatibile con Supabase). */
export function newId(): string {
  const c = globalThis.crypto as Crypto | undefined;
  if (c && typeof c.randomUUID === "function") return c.randomUUID();
  return `id-${rand()}${rand()}`;
}

export function makeLotCode(): string {
  return `SCV-${Math.floor(2000 + Math.random() * 7000)}`;
}

export interface NewLotInput {
  title: string;
  category: string;
  subcategory: string;
  shortDescription: string;
  description: string;
  quantity: number;
  unit: string;
  minQuantity: number;
  unitPrice: number;
  negotiable: boolean;
  condition: Lot["condition"];
  region: string;
  province: string;
  delivery: DeliveryMode;
  documents: string[];
  certifications: string[];
  sellerId: string;
  imageUrls?: string[];
}

export function createLot(input: NewLotInput): Lot {
  const now = new Date();
  const expires = new Date(now);
  expires.setDate(expires.getDate() + 45);
  return {
    id: newId(),
    code: makeLotCode(),
    title: input.title,
    shortDescription: input.shortDescription,
    description: input.description,
    category: input.category,
    subcategory: input.subcategory,
    images: [Math.floor(Math.random() * 12) + 1, Math.floor(Math.random() * 12) + 1],
    imageUrls: input.imageUrls && input.imageUrls.length ? input.imageUrls : undefined,
    quantity: input.quantity,
    unit: input.unit,
    minQuantity: input.minQuantity,
    unitPrice: input.unitPrice,
    negotiable: input.negotiable,
    condition: input.condition,
    region: input.region,
    province: input.province,
    delivery: input.delivery,
    documents: input.documents,
    certifications: input.certifications,
    sellerId: input.sellerId,
    publishedAt: now.toISOString().slice(0, 10),
    expiresAt: expires.toISOString().slice(0, 10),
    views: 0,
    offersCount: 0,
    status: "In revisione",
  };
}

export interface NewOfferInput {
  lotId: string;
  buyerId: string;
  sellerId: string;
  quantity: number;
  unitPrice: number;
  message: string;
  expiresAt: string;
}

export function createOffer(input: NewOfferInput): Offer {
  return {
    id: newId(),
    lotId: input.lotId,
    buyerId: input.buyerId,
    sellerId: input.sellerId,
    quantity: input.quantity,
    unitPrice: input.unitPrice,
    totalValue: offerTotal(input.unitPrice, input.quantity),
    message: input.message,
    date: new Date().toISOString().slice(0, 10),
    expiresAt: input.expiresAt,
    status: "Inviata",
    history: [
      {
        by: "buyer",
        unitPrice: input.unitPrice,
        quantity: input.quantity,
        message: input.message,
        date: new Date().toISOString().slice(0, 10),
      },
    ],
  };
}

let orderSeq = 200;

export function createOrder(params: {
  lot: Lot;
  buyerId: string;
  quantity: number;
  unitPrice: number;
  delivery?: DeliveryMode;
}): Order {
  const { lot, buyerId, quantity, unitPrice } = params;
  const b = orderBreakdown(unitPrice, quantity);
  const date = new Date().toISOString().slice(0, 10);
  const seq = String(++orderSeq).padStart(4, "0");
  return {
    id: newId(),
    code: `ORD-2026-${seq}`,
    lotId: lot.id,
    lotTitle: lot.title,
    buyerId,
    sellerId: lot.sellerId,
    quantity,
    unitPrice,
    subtotal: b.subtotal,
    commission: b.commission,
    total: b.total,
    delivery: params.delivery ?? lot.delivery,
    status: "In attesa di conferma",
    history: [{ status: "In attesa di conferma", date }],
    documents: [],
    date,
    paid: false,
  };
}

export function makeNotification(
  n: Omit<Notification, "id" | "date" | "read">,
): Notification {
  return {
    ...n,
    id: newId(),
    date: new Date().toISOString().slice(0, 10),
    read: false,
  };
}

// ---------------------------------------------------------------------------
// Ordini: stato successivo suggerito
// ---------------------------------------------------------------------------

const orderFlow: Order["status"][] = [
  "In attesa di conferma",
  "Confermato",
  "In preparazione",
  "Spedito",
  "Consegnato",
  "Completato",
];

export function nextOrderStatus(status: Order["status"]): Order["status"] | null {
  const i = orderFlow.indexOf(status);
  if (i < 0 || i === orderFlow.length - 1) return null;
  return orderFlow[i + 1];
}

export function lotStatusIsPublic(status: LotStatus): boolean {
  return status === "Pubblicato";
}

export type { Company };
