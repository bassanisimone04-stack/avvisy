import type { DayOfWeek, Features, ImageRef, MenuPrice, OpeningHours, Restaurant } from "@/db/types";
import { cities } from "./geo";

/**
 * 30 FICTIONAL demo restaurants. Names, chefs, addresses and prices are invented.
 * Recognition is a simulated "Demo distinction" level — never a real award.
 * Websites use the reserved example.com domain; no phone numbers are published.
 */
type Spec = {
  slug: string;
  name: string;
  city: string;
  street: string;
  postal: string;
  cuisines: string[];
  chef?: string;
  level: 0 | 1 | 2 | 3;
  lunch: number | null; // tasting lunch price, null = missing
  dinner: number | null;
  wine: number | null;
  currency: string;
  f: Partial<Features>;
  diet: [boolean, boolean, boolean]; // vegetarian, vegan, gluten-free
  style: string;
  desc: string;
  dish: string;
  hours: "tue-sat" | "wed-sun" | "mon-fri" | "daily-dinner";
  verified?: "verified" | "stale" | "pending";
  verifiedAt?: string;
  featured?: boolean;
  selection?: boolean;
  hotel?: string;
  method?: "online" | "phone" | "email";
  priceStatus?: "verified" | "estimated";
  dx: number; // coordinate offset (fictional location near city centre)
  dy: number;
};

const S: Spec[] = [
  // PARIS (5)
  { slug: "maison-lune-paris", name: "Maison Lune", city: "paris", street: "14 Rue des Lanternes", postal: "75006", cuisines: ["french", "contemporary"], chef: "claire-montrose", level: 3, lunch: 145, dinner: 320, wine: 190, currency: "EUR", f: { romantic: true, chefsTable: true, privateDining: true, giftCard: true, accessible: true }, diet: [true, false, true], style: "Classical French, modern lightness", desc: "A hushed Left Bank dining room where vegetables from three market gardens lead a long, precise French tasting menu.", dish: "Glazed heirloom carrots with brown butter", hours: "tue-sat", featured: true, selection: true, dx: -0.006, dy: -0.004 },
  { slug: "atelier-sable-paris", name: "Atelier Sablé", city: "paris", street: "3 Passage du Moulin Clair", postal: "75011", cuisines: ["french"], chef: "bastien-lafarge", level: 2, lunch: 95, dinner: 210, wine: 130, currency: "EUR", f: { romantic: true, giftCard: true }, diet: [true, false, false], style: "Sauce-driven French cooking", desc: "A former pastry chef's dining room where two-day sauces anchor the savoury courses and the finale is an all-dessert sequence.", dish: "Pigeon with cherry and long-reduced jus", hours: "tue-sat", featured: true, dx: 0.021, dy: 0.006 },
  { slug: "le-quai-bleu-paris", name: "Le Quai Bleu", city: "paris", street: "27 Quai des Brumes", postal: "75004", cuisines: ["seafood", "french"], chef: "ines-auclair", level: 1, lunch: 68, dinner: 145, wine: 85, currency: "EUR", f: { terrace: true, accessible: true, giftCard: true }, diet: [false, false, true], style: "Day-boat seafood", desc: "Riverside seafood cooking built on each morning's Breton catch, with dry-aged fish cut to order.", dish: "Dry-aged turbot with seaweed butter", hours: "mon-fri", featured: true, dx: 0.004, dy: -0.003 },
  { slug: "verdure-paris", name: "Verdure", city: "paris", street: "8 Rue des Jardiniers", postal: "75010", cuisines: ["vegetarian", "contemporary"], level: 1, lunch: 55, dinner: 98, wine: 60, currency: "EUR", f: { romantic: false, accessible: true }, diet: [true, true, true], style: "Plant-based tasting menu", desc: "A fully plant-based tasting menu with fermented sauces and a bakery counter at the entrance.", dish: "Roasted celeriac with fermented barley", hours: "wed-sun", dx: 0.012, dy: 0.018 },
  { slug: "la-table-d-ombre-paris", name: "La Table d'Ombre", city: "paris", street: "41 Rue du Cadran", postal: "75009", cuisines: ["french", "contemporary"], level: 0, lunch: 48, dinner: 89, wine: null, currency: "EUR", f: { romantic: true, privateDining: true }, diet: [true, false, false], style: "Bistronomy", desc: "A candlelit neighbourhood room with a short, ambitious menu and a natural-wine list chosen by the owner.", dish: "Veal sweetbreads with morels", hours: "tue-sat", verified: "stale", verifiedAt: "2026-03-02", dx: 0.002, dy: 0.012 },
  // TOKYO (4)
  { slug: "sushi-kawase-tokyo", name: "Sushi Kawase", city: "tokyo", street: "2-14 Ginza Fictional Block", postal: "104-0061", cuisines: ["sushi", "japanese"], chef: "kenji-arakawa", level: 3, lunch: 22000, dinner: 48000, wine: 18000, currency: "JPY", f: { chefsTable: true }, diet: [false, false, true], style: "Edomae sushi counter", desc: "Eight seats at a hinoki counter, with fish aged for up to two weeks and rice seasoned with red vinegar.", dish: "Aged tuna nigiri", hours: "tue-sat", featured: true, selection: true, method: "phone", dx: 0.09, dy: -0.006 },
  { slug: "hanare-takeda-tokyo", name: "Hanare Takeda", city: "tokyo", street: "5-3 Nishi-Azabu Demo Lane", postal: "106-0031", cuisines: ["kaiseki", "japanese"], chef: "mio-takeda", level: 2, lunch: 18000, dinner: 35000, wine: 15000, currency: "JPY", f: { privateDining: true, romantic: true }, diet: [true, false, false], style: "Seasonal kaiseki", desc: "A quiet kaiseki house with private rooms, serving a monthly-changing menu on commissioned ceramics.", dish: "Autumn hassun on lacquer tray", hours: "tue-sat", featured: true, dx: -0.01, dy: -0.02 },
  { slug: "sumibi-oak-tokyo", name: "Sumibi Oak", city: "tokyo", street: "1-9 Ebisu Sample Street", postal: "150-0013", cuisines: ["japanese", "contemporary"], chef: "daniel-okafor", level: 1, lunch: null, dinner: 26000, wine: 12000, currency: "JPY", f: { chefsTable: true }, diet: [false, false, true], style: "Binchotan and oak fire", desc: "Twelve counter seats around a grill where each course is cooked over binchotan and oak.", dish: "Charcoal-grilled wagyu with wasabi leaf", hours: "daily-dinner", dx: 0.03, dy: -0.03 },
  { slug: "tempura-hikari-tokyo", name: "Tempura Hikari", city: "tokyo", street: "3-7 Akasaka Model Alley", postal: "107-0052", cuisines: ["japanese"], level: 0, lunch: 9000, dinner: 18000, wine: null, currency: "JPY", f: {}, diet: [true, false, false], style: "Tempura counter", desc: "A ten-seat tempura counter frying seasonal vegetables and fish in sesame oil.", dish: "Tempura of sweetfish and shiso", hours: "mon-fri", verified: "pending", dx: 0.06, dy: -0.002 },
  // MILAN (3)
  { slug: "oro-di-brera-milan", name: "Oro di Brera", city: "milan", street: "Via dei Pittori 12", postal: "20121", cuisines: ["italian", "contemporary"], chef: "luca-ferraris", level: 2, lunch: 85, dinner: 190, wine: 110, currency: "EUR", f: { romantic: true, privateDining: true, giftCard: true, accessible: true }, diet: [true, false, true], style: "Lombard classics, reinterpreted", desc: "A Brera dining room where Lombard classics are lightened and the saffron risotto is finished tableside.", dish: "Saffron risotto with bone-marrow crumb", hours: "mon-fri", featured: true, dx: 0.0, dy: 0.008 },
  { slug: "luna-fermenta-milan", name: "Luna Fermenta", city: "milan", street: "Alzaia dei Mulini 5", postal: "20143", cuisines: ["vegetarian", "italian"], chef: "giulia-sereni", level: 1, lunch: 60, dinner: 120, wine: 70, currency: "EUR", f: { terrace: true, accessible: true }, diet: [true, true, true], style: "Vegetables and fermentation", desc: "A canal-side room cooking vegetables, grains and ferments in a menu that changes with each moon cycle.", dish: "Fermented tomato water with garden herbs", hours: "wed-sun", dx: -0.01, dy: -0.014 },
  { slug: "vetro-porta-nuova-milan", name: "Vetro", city: "milan", street: "Piazza delle Vele 2", postal: "20124", cuisines: ["contemporary", "mediterranean"], level: 0, lunch: 45, dinner: 95, wine: 55, currency: "EUR", f: { terrace: true, parking: true, accessible: true }, diet: [true, true, false], style: "Contemporary Mediterranean", desc: "A glass-walled room on the 20th floor with a business lunch menu and a longer tasting menu in the evening.", dish: "Red prawn with blood orange", hours: "mon-fri", dx: 0.004, dy: 0.02 },
  // LONDON (3)
  { slug: "the-tidewater-london", name: "The Tidewater", city: "london", street: "18 Wharf Lane", postal: "E1 8AA", cuisines: ["modern-british", "seafood"], chef: "oliver-hastings", level: 2, lunch: 95, dinner: 185, wine: 120, currency: "GBP", f: { chefsTable: true, privateDining: true, giftCard: true }, diet: [false, false, true], style: "British coast and whole-animal butchery", desc: "A converted Victorian warehouse where coastal produce and in-house butchery shape a confident British menu.", dish: "Cornish crab with brown-butter crumpet", hours: "tue-sat", featured: true, dx: 0.055, dy: -0.004 },
  { slug: "saffron-and-slate-london", name: "Saffron & Slate", city: "london", street: "7 Mews Court", postal: "W1K 2AA", cuisines: ["contemporary", "modern-british"], chef: "priya-rao", level: 1, lunch: 65, dinner: 135, wine: 90, currency: "GBP", f: { romantic: true, giftCard: true, accessible: true }, diet: [true, true, true], style: "Karnataka spice, British seasons", desc: "A Mayfair mews dining room pairing the spice traditions of Karnataka with British seasonal produce.", dish: "Tandoor-roasted hogget with curry leaf", hours: "tue-sat", dx: -0.024, dy: 0.003 },
  { slug: "hearth-and-hall-london", name: "Hearth & Hall", city: "london", street: "2 Garden Row", postal: "SE1 7AA", cuisines: ["modern-british"], level: 0, lunch: 45, dinner: 85, wine: 60, currency: "GBP", f: { terrace: true, accessible: true }, diet: [true, false, false], style: "Fire-led neighbourhood cooking", desc: "A fire-led kitchen south of the river with a sunny courtyard and a short tasting menu.", dish: "Ember-roasted leeks with hazelnut", hours: "wed-sun", dx: -0.01, dy: -0.006 },
  // NEW YORK (3)
  { slug: "atlantic-house-new-york", name: "Atlantic House", city: "new-york", street: "212 Harbor Street (demo)", postal: "10013", cuisines: ["american", "seafood"], chef: "ava-sinclair", level: 2, lunch: null, dinner: 295, wine: 175, currency: "USD", f: { romantic: true, privateDining: true, giftCard: true, accessible: true }, diet: [false, false, true], style: "Atlantic-coast tasting menu", desc: "A seafood-led tasting menu inspired by the Atlantic coast, served in a former printing house.", dish: "Scallop crudo with green apple", hours: "tue-sat", featured: true, dx: -0.002, dy: 0.008 },
  { slug: "copper-counter-new-york", name: "Copper Counter", city: "new-york", street: "88 Mercer Row (demo)", postal: "10012", cuisines: ["american", "contemporary"], level: 1, lunch: 125, dinner: 210, wine: 140, currency: "USD", f: { chefsTable: true }, diet: [true, false, false], style: "Chef's counter", desc: "Fourteen seats facing an open kitchen, with a rotating cast of courses cooked in copper.", dish: "Duck with charred plum", hours: "tue-sat", dx: 0.0, dy: 0.012 },
  { slug: "greenmarket-room-new-york", name: "Greenmarket Room", city: "new-york", street: "5 Union Place (demo)", postal: "10003", cuisines: ["vegetarian", "american"], level: 0, lunch: 75, dinner: 145, wine: 95, currency: "USD", f: { accessible: true }, diet: [true, true, true], style: "Farmers'-market vegetables", desc: "A bright room cooking produce bought that morning at the nearby greenmarket.", dish: "Heirloom squash with sage brown butter", hours: "wed-sun", verified: "pending", dx: 0.012, dy: 0.022 },
  // DUBAI (2)
  { slug: "dar-al-ward-dubai", name: "Dar Al Ward", city: "dubai", street: "Creekside Promenade 4 (demo)", postal: "00000", cuisines: ["middle-eastern", "contemporary"], chef: "layla-haddad", level: 2, lunch: 450, dinner: 850, wine: 550, currency: "AED", f: { terrace: true, seaView: true, romantic: true, accessible: true, parking: true }, diet: [true, true, false], style: "Modern Levantine", desc: "A terrace above the creek serving modern Levantine cooking, from charcoal-roasted vegetables to rose-scented desserts.", dish: "Charcoal aubergine with tahini and pomegranate", hours: "daily-dinner", featured: true, dx: 0.06, dy: 0.04 },
  { slug: "marina-ember-dubai", name: "Marina Ember", city: "dubai", street: "Harbour Walk 11 (demo)", postal: "00000", cuisines: ["seafood", "japanese"], level: 1, lunch: null, dinner: 690, wine: 420, currency: "AED", f: { seaView: true, terrace: true, parking: true, rooms: true }, diet: [false, false, true], style: "Japanese-influenced grill", desc: "A waterfront grill inside a boutique hotel, cooking Gulf seafood over Japanese charcoal.", dish: "Grilled hamour with yuzu kosho", hours: "daily-dinner", hotel: "harbour-light-hotel-dubai", dx: -0.12, dy: -0.06 },
  // ROME (4)
  { slug: "quinto-elemento-rome", name: "Quinto Elemento", city: "rome", street: "Via dei Macellai 9", postal: "00153", cuisines: ["italian", "contemporary"], chef: "marco-dellarosa", level: 2, lunch: 80, dinner: 170, wine: 100, currency: "EUR", f: { chefsTable: true, giftCard: true }, diet: [false, false, false], style: "Roman offal, refined", desc: "A Testaccio kitchen rebuilding the Roman quinto quarto tradition into a precise tasting menu.", dish: "Glazed sweetbreads with artichoke", hours: "tue-sat", featured: true, selection: true, dx: -0.02, dy: -0.016 },
  { slug: "terrazza-celeste-rome", name: "Terrazza Celeste", city: "rome", street: "Via delle Cupole 21", postal: "00186", cuisines: ["seafood", "italian"], chef: "chiara-valente", level: 1, lunch: 70, dinner: 150, wine: 90, currency: "EUR", f: { terrace: true, romantic: true, giftCard: true, accessible: true, rooms: true }, diet: [true, false, true], style: "Rooftop seafood", desc: "A rooftop above the historic centre known for seafood crudo and long-aged pecorino.", dish: "Red mullet crudo with citrus", hours: "daily-dinner", hotel: "palazzo-celeste-rome", dx: -0.006, dy: 0.0 },
  { slug: "orto-di-monti-rome", name: "Orto di Monti", city: "rome", street: "Via dei Vasai 3", postal: "00184", cuisines: ["vegetarian", "italian"], level: 1, lunch: 55, dinner: 95, wine: 55, currency: "EUR", f: { romantic: true, accessible: true }, diet: [true, true, true], style: "Garden-led Roman cooking", desc: "A small Monti room cooking Lazio vegetables and legumes with surprising depth.", dish: "Roman artichoke with mint and pecorino", hours: "wed-sun", dx: 0.004, dy: -0.004 },
  { slug: "forno-antico-rome", name: "Forno Antico", city: "rome", street: "Vicolo del Pane 7", postal: "00193", cuisines: ["italian"], level: 0, lunch: 40, dinner: 75, wine: 45, currency: "EUR", f: { terrace: true }, diet: [true, false, false], style: "Wood-oven trattoria, elevated", desc: "An elevated trattoria in Prati built around a century-old wood oven.", dish: "Wood-roasted lamb with rosemary potatoes", hours: "tue-sat", dx: -0.03, dy: 0.012 },
  // BARCELONA (2)
  { slug: "brasa-marina-barcelona", name: "Brasa Marina", city: "barcelona", street: "Passeig de les Barques 15", postal: "08003", cuisines: ["spanish", "seafood"], chef: "sofia-marquez", level: 2, lunch: 90, dinner: 175, wine: 95, currency: "EUR", f: { seaView: true, terrace: true, romantic: true, giftCard: true }, diet: [false, false, true], style: "Catalan rice and seafood", desc: "A seafront room where Catalan rice and seafood are cooked in a wood-fired pan.", dish: "Red prawn rice from the wood-fired pan", hours: "wed-sun", featured: true, dx: 0.02, dy: -0.006 },
  { slug: "taula-nova-barcelona", name: "Taula Nova", city: "barcelona", street: "Carrer de la Llum 22", postal: "08010", cuisines: ["spanish", "contemporary"], level: 1, lunch: 65, dinner: 130, wine: 70, currency: "EUR", f: { chefsTable: true, accessible: true }, diet: [true, false, true], style: "Counter dining", desc: "A lively counter where small plates arrive one by one, paired with Catalan natural wines.", dish: "Cured mackerel with smoked almond", hours: "tue-sat", dx: 0.002, dy: 0.008 },
  // COPENHAGEN (2)
  { slug: "skov-og-hav-copenhagen", name: "Skov og Hav", city: "copenhagen", street: "Havnegade 31 (demo)", postal: "1058", cuisines: ["nordic"], chef: "anders-holm", level: 3, lunch: null, dinner: 3200, wine: 1900, currency: "DKK", f: { seaView: true, chefsTable: true, privateDining: true }, diet: [true, true, true], style: "Foraged Nordic seasons", desc: "Harbour-side Nordic cooking built on foraging, fermentation and the short northern growing season.", dish: "Fermented plum with beeswax cream", hours: "tue-sat", featured: true, selection: true, dx: 0.02, dy: 0.0 },
  { slug: "rug-copenhagen", name: "Rug", city: "copenhagen", street: "Bagergade 4 (demo)", postal: "1360", cuisines: ["nordic", "contemporary"], level: 0, lunch: 650, dinner: 1250, wine: 750, currency: "DKK", f: { accessible: true }, diet: [true, false, false], style: "Rye, grains and fire", desc: "A bakery by day and a grain-focused tasting menu by night.", dish: "Rye porridge with brown butter and trout roe", hours: "wed-sun", dx: -0.004, dy: 0.006 },
  // SINGAPORE (2)
  { slug: "rumah-tan-singapore", name: "Rumah Tan", city: "singapore", street: "48 Shophouse Row (demo)", postal: "089000", cuisines: ["peranakan", "contemporary"], chef: "wei-lin-tan", level: 2, lunch: 128, dinner: 288, wine: 168, currency: "SGD", f: { privateDining: true, giftCard: true, accessible: true }, diet: [false, false, false], style: "Peranakan with French technique", desc: "A restored shophouse where Peranakan family recipes meet French technique.", dish: "Ayam buah keluak, reimagined", hours: "tue-sat", featured: true, dx: -0.06, dy: -0.07 },
  { slug: "jade-lantern-singapore", name: "Jade Lantern", city: "singapore", street: "1 Marina Vista (demo)", postal: "018000", cuisines: ["cantonese"], chef: "henry-cho", level: 1, lunch: 98, dinner: 238, wine: 138, currency: "SGD", f: { privateDining: true, seaView: true, parking: true, accessible: true, rooms: true }, diet: [true, false, false], style: "Modern Cantonese", desc: "Modern Cantonese cooking with roast meats and a dim sum tasting menu, inside a bayside hotel.", dish: "Barbecued pork with lychee wood smoke", hours: "daily-dinner", hotel: "bayview-residence-singapore", dx: -0.03, dy: -0.065 },
];

const HOURS: Record<Spec["hours"], OpeningHours[]> = {
  "tue-sat": [
    { days: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "12:00", closes: "14:00" },
    { days: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "19:00", closes: "22:30" },
  ],
  "wed-sun": [
    { days: ["Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], opens: "12:30", closes: "14:30" },
    { days: ["Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], opens: "19:30", closes: "23:00" },
  ],
  "mon-fri": [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "12:00", closes: "14:30" },
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "19:00", closes: "22:00" },
  ],
  "daily-dinner": [
    {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as DayOfWeek[],
      opens: "18:30",
      closes: "23:30",
    },
  ],
};

const LANG: Record<string, string[]> = {
  france: ["French", "English"],
  japan: ["Japanese", "English"],
  italy: ["Italian", "English"],
  "united-kingdom": ["English"],
  "united-states": ["English", "Spanish"],
  "united-arab-emirates": ["English", "Arabic"],
  spain: ["Spanish", "Catalan", "English"],
  denmark: ["Danish", "English"],
  singapore: ["English", "Mandarin", "Malay"],
};

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return Math.abs(h);
}

/** Deterministic price history: 3–4 points ending at the current price. */
function history(amount: number | null, currency: string, seed: number) {
  if (amount == null) return [];
  const steps = [0.86, 0.91, 0.96, 1];
  const dates = ["2024-11-15", "2025-05-10", "2025-12-01", "2026-09-20"];
  return steps.slice(seed % 2).map((k, i, arr) => ({
    amount: Math.round((amount * k) / (currency === "JPY" ? 100 : 1)) * (currency === "JPY" ? 100 : 1),
    currency,
    recordedAt: dates[i + (4 - arr.length)]!,
  }));
}

function menus(s: Spec): MenuPrice[] {
  const seed = hash(s.slug);
  const status = (v: number | null) => (v == null ? "missing" : (s.priceStatus ?? (seed % 5 === 0 ? "estimated" : "verified")));
  const collected = s.verifiedAt ?? "2026-09-20";
  const src = `https://example.com/demo/${s.slug}/menu`;
  return [
    { id: `${s.slug}-lunch`, name: { en: "Lunch tasting menu", it: "Menu degustazione pranzo" }, kind: "tasting", service: "lunch", amount: s.lunch, currency: s.currency, status: status(s.lunch), sourceUrl: s.lunch ? src : undefined, collectedAt: s.lunch ? collected : undefined, courses: 5, history: history(s.lunch, s.currency, seed) },
    { id: `${s.slug}-dinner`, name: { en: "Dinner tasting menu", it: "Menu degustazione cena" }, kind: "tasting", service: "dinner", amount: s.dinner, currency: s.currency, status: status(s.dinner), sourceUrl: s.dinner ? src : undefined, collectedAt: s.dinner ? collected : undefined, courses: 9 + (seed % 4), history: history(s.dinner, s.currency, seed + 1) },
    { id: `${s.slug}-wine`, name: { en: "Wine pairing", it: "Abbinamento vini" }, kind: "wine_pairing", service: "dinner", amount: s.wine, currency: s.currency, status: status(s.wine), sourceUrl: s.wine ? src : undefined, collectedAt: s.wine ? collected : undefined, history: history(s.wine, s.currency, seed + 2) },
  ];
}

const DISH_POOL = 16;
const INTERIOR_POOL = 8;

function images(s: Spec, i: number): ImageRef[] {
  const seed = hash(s.slug);
  const d = (k: number) => `dish-${((i * 5 + k * 7) % DISH_POOL) + 1}`;
  const r = (k: number) => `interior-${((seed + k * 3) % INTERIOR_POOL) + 1}`;
  return [
    { key: d(0), subject: "dish", dish: s.dish, illustrative: true },
    { key: r(0), subject: "interior", illustrative: true },
    { key: d(1), subject: "dish", illustrative: true },
    { key: s.f.terrace ? "terrace-1" : r(1), subject: s.f.terrace ? "terrace" : "interior", illustrative: true },
    { key: d(2 + (i % 3)), subject: "dish", illustrative: true },
  ];
}

export const restaurants: Restaurant[] = S.map((s, i) => {
  const city = cities.find((c) => c.slug === s.city)!;
  const features: Features = {
    romantic: false, terrace: false, seaView: false, chefsTable: false, privateDining: false,
    rooms: Boolean(s.hotel), giftCard: false, accessible: false, parking: false, ...s.f,
  };
  const verification = s.verified ?? "verified";
  const lastVerifiedAt = s.verifiedAt ?? (verification === "pending" ? undefined : "2026-09-20");
  return {
    id: `rest-${String(i + 1).padStart(2, "0")}`,
    slug: s.slug,
    isDemo: true,
    publicationStatus: "published",
    verificationStatus: verification,
    sourceUrl: `https://example.com/demo/${s.slug}`,
    lastVerifiedAt,
    updatedAt: lastVerifiedAt ?? "2026-10-15",
    name: s.name,
    countrySlug: city.countrySlug,
    regionSlug: city.regionSlug,
    citySlug: city.slug,
    address: { street: s.street, postalCode: s.postal, locality: city.name.en, region: undefined, countryCode: "" },
    lat: +(city.lat + s.dy).toFixed(5),
    lng: +(city.lng + s.dx).toFixed(5),
    cuisines: s.cuisines,
    chefSlug: s.chef,
    style: { en: s.style },
    description: { en: s.desc },
    recognition: { level: s.level, kind: s.level > 0 ? "demo" : "none" },
    awards: [],
    atlasSelection: Boolean(s.selection),
    website: `https://example.com/demo/${s.slug}`,
    features,
    dietary: { vegetarian: s.diet[0], vegan: s.diet[1], glutenFree: s.diet[2] },
    reservation: {
      method: s.method ?? (hash(s.slug) % 3 === 0 ? "email" : "online"),
      providerUrl: undefined,
      instructions: {
        en: "Bookings open 30 days ahead. Dietary requirements should be shared at least 48 hours before the visit.",
        it: "Le prenotazioni si aprono 30 giorni prima. Le esigenze alimentari vanno comunicate almeno 48 ore prima.",
      },
    },
    dressCode: { en: "Smart casual", it: "Elegante informale" },
    durationMinutes: 120 + (hash(s.slug) % 4) * 30,
    languages: LANG[city.countrySlug] ?? ["English"],
    atmosphere: { en: features.romantic ? "Intimate, softly lit" : "Relaxed and convivial", it: features.romantic ? "Intima, luci soffuse" : "Rilassata e conviviale" },
    familyPolicy: { en: "Children aged 10 and over are welcome at dinner.", it: "Bambini dai 10 anni benvenuti a cena." },
    cancellationPolicy: { en: "Free cancellation up to 48 hours before; later cancellations may be charged.", it: "Cancellazione gratuita fino a 48 ore prima; oltre può essere addebitata." },
    hours: HOURS[s.hours],
    specialHours: [{ date: "2026-12-25", closed: true, note: "Christmas Day" }],
    menus: menus(s),
    images: images(s, i),
    hotelSlug: s.hotel,
    featured: Boolean(s.featured),
    reviews: { count: 0, average: null },
  };
});

const CC: Record<string, string> = { france: "FR", japan: "JP", italy: "IT", "united-kingdom": "GB", "united-states": "US", "united-arab-emirates": "AE", spain: "ES", denmark: "DK", singapore: "SG" };
for (const r of restaurants) r.address.countryCode = CC[r.countrySlug] ?? "";
