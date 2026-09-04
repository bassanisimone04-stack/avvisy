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
    description: "Menu completi senza glutine per celiaci, dalla trattoria di quartiere al ristorante fine dining, con cucina o forno dedicati contro la contaminazione crociata.",
    descriptionEn: "Full gluten-free menus for celiacs, from neighborhood trattorias to fine dining, with dedicated kitchens against cross-contamination.",
  },
  {
    slug: "pizzeria",
    label: "Pizzeria",
    labelPlural: "Pizzerie",
    labelEn: "Pizzeria",
    labelPluralEn: "Pizzerias",
    icon: "Pizza",
    description: "Pizzerie senza glutine con impasti e forni dedicati, per una pizza napoletana o gourmet sicura al 100% per i celiaci.",
    descriptionEn: "Gluten-free pizzerias with dedicated dough and separate ovens, for safe Neapolitan or gourmet pizza.",
  },
  {
    slug: "hotel",
    label: "Hotel",
    labelPlural: "Hotel e B&B",
    labelEn: "Hotel",
    labelPluralEn: "Hotels & B&Bs",
    icon: "BedDouble",
    description: "Hotel e B&B con colazione senza glutine certificata AIC e cucina gluten free, ideali per una vacanza senza pensieri da celiaco.",
    descriptionEn: "Hotels and B&Bs with AIC-certified gluten-free breakfast and kitchens, ideal for a worry-free celiac holiday.",
  },
  {
    slug: "farmacia",
    label: "Farmacia",
    labelPlural: "Farmacie",
    labelEn: "Pharmacy",
    labelPluralEn: "Pharmacies",
    icon: "Stethoscope",
    description: "Farmacie con prodotti senza glutine erogabili con buono AIC, integratori per celiaci e consulenza dedicata sulla dieta gluten free.",
    descriptionEn: "Pharmacies with AIC-voucher gluten-free products, celiac supplements and dedicated advice on the gluten-free diet.",
  },
  {
    slug: "supermercato",
    label: "Supermercato",
    labelPlural: "Supermercati",
    labelEn: "Supermarket",
    labelPluralEn: "Supermarkets",
    icon: "ShoppingCart",
    description: "Supermercati con reparto senza glutine assortito, prodotti certificati con la Spiga Barrata per la spesa quotidiana dei celiaci.",
    descriptionEn: "Supermarkets with a well-stocked gluten-free aisle, Crossed Grain certified products for everyday celiac shopping.",
  },
  {
    slug: "negozio",
    label: "Negozio specializzato",
    labelPlural: "Negozi specializzati",
    labelEn: "Specialty shop",
    labelPluralEn: "Specialty shops",
    icon: "Store",
    description: "Negozi specializzati 100% senza glutine, con pane, pasta e dolci freschi certificati AIC per la spesa dei celiaci.",
    descriptionEn: "Specialty shops 100% dedicated to gluten-free, with fresh AIC-certified bread, pasta and desserts for celiac shopping.",
  },
  {
    slug: "bar-pasticceria",
    label: "Bar e Pasticceria",
    labelPlural: "Bar e Pasticcerie",
    labelEn: "Café & Bakery",
    labelPluralEn: "Cafés & Bakeries",
    icon: "Croissant",
    description: "Bar e pasticcerie con colazione senza glutine tutti i giorni: cornetti, lievitati e dolci certificati per celiaci.",
    descriptionEn: "Cafés and bakeries with gluten-free breakfast every day: croissants, pastries and certified treats for celiacs.",
  },
  {
    slug: "gelateria",
    label: "Gelateria",
    labelPlural: "Gelaterie",
    labelEn: "Ice cream shop",
    labelPluralEn: "Ice cream shops",
    icon: "IceCreamCone",
    description: "Gelaterie con gelato artigianale senza glutine, coni e vaschette dedicate per evitare la contaminazione crociata.",
    descriptionEn: "Ice cream shops with gluten-free artisan gelato, dedicated cones and tubs to avoid cross-contamination.",
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
