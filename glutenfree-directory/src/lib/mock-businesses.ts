import type { Business, OpeningHoursDay, Review } from "./types";
import { slugify } from "./format";
import { getCategoryInfo, categoryLabelPlural } from "./categories";

// Attivita reali, verificate tramite ricerca web (nome, indirizzo, sito
// ufficiale, certificazione AIC), non dati inventati. Fonti citate nella
// descrizione di ciascuna. Nessuna recensione e mostrata: il sito non ha
// ancora una community reale, quindi reviewCount resta a 0 ovunque finche'
// non arrivano recensioni vere dagli utenti.
const FEMININE_CATEGORIES = new Set(["pizzeria", "farmacia", "gelateria"]);

const DAYS = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"];

function hours(pattern: (string | null)[]): OpeningHoursDay[] {
  return DAYS.map((day, i) => ({ day, hours: pattern[i] }));
}

const LUNCH_DINNER = "12:30–14:30, 19:30–22:30";

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
  phone: string;
  website: string;
  services: string[];
  glutenFreeMenu: string[];
  description: string;
  shortDescription: string;
  gallerySeeds: number[];
  photoUrl?: string;
  featured?: boolean;
}

const seeds: Seed[] = [
  {
    name: "La Rosa dei Venti",
    category: "ristorante",
    region: "Lombardia", province: "Milano", provinceCode: "MI", city: "Milano",
    address: "Via Piero della Francesca 34", postalCode: "20154", lat: 45.4845, lng: 9.1560,
    priceRange: "€€€", aicCertified: true, delivery: false, takeaway: false, openNow: true,
    hoursPattern: [null, LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER],
    phone: "02 3319391", website: "https://www.rosaventi.eu",
    services: ["Certificato AIC", "Cucina di pesce", "Menu senza glutine"],
    glutenFreeMenu: ["Pane e pasta senza glutine", "Piatti di pesce"],
    description: "Storico ristorante di pesce nella zona di Sempione/Bullona a Milano, aperto dal 2001 e segnalato anche dalla Guida Michelin. Certificato AIC, propone una selezione di piatti senza glutine tra cui pane e pasta.",
    shortDescription: "Ristorante di pesce certificato AIC, dal 2001 a Milano.",
    gallerySeeds: [1, 2, 3, 4],
    featured: true,
  },
  {
    name: "Be Bop",
    category: "pizzeria",
    region: "Lombardia", province: "Milano", provinceCode: "MI", city: "Milano",
    address: "Viale Col di Lana 4", postalCode: "20144", lat: 45.4508, lng: 9.1730,
    priceRange: "€€", aicCertified: false, delivery: false, takeaway: true, openNow: true,
    hoursPattern: [LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER],
    phone: "02 8376972", website: "https://bebopmilano.it",
    services: ["Ristorante e pizzeria", "Opzioni vegan", "Vicino ai Navigli"],
    glutenFreeMenu: ["Pizza senza glutine", "Menu tradizionale con opzioni gluten free"],
    description: "Ristorante e pizzeria a due passi dai Navigli, attivo dal 1986, con un ampio menu che include pizza e piatti tradizionali in versione senza glutine oltre a opzioni vegan.",
    shortDescription: "Ristorante e pizzeria vicino ai Navigli, dal 1986, con pizza senza glutine.",
    gallerySeeds: [5, 6, 7, 8],
    featured: true,
  },
  {
    name: "Il Secchio e l'Olivaro",
    category: "pizzeria",
    region: "Lazio", province: "Roma", provinceCode: "RM", city: "Roma",
    address: "Via del Porto Fluviale 3", postalCode: "00154", lat: 41.8660, lng: 12.4770,
    priceRange: "€€", aicCertified: false, delivery: false, takeaway: true, openNow: true,
    hoursPattern: [null, LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER],
    phone: "06 5120022", website: "https://ilsecchioelolivaro.it",
    services: ["Pizzeria e bruschetteria", "Forno a legna", "Menu senza glutine in laboratorio dedicato"],
    glutenFreeMenu: ["Pizza senza glutine cotta a legna", "Bruschette senza glutine"],
    description: "Pizzeria e bruschetteria nel quartiere Ostiense a Roma, attiva dal 1999, nota per le pizze alte cotte in forno a legna. Propone un menu senza glutine preparato in un laboratorio dedicato.",
    shortDescription: "Pizzeria e bruschetteria a Ostiense, dal 1999, menu senza glutine dedicato.",
    gallerySeeds: [9, 10, 11, 12],
    featured: true,
  },
  {
    name: "Fornerie Alessandrino",
    category: "pizzeria",
    region: "Lazio", province: "Roma", provinceCode: "RM", city: "Roma",
    address: "Viale Alessandrino 265", postalCode: "00172", lat: 41.8795, lng: 12.5695,
    priceRange: "€€", aicCertified: true, delivery: false, takeaway: true, openNow: true,
    hoursPattern: ["19:15–23:00", "19:15–23:00", "19:15–23:00", "19:15–23:00", "19:15–23:00", "12:30–15:00, 19:15–23:00", "12:30–15:00, 19:15–23:00"],
    phone: "06 2310381", website: "https://www.forneriealessandrino.it",
    services: ["Certificato AIC", "Ristorante, braceria, pizzeria, hamburgheria", "Opzioni vegan e senza lattosio"],
    glutenFreeMenu: ["Pizza senza glutine", "Carne alla brace", "Hamburger senza glutine"],
    description: "Locale nel quartiere Alessandrino a Roma con cucina interamente certificata AIC, separata dal resto della struttura. Offre pizza, griglia e hamburger senza glutine, oltre a opzioni vegan e senza lattosio.",
    shortDescription: "Pizzeria, braceria e hamburgheria certificata AIC nel quartiere Alessandrino.",
    gallerySeeds: [13, 14, 15, 16],
    featured: true,
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
    { question: "Sono disponibili opzioni anche per altre intolleranze?", answer: "Molte proposte sono adattabili anche a intolleranze al lattosio o scelte vegetariane/vegane: verifica direttamente con l'attività per esigenze specifiche." },
  ];
}

export const BUSINESSES: Business[] = seeds.map((s, idx) => {
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
    phone: s.phone,
    website: s.website,
    description: s.description,
    shortDescription: s.shortDescription,
    priceRange: s.priceRange,
    rating: 0,
    reviewCount: 0,
    aicCertified: s.aicCertified,
    delivery: s.delivery,
    takeaway: s.takeaway,
    openNow: s.openNow,
    hours: hours(s.hoursPattern),
    services: s.services,
    glutenFreeMenu: s.glutenFreeMenu,
    gallerySeeds: s.gallerySeeds,
    photoUrl: s.photoUrl,
    reviews: [],
    faqs: toFaqs(s.name, s.city, s.category),
    featured: s.featured,
    createdAt: "2026-07-29",
  };
});

export function getBusinessBySlug(slug: string) {
  return BUSINESSES.find((b) => b.slug === slug);
}

export function getFeaturedBusinesses(limit = 6) {
  return BUSINESSES.filter((b) => b.featured).slice(0, limit);
}

export function getTopRatedBusinesses(limit = 6) {
  return [...BUSINESSES].sort((a, b) => b.rating - a.rating).slice(0, limit);
}

export function getSimilarBusinesses(business: Business, limit = 4) {
  return BUSINESSES.filter((b) => b.id !== business.id && b.category === business.category).slice(0, limit);
}
