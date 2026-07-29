import type { Business, OpeningHoursDay, Review } from "./types";
import { slugify } from "./format";
import { getCategoryInfo, categoryLabelPlural } from "./categories";

const FEMININE_CATEGORIES = new Set(["pizzeria", "farmacia", "gelateria"]);

const DAYS = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"];

function hours(pattern: (string | null)[]): OpeningHoursDay[] {
  return DAYS.map((day, i) => ({ day, hours: pattern[i] }));
}

const LUNCH_DINNER = "12:30–14:30, 19:30–22:30";
const ALL_DAY = "8:00–20:00";
const SHOP_HOURS = "9:00–13:00, 16:00–19:30";

const reviewPool: Omit<Review, "id">[] = [
  { author: "Chiara M.", avatarSeed: 1, rating: 5, date: "2026-05-12", title: "Finalmente senza pensieri", body: "Menu dedicato con cucina separata, personale preparatissimo sulla celiachia. Ci torno sicuramente.", verifiedCeliac: true, helpful: 24 },
  { author: "Davide R.", avatarSeed: 2, rating: 5, date: "2026-04-02", title: "Qualità top", body: "Impasti perfetti e nessuna contaminazione incrociata, si sente l'attenzione.", verifiedCeliac: true, helpful: 18 },
  { author: "Federica S.", avatarSeed: 3, rating: 4, date: "2026-03-20", title: "Molto buono", body: "Ottimo rapporto qualità prezzo, personale gentile e informato.", verifiedCeliac: false, helpful: 9 },
  { author: "Luca P.", avatarSeed: 4, rating: 5, date: "2026-02-14", title: "Consigliatissimo", body: "Ambiente curato e menu gluten free ampio, non manca nulla rispetto al menu tradizionale.", verifiedCeliac: true, helpful: 31 },
  { author: "Martina B.", avatarSeed: 5, rating: 4, date: "2026-01-28", title: "Buona esperienza", body: "Prenotazione facile, hanno chiesto subito se ci fossero intolleranze. Bravi.", verifiedCeliac: true, helpful: 12 },
  { author: "Giorgio T.", avatarSeed: 6, rating: 5, date: "2025-12-19", title: "Top per celiaci", body: "Certificazione AIC esposta e staff formato. Il posto perfetto per una cena senza ansie.", verifiedCeliac: true, helpful: 27 },
];

function pickReviews(count: number, offset: number): Review[] {
  return Array.from({ length: count }).map((_, i) => {
    const base = reviewPool[(i + offset) % reviewPool.length];
    return { ...base, id: `r-${offset}-${i}` };
  });
}

function avgRating(reviews: Review[]): number {
  const r = reviews.reduce((s, x) => s + x.rating, 0) / reviews.length;
  return Math.round(r * 10) / 10;
}

interface Seed {
  name: string;
  category: Business["category"];
  region: string;
  province: string;
  provinceCode: string;
  city: string;
  address: string;
  postalCode: string;
  lat: number;
  lng: number;
  priceRange: Business["priceRange"];
  aicCertified: boolean;
  delivery: boolean;
  takeaway: boolean;
  openNow: boolean;
  hoursPattern: (string | null)[];
  services: string[];
  glutenFreeMenu: string[];
  description: string;
  shortDescription: string;
  gallerySeeds: number[];
  reviewOffset: number;
  reviewCount: number;
  featured?: boolean;
}

const seeds: Seed[] = [
  {
    name: "Osteria Senza Confini",
    category: "ristorante",
    region: "Lombardia", province: "Milano", provinceCode: "MI", city: "Milano",
    address: "Via Tortona 12", postalCode: "20144", lat: 45.4525, lng: 9.1620,
    priceRange: "€€", aicCertified: true, delivery: true, takeaway: true, openNow: true,
    hoursPattern: [LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER, null],
    services: ["Cucina 100% gluten free", "Prenotazione online", "Adatto ai bambini", "Accesso disabili"],
    glutenFreeMenu: ["Pasta fresca fatta in casa", "Risotti stagionali", "Tagliata di manzo", "Tiramisù gluten free"],
    description: "Cucina milanese contemporanea interamente gluten free, con laboratorio interno dedicato alla pasta fresca e forno separato per il pane. Un punto di riferimento per la comunità celiaca del capoluogo lombardo, con menu a rotazione stagionale e attenzione certosina alle contaminazioni incrociate.",
    shortDescription: "Cucina milanese 100% gluten free con pasta fresca fatta in casa.",
    gallerySeeds: [10, 11, 12, 13],
    reviewOffset: 0, reviewCount: 4, featured: true,
  },
  {
    name: "Pizzeria La Spiga d'Oro",
    category: "pizzeria",
    region: "Lombardia", province: "Milano", provinceCode: "MI", city: "Monza",
    address: "Corso Milano 45", postalCode: "20900", lat: 45.5845, lng: 9.2744,
    priceRange: "€€", aicCertified: true, delivery: true, takeaway: true, openNow: false,
    hoursPattern: [null, LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER],
    services: ["Forno dedicato", "Impasto a lunga lievitazione", "Asporto", "Delivery"],
    glutenFreeMenu: ["Margherita gluten free", "Pizza al padellino", "Fritti senza glutine", "Calzone farcito"],
    description: "Forno separato certificato AIC e impasto a lunga lievitazione senza glutine, cotto a legna. La pizzeria è diventata un punto di ritrovo per famiglie celiache della Brianza grazie a un menu ampio e a un servizio di consegna a domicilio rapido e affidabile.",
    shortDescription: "Forno dedicato certificato AIC, impasto a lunga lievitazione.",
    gallerySeeds: [14, 15, 16, 17],
    reviewOffset: 1, reviewCount: 3, featured: true,
  },
  {
    name: "Hotel Villa Verde",
    category: "hotel",
    region: "Toscana", province: "Firenze", provinceCode: "FI", city: "Fiesole",
    address: "Via Bosconi 8", postalCode: "50014", lat: 43.8074, lng: 11.2947,
    priceRange: "€€€", aicCertified: true, delivery: false, takeaway: false, openNow: true,
    hoursPattern: [ALL_DAY, ALL_DAY, ALL_DAY, ALL_DAY, ALL_DAY, ALL_DAY, ALL_DAY],
    services: ["Colazione gluten free", "Ristorante interno dedicato", "Piscina", "Parcheggio privato"],
    glutenFreeMenu: ["Colazione dolce e salata gluten free", "Menu cena degustazione", "Prodotti da forno certificati"],
    description: "Boutique hotel sulle colline di Fiesole con vista su Firenze, colazione interamente gluten free preparata in cucina dedicata e ristorante interno con menu certificato AIC. Ideale per una vacanza in Toscana senza rinunce.",
    shortDescription: "Boutique hotel con colazione e ristorante 100% gluten free.",
    gallerySeeds: [18, 19, 20, 21],
    reviewOffset: 2, reviewCount: 3, featured: true,
  },
  {
    name: "Farmacia San Lorenzo",
    category: "farmacia",
    region: "Lazio", province: "Roma", provinceCode: "RM", city: "Roma",
    address: "Via Nazionale 210", postalCode: "00184", lat: 41.8986, lng: 12.4924,
    priceRange: "€€", aicCertified: false, delivery: true, takeaway: true, openNow: true,
    hoursPattern: [SHOP_HOURS, SHOP_HOURS, SHOP_HOURS, SHOP_HOURS, SHOP_HOURS, "9:00–13:00", null],
    services: ["Reparto dedicato", "Consulenza nutrizionale", "Consegna a domicilio", "Prenotazione online"],
    glutenFreeMenu: ["Integratori senza glutine", "Prodotti per l'infanzia", "Cosmesi certificata"],
    description: "Reparto ampio e costantemente aggiornato con i prodotti a rimborso e non a rimborso del Prontuario AIC. Il personale è formato per fornire consulenza su interazioni e sicurezza dei prodotti per persone celiache e con sensibilità al glutine.",
    shortDescription: "Reparto dedicato con prodotti del Prontuario AIC e consulenza.",
    gallerySeeds: [22, 23, 24, 25],
    reviewOffset: 3, reviewCount: 3,
  },
  {
    name: "Supermercato Naturasì Bio",
    category: "supermercato",
    region: "Lazio", province: "Roma", provinceCode: "RM", city: "Roma",
    address: "Viale Marconi 145", postalCode: "00146", lat: 41.8570, lng: 12.4680,
    priceRange: "€€", aicCertified: false, delivery: true, takeaway: true, openNow: true,
    hoursPattern: [ALL_DAY, ALL_DAY, ALL_DAY, ALL_DAY, ALL_DAY, ALL_DAY, "9:00–13:00"],
    services: ["Corner gluten free", "Consegna a domicilio", "Prodotti bio", "Parcheggio"],
    glutenFreeMenu: ["Pane e sostituti", "Pasta di mais e riso", "Dolci e snack certificati"],
    description: "Ampio corner dedicato ai prodotti senza glutine, con marchi certificati AIC e alternative bio. Il punto vendita organizza periodicamente giornate informative con nutrizionisti dedicate alla celiachia.",
    shortDescription: "Corner esteso di prodotti senza glutine e alternative bio.",
    gallerySeeds: [26, 27, 28, 29],
    reviewOffset: 4, reviewCount: 2,
  },
  {
    name: "Trattoria dei Sapori Antichi",
    category: "ristorante",
    region: "Campania", province: "Napoli", provinceCode: "NA", city: "Napoli",
    address: "Via Toledo 88", postalCode: "80132", lat: 40.8443, lng: 14.2503,
    priceRange: "€€", aicCertified: true, delivery: false, takeaway: true, openNow: true,
    hoursPattern: [LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER],
    services: ["Cucina separata", "Menu bambini", "Terrazza esterna", "Adatto celiaci e vegani"],
    glutenFreeMenu: ["Scialatielli gluten free", "Parmigiana di melanzane", "Babà senza glutine"],
    description: "Cucina partenopea tradizionale rivisitata in chiave gluten free, con laboratorio di pasta fresca dedicato. Lo staff conosce a fondo la celiachia e propone anche dolci tipici napoletani rivisitati senza glutine.",
    shortDescription: "Cucina napoletana tradizionale con laboratorio pasta dedicato.",
    gallerySeeds: [30, 31, 32, 33],
    reviewOffset: 0, reviewCount: 3, featured: true,
  },
  {
    name: "Pizzeria Vesuvio Gluten Free",
    category: "pizzeria",
    region: "Campania", province: "Napoli", provinceCode: "NA", city: "Pozzuoli",
    address: "Via Napoli 200", postalCode: "80078", lat: 40.8203, lng: 14.1219,
    priceRange: "€", aicCertified: true, delivery: true, takeaway: true, openNow: false,
    hoursPattern: [null, LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER],
    services: ["Forno separato", "Delivery", "Prezzi accessibili"],
    glutenFreeMenu: ["Pizza napoletana gluten free", "Montanare senza glutine", "Fritti dedicati"],
    description: "Pizza napoletana verace in versione gluten free, con forno e impasti completamente separati dal resto della cucina. Ottimo rapporto qualità prezzo per famiglie e gruppi.",
    shortDescription: "Pizza napoletana verace con forno separato certificato.",
    gallerySeeds: [34, 35, 36, 37],
    reviewOffset: 1, reviewCount: 2,
  },
  {
    name: "Hotel Costiera Blu",
    category: "hotel",
    region: "Campania", province: "Salerno", provinceCode: "SA", city: "Amalfi",
    address: "Via Marina Grande 3", postalCode: "84011", lat: 40.6340, lng: 14.6027,
    priceRange: "€€€", aicCertified: true, delivery: false, takeaway: false, openNow: true,
    hoursPattern: [ALL_DAY, ALL_DAY, ALL_DAY, ALL_DAY, ALL_DAY, ALL_DAY, ALL_DAY],
    services: ["Ristorante dedicato", "Vista mare", "Colazione gluten free", "Spa"],
    glutenFreeMenu: ["Colazione completa gluten free", "Menu degustazione costiera"],
    description: "Struttura affacciata sulla Costiera Amalfitana con ristorante interno certificato e colazione interamente gluten free. Lo staff assiste gli ospiti celiaci nella scelta di escursioni e ristoranti sicuri in zona.",
    shortDescription: "Hotel vista mare in Costiera con ristorante certificato.",
    gallerySeeds: [38, 39, 40, 41],
    reviewOffset: 2, reviewCount: 3, featured: true,
  },
  {
    name: "Negozio Senza G",
    category: "negozio",
    region: "Toscana", province: "Firenze", provinceCode: "FI", city: "Firenze",
    address: "Borgo San Frediano 22", postalCode: "50124", lat: 43.7690, lng: 11.2440,
    priceRange: "€€", aicCertified: true, delivery: true, takeaway: true, openNow: true,
    hoursPattern: [SHOP_HOURS, SHOP_HOURS, SHOP_HOURS, SHOP_HOURS, SHOP_HOURS, SHOP_HOURS, null],
    services: ["100% senza glutine", "Prodotti freschi", "Consulenza personalizzata", "Spedizioni"],
    glutenFreeMenu: ["Pane fresco quotidiano", "Pasticceria artigianale", "Pasta fresca", "Gastronomia pronta"],
    description: "Bottega interamente dedicata al senza glutine nel cuore dell'Oltrarno fiorentino, con pane e pasticceria freschi ogni giorno prodotti in laboratorio interno privo di contaminazioni.",
    shortDescription: "Bottega 100% gluten free con pane e pasticceria fresca quotidiana.",
    gallerySeeds: [42, 43, 44, 45],
    reviewOffset: 3, reviewCount: 3,
  },
  {
    name: "Bar Pasticceria Il Chicco Verde",
    category: "bar-pasticceria",
    region: "Toscana", province: "Pisa", provinceCode: "PI", city: "Pisa",
    address: "Corso Italia 60", postalCode: "56125", lat: 43.7085, lng: 10.4013,
    priceRange: "€", aicCertified: true, delivery: false, takeaway: true, openNow: true,
    hoursPattern: ["7:00–19:30", "7:00–19:30", "7:00–19:30", "7:00–19:30", "7:00–19:30", "7:00–19:30", "8:00–13:00"],
    services: ["Colazioni gluten free", "Cornetti freschi ogni mattina", "Zona dedicata"],
    glutenFreeMenu: ["Cornetti gluten free", "Torte artigianali", "Panini gastronomici"],
    description: "Bar storico del centro di Pisa con angolo colazione gluten free rifornito ogni mattina da un laboratorio dedicato, per iniziare la giornata senza pensieri.",
    shortDescription: "Colazioni gluten free con cornetti freschi ogni mattina.",
    gallerySeeds: [46, 47, 48, 49],
    reviewOffset: 4, reviewCount: 2,
  },
  {
    name: "Gelateria Freddo Puro",
    category: "gelateria",
    region: "Veneto", province: "Venezia", provinceCode: "VE", city: "Venezia",
    address: "Fondamenta delle Zattere 15", postalCode: "30123", lat: 45.4291, lng: 12.3222,
    priceRange: "€", aicCertified: true, delivery: false, takeaway: true, openNow: true,
    hoursPattern: [ALL_DAY, ALL_DAY, ALL_DAY, ALL_DAY, ALL_DAY, ALL_DAY, ALL_DAY],
    services: ["Gelato artigianale", "Vaschette dedicate", "Gusti senza glutine e senza lattosio"],
    glutenFreeMenu: ["Gelato alle creme senza glutine", "Coni gluten free", "Semifreddi"],
    description: "Gelateria artigianale con produzione propria e vaschette totalmente dedicate al senza glutine, per evitare ogni rischio di contaminazione anche nei gusti alla crema.",
    shortDescription: "Gelato artigianale con vaschette e coni dedicati.",
    gallerySeeds: [50, 51, 52, 53],
    reviewOffset: 0, reviewCount: 2, featured: true,
  },
  {
    name: "Ristorante La Terrazza sul Duomo",
    category: "ristorante",
    region: "Sicilia", province: "Catania", provinceCode: "CT", city: "Taormina",
    address: "Via Costantino Patricio 5", postalCode: "98039", lat: 37.8527, lng: 15.2853,
    priceRange: "€€€", aicCertified: true, delivery: false, takeaway: false, openNow: true,
    hoursPattern: [LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER],
    services: ["Terrazza panoramica", "Menu degustazione gluten free", "Prenotazione consigliata"],
    glutenFreeMenu: ["Pasta alla Norma gluten free", "Pesce fresco del giorno", "Cannolo gluten free"],
    description: "Ristorante panoramico nel cuore di Taormina con menu siciliano interamente disponibile in versione gluten free, incluso il celebre cannolo preparato in laboratorio dedicato.",
    shortDescription: "Cucina siciliana panoramica con dolci gluten free fatti in casa.",
    gallerySeeds: [54, 55, 56, 57],
    reviewOffset: 1, reviewCount: 3, featured: true,
  },
  {
    name: "Farmacia Centrale Palermo",
    category: "farmacia",
    region: "Sicilia", province: "Palermo", provinceCode: "PA", city: "Palermo",
    address: "Via Ruggero Settimo 40", postalCode: "90139", lat: 38.1226, lng: 13.3579,
    priceRange: "€€", aicCertified: false, delivery: true, takeaway: true, openNow: false,
    hoursPattern: [SHOP_HOURS, SHOP_HOURS, SHOP_HOURS, SHOP_HOURS, SHOP_HOURS, "9:00–13:00", null],
    services: ["Reparto dedicato", "Consulenza farmacista", "Prenotazione ricette"],
    glutenFreeMenu: ["Prodotti a rimborso AIC", "Integratori", "Linea bimbi"],
    description: "Farmacia storica del centro di Palermo con reparto aggiornato ai prodotti del Prontuario AIC e personale disponibile a chiarire dubbi su etichette e prescrizioni.",
    shortDescription: "Reparto dedicato con prodotti del Prontuario AIC.",
    gallerySeeds: [58, 59, 60, 61],
    reviewOffset: 2, reviewCount: 2,
  },
  {
    name: "Ristorante Al Ponte Antico",
    category: "ristorante",
    region: "Veneto", province: "Verona", provinceCode: "VR", city: "Verona",
    address: "Via Ponte Pietra 4", postalCode: "37129", lat: 45.4468, lng: 10.9986,
    priceRange: "€€", aicCertified: true, delivery: false, takeaway: true, openNow: true,
    hoursPattern: [LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER, null],
    services: ["Cucina veneta gluten free", "Cantina selezionata", "Vista fiume"],
    glutenFreeMenu: ["Risotto all'Amarone gluten free", "Bigoli senza glutine", "Tiramisù"],
    description: "Ristorante affacciato sull'Adige con proposta di cucina veneta tradizionale interamente rivisitata senza glutine, cantina con etichette locali selezionate.",
    shortDescription: "Cucina veneta gluten free con vista sull'Adige.",
    gallerySeeds: [62, 63, 64, 65],
    reviewOffset: 3, reviewCount: 3,
  },
  {
    name: "Supermercato Bio Verde Bologna",
    category: "supermercato",
    region: "Emilia-Romagna", province: "Bologna", provinceCode: "BO", city: "Bologna",
    address: "Via Indipendenza 60", postalCode: "40121", lat: 44.5015, lng: 11.3430,
    priceRange: "€€", aicCertified: false, delivery: true, takeaway: true, openNow: true,
    hoursPattern: [ALL_DAY, ALL_DAY, ALL_DAY, ALL_DAY, ALL_DAY, ALL_DAY, "9:00–13:00"],
    services: ["Corner celiachia", "Consegna a domicilio", "Prodotti locali"],
    glutenFreeMenu: ["Tagliatelle di mais", "Tigelle gluten free", "Snack certificati"],
    description: "Supermercato biologico nel centro di Bologna con un reparto dedicato in costante crescita, molto apprezzato dalla comunità celiaca cittadina per l'assortimento e la freschezza.",
    shortDescription: "Corner celiachia ampio nel cuore di Bologna.",
    gallerySeeds: [66, 67, 68, 69],
    reviewOffset: 4, reviewCount: 2,
  },
  {
    name: "Pizzeria Regina Torino",
    category: "pizzeria",
    region: "Piemonte", province: "Torino", provinceCode: "TO", city: "Torino",
    address: "Via Po 22", postalCode: "10124", lat: 45.0684, lng: 7.6923,
    priceRange: "€€", aicCertified: true, delivery: true, takeaway: true, openNow: true,
    hoursPattern: [null, LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER],
    services: ["Forno dedicato", "Delivery rapido", "Zona famiglie"],
    glutenFreeMenu: ["Pizza tonda gluten free", "Focacce farcite", "Dolci senza glutine"],
    description: "Pizzeria del centro di Torino con forno completamente dedicato al senza glutine e servizio di consegna rapido in tutta la città, molto attiva sui social con i celiaci locali.",
    shortDescription: "Forno dedicato e delivery rapido nel centro di Torino.",
    gallerySeeds: [70, 71, 72, 73],
    reviewOffset: 0, reviewCount: 2,
  },
  {
    name: "Trattoria de Roma Senza Glutine",
    category: "ristorante",
    region: "Lazio", province: "Roma", provinceCode: "RM", city: "Roma",
    address: "Via della Lungaretta 45", postalCode: "00153", lat: 41.8890, lng: 12.4700,
    priceRange: "€€", aicCertified: true, delivery: false, takeaway: true, openNow: true,
    hoursPattern: [null, LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER],
    services: ["Cucina dedicata", "Prenotazione online", "Menu tradizionale romano", "Adatto ai bambini"],
    glutenFreeMenu: ["Cacio e pepe gluten free", "Amatriciana con pasta senza glutine", "Supplì al telefono gluten free", "Tiramisù senza glutine"],
    description: "Trattoria nel cuore di Trastevere specializzata nella grande cucina romana reinterpretata senza glutine: dalla pasta fresca fatta in casa ai supplì fritti in olio dedicato, con cucina certificata AIC e staff formato sulla contaminazione crociata.",
    shortDescription: "Cucina romana tradizionale 100% gluten free nel cuore di Trastevere.",
    gallerySeeds: [74, 75, 76, 77],
    reviewOffset: 1, reviewCount: 3, featured: true,
  },
  {
    name: "Pizzeria Testaccio Gluten Free",
    category: "pizzeria",
    region: "Lazio", province: "Roma", provinceCode: "RM", city: "Roma",
    address: "Via Marmorata 32", postalCode: "00153", lat: 41.8760, lng: 12.4770,
    priceRange: "€€", aicCertified: true, delivery: true, takeaway: true, openNow: true,
    hoursPattern: [null, LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER],
    services: ["Forno dedicato certificato AIC", "Pizza al taglio e tonda", "Delivery", "Zona famiglie"],
    glutenFreeMenu: ["Pizza romana scrocchiarella gluten free", "Pizza al taglio senza glutine", "Supplì e fritti dedicati", "Trapizzino gluten free"],
    description: "Pizzeria nel quartiere Testaccio con forno separato certificato AIC, specializzata nella pizza romana scrocchiarella senza glutine e nella pizza al taglio, oltre a una selezione di fritti romani preparati in olio dedicato.",
    shortDescription: "Forno dedicato AIC per la pizza romana scrocchiarella senza glutine.",
    gallerySeeds: [78, 79, 80, 81],
    reviewOffset: 2, reviewCount: 2, featured: true,
  },
];

function toFaqs(name: string, city: string, categorySlug: Business["category"]): Business["faqs"] {
  const cat = getCategoryInfo(categorySlug);
  const catLabel = (cat ? categoryLabelPlural(cat, "it") : "locali").toLowerCase();
  const feminine = FEMININE_CATEGORIES.has(categorySlug);
  const altri = feminine ? "altre" : "altri";
  const tutti = feminine ? "tutte le" : "tutti i";
  return [
    { question: `${name} a ${city} ha una cucina davvero priva di contaminazioni?`, answer: "Sì, l'attività utilizza attrezzature, superfici e, dove indicato, ambienti separati per la preparazione dei piatti senza glutine, riducendo al minimo il rischio di contaminazione crociata." },
    { question: `È necessario prenotare in anticipo da ${name}?`, answer: "Consigliamo di prenotare, soprattutto nei weekend, segnalando l'esigenza di menu senza glutine al momento della prenotazione." },
    { question: `Ci sono ${altri} ${catLabel} senza glutine a ${city} oltre a ${name}?`, answer: `Sì, nella directory di Mappa Senza Glutine trovi ${tutti} ${catLabel} senza glutine ${feminine ? "verificate" : "verificati"} a ${city}, con certificazione AIC o dalla community.` },
    { question: "Sono disponibili opzioni anche per altre intolleranze?", answer: "Molte proposte sono adattabili anche a intolleranze al lattosio o scelte vegetariane: verifica direttamente con l'attività per esigenze specifiche." },
  ];
}

export const BUSINESSES: Business[] = seeds.map((s, idx) => {
  const reviews = pickReviews(s.reviewCount, s.reviewOffset + idx);
  return {
    id: `biz-${idx + 1}`,
    slug: slugify(`${s.name}-${s.city}`),
    name: s.name,
    category: s.category,
    region: s.region,
    province: s.province,
    provinceCode: s.provinceCode,
    city: s.city,
    address: s.address,
    postalCode: s.postalCode,
    lat: s.lat,
    lng: s.lng,
    phone: `0${(idx % 9) + 1} ${1000000 + idx * 137}`,
    website: `https://www.${slugify(s.name)}.it`,
    instagram: `https://instagram.com/${slugify(s.name)}`,
    facebook: `https://facebook.com/${slugify(s.name)}`,
    description: s.description,
    shortDescription: s.shortDescription,
    priceRange: s.priceRange,
    rating: avgRating(reviews),
    reviewCount: reviews.length * 7 + idx,
    aicCertified: s.aicCertified,
    delivery: s.delivery,
    takeaway: s.takeaway,
    openNow: s.openNow,
    hours: hours(s.hoursPattern),
    services: s.services,
    glutenFreeMenu: s.glutenFreeMenu,
    gallerySeeds: s.gallerySeeds,
    reviews,
    faqs: toFaqs(s.name, s.city, s.category),
    featured: s.featured,
    createdAt: "2025-09-01",
  };
});

export function getBusinessBySlug(slug: string) {
  return BUSINESSES.find((b) => b.slug === slug);
}

export function getFeaturedBusinesses(limit = 6) {
  return BUSINESSES.filter((b) => b.featured).slice(0, limit);
}

export function getTopRatedBusinesses(limit = 6) {
  return [...BUSINESSES].sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount).slice(0, limit);
}

export function getSimilarBusinesses(business: Business, limit = 3) {
  return BUSINESSES.filter(
    (b) => b.id !== business.id && (b.category === business.category || b.city === business.city),
  ).slice(0, limit);
}
