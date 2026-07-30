export type Category =
  | "ristorante"
  | "pizzeria"
  | "hotel"
  | "farmacia"
  | "supermercato"
  | "negozio"
  | "bar-pasticceria"
  | "gelateria";

export interface CategoryInfo {
  slug: Category;
  label: string;
  labelPlural: string;
  labelEn: string;
  labelPluralEn: string;
  icon: string;
  description: string;
  descriptionEn: string;
}

export type PriceRange = "€" | "€€" | "€€€";

export interface OpeningHoursDay {
  day: string;
  hours: string | null;
}

export interface Review {
  id: string;
  author: string;
  avatarSeed: number;
  rating: number;
  date: string;
  title: string;
  body: string;
  verifiedCeliac?: boolean;
  helpful?: number;
  photos?: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Business {
  id: string;
  slug: string;
  name: string;
  category: Category;
  region: string;
  province: string;
  provinceCode: string;
  city: string;
  address: string;
  postalCode: string;
  lat: number;
  lng: number;
  phone: string;
  website: string;
  instagram?: string;
  facebook?: string;
  description: string;
  shortDescription: string;
  priceRange: PriceRange;
  rating: number;
  reviewCount: number;
  aicCertified: boolean;
  delivery: boolean;
  takeaway: boolean;
  openNow: boolean;
  hours: OpeningHoursDay[];
  services: string[];
  glutenFreeMenu: string[];
  gallerySeeds: number[];
  /** Foto reale caricata dal locale o verificata da noi; se assente si usa l'illustrazione SVG. */
  photoUrl?: string;
  reviews: Review[];
  faqs: FaqItem[];
  featured?: boolean;
  createdAt: string;
}

export type BlogCategory =
  | "Alimentazione"
  | "Celiachia"
  | "News"
  | "Ricette"
  | "Viaggi"
  | "Salute"
  | "Guide"
  | "Prodotti"
  | "Bambini"
  | "Eventi";

export interface ArticleHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface Comment {
  id: string;
  author: string;
  avatarSeed: number;
  date: string;
  body: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  category: BlogCategory;
  excerpt: string;
  coverSeed: number;
  author: string;
  authorRole: string;
  authorAvatarSeed: number;
  publishedAt: string;
  updatedAt: string;
  readingTime: number;
  headings: ArticleHeading[];
  contentHtml: string;
  keyTakeaways: string[];
  faqs: FaqItem[];
  tags: string[];
  comments: Comment[];
  featured?: boolean;
}

export type ProductCategory =
  | "Pasta e cereali"
  | "Pane e sostituti"
  | "Snack e dolci"
  | "Farine e mix"
  | "Prodotti da forno"
  | "Condimenti";

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: ProductCategory;
  description: string;
  imageSeed: number;
  price: number;
  rating: number;
  reviewCount: number;
  aicCertified: boolean;
  whereToBuy: string[];
  tags: string[];
  /** Foto reale del prodotto/alimento; se assente si usa l'illustrazione SVG. */
  photoUrl?: string;
}

export interface RegionData {
  name: string;
  slug: string;
  provinces: { name: string; code: string; slug: string; comuni: string[] }[];
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  avatarSeed: number;
  role: "utente" | "azienda" | "admin";
  favorites: string[];
  joinedAt: string;
}
