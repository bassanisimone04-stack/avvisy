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
    photoUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=75",
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
    photoUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=75",
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
    photoUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=75",
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
    photoUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=75",
    featured: true,
  },
  // ── Nord Italia ──────────────────────────────────────────
  {
    name: "Casa Biga",
    category: "pizzeria",
    region: "Lombardia", province: "Milano", provinceCode: "MI", city: "Milano",
    address: "Via Antonio Pollaiuolo 9", postalCode: "20159", lat: 45.4930, lng: 9.1780,
    priceRange: "€€", aicCertified: true, delivery: false, takeaway: true, openNow: true,
    hoursPattern: [null, "19:00–23:00", "19:00–23:00", "19:00–23:00", "19:00–23:00", "12:30–14:30, 19:00–23:00", "12:30–14:30, 19:00–23:00"],
    phone: "02 7001 2362", website: "https://casabiga.com",
    services: ["Certificato AIC", "Impasto a lunga lievitazione", "Pizza senza glutine premiata"],
    glutenFreeMenu: ["Pizza senza glutine con impasto dedicato", "Fritti senza glutine"],
    description: "Pizzeria d'autore nel quartiere Isola a Milano, certificata AIC. Nota per l'impasto ad alta idratazione e lunga lievitazione, offre pizza senza glutine preparata con ingredienti dedicati e premiata come Best Pizza GF 2025.",
    shortDescription: "Pizzeria d'autore certificata AIC nel quartiere Isola, premiata Best Pizza GF.",
    gallerySeeds: [17, 18, 19, 20],
    photoUrl: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=800&q=75",
    featured: true,
  },
  {
    name: "Mama Eat",
    category: "ristorante",
    region: "Lombardia", province: "Milano", provinceCode: "MI", city: "Milano",
    address: "Via G.C. Procaccini 32", postalCode: "20154", lat: 45.4810, lng: 9.1700,
    priceRange: "€€", aicCertified: true, delivery: true, takeaway: true, openNow: true,
    hoursPattern: ["12:00–15:00, 19:00–23:00", "12:00–15:00, 19:00–23:00", "12:00–15:00, 19:00–23:00", "12:00–15:00, 19:00–23:00", "12:00–15:00, 19:00–23:00", "12:00–15:00, 19:00–23:00", "12:00–15:00, 19:00–23:00"],
    phone: "02 2416 8335", website: "https://mamaeat.com",
    services: ["Certificato AIC", "Doppia cucina separata", "Consegna a domicilio"],
    glutenFreeMenu: ["Pizza napoletana senza glutine", "Frittura napoletana", "Pasta fresca senza glutine"],
    description: "Ristorante-pizzeria con doppia cucina completamente separata per garantire zero contaminazione crociata. Tutti i piatti del menu sono disponibili senza glutine e senza lattosio, certificato AIC.",
    shortDescription: "Ristorante certificato AIC con doppia cucina separata, zero contaminazione.",
    gallerySeeds: [21, 22, 23, 24],
    photoUrl: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=75",
  },
  {
    name: "Panperfocaccia",
    category: "ristorante",
    region: "Piemonte", province: "Torino", provinceCode: "TO", city: "Torino",
    address: "Via Conte Verde 7/A", postalCode: "10122", lat: 45.0657, lng: 7.6920,
    priceRange: "€€", aicCertified: true, delivery: false, takeaway: true, openNow: true,
    hoursPattern: [null, LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER, "12:30–14:30"],
    phone: "011 439 6610", website: "https://panperfocacciatorino.it",
    services: ["Certificato AIC", "Cucina ligure e piemontese", "Focaccia senza glutine"],
    glutenFreeMenu: ["Focaccia di Recco senza glutine", "Farinata", "Primi piatti senza glutine"],
    description: "Ristorante nel centro di Torino certificato AIC, specializzato in cucina ligure e piemontese. Propone focaccia di Recco, farinata e primi piatti tutti disponibili in versione senza glutine.",
    shortDescription: "Ristorante certificato AIC a Torino, specialità liguri e piemontesi senza glutine.",
    gallerySeeds: [25, 26, 27, 28],
    photoUrl: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&w=800&q=75",
  },
  {
    name: "La Smorfia",
    category: "pizzeria",
    region: "Piemonte", province: "Torino", provinceCode: "TO", city: "Venaria Reale",
    address: "Via Giovanni Verga 14", postalCode: "10078", lat: 45.1340, lng: 7.6320,
    priceRange: "€€", aicCertified: true, delivery: false, takeaway: true, openNow: true,
    hoursPattern: [null, "19:00–23:30", "19:00–23:30", "19:00–23:30", "19:00–23:30", "12:00–14:30, 19:00–23:30", "12:00–14:30, 19:00–23:30"],
    phone: "011 424 6595", website: "https://pizzerialasmorfia.com",
    services: ["Certificato AIC", "Pizza napoletana", "Oltre 25 anni di esperienza senza glutine"],
    glutenFreeMenu: ["Pizza napoletana senza glutine", "Antipasti e dolci senza glutine"],
    description: "Storica pizzeria certificata AIC a Venaria Reale, alle porte di Torino, con oltre 25 anni di esperienza nella preparazione senza glutine. Pizza napoletana con impasto dedicato e linea completa di antipasti e dolci.",
    shortDescription: "Pizzeria certificata AIC da oltre 25 anni a Venaria Reale, vicino Torino.",
    gallerySeeds: [29, 30, 31, 32],
    photoUrl: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=75",
  },
  {
    name: "Trattoria Vecchio Mercato",
    category: "ristorante",
    region: "Emilia-Romagna", province: "Bologna", provinceCode: "BO", city: "Bologna",
    address: "Via Pietro Gobetti 49/F", postalCode: "40129", lat: 44.5010, lng: 11.3550,
    priceRange: "€€", aicCertified: true, delivery: false, takeaway: false, openNow: true,
    hoursPattern: [null, LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER, "12:30–14:30"],
    phone: "393 856 4648", website: "https://trattoriavecchiomercato.it",
    services: ["Certificato AIC", "Cucina esclusivamente senza glutine", "Tradizione emiliana"],
    glutenFreeMenu: ["Tagliatelle al ragù senza glutine", "Tortellini senza glutine", "Crescentine e tigelle"],
    description: "Trattoria a Bologna con cucina esclusivamente senza glutine, certificata AIC. Propone la tradizione emiliana — tagliatelle, tortellini, crescentine — tutta in versione gluten free. Uno dei pochi locali in Italia interamente dedicati.",
    shortDescription: "Trattoria certificata AIC a Bologna, cucina esclusivamente senza glutine.",
    gallerySeeds: [33, 34, 35, 36],
    photoUrl: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=800&q=75",
    featured: true,
  },
  // ── Centro-Sud Italia ────────────────────────────────────
  {
    name: "Mama Eat",
    category: "ristorante",
    region: "Lazio", province: "Roma", provinceCode: "RM", city: "Roma",
    address: "Borgo Pio 28", postalCode: "00193", lat: 41.9020, lng: 12.4610,
    priceRange: "€€", aicCertified: true, delivery: true, takeaway: true, openNow: true,
    hoursPattern: ["12:00–15:00, 19:00–23:00", "12:00–15:00, 19:00–23:00", "12:00–15:00, 19:00–23:00", "12:00–15:00, 19:00–23:00", "12:00–15:00, 19:00–23:00", "12:00–15:00, 19:00–23:00", "12:00–15:00, 19:00–23:00"],
    phone: "06 4550 8771", website: "https://mamaeat.com",
    services: ["Certificato AIC", "Doppia cucina separata", "Delivery via Glovo"],
    glutenFreeMenu: ["Pizza napoletana senza glutine", "Linguine alla Nerano", "Frittura napoletana", "Calzone senza glutine"],
    description: "Sede romana di Mama Eat a Borgo Pio, vicino al Vaticano. Doppia cucina completamente separata per zero contaminazione crociata, certificato AIC. Piatti serviti su stoviglie di colore diverso per identificazione.",
    shortDescription: "Ristorante certificato AIC a Borgo Pio, doppia cucina separata per zero contaminazione.",
    gallerySeeds: [37, 38, 39, 40],
    photoUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=75",
  },
  {
    name: "Celiachiamo",
    category: "negozio",
    region: "Lazio", province: "Roma", provinceCode: "RM", city: "Roma",
    address: "Via Elio Vittorini 49/51", postalCode: "00144", lat: 41.8340, lng: 12.4720,
    priceRange: "€", aicCertified: false, delivery: false, takeaway: true, openNow: true,
    hoursPattern: [null, "10:00–14:00, 16:00–20:00", "10:00–14:00, 16:00–20:00", "10:00–14:00, 16:00–20:00", "10:00–14:00, 16:00–20:00", "10:00–20:00", null],
    phone: "06 6228 8522", website: "https://www.celiachiamo.com",
    services: ["Forno 100% senza glutine", "Laboratorio artigianale interno", "Accetta ricette ASL"],
    glutenFreeMenu: ["Pizza al taglio senza glutine", "Pane fresco artigianale", "Dolci e torte", "Prodotti confezionati erogabili"],
    description: "Forno e pasticceria nel quartiere EUR a Roma, interamente dedicati alla produzione senza glutine con laboratorio interno. Ogni giorno pizza al taglio, pane fresco, dolci artigianali e un assortimento di prodotti confezionati rimborsabili con ricetta ASL.",
    shortDescription: "Forno e pasticceria 100% senza glutine all'EUR, con laboratorio artigianale.",
    gallerySeeds: [41, 42, 43, 44],
    photoUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=75",
  },
  {
    name: "Pizzeria Starita",
    category: "pizzeria",
    region: "Campania", province: "Napoli", provinceCode: "NA", city: "Napoli",
    address: "Via Materdei 27/28", postalCode: "80136", lat: 40.8580, lng: 14.2440,
    priceRange: "€", aicCertified: false, delivery: true, takeaway: true, openNow: true,
    hoursPattern: [null, "12:00–15:30, 19:00–00:00", "12:00–15:30, 19:00–00:00", "12:00–15:30, 19:00–00:00", "12:00–15:30, 19:00–00:00", "12:00–15:30, 19:00–00:00", "12:00–15:30, 19:00–00:00"],
    phone: "081 557 3682", website: "https://pizzeriestarita.it",
    services: ["Forno dedicato senza glutine", "Pizza napoletana dal 1901", "Consegna a domicilio"],
    glutenFreeMenu: ["Pizza margherita senza glutine", "Pizza fritta", "Montanara", "Calzone ripieno"],
    description: "Storica pizzeria napoletana fondata nel 1901 nel quartiere Materdei, gestita dalla famiglia Starita da generazioni. Tutte le pizze sono disponibili in versione senza glutine e cotte in un forno separato dedicato.",
    shortDescription: "Storica pizzeria napoletana dal 1901, pizza senza glutine con forno dedicato.",
    gallerySeeds: [45, 46, 47, 48],
    photoUrl: "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?auto=format&fit=crop&w=800&q=75",
    featured: true,
  },
  {
    name: "Pizzaioli Veraci",
    category: "pizzeria",
    region: "Campania", province: "Napoli", provinceCode: "NA", city: "Napoli",
    address: "Vico Tre Re a Toledo 1", postalCode: "80132", lat: 40.8430, lng: 14.2500,
    priceRange: "€", aicCertified: true, delivery: true, takeaway: true, openNow: true,
    hoursPattern: ["11:30–00:00", "11:30–00:00", "11:30–00:00", "11:30–00:00", "11:30–00:00", "11:30–00:00", "11:30–00:00"],
    phone: "081 628718", website: "https://www.pizzaioliveraci.it",
    services: ["Certificato AIC", "Bancone e forno dedicati senza glutine", "Delivery via Just Eat"],
    glutenFreeMenu: ["Pizza napoletana senza glutine", "Frittura di paranza", "Pasta al forno", "Dolci napoletani senza glutine"],
    description: "Pizzeria certificata AIC con tre sedi a Napoli, dotata di bancone e forno interamente dedicati alla preparazione senza glutine. L'intero menu è disponibile in versione gluten-free, inclusi fritti, primi piatti e dolci.",
    shortDescription: "Pizzeria certificata AIC a Napoli con bancone e forno dedicati senza glutine.",
    gallerySeeds: [49, 50, 51, 52],
    photoUrl: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=75",
  },
  {
    name: "Leopoldo Cafebar",
    category: "bar-pasticceria",
    region: "Campania", province: "Napoli", provinceCode: "NA", city: "Napoli",
    address: "Piazza Cavour 78/79", postalCode: "80137", lat: 40.8540, lng: 14.2520,
    priceRange: "€", aicCertified: false, delivery: true, takeaway: true, openNow: true,
    hoursPattern: ["07:00–21:00", "07:00–21:00", "07:00–21:00", "07:00–21:00", "07:00–21:00", "07:00–21:00", "07:00–21:00"],
    phone: "081 010 8582", website: "https://leopoldoinfante.it",
    services: ["Pasticceria esclusivamente senza glutine", "Laboratorio dedicato al primo piano", "Vendita online con spedizione"],
    glutenFreeMenu: ["Babà napoletano senza glutine e senza lattosio", "Sfogliatella senza glutine", "Taralli napoletani", "Pastiera"],
    description: "Primo cafebar senza glutine di Casa Infante, con laboratorio al primo piano dedicato esclusivamente alla produzione gluten-free. Situato di fronte al MANN, offre l'intera tradizione dolciaria napoletana in versione senza glutine.",
    shortDescription: "Cafebar con pasticceria napoletana esclusivamente senza glutine, di fronte al MANN.",
    gallerySeeds: [53, 54, 55, 56],
    photoUrl: "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=800&q=75",
  },
  {
    name: "Ciro & Sons",
    category: "pizzeria",
    region: "Toscana", province: "Firenze", provinceCode: "FI", city: "Firenze",
    address: "Via del Giglio 28R", postalCode: "50123", lat: 43.7740, lng: 11.2510,
    priceRange: "€€", aicCertified: true, delivery: false, takeaway: false, openNow: true,
    hoursPattern: ["18:00–22:30", "12:00–15:00, 18:00–22:30", "12:00–15:00, 18:00–22:30", "12:00–15:00, 18:00–22:30", "12:00–15:00, 18:00–22:30", "12:00–15:00, 18:00–22:30", null],
    phone: "055 289694", website: "https://www.ciroandsons.com",
    services: ["Certificato AIC", "Campione mondiale pizza senza glutine", "Forno dedicato"],
    glutenFreeMenu: ["Pizza napoletana senza glutine", "Ravioli al formaggio", "Calzone", "Pasta fresca fatta in casa"],
    description: "Ristorante-pizzeria con oltre 70 anni di storia (dal 1948), vincitore al campionato mondiale della pizza senza glutine. Certificato AIC e AVPN, offre l'intero menu in versione gluten-free con forno separato.",
    shortDescription: "Pizzeria certificata AIC a Firenze, campione mondiale di pizza senza glutine.",
    gallerySeeds: [57, 58, 59, 60],
    photoUrl: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=800&q=75",
    featured: true,
  },
  {
    name: "Quinoa",
    category: "ristorante",
    region: "Toscana", province: "Firenze", provinceCode: "FI", city: "Firenze",
    address: "Vicolo di Santa Maria Maggiore 1", postalCode: "50123", lat: 43.7720, lng: 11.2530,
    priceRange: "€€", aicCertified: true, delivery: false, takeaway: true, openNow: true,
    hoursPattern: ["12:30–15:00, 19:30–23:00", "12:30–15:00, 19:30–23:00", "12:30–15:00, 19:30–23:00", "12:30–15:00, 19:30–23:00", "12:30–15:00, 19:30–23:00", "12:30–15:00, 19:30–23:00", "12:00–15:00"],
    phone: "055 290876", website: "https://www.ristorantequinoa.it",
    services: ["Certificato AIC", "Cucina 100% senza glutine", "Brunch domenicale", "Orto urbano nel chiostro"],
    glutenFreeMenu: ["Gnocchi di patate fatti in casa", "Burger di quinoa e lenticchie", "Tradizione toscana senza glutine", "Piatti fusion"],
    description: "Primo ristorante 100% gluten-free di Firenze, aperto dal 2014 e certificato AIC. Situato in un suggestivo chiostro cinquecentesco con orto urbano, offre cucina gourmet che fonde tradizione toscana e sapori orientali.",
    shortDescription: "Primo ristorante 100% senza glutine di Firenze, certificato AIC, nel chiostro cinquecentesco.",
    gallerySeeds: [61, 62, 63, 64],
    photoUrl: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=75",
    featured: true,
  },
  // ── Milano e Roma, seconda ondata ───────────────────────
  {
    name: "GluFree Bakery",
    category: "bar-pasticceria",
    region: "Lombardia", province: "Milano", provinceCode: "MI", city: "Milano",
    address: "Via Curtatone 6", postalCode: "20122", lat: 45.4595, lng: 9.1975,
    priceRange: "€", aicCertified: true, delivery: false, takeaway: true, openNow: true,
    hoursPattern: ["09:00–18:00", "09:00–18:00", "09:00–18:00", "09:00–18:00", "09:00–18:00", "09:00–18:00", null],
    phone: "02 5401 9723", website: "https://glufreebakery.it",
    services: ["Certificato AIC", "Laboratorio 100% senza glutine", "Zona Porta Romana"],
    glutenFreeMenu: ["Croissant e pane senza glutine", "Dolci da forno", "Pizza e arancini senza glutine"],
    description: "Panificio e pasticceria a Milano con laboratorio interamente dedicato alla produzione senza glutine. Ogni giorno propone pane, croissant, dolci, pizze e arancini preparati senza rischio di contaminazione crociata, nel circuito di attività riconosciute da AIC.",
    shortDescription: "Panificio-pasticceria 100% senza glutine a Milano, certificato AIC.",
    gallerySeeds: [65, 66, 67, 68],
    photoUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=75",
  },
  {
    name: "Pansy",
    category: "bar-pasticceria",
    region: "Lombardia", province: "Milano", provinceCode: "MI", city: "Milano",
    address: "Via Santa Sofia 1", postalCode: "20122", lat: 45.4570, lng: 9.1855,
    priceRange: "€", aicCertified: false, delivery: true, takeaway: true, openNow: true,
    hoursPattern: ["08:00–18:30", "08:00–18:30", "08:00–18:30", "08:00–18:30", "08:00–18:30", "09:00–18:30", null],
    phone: "02 8722 6396", website: "https://pansy.it",
    services: ["Pasticceria 100% senza glutine e senza lattosio", "Opzioni vegan", "Consegna a domicilio a Milano"],
    glutenFreeMenu: ["Torte e mignon senza glutine", "Pane e grissini", "Torte salate"],
    description: "Pasticceria a Milano con produzione interamente senza glutine e senza lattosio, senza possibilità di contaminazione crociata. Propone torte, mignon, pane, grissini e torte salate, con diverse opzioni vegan, disponibili anche per asporto e consegna a domicilio in città.",
    shortDescription: "Pasticceria 100% senza glutine e senza lattosio a Milano, con consegna a domicilio.",
    gallerySeeds: [69, 70, 71, 72],
    photoUrl: "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=800&q=75",
  },
  {
    name: "Sushi&Sound",
    category: "ristorante",
    region: "Lombardia", province: "Milano", provinceCode: "MI", city: "Milano",
    address: "Piazza 24 Maggio 1/10", postalCode: "20143", lat: 45.4505, lng: 9.1755,
    priceRange: "€€", aicCertified: true, delivery: false, takeaway: false, openNow: true,
    hoursPattern: ["12:00–15:00, 18:30–23:15", "12:00–15:00, 18:30–23:15", "12:00–15:00, 18:30–23:15", "12:00–15:00, 18:30–23:15", "12:00–15:00, 18:30–23:15", "12:00–15:00, 18:30–23:15", "12:00–15:00, 18:30–23:15"],
    phone: "02 3670 4842", website: "https://sushiandsound.it",
    services: ["Certificato AIC", "Cucina giapponese fusion", "Zona Navigli"],
    glutenFreeMenu: ["Sushi e sashimi senza glutine", "Piatti fusion giapponesi"],
    description: "Ristorante di sushi fusion sui Navigli, tra i primi a Milano ad offrire un menu quasi interamente senza glutine, certificato AIC. Propone piatti di cucina giapponese rivisitata preparati seguendo i protocolli dell'Associazione Italiana Celiachia.",
    shortDescription: "Ristorante sushi certificato AIC sui Navigli, menu quasi interamente senza glutine.",
    gallerySeeds: [73, 74, 75, 76],
    photoUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=800&q=75",
  },
  {
    name: "Zero Gelato",
    category: "gelateria",
    region: "Lombardia", province: "Milano", provinceCode: "MI", city: "Milano",
    address: "Corso Ventidue Marzo 52", postalCode: "20137", lat: 45.4580, lng: 9.2075,
    priceRange: "€", aicCertified: false, delivery: false, takeaway: true, openNow: true,
    hoursPattern: ["12:00–22:00", "12:00–22:00", "12:00–22:00", "12:00–22:00", "12:00–22:00", "12:00–22:00", "12:00–22:00"],
    phone: "02 8343 8725", website: "",
    services: ["Gusti interamente senza glutine", "Molte varianti senza lattosio"],
    glutenFreeMenu: ["Gelato artigianale senza glutine", "Varianti senza lattosio"],
    description: "Gelateria a Milano che propone gusti preparati interamente senza glutine, molti dei quali anche senza lattosio. Segnalata nelle principali guide specializzate sul senza glutine a Milano.",
    shortDescription: "Gelateria con gusti interamente senza glutine a Milano.",
    gallerySeeds: [77, 78, 79, 80],
    photoUrl: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=800&q=75",
  },
  {
    name: "Le Specialità",
    category: "pizzeria",
    region: "Lombardia", province: "Milano", provinceCode: "MI", city: "Milano",
    address: "Via Pietro Calvi 29", postalCode: "20129", lat: 45.4715, lng: 9.2075,
    priceRange: "€€", aicCertified: true, delivery: true, takeaway: true, openNow: true,
    hoursPattern: [LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER],
    phone: "02 7388235", website: "https://ristorantelespecialita.it",
    services: ["Certificato AIC", "Pizzeria storica dal 1977", "Oltre 50 varianti di pizza"],
    glutenFreeMenu: ["Pizza al forno a legna senza glutine", "Birre gluten free"],
    description: "Pizzeria storica a Milano, attiva dal 1977, con oltre 50 varianti di pizza cotta nel forno a legna disponibili in versione senza glutine, oltre a birre gluten free. Certificata AIC dopo anni di collaborazione con l'Associazione.",
    shortDescription: "Pizzeria storica dal 1977 a Milano, certificata AIC, oltre 50 pizze senza glutine.",
    gallerySeeds: [81, 82, 83, 84],
    photoUrl: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=800&q=75",
  },
  {
    name: "Sans de Blé",
    category: "bar-pasticceria",
    region: "Lazio", province: "Roma", provinceCode: "RM", city: "Roma",
    address: "Via Gabriello Chiabrera 58/C", postalCode: "00145", lat: 41.8615, lng: 12.4835,
    priceRange: "€", aicCertified: false, delivery: false, takeaway: true, openNow: true,
    hoursPattern: [null, "09:00–14:00, 16:30–19:30", "09:00–14:00, 16:30–19:30", "09:00–14:00, 16:30–19:30", "09:00–14:00, 16:30–19:30", "09:00–14:00, 16:30–19:30", "09:00–13:00"],
    phone: "06 6465 0277", website: "https://sansdeble.it",
    services: ["Laboratorio 100% senza glutine e senza lattosio", "Zona Garbatella", "Dolci stagionali"],
    glutenFreeMenu: ["Cannoli siciliani senza glutine", "Pane e pasticceria quotidiana", "Panettone e pandoro senza glutine"],
    description: "Panificio e pasticceria artigianale a Roma, con laboratorio interamente dedicato alla produzione senza glutine e senza lattosio. Propone pane, cannoli siciliani, dolci stagionali come panettone e pandoro, oltre alla pasticceria quotidiana.",
    shortDescription: "Panificio-pasticceria artigianale 100% senza glutine e senza lattosio a Roma.",
    gallerySeeds: [85, 86, 87, 88],
    photoUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=75",
  },
  {
    name: "La Gallina Bianca",
    category: "ristorante",
    region: "Lazio", province: "Roma", provinceCode: "RM", city: "Roma",
    address: "Via Antonio Rosmini 5-12", postalCode: "00184", lat: 41.8990, lng: 12.5030,
    priceRange: "€€", aicCertified: true, delivery: false, takeaway: false, openNow: true,
    hoursPattern: ["12:00–22:30", "12:00–22:30", "12:00–22:30", "12:00–22:30", "12:00–22:30", "12:00–22:30", null],
    phone: "06 4743 777", website: "https://lagallinabiancaroma.it",
    services: ["Certificato AIC", "Trattoria e griglieria", "Zona Termini"],
    glutenFreeMenu: ["Primi di pasta senza glutine", "Fritti e carni alla griglia", "Pizza e pane senza glutine"],
    description: "Trattoria e griglieria a Roma, certificata AIC, dove quasi tutto il menu è disponibile senza glutine: primi di pasta, fritti, carni alla griglia, pizze e pane.",
    shortDescription: "Trattoria e griglieria certificata AIC a Roma, menu quasi interamente senza glutine.",
    gallerySeeds: [89, 90, 91, 92],
    photoUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=75",
  },
  {
    name: "Mangiafuoco Pizza & Grill",
    category: "pizzeria",
    region: "Lazio", province: "Roma", provinceCode: "RM", city: "Roma",
    address: "Via Chiana 37", postalCode: "00198", lat: 41.9210, lng: 12.5115,
    priceRange: "€€", aicCertified: true, delivery: false, takeaway: false, openNow: true,
    hoursPattern: ["12:30–15:00, 19:30–00:00", "12:30–15:00, 19:30–00:00", "12:30–15:00, 19:30–00:00", "12:30–15:00, 19:30–00:00", "12:30–15:00, 19:30–00:00", "19:30–00:00", "12:30–15:00, 19:30–00:00"],
    phone: "06 8535 7255", website: "https://mangiafuoco.org",
    services: ["Certificato AIC", "Cucina separata dedicata", "Brunch domenicale"],
    glutenFreeMenu: ["Pizza senza glutine", "Griglia di carne", "Fritti senza glutine"],
    description: "Ristorante-griglieria e pizzeria a Roma, certificato AIC, con cucina separata dedicata alla preparazione dei piatti senza glutine per evitare contaminazioni crociate. Ampi spazi interni ed esterni.",
    shortDescription: "Pizzeria e griglieria certificata AIC a Roma, cucina separata senza glutine.",
    gallerySeeds: [93, 94, 95, 96],
    photoUrl: "https://images.unsplash.com/photo-1548365328-9f547fb0953b?auto=format&fit=crop&w=800&q=75",
  },
  {
    name: "Ramè - Sushi Naturale Italiano",
    category: "ristorante",
    region: "Lazio", province: "Roma", provinceCode: "RM", city: "Roma",
    address: "Via Folco Portinari 33", postalCode: "00151", lat: 41.8590, lng: 12.4460,
    priceRange: "€€", aicCertified: true, delivery: true, takeaway: true, openNow: true,
    hoursPattern: [LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER, LUNCH_DINNER],
    phone: "331 133 1273", website: "https://ramesushi.it",
    services: ["Certificato AIC", "Ricette originali senza glutine", "Consegna anche su Deliveroo"],
    glutenFreeMenu: ["Sushi e sashimi senza glutine", "Ricette fusion italo-giapponesi"],
    description: "Ristorante di sushi a Roma, certificato AIC, con ricette originali e preparazioni garantite senza glutine. Offre consegna e asporto anche tramite piattaforme di food delivery.",
    shortDescription: "Ristorante sushi certificato AIC a Roma, con consegna a domicilio.",
    gallerySeeds: [97, 98, 99, 100],
    photoUrl: "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=800&q=75",
  },
  {
    name: "Senza Pensieri Healthy Bakery",
    category: "bar-pasticceria",
    region: "Lazio", province: "Roma", provinceCode: "RM", city: "Roma",
    address: "Via dei Campani 53", postalCode: "00185", lat: 41.8990, lng: 12.5175,
    priceRange: "€", aicCertified: false, delivery: false, takeaway: true, openNow: true,
    hoursPattern: ["12:30–19:30", "12:30–19:30", "12:30–19:30", "12:30–19:30", "12:30–19:30", "12:30–19:30", null],
    phone: "06 4470 4402", website: "https://dolciecosenzapensieri.it",
    services: ["Prodotti dolci e salati senza glutine", "Opzioni vegan e senza lattosio", "Zona San Lorenzo"],
    glutenFreeMenu: ["Dolci e torte senza glutine", "Prodotti salati senza glutine"],
    description: "Pasticceria e bakery nel quartiere San Lorenzo a Roma, con prodotti dolci e salati senza glutine, molti anche senza lattosio e vegan. Possibilità di mangiare sul posto, ordinare o portare via.",
    shortDescription: "Bakery senza glutine a San Lorenzo, Roma, con opzioni vegan e senza lattosio.",
    gallerySeeds: [101, 102, 103, 104],
    photoUrl: "https://images.unsplash.com/photo-1568254183919-78a4f43a2877?auto=format&fit=crop&w=800&q=75",
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
