import type { CategoryInfo } from "./types";
import type { Locale } from "./i18n/locale";

export const CATEGORIES: CategoryInfo[] = [
  {
    slug: "ristorante",
    label: "Ristorante",
    labelPlural: "Ristoranti",
    labelEn: "Restaurant",
    labelPluralEn: "Restaurants",
    icon: "UtensilsCrossed",
    description: "Cucina completa senza glutine, dalla trattoria al fine dining.",
    descriptionEn: "Full gluten-free menus, from trattorias to fine dining.",
  },
  {
    slug: "pizzeria",
    label: "Pizzeria",
    labelPlural: "Pizzerie",
    labelEn: "Pizzeria",
    labelPluralEn: "Pizzerias",
    icon: "Pizza",
    description: "Impasti dedicati e forni separati per una pizza sicura.",
    descriptionEn: "Dedicated dough and separate ovens for safe pizza.",
  },
  {
    slug: "hotel",
    label: "Hotel",
    labelPlural: "Hotel e B&B",
    labelEn: "Hotel",
    labelPluralEn: "Hotels & B&Bs",
    icon: "BedDouble",
    description: "Strutture ricettive con colazione e cucina gluten free.",
    descriptionEn: "Places to stay with gluten-free breakfast and kitchens.",
  },
  {
    slug: "farmacia",
    label: "Farmacia",
    labelPlural: "Farmacie",
    labelEn: "Pharmacy",
    labelPluralEn: "Pharmacies",
    icon: "Stethoscope",
    description: "Prodotti specifici, integratori e consulenza dedicata.",
    descriptionEn: "Specific products, supplements and dedicated advice.",
  },
  {
    slug: "supermercato",
    label: "Supermercato",
    labelPlural: "Supermercati",
    labelEn: "Supermarket",
    labelPluralEn: "Supermarkets",
    icon: "ShoppingCart",
    description: "Reparti e corner assortiti di prodotti certificati.",
    descriptionEn: "Aisles and corners stocked with certified products.",
  },
  {
    slug: "negozio",
    label: "Negozio specializzato",
    labelPlural: "Negozi specializzati",
    labelEn: "Specialty shop",
    labelPluralEn: "Specialty shops",
    icon: "Store",
    description: "Botteghe dedicate al 100% al senza glutine.",
    descriptionEn: "Shops 100% dedicated to gluten-free products.",
  },
  {
    slug: "bar-pasticceria",
    label: "Bar e Pasticceria",
    labelPlural: "Bar e Pasticcerie",
    labelEn: "Café & Bakery",
    labelPluralEn: "Cafés & Bakeries",
    icon: "Croissant",
    description: "Colazioni, lievitati e dolci senza glutine ogni giorno.",
    descriptionEn: "Breakfast, pastries and gluten-free treats every day.",
  },
  {
    slug: "gelateria",
    label: "Gelateria",
    labelPlural: "Gelaterie",
    labelEn: "Ice cream shop",
    labelPluralEn: "Ice cream shops",
    icon: "IceCreamCone",
    description: "Gelato artigianale sicuro, senza contaminazioni.",
    descriptionEn: "Safe artisan gelato, free from cross-contamination.",
  },
];

export function getCategoryInfo(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function categoryLabel(c: CategoryInfo, locale: Locale) {
  return locale === "en" ? c.labelEn : c.label;
}

export function categoryLabelPlural(c: CategoryInfo, locale: Locale) {
  return locale === "en" ? c.labelPluralEn : c.labelPlural;
}

export function categoryDescription(c: CategoryInfo, locale: Locale) {
  return locale === "en" ? c.descriptionEn : c.description;
}
