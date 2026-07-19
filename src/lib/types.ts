// Modello dati del marketplace B2B Scortvia (prototipo).
// Dati fittizi, pagamenti/verifiche simulati: nessun servizio esterno reale.

export const COMMISSION_RATE = 0.025; // 2,5% trattenuta sulle transazioni concluse

// ---------------------------------------------------------------------------
// Enumerazioni di stato
// ---------------------------------------------------------------------------

export type VerificationStatus =
  | "Non verificata"
  | "In verifica"
  | "Verificata"
  | "Sospesa";

export type LotStatus =
  | "Bozza"
  | "In revisione"
  | "Pubblicato"
  | "Riservato"
  | "Venduto"
  | "Scaduto"
  | "Sospeso";

export type OfferStatus =
  | "Inviata"
  | "Visualizzata"
  | "In valutazione"
  | "Controproposta"
  | "Accettata"
  | "Rifiutata"
  | "Ritirata"
  | "Scaduta";

export type OrderStatus =
  | "In attesa di conferma"
  | "Confermato"
  | "In preparazione"
  | "Spedito"
  | "Consegnato"
  | "Completato"
  | "Contestato"
  | "Annullato";

export type DeliveryMode =
  | "Spedizione"
  | "Ritiro in sede"
  | "Spedizione e ritiro";

export type MerchandiseCondition =
  | "Nuovo"
  | "Come nuovo"
  | "Usato - buono"
  | "Usato - funzionante"
  | "Ricondizionato"
  | "Fine serie";

// ---------------------------------------------------------------------------
// Categorie
// ---------------------------------------------------------------------------

export interface Category {
  slug: string;
  name: string;
  description: string;
  subcategories: string[];
  count: number;
}

// ---------------------------------------------------------------------------
// Azienda
// ---------------------------------------------------------------------------

export interface Company {
  id: string;
  ragioneSociale: string;
  displayName: string;
  vatNumber: string; // Partita IVA fittizia
  sector: string;
  description: string;
  region: string;
  province: string;
  address: string;
  foundedYear: number;
  employees: string;
  verification: VerificationStatus;
  rating: number; // 0-5
  reviewsCount: number;
  /** Iniziali usate come "logo" testuale. */
  logo: string;
  verifiedDocuments: string[];
  registeredAt: string; // ISO
  salesCount: number;
  /** Saldo simulato in EUR. */
  walletBalance: number;
}

// ---------------------------------------------------------------------------
// Lotto
// ---------------------------------------------------------------------------

export interface Lot {
  id: string;
  title: string;
  code: string; // es. SCV-1042
  shortDescription: string;
  description: string;
  category: string; // slug categoria
  subcategory: string;
  images: number[]; // seed illustrazioni
  quantity: number;
  unit: string;
  minQuantity: number;
  unitPrice: number;
  negotiable: boolean;
  condition: MerchandiseCondition;
  region: string;
  province: string;
  delivery: DeliveryMode;
  documents: string[];
  certifications: string[];
  sellerId: string;
  publishedAt: string; // ISO
  expiresAt: string; // ISO
  views: number;
  offersCount: number;
  status: LotStatus;
  featured?: boolean;
}

export function lotTotal(lot: Pick<Lot, "unitPrice" | "quantity">): number {
  return lot.unitPrice * lot.quantity;
}

// ---------------------------------------------------------------------------
// Offerta
// ---------------------------------------------------------------------------

export interface CounterEntry {
  by: "buyer" | "seller";
  unitPrice: number;
  quantity: number;
  message?: string;
  date: string; // ISO
}

export interface Offer {
  id: string;
  lotId: string;
  buyerId: string;
  sellerId: string;
  quantity: number;
  unitPrice: number; // prezzo unitario corrente proposto
  totalValue: number;
  message: string;
  date: string; // ISO
  expiresAt: string; // ISO
  status: OfferStatus;
  history: CounterEntry[];
}

// ---------------------------------------------------------------------------
// Ordine
// ---------------------------------------------------------------------------

export interface OrderEvent {
  status: OrderStatus;
  date: string; // ISO
  note?: string;
}

export interface Order {
  id: string;
  code: string; // ORD-2026-0148
  lotId: string;
  lotTitle: string;
  buyerId: string;
  sellerId: string;
  quantity: number;
  unitPrice: number; // prezzo concordato
  subtotal: number;
  commission: number; // commissione Scortvia
  total: number;
  delivery: DeliveryMode;
  status: OrderStatus;
  history: OrderEvent[];
  documents: string[];
  date: string; // ISO
}

// ---------------------------------------------------------------------------
// Notifiche
// ---------------------------------------------------------------------------

export type NotificationType =
  | "offerta_ricevuta"
  | "offerta_accettata"
  | "controproposta"
  | "lotto_scadenza"
  | "ordine_aggiornato"
  | "verifica_completata"
  | "messaggio"
  | "sistema";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  detail: string;
  date: string; // ISO
  read: boolean;
  href?: string;
  audience: "seller" | "buyer" | "both";
}

// ---------------------------------------------------------------------------
// Recensioni
// ---------------------------------------------------------------------------

export interface Review {
  id: string;
  companyId: string;
  authorCompany: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  lotId?: string;
}

// ---------------------------------------------------------------------------
// Ricerche salvate
// ---------------------------------------------------------------------------

export interface SavedSearch {
  id: string;
  label: string;
  query: string;
  alerts: boolean;
}
