import type { AssistantIndex } from "./assistant-index";
import { normalize } from "./map-search";

/**
 * Motore dell'assistente: capisce cosa chiede il visitatore con regole semplici
 * (città, tipo di locale, ricette, guida PDF, domande frequenti) e risponde solo
 * con contenuti del sito. Nessun modello linguistico, nessun dato inventato.
 */

export type Card =
  | { type: "venue"; title: string; sub: string; href: string; aic: boolean }
  | { type: "article"; title: string; sub: string; href: string }
  | { type: "link"; title: string; href: string };

export interface Reply {
  text: string;
  cards?: Card[];
  chips?: string[];
  note?: string;
}

type L = "it" | "en";

const STOP = new Set(
  (
    "il lo la i gli le un uno una di a da in con su per tra fra e o ma se che chi cosa come dove quando quale quali quanto quanta sono sei è e' ho hai ha mi ti ci si vi ne non piu più del dello della dei degli delle al allo alla ai agli alle dal dalla nel nella nei sul sulla posso puoi può voglio vorrei cerco trovare trovo c'è ce senza glutine gluten free celiaco celiaci celiaca cos cos'è perche perché fa fare sapere dimmi " +
    "the a an of to in on for with and or is are can i you we my me do does what where how which who near find want looking any some there"
  )
    .split(" ")
    .map((w) => normalize(w))
    .filter(Boolean),
);

const tokens = (s: string) => normalize(s).split(" ").filter((w) => w.length > 1 && !STOP.has(w));
// Radice grezza: "ristoranti" e "ristorante" diventano "ristorant".
const stem = (w: string) => (w.length > 4 ? w.replace(/(i|e|a|o|s)$/, "") : w);

function score(query: string[], text: string, weight: (q: string) => number = () => 1): number {
  const words = normalize(text).split(" ");
  const stems = new Set(words.map(stem));
  let s = 0;
  for (const q of query) {
    const qs = stem(q);
    if (stems.has(qs)) s += 2 * weight(q);
    else if (qs.length > 3 && words.some((w) => w.startsWith(qs))) s += weight(q);
  }
  return s;
}

const hits = (q: string, text: string) => {
  const qs = stem(q);
  return normalize(text)
    .split(" ")
    .some((w) => stem(w) === qs || (qs.length > 3 && w.startsWith(qs)));
};

// Peso delle parole: quelle rare nei contenuti del sito («riso») contano più di
// quelle comuni («contiene»), così la risposta segue la parola che conta.
const idfCache = new WeakMap<AssistantIndex, string[]>();
function makeWeight(idx: AssistantIndex) {
  let docs = idfCache.get(idx);
  if (!docs) {
    docs = [...idx.faqs.map((f) => `${f.q} ${f.a}`), ...idx.articles.map((a) => `${a.t} ${a.e}`)];
    idfCache.set(idx, docs);
  }
  const n = docs.length;
  const memo = new Map<string, number>();
  return (q: string) => {
    let w = memo.get(q);
    if (w === undefined) {
      const df = docs.filter((d) => hits(q, d)).length;
      w = Math.log((n + 1) / (df + 1)) + 0.2;
      memo.set(q, w);
    }
    return w;
  };
}

const CATEGORY_WORDS: Record<string, string[]> = {
  ristorante: ["ristorant", "trattori", "osteri", "restaurant"],
  pizzeria: ["pizz"],
  hotel: ["hotel", "albergh", "b&b", "bnb", "dormire", "colazion", "sleep", "stay"],
  farmacia: ["farmaci", "pharmac"],
  supermercato: ["supermercat", "supermarket"],
  negozio: ["negoz", "shop", "store", "bottega"],
  "bar-pasticceria": ["bar", "pasticceri", "dolc", "brioch", "cornett", "bakery", "pastry", "cafe", "panifici"],
  gelateria: ["gelat", "ice cream", "icecream"],
};

const CITY_ALIASES: Record<string, string[]> = {
  Roma: ["rome"],
  Milano: ["milan"],
  Firenze: ["florence"],
  Napoli: ["naples"],
  Torino: ["turin"],
  Venezia: ["venice"],
  Genova: ["genoa"],
};

const T = {
  it: {
    welcome: "Ciao! Sono l'assistente di Mappa Senza Glutine. Ti aiuto a trovare locali, ricette e risposte sul senza glutine. Cosa cerchi?",
    chips: ["Ristoranti a Roma", "Pizzerie certificate AIC", "Ricette facili", "Cos'è la contaminazione crociata?", "La guida PDF"],
    note: "Rispondo con i contenuti del sito. Non sostituisco il parere del medico.",
    venuesIn: (what: string, where: string, n: number) => `Ho trovato ${n} ${what}${where}. ${n > 4 ? "Eccone alcuni:" : n === 1 ? "Ecco la scheda:" : "Ecco l'elenco:"}`,
    venuesWord: (n: number) => (n === 1 ? "locale" : "locali"),
    aicWord: " con certificazione AIC",
    seeAll: (n: number) => `Vedi tutti i ${n} nella directory`,
    noVenues: (where: string) => `Per ora non abbiamo locali verificati${where}. Puoi guardare la mappa completa o cercare una città vicina.`,
    otherVenues: (what: string, where: string, n: number) => `Non ho trovato ${what}${where}, ma ${n === 1 ? "c'è 1 altro locale" : `ci sono ${n} altri locali`} senza glutine:`,
    openDirectory: "Apri la directory",
    near: "Per i locali vicino a te usa il pulsante «Vicino a me» sulla mappa: li ordina per distanza.",
    mapAic: "Mappa dei ristoranti AIC",
    mapHome: "Mappa di tutti i locali",
    recipes: "Ecco le ricette che fanno al caso tuo:",
    recipesAll: "Tutte le ricette",
    pdf: "La guida «Vivere Senza Glutine» mette in ordine tutto: diagnosi, etichette, ristoranti, casa e viaggi, con schede da stampare.",
    pdfLink: "Scopri la guida PDF",
    business: "Se hai un locale, puoi proporlo dalla pagina per le aziende: le schede sono pubblicate gratuitamente.",
    businessLink: "Inserisci la tua attività",
    contact: "Puoi scriverci dalla pagina contatti.",
    contactLink: "Contatti",
    faq: "Ecco cosa trovi sul sito:",
    articles: "Questi articoli possono aiutarti:",
    readMore: "Per approfondire:",
    none: "Non ho trovato una risposta precisa. Prova con parole diverse (per esempio una città o un piatto), oppure guarda le domande frequenti.",
    faqLink: "Domande frequenti",
    health: "Per dubbi su sintomi, esami o diagnosi rivolgiti al tuo medico.",
  },
  en: {
    welcome: "Hi! I'm the Mappa Senza Glutine assistant. I can help you find venues, recipes and answers about gluten-free living. What are you looking for?",
    chips: ["Restaurants in Rome", "AIC certified pizzerias", "Easy recipes", "What is cross-contamination?", "The PDF guide"],
    note: "I answer with the site's content. I don't replace your doctor's advice.",
    venuesIn: (what: string, where: string, n: number) => `I found ${n} ${what}${where}. Here ${n > 4 ? "are the first ones" : n === 1 ? "it is" : "they are"}:`,
    venuesWord: (n: number) => (n === 1 ? "venue" : "venues"),
    aicWord: " AIC certified",
    seeAll: (n: number) => `See all ${n} in the directory`,
    noVenues: (where: string) => `We don't have verified venues${where} yet. You can browse the full map or try a nearby city.`,
    otherVenues: (what: string, where: string, n: number) => `I couldn't find ${what}${where}, but there ${n === 1 ? "is 1 other gluten-free venue" : `are ${n} other gluten-free venues`}:`,
    openDirectory: "Open the directory",
    near: "For venues near you, use the “Near me” button on the map: it sorts them by distance.",
    mapAic: "Map of AIC restaurants",
    mapHome: "Map of all venues",
    recipes: "Here are some recipes for you:",
    recipesAll: "All recipes",
    pdf: "The “Live Gluten-Free” guide puts everything in order: diagnosis, labels, restaurants, home and travel, with printable sheets.",
    pdfLink: "See the PDF guide",
    business: "If you run a venue, you can submit it from the For businesses page: listings are published for free.",
    businessLink: "Add your business",
    contact: "You can write to us from the contact page.",
    contactLink: "Contact",
    faq: "Here's what the site says:",
    articles: "These articles can help:",
    readMore: "Read more:",
    none: "I couldn't find a precise answer. Try different words (for example a city or a dish), or check the FAQ.",
    faqLink: "FAQ",
    health: "For questions about symptoms, tests or diagnosis, talk to your doctor.",
  },
};

export function welcome(locale: L): Reply {
  return { text: T[locale].welcome, chips: T[locale].chips, note: T[locale].note };
}

export function answer(raw: string, idx: AssistantIndex, locale: L): Reply {
  const t = T[locale];
  const pre = locale === "en" ? "/en" : "";
  const q = normalize(raw);
  const has = (...re: RegExp[]) => re.some((r) => r.test(q));
  const words = tokens(raw);

  if (!q || has(/^(ciao|salve|buongiorno|buonasera|hey|hi|hello|aiuto|help)\b/) && words.length <= 2) return welcome(locale);

  if (has(/\b(pdf|ebook|e book|guida da scaricare|guida pdf|the guide|pdf guide|guida vivere|live gluten)/)) {
    return { text: t.pdf, cards: [{ type: "link", title: t.pdfLink, href: `${pre}/vivere-senza-glutine` }] };
  }
  if (has(/(inserire|aggiungere|segnalare|proporre|registrare).*(locale|attivita|ristorante)|\bper le aziende\b|add (my|a) (business|restaurant|venue)|\bmy restaurant\b/)) {
    return { text: t.business, cards: [{ type: "link", title: t.businessLink, href: `${pre}/per-le-aziende` }] };
  }
  if (has(/\b(contatt|scriver|email|mail|contact)/)) {
    return { text: t.contact, cards: [{ type: "link", title: t.contactLink, href: `${pre}/contatti` }] };
  }

  // Città e tipo di locale
  const city = idx.cities.find((c) => {
    const names = [c.key, c.label, ...(CITY_ALIASES[c.key] ?? [])].map(normalize);
    return names.some((n) => new RegExp(`\\b${n}\\b`).test(q));
  });
  // Parole intere o inizi di parola ("pizz" trova "pizzeria"); le parole brevi
  // devono coincidere ("bar" non deve trovare "Bari").
  const qWords = q.split(" ");
  const matchWord = (w: string) => (w.includes(" ") ? q.includes(w) : w.length <= 3 ? qWords.includes(w) : qWords.some((x) => x.startsWith(w)));
  const cat = Object.entries(CATEGORY_WORDS).find(([, ws]) => ws.some(matchWord))?.[0];
  const aic = has(/\baic\b|certificat/);
  const near = has(/vicin|near me|nearby|intorno|zona mia/);
  const recipeIntent = has(/ricett|recipe|come (si )?(fa|prepar|cucin)|impast|how to make|fatt[ao] in casa|homemade/);

  if (near && !city) {
    return {
      text: t.near,
      cards: [
        { type: "link", title: t.mapHome, href: `${pre}/#mappa` },
        { type: "link", title: t.mapAic, href: `${pre}/mappa-ristoranti-aic` },
      ],
    };
  }

  if (!recipeIntent && (city || (cat && words.length <= 4) || (aic && cat))) {
    let list = idx.venues;
    if (city) list = list.filter((v) => v.cityKey === city.key);
    if (cat) list = list.filter((v) => v.k === cat || (cat === "ristorante" && v.k === "pizzeria" && !has(/ristorant|restaurant/)));
    if (aic) list = list.filter((v) => v.aic);
    const catLabel = cat ? idx.categories.find((c) => c.slug === cat)?.label.toLowerCase() : undefined;
    const where = city ? (locale === "en" ? ` in ${city.label}` : ` a ${city.label}`) : "";
    const params = new URLSearchParams();
    if (city) params.set("comune", city.key);
    if (cat) params.set("categoria", cat);
    if (aic) params.set("certificato", "1");
    const dirHref = `${pre}/directory${params.toString() ? `?${params}` : ""}`;
    if (list.length === 0) {
      // Nessun locale di quel tipo: se la città ha altri locali, li proponiamo.
      const inCity = city ? idx.venues.filter((v) => v.cityKey === city.key) : [];
      if (inCity.length && (cat || aic)) {
        const askedFor = `${catLabel ?? t.venuesWord(2)}${aic ? t.aicWord : ""}`;
        return {
          text: t.otherVenues(askedFor, where, inCity.length),
          cards: [
            ...inCity.slice(0, 4).map((v): Card => ({ type: "venue", title: v.n, sub: `${v.city} · ${v.d}`, href: `${pre}/directory/${v.s}`, aic: v.aic })),
            { type: "link", title: t.openDirectory, href: `${pre}/directory?comune=${encodeURIComponent(city!.key)}` },
          ],
        };
      }
      return { text: t.noVenues(where), cards: [{ type: "link", title: t.openDirectory, href: dirHref }] };
    }
    const what = `${catLabel ?? t.venuesWord(list.length)}${aic ? t.aicWord : ""}`;
    const sorted = [...list].sort((a, b) => Number(b.aic) - Number(a.aic));
    return {
      text: t.venuesIn(what, where, list.length),
      cards: [
        ...sorted.slice(0, 4).map((v): Card => ({ type: "venue", title: v.n, sub: `${v.city} · ${v.d}`, href: `${pre}/directory/${v.s}`, aic: v.aic })),
        ...(list.length > 4 ? [{ type: "link", title: t.seeAll(list.length), href: dirHref } as Card] : []),
      ],
    };
  }

  // Ricette
  const recipes = idx.articles.filter((a) => a.k === "Ricette");
  // Senza la parola «ricetta», solo una o due parole su un piatto (es. «focaccia»), non una domanda.
  const question = /\?/.test(raw) || has(/contien|\bcos\b|perch|posso|\bpuo\b|does|\bcan\b|\bis\b/);
  const w0 = makeWeight(idx);
  const bestRecipe = Math.max(0, ...recipes.map((r) => score(words, r.t, w0)));
  const bestOther = Math.max(0, ...idx.articles.filter((a) => a.k !== "Ricette").map((a) => score(words, a.t, w0)));
  // «focaccia» porta alle ricette, «birra» no: vince il titolo che corrisponde meglio.
  const titleStartsWith = recipes.some((r) => words.some((w) => stem(normalize(r.t).split(" ")[0]) === stem(w)));
  const implicitRecipe = !question && words.length <= 2 && bestRecipe > 0 && (bestRecipe > bestOther || titleStartsWith);
  if (recipeIntent || implicitRecipe) {
    const ranked = recipes
      .map((r) => ({ r, s: score(words, `${r.t} ${r.e}`) }))
      .sort((a, b) => b.s - a.s);
    const best = ranked.filter((x) => x.s > 0).slice(0, 3);
    const pick = best.length ? best.map((x) => x.r) : recipes.slice(0, 3);
    return {
      text: t.recipes,
      cards: [
        ...pick.map((r): Card => ({ type: "article", title: r.t, sub: r.e, href: `${pre}/blog/${r.s}` })),
        { type: "link", title: t.recipesAll, href: `${pre}/blog?categoria=ricette` },
      ],
    };
  }

  // Domande frequenti e articoli
  const weight = makeWeight(idx);
  // La parola più informativa della domanda deve comparire nella domanda frequente scelta.
  const key = [...words].sort((a, b) => weight(b) - weight(a))[0];
  const faq = idx.faqs
    .filter((f) => !key || hits(key, f.q))
    .map((f) => ({ f, s: score(words, f.q, weight) * 2 + score(words, f.a, weight) }))
    .sort((a, b) => b.s - a.s)[0];
  const arts = idx.articles
    .map((a) => ({ a, s: score(words, a.t, weight) * 2 + score(words, a.e, weight) }))
    .filter((x) => x.s >= 2)
    .sort((a, b) => b.s - a.s)
    .slice(0, 3)
    .map((x): Card => ({ type: "article", title: x.a.t, sub: x.a.e, href: `${pre}/blog/${x.a.s}` }));
  const health = has(/sintom|diagnos|esam|analisi|test|symptom|biops|anticorp|antibod/) ? t.health : undefined;

  if (faq && faq.s >= Math.max(3, words.length * 1.5)) {
    return { text: faq.f.a, cards: arts.length ? arts : undefined, note: health, chips: undefined };
  }
  if (arts.length) return { text: t.articles, cards: arts, note: health };
  return { text: t.none, cards: [{ type: "link", title: t.faqLink, href: `${pre}/faq` }], chips: t.chips.slice(0, 3) };
}
