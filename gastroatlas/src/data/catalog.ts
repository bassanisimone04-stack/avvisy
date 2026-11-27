import type { Locale } from "@/lib/i18n";

/**
 * DEMO CATALOGUE — every venue, price and distinction below is fictional.
 * Slugs (atlas-1 … atlas-30) are public URLs and must not change.
 */
export type Bilingual = Record<Locale, string>;
export type City = { slug: string; name: Bilingual; country: Bilingual };
export type Cuisine = { key: string; name: Bilingual };
export type PhotoName = "plate0" | "plate1" | "plate2";
export type Restaurant = {
  slug: string;
  name: string;
  city: City;
  cuisine: Cuisine;
  /** Fictional "demo distinction" level (not a real award). */
  level: 1 | 2 | 3;
  /** Fictional dinner tasting-menu price in EUR. */
  price: number;
  image: PhotoName;
  rooms: boolean;
  isDemo: true;
};

export const BRAND = { name: "GASTROATLAS", short: "GastroAtlas", currency: "EUR" } as const;

const c = (slug: string, en: string, it: string, countryIt: string, countryEn: string): City => ({ slug, name: { en, it }, country: { en: countryEn, it: countryIt } });
export const cities: City[] = [
  c("paris", "Paris", "Parigi", "Francia", "France"),
  c("tokyo", "Tokyo", "Tokyo", "Giappone", "Japan"),
  c("milan", "Milan", "Milano", "Italia", "Italy"),
  c("london", "London", "Londra", "Regno Unito", "United Kingdom"),
  c("new-york", "New York", "New York", "Stati Uniti", "United States"),
  c("dubai", "Dubai", "Dubai", "Emirati Arabi Uniti", "United Arab Emirates"),
  c("rome", "Rome", "Roma", "Italia", "Italy"),
  c("barcelona", "Barcelona", "Barcellona", "Spagna", "Spain"),
  c("copenhagen", "Copenhagen", "Copenaghen", "Danimarca", "Denmark"),
  c("singapore", "Singapore", "Singapore", "Singapore", "Singapore"),
];

export const cuisines: Cuisine[] = [
  { key: "French", name: { en: "French", it: "Francese" } },
  { key: "Japanese", name: { en: "Japanese", it: "Giapponese" } },
  { key: "Italian", name: { en: "Italian", it: "Italiana" } },
  { key: "Contemporary", name: { en: "Contemporary", it: "Contemporanea" } },
];

const names = ["Aubépine et Sel", "Kohaku no Niwa", "Orto delle Ombre", "Fern and Flint", "Juniper Ledger", "Saffron Meridian", "Corte di Sale", "Brasa de Llum", "Havtorn Bord", "Pandan & Ember", "Lune de Sureau", "Yuki to Mori", "Corte del Ginepro", "Briar & Chalk", "Copper Orchard", "Dune and Date", "Tavola di Vetro", "Ombra de Mar", "Lys of Nord", "Tamarind Ink", "Verre d’Orme", "Hana no Shio", "Nebbia di Riso", "Ash and Elder", "Wren Atelier", "Cinder Palm", "Forno Luna", "Bosc de Sal", "Morgen Havn", "Salted Palm"];

export const restaurants: Restaurant[] = names.map((name, i) => ({
  name,
  slug: `atlas-${i + 1}`,
  city: cities[i % 10]!,
  cuisine: cuisines[i % 4]!,
  level: (1 + (i % 3)) as 1 | 2 | 3,
  price: 65 + ((i * 17) % 219),
  image: `plate${i % 3}` as PhotoName,
  rooms: i % 4 === 0,
  isDemo: true,
}));

export const findRestaurant = (slug: string) => restaurants.find((r) => r.slug === slug);
export const findCity = (slug: string) => cities.find((x) => x.slug === slug);

export const sectionTitles = {
  destinations: ["Destinations", "Destinazioni"], restaurants: ["Restaurants", "Ristoranti"], hotels: ["Hotels", "Hotel"],
  experiences: ["Experiences", "Esperienze"], travel: ["Travel", "Viaggi"], gifts: ["Gifts", "Regali"], magazine: ["Magazine", "Magazine"],
  "price-index": ["Price Index", "Indice dei prezzi"], club: ["Club", "Club"], favorites: ["Favourites", "Preferiti"],
  compare: ["Compare", "Confronta"], about: ["About", "Chi siamo"], methodology: ["Methodology", "Metodologia"], account: ["Account", "Account"],
  business: ["For Business", "Per le aziende"], concierge: ["Concierge", "Concierge"], legal: ["Legal", "Informazioni legali"],
} as const;
export type SectionKey = keyof typeof sectionTitles;
export const title = (key: SectionKey, locale: Locale) => sectionTitles[key][locale === "it" ? 1 : 0];
