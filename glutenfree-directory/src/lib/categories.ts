import type { CategoryInfo } from "./types";

export const CATEGORIES: CategoryInfo[] = [
  {
    slug: "ristorante",
    label: "Ristorante",
    labelPlural: "Ristoranti",
    icon: "UtensilsCrossed",
    description: "Cucina completa senza glutine, dalla trattoria al fine dining.",
  },
  {
    slug: "pizzeria",
    label: "Pizzeria",
    labelPlural: "Pizzerie",
    icon: "Pizza",
    description: "Impasti dedicati e forni separati per una pizza sicura.",
  },
  {
    slug: "hotel",
    label: "Hotel",
    labelPlural: "Hotel e B&B",
    icon: "BedDouble",
    description: "Strutture ricettive con colazione e cucina gluten free.",
  },
  {
    slug: "farmacia",
    label: "Farmacia",
    labelPlural: "Farmacie",
    icon: "Stethoscope",
    description: "Prodotti specifici, integratori e consulenza dedicata.",
  },
  {
    slug: "supermercato",
    label: "Supermercato",
    labelPlural: "Supermercati",
    icon: "ShoppingCart",
    description: "Reparti e corner assortiti di prodotti certificati.",
  },
  {
    slug: "negozio",
    label: "Negozio specializzato",
    labelPlural: "Negozi specializzati",
    icon: "Store",
    description: "Botteghe dedicate al 100% al senza glutine.",
  },
  {
    slug: "bar-pasticceria",
    label: "Bar e Pasticceria",
    labelPlural: "Bar e Pasticcerie",
    icon: "Croissant",
    description: "Colazioni, lievitati e dolci senza glutine ogni giorno.",
  },
  {
    slug: "gelateria",
    label: "Gelateria",
    labelPlural: "Gelaterie",
    icon: "IceCreamCone",
    description: "Gelato artigianale sicuro, senza contaminazioni.",
  },
];

export function getCategoryInfo(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}
