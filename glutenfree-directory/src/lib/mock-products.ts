import type { Product } from "./types";
import { slugify } from "./format";
import type { Locale } from "./i18n/locale";

// Prodotti reali verificati, in vendita in Italia (supermercati, farmacie,
// online). Prezzi indicativi mid-2026; certificazione AIC Spiga Barrata
// confermata dai siti ufficiali dei produttori. Nessuna recensione o
// valutazione inventata: rating e reviewCount restano a 0 finche' non
// arrivano valutazioni reali dagli utenti.
interface Seed {
  name: string;
  brand: string;
  category: Product["category"];
  description: string;
  price: number;
  aicCertified: boolean;
  imageSeed: number;
  whereToBuy: string[];
  tags: string[];
  photoUrl: string;
}

const seeds: Seed[] = [
  { name: "Fusilli Senza Glutine 400g", brand: "Barilla", category: "Pasta e cereali", description: "Fusilli di mais bianco, mais giallo e riso integrale, senza aggiunta di amidi. Cottura 11 minuti, stessa qualità della pasta tradizionale Barilla. Marchio Spiga Barrata e Ministero della Salute.", price: 2.00, aicCertified: true, imageSeed: 401, whereToBuy: ["Supermercato (Carrefour, Esselunga, Conad, Coop)", "Farmacia", "Online"], tags: ["pasta", "senza lattosio", "erogabile SSN"], photoUrl: "https://images.unsplash.com/photo-1551462147-ff29053bfabf?auto=format&fit=crop&w=800&q=75" },
  { name: "Eliche di Mais 250g", brand: "Le Veneziane", category: "Pasta e cereali", description: "Pasta di mais 100% italiano, lavorata secondo il metodo esclusivo Molino di Ferro tramandato da 6 generazioni. Cottura 8-9 minuti, ottima tenuta e capacità di trattenere i condimenti.", price: 2.30, aicCertified: true, imageSeed: 402, whereToBuy: ["Farmacia", "Supermercato", "Online"], tags: ["pasta", "senza lattosio", "senza uova"], photoUrl: "https://images.unsplash.com/photo-1598866594230-a7c12756260f?auto=format&fit=crop&w=800&q=75" },
  { name: "Pane Casereccio 240g", brand: "Schär", category: "Pane e sostituti", description: "Pane a fette con farina di grano saraceno (8%), soffice e dal gusto rustico. Senza glutine, senza lattosio e senza conservanti. Conservazione a temperatura ambiente.", price: 4.75, aicCertified: true, imageSeed: 403, whereToBuy: ["Farmacia", "Supermercato", "Online"], tags: ["pane", "senza lattosio", "senza conservanti"], photoUrl: "https://images.unsplash.com/photo-1595475207225-428b62bda831?auto=format&fit=crop&w=800&q=75" },
  { name: "Panfette Pane Casereccio 300g", brand: "Nutrifree", category: "Pane e sostituti", description: "Pane a fette morbido in monoporzioni da 2 fette, con olio extravergine di oliva (2%). Senza amido di frumento, senza soia, senza latte, senza uova e senza conservanti.", price: 3.50, aicCertified: true, imageSeed: 404, whereToBuy: ["Farmacia", "Supermercato", "Online"], tags: ["pane", "senza lattosio", "senza soia"], photoUrl: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=800&q=75" },
  { name: "Chocolix 110g", brand: "Schär", category: "Snack e dolci", description: "Barretta wafer ricoperta di cioccolato al latte (32%) con ripieno al caramello (30%), confezionata singolarmente in 5 porzioni. Snack goloso senza glutine.", price: 3.50, aicCertified: true, imageSeed: 405, whereToBuy: ["Farmacia", "Supermercato", "Online"], tags: ["snack", "cioccolato", "monoporzione"], photoUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=75" },
  { name: "Buoni Senza Biscotti con Gocce di Cioccolato 150g", brand: "Céréal", category: "Snack e dolci", description: "Biscotti frollini con gocce di cioccolato fondente (9,1%), senza glutine, senza lattosio e senza olio di palma. In monoporzioni da 3 biscotti, ideali per colazione o merenda.", price: 3.50, aicCertified: true, imageSeed: 406, whereToBuy: ["Supermercato (Esselunga, Carrefour, Iper)", "Online"], tags: ["biscotti", "senza lattosio", "senza olio di palma"], photoUrl: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=75" },
  { name: "Mix It! Universale 1kg", brand: "Schär", category: "Farine e mix", description: "Farina universale senza glutine per qualsiasi ricetta da forno: dolci, pane, focacce, pasta fresca e impanature. A base di amido di mais, farina di riso e farina di sorgo.", price: 4.50, aicCertified: true, imageSeed: 407, whereToBuy: ["Farmacia", "Supermercato (Carrefour)", "Online"], tags: ["farina", "versatile", "vegano"], photoUrl: "https://images.unsplash.com/photo-1568051243858-533a607809a5?auto=format&fit=crop&w=800&q=75" },
  { name: "Mix per Dolci 1kg", brand: "Nutrifree", category: "Farine e mix", description: "Miscela di farine senza glutine specifica per torte e biscotti, a basso contenuto di zuccheri e grassi saturi. Senza lattosio e senza proteine del latte.", price: 5.50, aicCertified: true, imageSeed: 408, whereToBuy: ["Farmacia", "Supermercato", "Online"], tags: ["farina", "per pasticceria", "senza lattosio"], photoUrl: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=800&q=75" },
  { name: "Crackers 210g", brand: "Schär", category: "Prodotti da forno", description: "Crackers classici senza glutine, leggeri e friabili, in monoporzioni da 35g. Ideali come sostituto del pane o base per aperitivi. A base di amido di mais e farine multicereali.", price: 3.00, aicCertified: true, imageSeed: 409, whereToBuy: ["Farmacia", "Supermercato (Carrefour)", "Online"], tags: ["crackers", "monoporzione", "senza lattosio"], photoUrl: "https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=800&q=75" },
  { name: "Fette Croccanti 150g", brand: "Céréal", category: "Prodotti da forno", description: "Fette croccanti senza glutine e senza lattosio, a base di farina di mais e farina di riso. Friabili e dal gusto delicato, alternativa leggera al pane tradizionale.", price: 3.20, aicCertified: true, imageSeed: 410, whereToBuy: ["Supermercato (Carrefour, Esselunga)", "Farmacia", "Online"], tags: ["fette", "senza lattosio", "sostituto del pane"], photoUrl: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&w=800&q=75" },
  { name: "Pesto alla Genovese 190g", brand: "Barilla", category: "Condimenti", description: "Pesto con basilico fresco italiano (30%) e Parmigiano Reggiano DOP (5%). Sugo pronto senza glutine e senza conservanti, ideale per condire pasta senza glutine.", price: 2.20, aicCertified: false, imageSeed: 411, whereToBuy: ["Supermercato (Carrefour, Esselunga, Conad, Coop)", "Online"], tags: ["pesto", "senza conservanti", "con Parmigiano Reggiano DOP"], photoUrl: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=800&q=75" },
  { name: "Pesto Bio 130g", brand: "Sarchio", category: "Condimenti", description: "Pesto biologico con basilico fresco (55%), olio extra vergine d'oliva e pinoli. Senza aglio e senza formaggio, ideale per primi piatti, bruschette o insalate. Certificato biologico e senza glutine.", price: 4.48, aicCertified: true, imageSeed: 412, whereToBuy: ["Supermercato (Coop, negozi bio)", "Farmacia", "Online"], tags: ["biologico", "vegano", "senza aglio"], photoUrl: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=800&q=75" },
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
  rating: 0,
  reviewCount: 0,
  aicCertified: s.aicCertified,
  whereToBuy: s.whereToBuy,
  tags: s.tags,
  photoUrl: s.photoUrl,
}));

export function getProductBySlug(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getRecommendedProducts(limit = 8) {
  return PRODUCTS.slice(0, limit);
}

export const PRODUCT_CATEGORIES: Product["category"][] = [
  "Pasta e cereali", "Pane e sostituti", "Snack e dolci", "Farine e mix", "Prodotti da forno", "Condimenti",
];

export const PRODUCT_CATEGORY_EN: Record<Product["category"], string> = {
  "Pasta e cereali": "Pasta & grains",
  "Pane e sostituti": "Bread & substitutes",
  "Snack e dolci": "Snacks & sweets",
  "Farine e mix": "Flours & mixes",
  "Prodotti da forno": "Baked goods",
  Condimenti: "Condiments",
};

export function productCategoryLabel(category: Product["category"], locale: Locale) {
  return locale === "en" ? PRODUCT_CATEGORY_EN[category] : category;
}
