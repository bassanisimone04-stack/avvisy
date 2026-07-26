import type { Product } from "./types";
import { slugify } from "./format";

interface Seed {
  name: string;
  brand: string;
  category: Product["category"];
  description: string;
  price: number;
  rating: number;
  reviewCount: number;
  aicCertified: boolean;
  imageSeed: number;
  whereToBuy: string[];
  tags: string[];
}

const seeds: Seed[] = [
  { name: "Fusilli di mais e riso", brand: "Naturis", category: "Pasta e cereali", description: "Formato classico trafilato al bronzo, tiene bene la cottura ed è ideale per condimenti ricchi.", price: 2.4, rating: 4.6, reviewCount: 312, aicCertified: true, imageSeed: 401, whereToBuy: ["Supermercato Naturasì Bio", "Negozio Senza G"], tags: ["pasta", "senza lattosio"] },
  { name: "Pane in cassetta senza glutine", brand: "Panfree", category: "Pane e sostituti", description: "Pane morbido a lunga conservazione, ottimo anche tostato, senza uova né latte.", price: 3.9, rating: 4.3, reviewCount: 187, aicCertified: true, imageSeed: 402, whereToBuy: ["Supermercato Naturasì Bio"], tags: ["pane", "vegano"] },
  { name: "Mix farina per pizza", brand: "Molino Verde", category: "Farine e mix", description: "Mix pronto per un impasto elastico e leggero, risultato molto simile alla pizza tradizionale.", price: 5.5, rating: 4.7, reviewCount: 421, aicCertified: true, imageSeed: 403, whereToBuy: ["Negozio Senza G", "Pizzeria La Spiga d'Oro"], tags: ["farina", "pizza"] },
  { name: "Biscotti frollini classici", brand: "Dolciaria Rossi", category: "Snack e dolci", description: "Frollini friabili al burro, perfetti per la colazione o la merenda dei più piccoli.", price: 3.2, rating: 4.5, reviewCount: 264, aicCertified: true, imageSeed: 404, whereToBuy: ["Bar Pasticceria Il Chicco Verde"], tags: ["dolci", "bambini"] },
  { name: "Crackers ai semi", brand: "Naturis", category: "Snack e dolci", description: "Snack croccante ai semi di lino e sesamo, ideale per uno spuntino salato senza pensieri.", price: 2.8, rating: 4.4, reviewCount: 156, aicCertified: true, imageSeed: 405, whereToBuy: ["Supermercato Naturasì Bio", "Negozio Senza G"], tags: ["snack", "semi"] },
  { name: "Farina di grano saraceno integrale", brand: "Molino Verde", category: "Farine e mix", description: "Farina 100% grano saraceno macinata a pietra, perfetta per pancake e prodotti da forno rustici.", price: 4.6, rating: 4.8, reviewCount: 198, aicCertified: true, imageSeed: 406, whereToBuy: ["Negozio Senza G"], tags: ["farina", "integrale"] },
  { name: "Taralli pugliesi senza glutine", brand: "Sapori del Sud", category: "Prodotti da forno", description: "Taralli classici all'olio EVO, croccanti e sottili come la ricetta tradizionale pugliese.", price: 3.5, rating: 4.6, reviewCount: 233, aicCertified: true, imageSeed: 407, whereToBuy: ["Trattoria dei Sapori Antichi"], tags: ["snack", "tradizione"] },
  { name: "Pangrattato senza glutine", brand: "Panfree", category: "Condimenti", description: "Pangrattato fine ideale per impanature croccanti, ottenuto da pane gluten free essiccato.", price: 2.2, rating: 4.2, reviewCount: 94, aicCertified: true, imageSeed: 408, whereToBuy: ["Supermercato Naturasì Bio"], tags: ["condimenti"] },
  { name: "Penne rigate di lenticchie rosse", brand: "Legum Pasta", category: "Pasta e cereali", description: "Pasta ad alto contenuto proteico ricavata da farina di lenticchie rosse, senza altri cereali.", price: 3.1, rating: 4.5, reviewCount: 145, aicCertified: true, imageSeed: 409, whereToBuy: ["Negozio Senza G"], tags: ["pasta", "proteine"] },
  { name: "Torta al cioccolato pronta", brand: "Dolciaria Rossi", category: "Snack e dolci", description: "Preparato per torta al cioccolato fondente, basta aggiungere uova, olio e latte a scelta.", price: 4.1, rating: 4.4, reviewCount: 112, aicCertified: true, imageSeed: 410, whereToBuy: ["Bar Pasticceria Il Chicco Verde"], tags: ["dolci", "preparati"] },
  { name: "Piadina romagnola senza glutine", brand: "Sapori del Sud", category: "Pane e sostituti", description: "Piadina pronta da scaldare in padella pochi minuti, morbida e sottile come l'originale.", price: 3.8, rating: 4.3, reviewCount: 78, aicCertified: true, imageSeed: 411, whereToBuy: ["Supermercato Naturasì Bio"], tags: ["pane"] },
  { name: "Mix farina per pane rustico", brand: "Molino Verde", category: "Farine e mix", description: "Mix con farina di riso integrale e teff, per un pane rustico dalla crosta croccante.", price: 5.9, rating: 4.7, reviewCount: 167, aicCertified: true, imageSeed: 412, whereToBuy: ["Negozio Senza G"], tags: ["farina", "pane"] },
];

export const PRODUCTS: Product[] = seeds.map((s, idx) => ({
  id: `prod-${idx + 1}`,
  slug: slugify(`${s.brand}-${s.name}`),
  name: s.name,
  brand: s.brand,
  category: s.category,
  description: s.description,
  imageSeed: s.imageSeed,
  price: s.price,
  rating: s.rating,
  reviewCount: s.reviewCount,
  aicCertified: s.aicCertified,
  whereToBuy: s.whereToBuy,
  tags: s.tags,
}));

export function getProductBySlug(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getRecommendedProducts(limit = 8) {
  return [...PRODUCTS].sort((a, b) => b.rating - a.rating).slice(0, limit);
}

export const PRODUCT_CATEGORIES: Product["category"][] = [
  "Pasta e cereali", "Pane e sostituti", "Snack e dolci", "Farine e mix", "Prodotti da forno", "Condimenti",
];
