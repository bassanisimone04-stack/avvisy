// Domain model for the Scortvia B2B marketplace prototype.
// Everything here is fictional demo data — no real payments, identities or
// external services are involved.

export type VerificationStatus = "verificata" | "in_verifica" | "sospesa";

export type MerchandiseCondition =
  | "Nuovo"
  | "Come nuovo"
  | "Usato - buono"
  | "Usato - funzionante"
  | "Ricondizionato"
  | "Fine serie";

export type CategorySlug =
  | "componenti-industriali"
  | "ricambi"
  | "materiali-edili"
  | "imballaggi"
  | "elettronica-professionale"
  | "attrezzature"
  | "arredi-aziendali"
  | "materie-prime";

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
  /** Number of demo listings, used for the categories overview. */
  count: number;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  vatNumber: string; // Partita IVA (fittizia)
  city: string;
  region: string;
  sector: string;
  status: VerificationStatus;
  rating: number; // 0-5
  reviewsCount: number;
  salesCount: number;
  memberSince: string; // ISO date
  bio: string;
  /** Simulated wallet balance in EUR. */
  walletBalance: number;
}

export interface Review {
  id: string;
  companyId: string; // company being reviewed (seller)
  authorCompany: string;
  rating: number; // 1-5
  date: string; // ISO
  title: string;
  body: string;
  lotId?: string;
}

export type LotSaleMode = "immediato" | "negoziabile" | "entrambi";

export interface Lot {
  id: string;
  slug: string;
  title: string;
  category: CategorySlug;
  sellerId: string;
  description: string;
  quantity: number;
  minQuantity: number;
  unit: string; // pz, kg, bancali, m...
  unitPrice: number; // EUR
  condition: MerchandiseCondition;
  city: string;
  region: string;
  saleMode: LotSaleMode;
  shipping: boolean;
  pickup: boolean;
  documents: string[];
  certifications: string[];
  views: number;
  publishedAt: string; // ISO
  featured?: boolean;
  /** Accent used by the generated illustration. */
  imageSeed: number;
}

export type OfferStatus =
  | "Inviata"
  | "In valutazione"
  | "Controproposta"
  | "Accettata"
  | "Rifiutata"
  | "Scaduta";

export interface Offer {
  id: string;
  lotId: string;
  buyerCompany: string;
  sellerId: string;
  quantity: number;
  proposedUnitPrice: number;
  message: string;
  status: OfferStatus;
  date: string; // ISO
  /** Optional seller counter proposal. */
  counterUnitPrice?: number;
}

export type OrderStatus =
  | "In lavorazione"
  | "In spedizione"
  | "Consegnato"
  | "Concluso"
  | "Annullato";

export interface Order {
  id: string;
  lotId: string;
  lotTitle: string;
  buyerCompany: string;
  sellerId: string;
  quantity: number;
  unitPrice: number;
  status: OrderStatus;
  date: string; // ISO
  fulfilment: "Spedizione" | "Ritiro in sede";
}

export interface DemoNotification {
  id: string;
  icon: "offer" | "order" | "message" | "verify" | "system";
  title: string;
  detail: string;
  time: string;
  unread: boolean;
}

export const COMMISSION_RATE = 0.025; // 2,5% trattenuta sulle transazioni concluse
