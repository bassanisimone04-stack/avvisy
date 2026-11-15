import type { Business, DishType, ProductionType } from "./types";

/**
 * Tipo di produzione dichiarato. Solo i locali per cui il testo già verificato
 * della scheda lo dice chiaramente: gli altri restano senza etichetta (e non
 * compaiono nel filtro) finché non c'è una conferma dal locale o da AIC.
 *
 * dedicato = tutta la produzione e senza glutine (testo: "100%", "esclusivamente",
 *            "interamente", laboratorio o negozio dedicato).
 * misto    = il locale prepara anche piatti con glutine e offre un percorso senza
 *            glutine (testo: forno, bancone o cucina dedicati/separati, "quasi interamente").
 */
export const PRODUCTION: Record<string, ProductionType> = {
  // dedicato
  "trattoria-vecchio-mercato-bologna": "dedicato", // "cucina esclusivamente senza glutine"
  "celiachiamo-roma": "dedicato", // "Forno 100% senza glutine"
  "leopoldo-cafebar-napoli": "dedicato", // "pasticceria esclusivamente senza glutine"
  "quinoa-firenze": "dedicato", // "Cucina 100% senza glutine"
  "glufree-bakery-milano": "dedicato", // "Laboratorio 100% senza glutine"
  "pansy-milano": "dedicato", // "Pasticceria 100% senza glutine e senza lattosio"
  "sans-de-ble-roma": "dedicato", // "Laboratorio 100% senza glutine e senza lattosio"
  "la-gouterie-bari": "dedicato", // "Laboratorio 100% dedicato senza glutine"
  "pizzicotto-palermo": "dedicato", // "Cucina, forno e postazioni interamente dedicati"
  "no-gluten-bakery-palermo": "dedicato", // "Laboratorio 100% senza glutine"
  "randazzo-gluten-free-genova": "dedicato", // "Laboratorio dedicato esclusivamente al senza glutine"
  "ristorante-flora-verona": "dedicato", // "Menu interamente vegano e senza glutine"
  "milano-senza-glutine-milano": "dedicato", // "Negozio 100% dedicato al senza glutine"
  "zero-gelato-milano": "dedicato", // "Gusti interamente senza glutine"
  // misto
  "be-bop-milano": "misto", // "Menu tradizionale con opzioni gluten free"
  "il-secchio-e-l-olivaro-roma": "misto", // "Menu senza glutine in laboratorio dedicato"
  "mama-eat-milano": "misto", // "Doppia cucina separata"
  "mama-eat-roma": "misto", // "Doppia cucina separata"
  "pizzeria-starita-napoli": "misto", // "Forno dedicato senza glutine"
  "pizzaioli-veraci-napoli": "misto", // "Bancone e forno dedicati"
  "ciro-sons-firenze": "misto", // "Forno dedicato"
  "mangiafuoco-pizza-grill-roma": "misto", // "Cucina separata dedicata"
  "pizzeria-oke-venezia": "misto", // "Cucine fisicamente separate"
  "franco-pizzeria-genova": "misto", // "Forno dedicato"
  "bistrot-107-palermo": "misto", // "quasi tutto il menu senza glutine, friggitrice dedicata"
  "sushi-sound-milano": "misto", // "menu quasi interamente senza glutine"
  "la-gallina-bianca-roma": "misto", // "menu quasi interamente senza glutine"
  "grom-venezia": "misto", // "coni dedicati; attenzione alla contaminazione crociata"
};

const DISH_PATTERNS: [DishType, RegExp][] = [
  ["pizza", /pizz/],
  ["pasta", /\bpasta\b|tagliatell|tortellin|gnocchi|ravioli|linguine|lasagn|\bprimi\b/],
  ["pane", /\bpane\b|focacc|grissin|panificio/],
  ["dolci", /dolc|\btort[ae]\b|pasticceria|cannol|bab[àa]|sfogliatell|pastiera|croissant|panettone|pandoro|brioche|mignon|biscott/],
  ["gelato", /gelat|coni dedicati/],
  ["fritti", /fritt|arancin|panelle|montanara|paranza/],
  ["carne", /\bcarn|griglia|braceria|alla brace|hamburger/],
  ["sushi", /sushi|sashimi/],
  ["birra", /birr/],
];

function text(b: Business): string {
  return `${b.glutenFreeMenu.join(" ")} ${b.services.join(" ")}`.toLowerCase();
}

/** Tipi di piatto ricavati dal menu senza glutine e dai servizi gia' elencati nella scheda. */
export function deriveDishes(b: Business): DishType[] {
  const t = text(b);
  return DISH_PATTERNS.filter(([, re]) => re.test(t)).map(([d]) => d);
}

/** Esigenze aggiuntive citate nella scheda: "opzioni", non una garanzia. */
export function deriveDiets(b: Business): { veganFriendly: boolean; lactoseFree: boolean } {
  const t = `${text(b)} ${b.description} ${b.shortDescription}`.toLowerCase();
  return { veganFriendly: /vegan/.test(t), lactoseFree: /senza lattosio|lactose/.test(t) };
}

export const DISH_LABEL: Record<DishType, { it: string; en: string }> = {
  pizza: { it: "Pizza", en: "Pizza" },
  pasta: { it: "Pasta", en: "Pasta" },
  pane: { it: "Pane e focaccia", en: "Bread & focaccia" },
  dolci: { it: "Dolci", en: "Sweets" },
  gelato: { it: "Gelato", en: "Gelato" },
  fritti: { it: "Fritti", en: "Fried food" },
  carne: { it: "Carne e griglia", en: "Meat & grill" },
  sushi: { it: "Sushi", en: "Sushi" },
  birra: { it: "Birra", en: "Beer" },
};

export const PRODUCTION_LABEL: Record<ProductionType, { short: { it: string; en: string }; long: { it: string; en: string } }> = {
  dedicato: {
    short: { it: "100% senza glutine", en: "100% gluten-free" },
    long: {
      it: "Dedicato: tutta la produzione è senza glutine, quindi il rischio di contaminazione crociata dall'interno è il più basso.",
      en: "Dedicated: all production is gluten-free, so the risk of cross-contamination from inside the venue is the lowest.",
    },
  },
  misto: {
    short: { it: "Cucina mista", en: "Mixed kitchen" },
    long: {
      it: "Cucina mista: il locale prepara anche piatti con glutine e offre un percorso senza glutine. Dichiara di essere celiaco e chiedi come lavorano.",
      en: "Mixed kitchen: the venue also prepares dishes with gluten and offers a gluten-free route. Say you have celiac disease and ask how they work.",
    },
  },
};
