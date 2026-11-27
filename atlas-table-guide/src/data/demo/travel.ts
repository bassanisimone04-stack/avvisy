import type { AffiliateLink, Experience, GiftCard, Hotel, ImageRef, Itinerary } from "@/db/types";
import { cities } from "./geo";

const rec = (id: string, slug: string) => ({
  id, slug, isDemo: true, publicationStatus: "published" as const, verificationStatus: "verified" as const,
  lastVerifiedAt: "2026-09-20", updatedAt: "2026-09-20", sourceUrl: `https://example.com/demo/${slug}`,
});
const at = (citySlug: string, dx: number, dy: number) => {
  const c = cities.find((x) => x.slug === citySlug)!;
  return { citySlug, countrySlug: c.countrySlug, lat: +(c.lat + dy).toFixed(5), lng: +(c.lng + dx).toFixed(5) };
};
const im = (key: string, subject: ImageRef["subject"]): ImageRef => ({ key, subject, illustrative: true });

/** Affiliate partners are placeholders on example.com until real agreements exist. */
export const affiliateLinks: AffiliateLink[] = [
  ...["harbour-light-hotel-dubai", "palazzo-celeste-rome", "bayview-residence-singapore", "maison-des-vignes-paris", "villa-lago-milan", "ryokan-kaze-tokyo", "the-gatehouse-london", "hudson-loft-new-york", "casa-del-mar-barcelona", "nyhavn-light-copenhagen", "podere-cipressi-tuscany", "castello-vigna-tuscany"].map((s) => ({
    id: `h-${s}`, partner: "Demo hotel partner", url: `https://example.com/demo-affiliate/hotels/${s}`, label: "Check rates",
  })),
  ...Array.from({ length: 15 }, (_, i) => ({ id: `x-${i + 1}`, partner: "Demo experience partner", url: `https://example.com/demo-affiliate/experiences/${i + 1}`, label: "Check availability" })),
];

type H = [string, string, string, Hotel["category"], string, number | null, string, number, number, string[], string[]];
const HOTELS: H[] = [
  ["harbour-light-hotel-dubai", "Harbour Light Hotel", "dubai", "restaurant-with-rooms", "A 40-room waterfront hotel built around its Japanese-influenced grill, Marina Ember.", 1450, "AED", -0.118, -0.058, ["Pool", "Spa", "Sea view", "Airport transfer"], ["marina-ember-dubai"]],
  ["palazzo-celeste-rome", "Palazzo Celeste", "rome", "recognised-restaurant", "A restored 18th-century palazzo with 22 rooms beneath the rooftop restaurant Terrazza Celeste.", 520, "EUR", -0.005, 0.001, ["Rooftop", "Concierge", "Bar"], ["terrazza-celeste-rome"]],
  ["bayview-residence-singapore", "Bayview Residence", "singapore", "recognised-restaurant", "A bayside hotel with an infinity pool and the modern Cantonese restaurant Jade Lantern.", 690, "SGD", -0.029, -0.064, ["Pool", "Gym", "Bay view"], ["jade-lantern-singapore"]],
  ["maison-des-vignes-paris", "Maison des Vignes", "paris", "boutique", "A 16-room townhouse hotel on the Left Bank with a wine cellar open to guests.", 410, "EUR", -0.008, -0.002, ["Wine cellar", "Library", "Courtyard"], ["maison-lune-paris"]],
  ["villa-lago-milan", "Villa Lago", "milan", "countryside-retreat", "A lakeside villa an hour from Milan with a set-table terrace and boat transfers.", 380, "EUR", 0.15, 0.35, ["Lake view", "Boat transfer", "Garden"], ["oro-di-brera-milan"]],
  ["ryokan-kaze-tokyo", "Ryokan Kaze", "tokyo", "boutique", "A modern ryokan with twelve rooms, cypress baths and a kaiseki breakfast.", 68000, "JPY", -0.012, -0.018, ["Onsen-style bath", "Tea room"], ["hanare-takeda-tokyo"]],
  ["the-gatehouse-london", "The Gatehouse", "london", "boutique", "A 30-room hotel in a converted gatehouse near the river, with a cocktail bar.", 345, "GBP", 0.05, -0.003, ["Bar", "Gym"], ["the-tidewater-london"]],
  ["hudson-loft-new-york", "Hudson Loft", "new-york", "boutique", "Industrial-style lofts above a former printing house in Tribeca.", null, "USD", -0.003, 0.009, ["Rooftop", "Gym"], ["atlantic-house-new-york"]],
  ["casa-del-mar-barcelona", "Casa del Mar", "barcelona", "boutique", "A seafront hotel with a rooftop pool and direct beach access.", 290, "EUR", 0.021, -0.005, ["Pool", "Beach access"], ["brasa-marina-barcelona"]],
  ["nyhavn-light-copenhagen", "Havnelys Hotel", "copenhagen", "boutique", "A harbour warehouse turned 50-room design hotel with a sauna on the water.", 2400, "DKK", 0.019, 0.001, ["Sauna", "Bikes"], ["skov-og-hav-copenhagen"]],
  ["podere-cipressi-tuscany", "Podere dei Cipressi", "rome", "wine-estate", "A working wine estate between Siena and Montalcino with eight rooms and cellar tastings.", 340, "EUR", -0.95, 1.25, ["Vineyard", "Pool", "Cellar tours"], []],
  ["castello-vigna-tuscany", "Castello della Vigna", "rome", "gastronomic-resort", "A hilltop castle resort in the Chianti hills with a cooking school and olive groves.", 610, "EUR", -1.2, 1.55, ["Cooking school", "Spa", "Pool"], []],
];

export const hotels: Hotel[] = HOTELS.map(([slug, name, city, category, desc, price, cur, dx, dy, amenities, rs], i) => {
  const p = at(city, dx, dy);
  return {
    ...rec(`hotel-${i + 1}`, slug), name, category, description: { en: desc }, amenities, restaurantSlugs: rs,
    affiliateId: `h-${slug}`, priceFrom: price ? { amount: price, currency: cur, status: "estimated" } : null,
    ...p, address: { street: "Demo address", postalCode: "", locality: cities.find((c) => c.slug === city)!.name.en, countryCode: "" },
    images: [im(i % 2 ? "luxury-hotel" : "dine-and-stay", "hotel"), im(`interior-${(i % 8) + 1}`, "interior")],
    rooms: 8 + ((i * 7) % 40),
  };
});
// Tuscany estates sit in Tuscany, not Rome — fix their region-level placement
for (const h of hotels) if (h.slug.endsWith("tuscany")) { h.address.locality = "Tuscany"; }

type X = [string, Experience["category"], string, string, number, number | null, string, string?];
const EXP: X[] = [
  ["Chef's table at Maison Lune", "chefs-table", "paris", "Six guests sit at the pass for a 12-course menu explained course by course by the kitchen team.", 3.5, 420, "EUR", "maison-lune-paris"],
  ["Private dining at Rumah Tan", "private-dining", "singapore", "A restored shophouse room for up to 14 guests with a Peranakan banquet menu.", 3, 3800, "SGD", "rumah-tan-singapore"],
  ["Fresh pasta masterclass", "cooking-class", "rome", "Learn tonnarelli, ravioli and cacio e pepe technique with a Roman pasta maker, lunch included.", 4, 145, "EUR"],
  ["Champagne house cellar visit", "wine-tasting", "paris", "A day trip to a grower's cellar with a tasting of five cuvées and a vineyard walk.", 9, 260, "EUR"],
  ["Chianti vineyard walk and lunch", "vineyard-tour", "rome", "Walk the rows of a family estate, then taste four wines with a long Tuscan lunch.", 6, 180, "EUR"],
  ["White truffle hunt with a trifolau", "truffle-hunting", "milan", "Join a truffle hunter and his dog in the hills, followed by a tasting of fresh truffle dishes.", 5, 310, "EUR"],
  ["Tsukiji outer-market food walk", "food-tour", "tokyo", "A guided morning walk through the outer market with tastings of tamagoyaki, tuna and wagashi.", 3, 18000, "JPY"],
  ["Borough market morning", "market-visit", "london", "Meet producers and cheesemongers before a tasting lunch at a nearby restaurant.", 3, 120, "GBP"],
  ["Copenhagen foraging walk", "food-tour", "copenhagen", "A coastal forage with a Nordic chef, ending with a fire-cooked lunch.", 4, 1400, "DKK"],
  ["Spice souk and Levantine supper", "food-tour", "dubai", "An evening through the spice and gold souks, then a supper of Levantine small plates.", 4, 650, "AED"],
  ["Catalan rice workshop", "cooking-class", "barcelona", "Cook a seafood rice in a wood-fired pan with a Catalan chef, finishing with lunch on the terrace.", 4, 160, "EUR"],
  ["Sake and kaiseki evening", "wine-tasting", "tokyo", "A sake sommelier guides a pairing of six sakes with a short kaiseki menu.", 3, 32000, "JPY"],
  ["Hawker heritage trail", "food-tour", "singapore", "Taste your way through three hawker centres with a food historian.", 3.5, 160, "SGD"],
  ["Milan culinary weekend", "culinary-weekend", "milan", "Two nights, a cooking class, a market visit and two dinners in Milan's best-known dining rooms.", 48, null, "EUR"],
  ["Hudson Valley farm day", "vineyard-tour", "new-york", "Leave the city for a farm and cider house tour with a picnic of local produce.", 8, 295, "USD"],
];
export const experiences: Experience[] = EXP.map(([name, category, city, desc, hours, price, cur, rest], i) => {
  const slug = name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const subj: ImageRef["subject"] = category === "wine-tasting" || category === "vineyard-tour" ? "wine" : category === "chefs-table" || category === "cooking-class" ? "chef" : "experience";
  const key = subj === "wine" ? "wine-experience" : subj === "chef" ? (i % 2 ? "chefs-table" : "chef-editorial") : category === "private-dining" ? "romantic-dining" : i % 2 ? "tasting-menu" : "tuscany-travel";
  return {
    ...rec(`exp-${i + 1}`, slug), name, category, ...at(city, (i % 5) * 0.004, (i % 3) * 0.004),
    description: { en: desc }, durationHours: hours,
    price: price ? { amount: price, currency: cur, status: i % 4 === 0 ? "estimated" : "verified" } : null,
    affiliateId: `x-${i + 1}`, restaurantSlug: rest, images: [im(key, subj)],
  };
});

export const itineraries: Itinerary[] = [
  {
    ...rec("it-1", "gastronomic-journey-tuscany"), countrySlug: "italy", citySlugs: ["rome"],
    title: { en: "A gastronomic journey through Tuscany", it: "Un viaggio gastronomico in Toscana" },
    summary: { en: "Four days from Rome into the Chianti hills: wine estates, a truffle lunch and two tasting menus.", it: "Quattro giorni da Roma alle colline del Chianti: tenute vinicole, un pranzo al tartufo e due menu degustazione." },
    image: im("tuscany-travel", "landscape"), budgetEstimate: { amount: 1650, currency: "EUR", perPerson: true },
    days: [
      { day: 1, title: { en: "Rome", it: "Roma" }, items: [
        { time: "13:00", type: "restaurant", ref: "orto-di-monti-rome", note: { en: "Light vegetable lunch in Monti", it: "Pranzo leggero di verdure a Monti" } },
        { time: "20:00", type: "restaurant", ref: "quinto-elemento-rome", note: { en: "Tasting menu", it: "Menu degustazione" } },
        { time: "23:00", type: "hotel", ref: "palazzo-celeste-rome", note: { en: "Overnight", it: "Pernottamento" } },
      ] },
      { day: 2, title: { en: "Into Chianti", it: "Verso il Chianti" }, items: [
        { time: "10:00", type: "experience", ref: "chianti-vineyard-walk-and-lunch", note: { en: "Vineyard walk and lunch", it: "Passeggiata in vigna e pranzo" } },
        { time: "18:00", type: "hotel", ref: "castello-vigna-tuscany", note: { en: "Check in at the castle", it: "Check-in al castello" } },
      ] },
      { day: 3, title: { en: "Estates and cellars", it: "Tenute e cantine" }, items: [
        { time: "11:00", type: "note", note: { en: "Free morning; the estate offers cellar tours", it: "Mattina libera; la tenuta propone visite in cantina" } },
        { time: "19:30", type: "hotel", ref: "podere-cipressi-tuscany", note: { en: "Dinner and overnight at the wine estate", it: "Cena e notte nella tenuta" } },
      ] },
      { day: 4, title: { en: "Back to Rome", it: "Ritorno a Roma" }, items: [
        { time: "20:30", type: "restaurant", ref: "terrazza-celeste-rome", note: { en: "Farewell dinner on the rooftop", it: "Cena d'addio in terrazza" } },
      ] },
    ],
  },
  {
    ...rec("it-2", "paris-in-three-tables"), countrySlug: "france", citySlugs: ["paris"],
    title: { en: "Paris in three tables", it: "Parigi in tre tavole" }, summary: { en: "A long weekend balancing a grand tasting menu, a seafood lunch and a plant-based dinner.", it: "Un weekend lungo tra un grande menu degustazione, un pranzo di pesce e una cena vegetale." },
    image: im("destination-paris", "skyline"), budgetEstimate: { amount: 1100, currency: "EUR", perPerson: true },
    days: [
      { day: 1, title: { en: "Left Bank", it: "Rive Gauche" }, items: [{ time: "20:00", type: "restaurant", ref: "maison-lune-paris", note: { en: "Dinner tasting menu", it: "Degustazione serale" } }, { time: "23:30", type: "hotel", ref: "maison-des-vignes-paris", note: { en: "Overnight", it: "Pernottamento" } }] },
      { day: 2, title: { en: "On the river", it: "Sul fiume" }, items: [{ time: "12:30", type: "restaurant", ref: "le-quai-bleu-paris", note: { en: "Seafood lunch", it: "Pranzo di pesce" } }, { time: "16:00", type: "experience", ref: "champagne-house-cellar-visit", note: { en: "Alternative: day trip to the cellars", it: "In alternativa: gita in cantina" } }] },
      { day: 3, title: { en: "East Paris", it: "Parigi est" }, items: [{ time: "19:30", type: "restaurant", ref: "verdure-paris", note: { en: "Plant-based dinner", it: "Cena vegetale" } }] },
    ],
  },
  {
    ...rec("it-3", "tokyo-counters-and-kaiseki"), countrySlug: "japan", citySlugs: ["tokyo"],
    title: { en: "Tokyo: counters and kaiseki", it: "Tokyo: banconi e kaiseki" }, summary: { en: "Three days of sushi, charcoal and seasonal kaiseki, with a market walk.", it: "Tre giorni di sushi, carbone e kaiseki stagionale, con una passeggiata al mercato." },
    image: im("destination-tokyo", "skyline"), budgetEstimate: { amount: 230000, currency: "JPY", perPerson: true },
    days: [
      { day: 1, title: { en: "Ginza", it: "Ginza" }, items: [{ time: "08:00", type: "experience", ref: "tsukiji-outer-market-food-walk", note: { en: "Market walk", it: "Mercato" } }, { time: "19:00", type: "restaurant", ref: "sushi-kawase-tokyo", note: { en: "Sushi counter", it: "Bancone di sushi" } }] },
      { day: 2, title: { en: "Nishi-Azabu", it: "Nishi-Azabu" }, items: [{ time: "18:30", type: "restaurant", ref: "hanare-takeda-tokyo", note: { en: "Kaiseki", it: "Kaiseki" } }, { time: "22:00", type: "hotel", ref: "ryokan-kaze-tokyo", note: { en: "Overnight", it: "Pernottamento" } }] },
      { day: 3, title: { en: "Ebisu", it: "Ebisu" }, items: [{ time: "19:00", type: "restaurant", ref: "sumibi-oak-tokyo", note: { en: "Charcoal counter", it: "Bancone alla brace" } }] },
    ],
  },
  {
    ...rec("it-4", "nordic-weekend-copenhagen"), countrySlug: "denmark", citySlugs: ["copenhagen"],
    title: { en: "A Nordic weekend in Copenhagen", it: "Un weekend nordico a Copenaghen" }, summary: { en: "Foraging, rye and a harbour-side tasting menu.", it: "Foraging, segale e un menu degustazione sul porto." },
    image: im("destination-copenhagen", "skyline"), budgetEstimate: { amount: 9500, currency: "DKK", perPerson: true },
    days: [
      { day: 1, title: { en: "Harbour", it: "Porto" }, items: [{ time: "10:00", type: "experience", ref: "copenhagen-foraging-walk", note: { en: "Foraging walk", it: "Foraging" } }, { time: "19:00", type: "restaurant", ref: "skov-og-hav-copenhagen", note: { en: "Tasting menu", it: "Degustazione" } }, { time: "23:00", type: "hotel", ref: "nyhavn-light-copenhagen", note: { en: "Overnight", it: "Pernottamento" } }] },
      { day: 2, title: { en: "Grain and fire", it: "Grano e fuoco" }, items: [{ time: "12:00", type: "restaurant", ref: "rug-copenhagen", note: { en: "Bakery lunch", it: "Pranzo in panetteria" } }] },
    ],
  },
  {
    ...rec("it-5", "london-long-weekend"), countrySlug: "united-kingdom", citySlugs: ["london"],
    title: { en: "London long weekend", it: "Weekend lungo a Londra" }, summary: { en: "Market morning, a Mayfair lunch and a warehouse tasting menu.", it: "Mattina al mercato, pranzo a Mayfair e degustazione in un magazzino." },
    image: im("destination-london", "skyline"), budgetEstimate: { amount: 980, currency: "GBP", perPerson: true },
    days: [
      { day: 1, title: { en: "South Bank", it: "South Bank" }, items: [{ time: "09:30", type: "experience", ref: "borough-market-morning", note: { en: "Market morning", it: "Mercato" } }, { time: "19:30", type: "restaurant", ref: "hearth-and-hall-london", note: { en: "Fire-led dinner", it: "Cena alla brace" } }] },
      { day: 2, title: { en: "Mayfair and East", it: "Mayfair ed East" }, items: [{ time: "12:30", type: "restaurant", ref: "saffron-and-slate-london", note: { en: "Lunch", it: "Pranzo" } }, { time: "19:30", type: "restaurant", ref: "the-tidewater-london", note: { en: "Tasting menu", it: "Degustazione" } }, { time: "23:00", type: "hotel", ref: "the-gatehouse-london", note: { en: "Overnight", it: "Pernottamento" } }] },
    ],
  },
  {
    ...rec("it-6", "milan-and-the-lakes"), countrySlug: "italy", citySlugs: ["milan"],
    title: { en: "Milan and the lakes", it: "Milano e i laghi" }, summary: { en: "Design-led dining in Milan, then a lakeside terrace and a truffle hunt.", it: "Ristoranti di design a Milano, poi una terrazza sul lago e una caccia al tartufo." },
    image: im("dine-and-stay", "hotel"), budgetEstimate: { amount: 1250, currency: "EUR", perPerson: true },
    days: [
      { day: 1, title: { en: "Brera", it: "Brera" }, items: [{ time: "13:00", type: "restaurant", ref: "vetro-porta-nuova-milan", note: { en: "Business lunch with a view", it: "Pranzo con vista" } }, { time: "20:00", type: "restaurant", ref: "oro-di-brera-milan", note: { en: "Tasting menu", it: "Degustazione" } }] },
      { day: 2, title: { en: "Lake", it: "Lago" }, items: [{ time: "10:00", type: "experience", ref: "white-truffle-hunt-with-a-trifolau", note: { en: "Truffle hunt (seasonal)", it: "Caccia al tartufo (stagionale)" } }, { time: "19:00", type: "hotel", ref: "villa-lago-milan", note: { en: "Dinner and overnight by the lake", it: "Cena e notte sul lago" } }] },
    ],
  },
];

export const giftCards: GiftCard[] = [
  { ...rec("gc-1", "any-restaurant"), name: { en: "Any restaurant", it: "Qualsiasi ristorante" }, category: "any-restaurant", values: [100, 250, 500], currency: "EUR", design: "carmine", description: { en: "Redeemable at participating restaurants once partner agreements are in place.", it: "Utilizzabile nei ristoranti aderenti una volta attivati gli accordi con i partner." } },
  { ...rec("gc-2", "tasting-menu-for-two"), name: { en: "Tasting menu for two", it: "Degustazione per due" }, category: "tasting-menu", values: [250, 400], currency: "EUR", design: "garnet", description: { en: "A tasting menu experience for two guests.", it: "Un menu degustazione per due persone." } },
  { ...rec("gc-3", "dine-and-stay"), name: { en: "Dine & Stay", it: "Cena e soggiorno" }, category: "dine-and-stay", values: [600, 900], currency: "EUR", design: "ivory", description: { en: "Dinner and an overnight stay at a restaurant with rooms.", it: "Cena e pernottamento in un ristorante con camere." } },
  { ...rec("gc-4", "chefs-table"), name: { en: "Chef's table", it: "Tavolo dello chef" }, category: "experience", values: [420, 840], currency: "EUR", design: "garnet", description: { en: "A seat at the pass for one or two guests.", it: "Un posto al pass per una o due persone." } },
  { ...rec("gc-5", "wine-experience"), name: { en: "Wine experience", it: "Esperienza nel vino" }, category: "experience", values: [150, 300], currency: "EUR", design: "carmine", description: { en: "Cellar visits, tastings and vineyard lunches.", it: "Visite in cantina, degustazioni e pranzi in vigna." } },
  { ...rec("gc-6", "cooking-class"), name: { en: "Cooking class", it: "Corso di cucina" }, category: "experience", values: [145, 290], currency: "EUR", design: "ivory", description: { en: "A hands-on class with a professional chef.", it: "Una lezione pratica con uno chef professionista." } },
];
