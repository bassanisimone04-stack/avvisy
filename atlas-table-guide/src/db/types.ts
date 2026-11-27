import type { Locale } from "@/config/brand";

export type L10n = { en: string; it?: string };
export type VerificationStatus = "unverified" | "pending" | "verified" | "stale" | "rejected";
export type PublicationStatus = "draft" | "in_review" | "published" | "archived";
export type PriceStatus = "verified" | "estimated" | "missing";

export interface Record_ {
  id: string;
  slug: string;
  isDemo: boolean;
  publicationStatus: PublicationStatus;
  verificationStatus: VerificationStatus;
  sourceUrl?: string;
  lastVerifiedAt?: string; // ISO date
  updatedAt: string; // ISO date
}

export interface ImageRef {
  /** key into the generated image manifest or a storage path */
  key: string;
  /** what the photo shows — used by buildAlt() */
  subject: "dish" | "interior" | "terrace" | "skyline" | "hotel" | "experience" | "wine" | "chef" | "landscape" | "gift" | "table";
  dish?: string;
  illustrative: boolean;
  licence?: string;
  author?: string;
}

export interface Country extends Record_ {
  code: string; // ISO 3166-1 alpha-2
  name: L10n;
  currency: string;
}

export interface Region extends Record_ {
  countrySlug: string;
  name: L10n;
}

export interface City extends Record_ {
  countrySlug: string;
  regionSlug?: string;
  name: L10n;
  lat: number;
  lng: number;
  intro: L10n;
  image: ImageRef;
  bestTimeToBook: L10n;
}

export interface Chef extends Record_ {
  name: string;
  bio: L10n;
  image?: ImageRef;
}

export interface Cuisine {
  slug: string;
  name: L10n;
}

export interface Award {
  body: string;
  title: string;
  year: number;
  sourceUrl: string;
  level: 1 | 2 | 3;
}

export interface Recognition {
  level: 0 | 1 | 2 | 3;
  /** "award" = real, sourced award; "demo" = simulated level on fictional venues */
  kind: "award" | "demo" | "none";
}

export interface PricePoint {
  amount: number;
  currency: string;
  recordedAt: string;
}

export interface MenuPrice {
  id: string;
  name: L10n;
  kind: "tasting" | "a_la_carte" | "wine_pairing" | "set";
  service: "lunch" | "dinner" | "any";
  amount: number | null;
  currency: string;
  status: PriceStatus;
  sourceUrl?: string;
  collectedAt?: string;
  courses?: number;
  season?: { from: string; to: string };
  history: PricePoint[];
}

export type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

export interface OpeningHours {
  days: DayOfWeek[];
  opens: string; // HH:MM
  closes: string;
  validFrom?: string;
  validThrough?: string;
}

export interface SpecialHours {
  date: string;
  closed: boolean;
  note?: string;
}

export interface Features {
  romantic: boolean;
  terrace: boolean;
  seaView: boolean;
  chefsTable: boolean;
  privateDining: boolean;
  rooms: boolean;
  giftCard: boolean;
  accessible: boolean;
  parking: boolean;
}

export interface Dietary {
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
}

export type ReservationMethod = "online" | "phone" | "email";

export interface Restaurant extends Record_ {
  name: string;
  countrySlug: string;
  regionSlug?: string;
  citySlug: string;
  address: { street: string; postalCode: string; locality: string; region?: string; countryCode: string };
  lat: number;
  lng: number;
  cuisines: string[];
  chefSlug?: string;
  style: L10n;
  description: L10n;
  recognition: Recognition;
  awards: Award[];
  atlasSelection: boolean;
  website?: string;
  phone?: string;
  email?: string;
  features: Features;
  dietary: Dietary;
  reservation: { method: ReservationMethod; providerUrl?: string; instructions: L10n };
  dressCode: L10n;
  durationMinutes: number;
  languages: string[];
  atmosphere: L10n;
  familyPolicy: L10n;
  cancellationPolicy: L10n;
  hours: OpeningHours[];
  specialHours: SpecialHours[];
  menus: MenuPrice[];
  images: ImageRef[];
  hotelSlug?: string;
  featured: boolean;
  /** first-party reviews (none collected yet) */
  reviews: { count: number; average: number | null };
}

export type AffiliateId = string;

export interface AffiliateLink {
  id: AffiliateId;
  partner: string;
  url: string;
  label: string;
}

export interface Hotel extends Record_ {
  name: string;
  citySlug: string;
  countrySlug: string;
  category: "recognised-restaurant" | "restaurant-with-rooms" | "boutique" | "gastronomic-resort" | "wine-estate" | "countryside-retreat";
  description: L10n;
  amenities: string[];
  amenitiesIt?: string[];
  restaurantSlugs: string[];
  affiliateId?: AffiliateId;
  priceFrom: { amount: number; currency: string; status: PriceStatus } | null;
  lat: number;
  lng: number;
  address: { street: string; postalCode: string; locality: string; countryCode: string };
  images: ImageRef[];
  rooms: number;
}

export interface Experience extends Record_ {
  name: string;
  nameIt?: string;
  category:
    | "chefs-table"
    | "private-dining"
    | "cooking-class"
    | "wine-tasting"
    | "vineyard-tour"
    | "truffle-hunting"
    | "food-tour"
    | "market-visit"
    | "culinary-weekend";
  citySlug: string;
  countrySlug: string;
  description: L10n;
  durationHours: number;
  price: { amount: number; currency: string; status: PriceStatus } | null;
  affiliateId?: AffiliateId;
  restaurantSlug?: string;
  images: ImageRef[];
  lat: number;
  lng: number;
}

export interface ItineraryItem {
  time: string;
  type: "restaurant" | "hotel" | "experience" | "note";
  ref?: string;
  note: L10n;
}

export interface Itinerary extends Record_ {
  title: L10n;
  summary: L10n;
  countrySlug: string;
  citySlugs: string[];
  days: { day: number; title: L10n; items: ItineraryItem[] }[];
  budgetEstimate: { amount: number; currency: string; perPerson: true };
  image: ImageRef;
}

export type ArticleCategory =
  | "fine-dining"
  | "chefs"
  | "restaurants"
  | "wine-champagne"
  | "luxury-travel"
  | "hotels"
  | "news"
  | "guides"
  | "interviews"
  | "price-index";

export interface Article extends Record_ {
  category: ArticleCategory;
  title: L10n;
  excerpt: L10n;
  author: { name: string; role: string };
  publishedAt: string;
  sections: { heading: string; paragraphs: string[] }[];
  sectionsIt?: { heading: string; paragraphs: string[] }[];
  sponsored: boolean;
  sponsor?: string;
  relatedRestaurants: string[];
  relatedCities: string[];
  image: ImageRef;
}

export interface GiftCard extends Record_ {
  name: L10n;
  category: "any-restaurant" | "tasting-menu" | "dine-and-stay" | "experience";
  values: number[];
  currency: string;
  design: "carmine" | "ivory" | "garnet";
  description: L10n;
}

export interface Collection {
  slug: string;
  title: L10n;
  intro: L10n;
  /** pure predicate over restaurants; evaluated against verified/published data only */
  rule:
    | { type: "recognition"; level: 1 | 2 | 3 }
    | { type: "maxPrice"; amount: number; currency: "EUR" }
    | { type: "feature"; feature: keyof Features }
    | { type: "winePairing" }
    | { type: "affordableRecognised"; amount: number };
}

export interface Dataset {
  source: "demo" | "supabase";
  countries: Country[];
  regions: Region[];
  cities: City[];
  chefs: Chef[];
  cuisines: Cuisine[];
  restaurants: Restaurant[];
  hotels: Hotel[];
  experiences: Experience[];
  itineraries: Itinerary[];
  articles: Article[];
  giftCards: GiftCard[];
  affiliateLinks: AffiliateLink[];
}

export function t(v: L10n | undefined, locale: Locale): string {
  if (!v) return "";
  return (locale !== "en" && v[locale as "it"]) || v.en;
}

/** true when the localized value falls back to English */
export function isFallback(v: L10n | undefined, locale: Locale): boolean {
  return locale !== "en" && !!v && !v[locale as "it"];
}

/** Experience name in the visitor's language (falls back to English). */
export function xname(x: { name: string; nameIt?: string }, locale: Locale): string {
  return locale === "it" && x.nameIt ? x.nameIt : x.name;
}
