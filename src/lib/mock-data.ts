import type {
  Category,
  Company,
  Lot,
  Notification,
  Offer,
  Order,
  Review,
  SavedSearch,
} from "./types";
import { COMMISSION_RATE, lotTotal } from "./types";

// Identità dimostrative del prototipo.
export const CURRENT_SELLER_ID = "co-metalfer";
export const CURRENT_BUYER_ID = "co-ferraris";

// ---------------------------------------------------------------------------
// Categorie (12)
// ---------------------------------------------------------------------------

export const categories: Category[] = [
  { slug: "componenti-industriali", name: "Componenti industriali", description: "Motori, cuscinetti, valvole, automazione e parti di macchina.", subcategories: ["Cuscinetti", "Motori elettrici", "Valvole", "Viteria", "Automazione"], count: 342 },
  { slug: "ricambi", name: "Ricambi", description: "Ricambi originali e compatibili per impianti e veicoli.", subcategories: ["Riduttori", "Pompe", "Cinghie", "Guarnizioni", "Filtri"], count: 287 },
  { slug: "materiali-edili", name: "Materiali edili", description: "Rimanenze di cantiere, laterizi, isolanti e finiture.", subcategories: ["Isolanti", "Pavimenti", "Laterizi", "Finiture"], count: 198 },
  { slug: "imballaggi", name: "Imballaggi", description: "Bancali, cartoni, film estensibile e contenitori riutilizzabili.", subcategories: ["Bancali", "Film e nastri", "Contenitori", "Cartoni"], count: 164 },
  { slug: "elettronica-professionale", name: "Elettronica professionale", description: "Quadri elettrici, sensori, cablaggi e strumentazione.", subcategories: ["Quadri elettrici", "Sensori", "Cavi", "Strumentazione"], count: 221 },
  { slug: "attrezzature", name: "Attrezzature", description: "Utensili, macchinari e attrezzature da lavoro.", subcategories: ["Utensili elettrici", "Macchine utensili", "Attrezzatura officina"], count: 176 },
  { slug: "arredi-aziendali", name: "Arredi aziendali", description: "Scaffalature, arredo ufficio e allestimenti industriali.", subcategories: ["Scaffalature", "Arredo ufficio", "Allestimenti"], count: 142 },
  { slug: "materie-prime", name: "Materie prime", description: "Metalli, polimeri, semilavorati e materiali di produzione.", subcategories: ["Metalli", "Polimeri", "Semilavorati"], count: 203 },
  { slug: "tessile", name: "Tessile e filati", description: "Filati, tessuti e semilavorati per l'industria tessile.", subcategories: ["Filati", "Tessuti", "Accessori"], count: 74 },
  { slug: "chimica-vernici", name: "Chimica e vernici", description: "Vernici, adesivi e prodotti chimici industriali.", subcategories: ["Vernici", "Adesivi", "Solventi"], count: 58 },
  { slug: "dpi-sicurezza", name: "DPI e sicurezza", description: "Dispositivi di protezione individuale e antinfortunistica.", subcategories: ["Protezione", "Segnaletica", "Antinfortunistica"], count: 46 },
  { slug: "logistica-movimentazione", name: "Logistica e movimentazione", description: "Carrelli, transpallet e sistemi di movimentazione.", subcategories: ["Transpallet", "Carrelli", "Nastri"], count: 39 },
];

export function categoryName(slug: string): string {
  return categories.find((c) => c.slug === slug)?.name ?? slug;
}

export function categoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

// ---------------------------------------------------------------------------
// Aziende (8)
// ---------------------------------------------------------------------------

export const companies: Company[] = [
  {
    id: "co-metalfer",
    ragioneSociale: "Metalfer Componenti S.r.l.",
    displayName: "Metalfer Componenti",
    vatNumber: "IT01948320177",
    sector: "Meccanica e componentistica",
    description: "Produzione e distribuzione di componenti meccanici. Gestiamo eccedenze di magazzino e fine serie con documentazione tecnica completa.",
    region: "Lombardia",
    province: "Brescia",
    address: "Via dell'Industria 42, Brescia",
    foundedYear: 2006,
    employees: "51–200",
    verification: "Verificata",
    rating: 4.8,
    reviewsCount: 64,
    logo: "ME",
    verifiedDocuments: ["Visura camerale", "Attestazione P.IVA", "Documento legale rappresentante"],
    registeredAt: "2021-03-11",
    salesCount: 213,
    walletBalance: 18450.32,
  },
  {
    id: "co-ricambipro",
    ragioneSociale: "RicambiPro Industriale S.p.A.",
    displayName: "RicambiPro Industriale",
    vatNumber: "IT02733410365",
    sector: "Ricambistica industriale",
    description: "Stock di ricambi originali e compatibili per linee di automazione e movimentazione. Spedizioni in tutta Italia.",
    region: "Emilia-Romagna",
    province: "Modena",
    address: "Via Emilia Ovest 210, Modena",
    foundedYear: 1998,
    employees: "51–200",
    verification: "Verificata",
    rating: 4.6,
    reviewsCount: 41,
    logo: "RP",
    verifiedDocuments: ["Visura camerale", "Attestazione P.IVA"],
    registeredAt: "2020-09-02",
    salesCount: 158,
    walletBalance: 9320.0,
  },
  {
    id: "co-edilforniture",
    ragioneSociale: "EdilForniture Adriatica S.r.l.",
    displayName: "EdilForniture Adriatica",
    vatNumber: "IT01620990682",
    sector: "Edilizia e materiali",
    description: "Rimanenze di cantiere e materiali edili nuovi. Ritiro in sede o consegna su bancale con corriere convenzionato.",
    region: "Abruzzo",
    province: "Pescara",
    address: "Zona Industriale 7, Pescara",
    foundedYear: 2011,
    employees: "11–50",
    verification: "Verificata",
    rating: 4.4,
    reviewsCount: 28,
    logo: "EF",
    verifiedDocuments: ["Visura camerale", "Attestazione P.IVA"],
    registeredAt: "2022-01-20",
    salesCount: 96,
    walletBalance: 5210.75,
  },
  {
    id: "co-packitalia",
    ragioneSociale: "PackItalia Imballaggi S.r.l.",
    displayName: "PackItalia Imballaggi",
    vatNumber: "IT03881270287",
    sector: "Imballaggio e logistica",
    description: "Imballaggi industriali, bancali e materiali di protezione. Eccedenze di produzione a prezzi di stock.",
    region: "Veneto",
    province: "Padova",
    address: "Via della Logistica 15, Padova",
    foundedYear: 2003,
    employees: "51–200",
    verification: "Verificata",
    rating: 4.9,
    reviewsCount: 73,
    logo: "PK",
    verifiedDocuments: ["Visura camerale", "Attestazione P.IVA", "Documento legale rappresentante"],
    registeredAt: "2019-11-05",
    salesCount: 302,
    walletBalance: 24110.9,
  },
  {
    id: "co-tecnoelettra",
    ragioneSociale: "TecnoElettra Distribuzione S.r.l.",
    displayName: "TecnoElettra Distribuzione",
    vatNumber: "IT08172640019",
    sector: "Elettronica ed elettrotecnica",
    description: "Componenti elettronici professionali, quadristica e strumentazione. Lotti nuovi e ricondizionati certificati.",
    region: "Piemonte",
    province: "Torino",
    address: "Corso Industria 88, Torino",
    foundedYear: 2009,
    employees: "11–50",
    verification: "Verificata",
    rating: 4.7,
    reviewsCount: 52,
    logo: "TE",
    verifiedDocuments: ["Visura camerale", "Attestazione P.IVA"],
    registeredAt: "2020-06-14",
    salesCount: 187,
    walletBalance: 13775.4,
  },
  {
    id: "co-ferraris",
    ragioneSociale: "Officine Meccaniche Ferraris S.r.l.",
    displayName: "Officine Meccaniche Ferraris",
    vatNumber: "IT09912450013",
    sector: "Lavorazioni meccaniche",
    description: "Officina di lavorazioni meccaniche di precisione. Acquistiamo componenti, ricambi e attrezzature per la produzione.",
    region: "Piemonte",
    province: "Torino",
    address: "Via Meccanica 3, Torino",
    foundedYear: 2014,
    employees: "11–50",
    verification: "Verificata",
    rating: 4.5,
    reviewsCount: 19,
    logo: "OF",
    verifiedDocuments: ["Visura camerale", "Attestazione P.IVA"],
    registeredAt: "2021-05-30",
    salesCount: 47,
    walletBalance: 7620.0,
  },
  {
    id: "co-nordutensili",
    ragioneSociale: "NordUtensili S.r.l.",
    displayName: "NordUtensili",
    vatNumber: "IT04455120168",
    sector: "Utensileria industriale",
    description: "Utensili e attrezzature da officina. Azienda in fase di verifica documentale.",
    region: "Lombardia",
    province: "Bergamo",
    address: "Via degli Artigiani 21, Bergamo",
    foundedYear: 2019,
    employees: "1–10",
    verification: "In verifica",
    rating: 0,
    reviewsCount: 0,
    logo: "NU",
    verifiedDocuments: [],
    registeredAt: "2026-06-28",
    salesCount: 0,
    walletBalance: 0,
  },
  {
    id: "co-materieprime",
    ragioneSociale: "MateriePrime Toscana S.r.l.",
    displayName: "MateriePrime Toscana",
    vatNumber: "IT02010530975",
    sector: "Materie prime tessili e polimeri",
    description: "Materie prime e semilavorati. Account sospeso in attesa di chiarimenti documentali.",
    region: "Toscana",
    province: "Prato",
    address: "Via del Filatoio 9, Prato",
    foundedYear: 2016,
    employees: "11–50",
    verification: "Sospesa",
    rating: 3.6,
    reviewsCount: 4,
    logo: "MP",
    verifiedDocuments: ["Attestazione P.IVA"],
    registeredAt: "2023-04-18",
    salesCount: 12,
    walletBalance: 340.0,
  },
];

export function companyById(id: string): Company | undefined {
  return companies.find((c) => c.id === id);
}

// ---------------------------------------------------------------------------
// Lotti (20)
// ---------------------------------------------------------------------------

function daysFromPublish(publishedAt: string, days: number): string {
  const d = new Date(publishedAt);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

const rawLots: Omit<Lot, "expiresAt">[] = [
  { id: "lot-001", code: "SCV-1001", title: "Cuscinetti a sfera SKF 6205-2RS — stock nuovo", shortDescription: "1.200 cuscinetti radiali schermati, eccedenza di magazzino.", description: "Lotto di cuscinetti radiali a sfera a gola profonda, schermati su entrambi i lati (2RS). Eccedenza di magazzino da ordine annullato, prodotto nuovo in confezione originale con etichetta di lotto. Idonei per applicazioni di trasmissione e movimentazione a media velocità.", category: "componenti-industriali", subcategory: "Cuscinetti", images: [1, 5, 9], quantity: 1200, unit: "pz", minQuantity: 100, unitPrice: 3.2, negotiable: true, condition: "Nuovo", region: "Lombardia", province: "Brescia", delivery: "Spedizione e ritiro", documents: ["Scheda tecnica", "Certificato di conformità", "DDT di origine"], certifications: ["ISO 9001", "RoHS"], sellerId: "co-metalfer", publishedAt: "2026-07-04", views: 1841, offersCount: 3, status: "Pubblicato", featured: true },
  { id: "lot-002", code: "SCV-1002", title: "Motori asincroni trifase 4 kW IE3 — 18 unità", shortDescription: "Motori IE3 400V forma B3, rimanenza di produzione.", description: "Motori elettrici asincroni trifase ad alta efficienza (IE3), 4 kW, 400V, forma B3. Rimanenza di produzione, mai installati. Corredati di targa dati e dichiarazione di conformità. Ideali per pompe, ventilatori e nastri trasportatori.", category: "componenti-industriali", subcategory: "Motori elettrici", images: [2, 6, 10], quantity: 18, unit: "pz", minQuantity: 2, unitPrice: 210, negotiable: true, condition: "Nuovo", region: "Lombardia", province: "Brescia", delivery: "Spedizione e ritiro", documents: ["Scheda tecnica", "Dichiarazione CE"], certifications: ["CE", "IE3"], sellerId: "co-metalfer", publishedAt: "2026-07-09", views: 947, offersCount: 1, status: "Pubblicato", featured: true },
  { id: "lot-003", code: "SCV-1003", title: "Kit ricambi per riduttori epicicloidali — misto", shortDescription: "Satelliti, alberi, guarnizioni e paraoli, fine serie.", description: "Lotto misto di ricambi per riduttori epicicloidali: satelliti, alberi, guarnizioni e paraoli. Prodotto compatibile, nuovo. Fine serie di gamma sostituita. Elenco codici disponibile su richiesta.", category: "ricambi", subcategory: "Riduttori", images: [3, 7, 11], quantity: 340, unit: "pz", minQuantity: 20, unitPrice: 12.5, negotiable: true, condition: "Fine serie", region: "Emilia-Romagna", province: "Modena", delivery: "Spedizione", documents: ["Distinta codici", "Scheda tecnica"], certifications: ["ISO 9001"], sellerId: "co-ricambipro", publishedAt: "2026-07-01", views: 612, offersCount: 1, status: "Pubblicato", featured: true },
  { id: "lot-004", code: "SCV-1004", title: "Pompe idrauliche a ingranaggi — ricondizionate", shortDescription: "44 pompe revisionate e collaudate, garanzia 6 mesi.", description: "Pompe idrauliche a ingranaggi ricondizionate e collaudate al banco. Revisione completa con sostituzione tenute. Garanzia funzionale 6 mesi. Ideali per manutenzione di mezzi e impianti oleodinamici.", category: "ricambi", subcategory: "Pompe", images: [4, 8, 12], quantity: 44, unit: "pz", minQuantity: 4, unitPrice: 78, negotiable: true, condition: "Ricondizionato", region: "Emilia-Romagna", province: "Modena", delivery: "Spedizione e ritiro", documents: ["Rapporto di collaudo", "Certificato di garanzia"], certifications: ["Collaudo interno"], sellerId: "co-ricambipro", publishedAt: "2026-06-24", views: 503, offersCount: 1, status: "Pubblicato" },
  { id: "lot-005", code: "SCV-1005", title: "Pannelli isolanti in lana di roccia — 90 bancali", shortDescription: "Lana di roccia 60 mm, rimanenza di cantiere.", description: "Pannelli in lana di roccia ad alta densità, spessore 60 mm, per isolamento termico e acustico. Prodotto nuovo, rimanenza di cantiere per commessa ridimensionata. Imballati su bancale filmato.", category: "materiali-edili", subcategory: "Isolanti", images: [5, 9, 1], quantity: 90, unit: "bancali", minQuantity: 5, unitPrice: 145, negotiable: false, condition: "Nuovo", region: "Abruzzo", province: "Pescara", delivery: "Spedizione e ritiro", documents: ["Scheda tecnica", "DoP - Dichiarazione di prestazione"], certifications: ["CE", "Euroclasse A1"], sellerId: "co-edilforniture", publishedAt: "2026-07-06", views: 738, offersCount: 1, status: "Pubblicato", featured: true },
  { id: "lot-006", code: "SCV-1006", title: "Gres porcellanato 60x60 — partita fine serie", shortDescription: "1.250 mq effetto pietra, prima scelta.", description: "Piastrelle in gres porcellanato rettificato 60x60, effetto pietra. Partita fine serie con tinta uniforme. Quantità sufficiente per progetti medio-grandi. Prima scelta.", category: "materiali-edili", subcategory: "Pavimenti", images: [6, 10, 2], quantity: 1250, unit: "mq", minQuantity: 50, unitPrice: 8.9, negotiable: true, condition: "Fine serie", region: "Abruzzo", province: "Pescara", delivery: "Spedizione e ritiro", documents: ["Scheda tecnica"], certifications: ["CE"], sellerId: "co-edilforniture", publishedAt: "2026-06-30", views: 421, offersCount: 0, status: "Pubblicato" },
  { id: "lot-007", code: "SCV-1007", title: "Bancali EPAL usati — 800 pezzi, buono stato", shortDescription: "EPAL/EUR 800x1200 selezionati e controllati.", description: "Bancali EPAL/EUR standard 800x1200, usati in buono stato, selezionati e controllati. Pronti al riutilizzo per logistica interna. Ritiro rapido su appuntamento.", category: "imballaggi", subcategory: "Bancali", images: [7, 11, 3], quantity: 800, unit: "pz", minQuantity: 50, unitPrice: 7.5, negotiable: false, condition: "Usato - buono", region: "Veneto", province: "Padova", delivery: "Spedizione e ritiro", documents: ["Report di selezione"], certifications: ["EPAL"], sellerId: "co-packitalia", publishedAt: "2026-07-11", views: 1290, offersCount: 1, status: "Pubblicato", featured: true },
  { id: "lot-008", code: "SCV-1008", title: "Film estensibile manuale — 240 bobine", shortDescription: "Film 23 micron per pallettizzazione manuale.", description: "Film estensibile trasparente per pallettizzazione manuale, 23 micron, bobina da 2,4 kg. Eccedenza di produzione. Prodotto nuovo, imballo integro.", category: "imballaggi", subcategory: "Film e nastri", images: [8, 12, 4], quantity: 240, unit: "bobine", minQuantity: 10, unitPrice: 4.1, negotiable: true, condition: "Nuovo", region: "Veneto", province: "Padova", delivery: "Spedizione", documents: ["Scheda tecnica"], certifications: ["RoHS"], sellerId: "co-packitalia", publishedAt: "2026-06-27", views: 356, offersCount: 0, status: "Pubblicato" },
  { id: "lot-009", code: "SCV-1009", title: "Quadri elettrici BT preconfigurati — 12 unità", shortDescription: "Quadri BT con magnetotermici e differenziali.", description: "Quadri elettrici di bassa tensione preconfigurati per distribuzione, con interruttori magnetotermici e differenziali. Nuovi, da commessa non ritirata. Schemi elettrici inclusi.", category: "elettronica-professionale", subcategory: "Quadri elettrici", images: [9, 1, 5], quantity: 12, unit: "pz", minQuantity: 1, unitPrice: 640, negotiable: true, condition: "Nuovo", region: "Piemonte", province: "Torino", delivery: "Spedizione e ritiro", documents: ["Schemi elettrici", "Dichiarazione CE", "Verifica di funzionamento"], certifications: ["CE", "IEC 61439"], sellerId: "co-tecnoelettra", publishedAt: "2026-07-08", views: 689, offersCount: 1, status: "Pubblicato", featured: true },
  { id: "lot-010", code: "SCV-1010", title: "Sensori fotoelettrici industriali — lotto 500 pz", shortDescription: "Sensori a riflessione diffusa, uscita PNP.", description: "Sensori fotoelettrici a riflessione diffusa per automazione di linea, uscita PNP. Prodotto nuovo, confezioni originali. Eccedenza di magazzino.", category: "elettronica-professionale", subcategory: "Sensori", images: [10, 2, 6], quantity: 500, unit: "pz", minQuantity: 25, unitPrice: 14.9, negotiable: true, condition: "Nuovo", region: "Piemonte", province: "Torino", delivery: "Spedizione", documents: ["Scheda tecnica", "Manuale d'uso"], certifications: ["CE", "RoHS"], sellerId: "co-tecnoelettra", publishedAt: "2026-06-22", views: 402, offersCount: 1, status: "Pubblicato" },
  { id: "lot-011", code: "SCV-1011", title: "Avvitatori a batteria professionali — 60 kit", shortDescription: "Kit 18V con 2 batterie e caricatore, fine serie.", description: "Kit avvitatori a batteria 18V con due batterie e caricatore, in valigetta. Prodotto nuovo, fine serie da rinnovo gamma. Ideali per officine e manutenzione.", category: "attrezzature", subcategory: "Utensili elettrici", images: [11, 3, 7], quantity: 60, unit: "kit", minQuantity: 2, unitPrice: 96, negotiable: true, condition: "Fine serie", region: "Lombardia", province: "Brescia", delivery: "Spedizione e ritiro", documents: ["Scheda tecnica", "Certificato di garanzia"], certifications: ["CE"], sellerId: "co-metalfer", publishedAt: "2026-07-13", views: 815, offersCount: 2, status: "Pubblicato", featured: true },
  { id: "lot-012", code: "SCV-1012", title: "Scaffalature portapallet — 40 campate, smontate", shortDescription: "40 campate complete, usato in buono stato.", description: "Scaffalature metalliche portapallet, 40 campate complete di correnti e diagonali. Usate in buono stato, provenienti da riorganizzazione magazzino. Smontate e pronte al trasporto. Portata elevata.", category: "arredi-aziendali", subcategory: "Scaffalature", images: [12, 4, 8], quantity: 40, unit: "campate", minQuantity: 4, unitPrice: 165, negotiable: true, condition: "Usato - buono", region: "Abruzzo", province: "Pescara", delivery: "Ritiro in sede", documents: ["Schema di montaggio", "Report condizioni"], certifications: ["Verifica strutturale"], sellerId: "co-edilforniture", publishedAt: "2026-07-05", views: 534, offersCount: 0, status: "Pubblicato" },
  { id: "lot-013", code: "SCV-1013", title: "Profilati in alluminio 40x40 — stock 900 metri", shortDescription: "Profilo strutturale con cave, nuovo.", description: "Profilati estrusi in alluminio serie 40x40 con cave, per strutture e automazione. Prodotto nuovo, tagli standard da 6 metri. Eccedenza di magazzino. Accessori disponibili a parte.", category: "materie-prime", subcategory: "Metalli", images: [1, 6, 11], quantity: 900, unit: "m", minQuantity: 60, unitPrice: 6.4, negotiable: true, condition: "Nuovo", region: "Lombardia", province: "Brescia", delivery: "Spedizione e ritiro", documents: ["Scheda tecnica"], certifications: ["EN 755"], sellerId: "co-metalfer", publishedAt: "2026-07-10", views: 388, offersCount: 1, status: "Riservato" },
  { id: "lot-014", code: "SCV-1014", title: "Tornio parallelo usato revisionato", shortDescription: "Tornio da officina, revisione recente.", description: "Tornio parallelo da officina, distanza tra le punte 1000 mm, revisionato di recente con sostituzione cuscinetti mandrino. Funzionante e collaudato. Ritiro in sede con nostro supporto al carico.", category: "attrezzature", subcategory: "Macchine utensili", images: [2, 7, 12], quantity: 1, unit: "pz", minQuantity: 1, unitPrice: 4200, negotiable: true, condition: "Ricondizionato", region: "Piemonte", province: "Torino", delivery: "Ritiro in sede", documents: ["Rapporto di revisione"], certifications: ["Collaudo interno"], sellerId: "co-ferraris", publishedAt: "2026-07-07", views: 271, offersCount: 0, status: "Pubblicato" },
  { id: "lot-015", code: "SCV-1015", title: "Set utensili manuali per officina — 30 valigette", shortDescription: "Set completi da officina, nuovi.", description: "Set di utensili manuali per officina in valigetta rigida: chiavi, bussole, cacciaviti e pinze. Prodotto nuovo. Annuncio in fase di revisione da parte della piattaforma.", category: "attrezzature", subcategory: "Attrezzatura officina", images: [3, 8, 1], quantity: 30, unit: "valigette", minQuantity: 2, unitPrice: 118, negotiable: true, condition: "Nuovo", region: "Lombardia", province: "Bergamo", delivery: "Spedizione", documents: ["Scheda tecnica"], certifications: [], sellerId: "co-nordutensili", publishedAt: "2026-07-16", views: 34, offersCount: 0, status: "In revisione" },
  { id: "lot-016", code: "SCV-1016", title: "Filati misto cotone — 1.500 kg in coni", shortDescription: "Filati Ne 30/1 in coni, fine collezione.", description: "Filati misto cotone Ne 30/1 in coni, tinte assortite. Fine collezione. Idonei per maglieria e tessitura. Annuncio momentaneamente sospeso.", category: "tessile", subcategory: "Filati", images: [4, 9, 2], quantity: 1500, unit: "kg", minQuantity: 100, unitPrice: 5.8, negotiable: true, condition: "Fine serie", region: "Toscana", province: "Prato", delivery: "Spedizione e ritiro", documents: ["Scheda tecnica"], certifications: ["Oeko-Tex"], sellerId: "co-materieprime", publishedAt: "2026-06-15", views: 210, offersCount: 0, status: "Sospeso" },
  { id: "lot-017", code: "SCV-1017", title: "Viteria inox A2 assortita — 25.000 pezzi", shortDescription: "Bulloneria inox assortita, nuova.", description: "Assortimento di viteria in acciaio inox A2: viti, dadi e rondelle in misure miste. Prodotto nuovo. Bozza in preparazione, non ancora pubblicata.", category: "componenti-industriali", subcategory: "Viteria", images: [5, 10, 3], quantity: 25000, unit: "pz", minQuantity: 1000, unitPrice: 0.09, negotiable: true, condition: "Nuovo", region: "Lombardia", province: "Brescia", delivery: "Spedizione", documents: [], certifications: ["ISO 3506"], sellerId: "co-metalfer", publishedAt: "2026-07-17", views: 0, offersCount: 0, status: "Bozza" },
  { id: "lot-018", code: "SCV-1018", title: "Cinghie trapezoidali industriali — lotto misto", shortDescription: "Cinghie SPA/SPB assortite, nuove.", description: "Lotto misto di cinghie trapezoidali industriali sezioni SPA e SPB, lunghezze assortite. Prodotto nuovo. Lotto già venduto, in evasione.", category: "ricambi", subcategory: "Cinghie", images: [6, 11, 4], quantity: 600, unit: "pz", minQuantity: 30, unitPrice: 3.9, negotiable: false, condition: "Nuovo", region: "Emilia-Romagna", province: "Modena", delivery: "Spedizione", documents: ["Distinta codici"], certifications: [], sellerId: "co-ricambipro", publishedAt: "2026-06-20", views: 455, offersCount: 2, status: "Venduto" },
  { id: "lot-019", code: "SCV-1019", title: "Casse in plastica impilabili — 500 pezzi", shortDescription: "Contenitori 600x400 nuovi, impilabili.", description: "Casse industriali in plastica impilabili 600x400x320 mm, colore grigio. Prodotto nuovo, imballo integro. Ideali per logistica interna e picking.", category: "imballaggi", subcategory: "Contenitori", images: [7, 12, 5], quantity: 500, unit: "pz", minQuantity: 25, unitPrice: 6.2, negotiable: true, condition: "Nuovo", region: "Veneto", province: "Padova", delivery: "Spedizione e ritiro", documents: ["Scheda tecnica"], certifications: ["RoHS"], sellerId: "co-packitalia", publishedAt: "2026-07-12", views: 318, offersCount: 0, status: "Pubblicato" },
  { id: "lot-020", code: "SCV-1020", title: "Cavo unipolare FS17 1x2,5 — 40 matasse", shortDescription: "Cavo FS17 blu 100 m, annuncio scaduto.", description: "Cavo unipolare FS17 450/750V sezione 1x2,5 mmq, colore blu, matasse da 100 m. Prodotto nuovo. Annuncio scaduto: contattare per disponibilità residua.", category: "elettronica-professionale", subcategory: "Cavi", images: [8, 1, 6], quantity: 40, unit: "matasse", minQuantity: 4, unitPrice: 22, negotiable: true, condition: "Nuovo", region: "Piemonte", province: "Torino", delivery: "Spedizione", documents: ["Scheda tecnica"], certifications: ["CE", "IMQ"], sellerId: "co-tecnoelettra", publishedAt: "2026-05-30", views: 176, offersCount: 0, status: "Scaduto" },
];

export const lots: Lot[] = rawLots.map((l) => ({
  ...l,
  expiresAt: daysFromPublish(l.publishedAt, 45),
}));

export function lotById(id: string): Lot | undefined {
  return lots.find((l) => l.id === id);
}

export { lotTotal };

// ---------------------------------------------------------------------------
// Offerte (12)
// ---------------------------------------------------------------------------

function mkOffer(
  o: Omit<Offer, "totalValue" | "expiresAt" | "history"> & {
    expiresAt?: string;
    history?: Offer["history"];
  },
): Offer {
  return {
    ...o,
    totalValue: o.unitPrice * o.quantity,
    expiresAt: o.expiresAt ?? daysFromPublish(o.date, 7),
    history: o.history ?? [],
  };
}

export const offers: Offer[] = [
  mkOffer({ id: "of-001", lotId: "lot-001", buyerId: "co-ferraris", sellerId: "co-metalfer", quantity: 300, unitPrice: 2.85, message: "Interessati a un ordine ricorrente trimestrale. Possibile sconto sul volume?", date: "2026-07-15", status: "In valutazione" }),
  mkOffer({ id: "of-002", lotId: "lot-002", buyerId: "co-ferraris", sellerId: "co-metalfer", quantity: 6, unitPrice: 190, message: "Ci servono 6 motori per un impianto di ventilazione. Ritiro diretto in sede.", date: "2026-07-14", status: "Controproposta", history: [
    { by: "buyer", unitPrice: 190, quantity: 6, message: "Proposta iniziale.", date: "2026-07-14" },
    { by: "seller", unitPrice: 200, quantity: 6, message: "Possiamo chiudere a 200 €/pz con ritiro entro la settimana.", date: "2026-07-15" },
  ] }),
  mkOffer({ id: "of-003", lotId: "lot-011", buyerId: "co-ricambipro", sellerId: "co-metalfer", quantity: 20, unitPrice: 88, message: "Ordine di 20 kit per rivendita.", date: "2026-07-17", status: "Inviata" }),
  mkOffer({ id: "of-004", lotId: "lot-001", buyerId: "co-tecnoelettra", sellerId: "co-metalfer", quantity: 500, unitPrice: 3.0, message: "Valutiamo 500 pezzi con consegna dilazionata.", date: "2026-07-16", status: "Visualizzata" }),
  mkOffer({ id: "of-005", lotId: "lot-013", buyerId: "co-ferraris", sellerId: "co-metalfer", quantity: 300, unitPrice: 6.0, message: "Confermiamo l'acquisto di 300 metri di profilato.", date: "2026-07-12", status: "Accettata" }),
  mkOffer({ id: "of-006", lotId: "lot-011", buyerId: "co-packitalia", sellerId: "co-metalfer", quantity: 10, unitPrice: 80, message: "Proposta per 10 kit.", date: "2026-07-14", status: "Rifiutata" }),
  mkOffer({ id: "of-007", lotId: "lot-005", buyerId: "co-ferraris", sellerId: "co-edilforniture", quantity: 30, unitPrice: 138, message: "30 bancali con ritiro nostro mezzo.", date: "2026-07-13", status: "In valutazione" }),
  mkOffer({ id: "of-008", lotId: "lot-009", buyerId: "co-ferraris", sellerId: "co-tecnoelettra", quantity: 4, unitPrice: 580, message: "Interesse per 4 quadri, richiediamo trasporto assicurato.", date: "2026-07-15", status: "Controproposta", history: [
    { by: "buyer", unitPrice: 580, quantity: 4, message: "Proposta iniziale.", date: "2026-07-15" },
    { by: "seller", unitPrice: 615, quantity: 4, message: "Possiamo scendere a 615 €/pz trasporto incluso.", date: "2026-07-16" },
  ] }),
  mkOffer({ id: "of-009", lotId: "lot-007", buyerId: "co-ferraris", sellerId: "co-packitalia", quantity: 200, unitPrice: 7.0, message: "200 bancali con ritiro programmato.", date: "2026-07-11", status: "Accettata" }),
  mkOffer({ id: "of-010", lotId: "lot-003", buyerId: "co-edilforniture", sellerId: "co-ricambipro", quantity: 60, unitPrice: 10.8, message: "Proposta ritirata, valutiamo più avanti.", date: "2026-07-08", status: "Ritirata" }),
  mkOffer({ id: "of-011", lotId: "lot-010", buyerId: "co-ferraris", sellerId: "co-tecnoelettra", quantity: 100, unitPrice: 13.5, message: "Offerta non rinnovata.", date: "2026-06-20", status: "Scaduta" }),
  mkOffer({ id: "of-012", lotId: "lot-004", buyerId: "co-ferraris", sellerId: "co-ricambipro", quantity: 8, unitPrice: 72, message: "8 pompe per manutenzione flotta.", date: "2026-07-17", status: "Inviata" }),
];

// ---------------------------------------------------------------------------
// Ordini (8)
// ---------------------------------------------------------------------------

function mkOrder(
  o: Omit<Order, "subtotal" | "commission" | "total" | "history" | "paid"> & {
    history?: Order["history"];
    paid?: boolean;
  },
): Order {
  const subtotal = o.unitPrice * o.quantity;
  const commission = Math.round(subtotal * COMMISSION_RATE * 100) / 100;
  return {
    ...o,
    subtotal,
    commission,
    total: subtotal + commission,
    history: o.history ?? [{ status: o.status, date: o.date }],
    paid: o.paid ?? o.status !== "In attesa di conferma",
    paymentMethod: o.status !== "In attesa di conferma" ? "Carta ·· 4242" : undefined,
  };
}

export const orders: Order[] = [
  mkOrder({ id: "ord-2026-0155", code: "ORD-2026-0155", lotId: "lot-013", lotTitle: "Profilati in alluminio 40x40 — stock 900 metri", buyerId: "co-ferraris", sellerId: "co-metalfer", quantity: 300, unitPrice: 6.0, delivery: "Ritiro in sede", status: "Confermato", date: "2026-07-16", documents: ["Conferma d'ordine"], history: [
    { status: "In attesa di conferma", date: "2026-07-16" },
    { status: "Confermato", date: "2026-07-17" },
  ] }),
  mkOrder({ id: "ord-2026-0151", code: "ORD-2026-0151", lotId: "lot-007", lotTitle: "Bancali EPAL usati — 800 pezzi, buono stato", buyerId: "co-ferraris", sellerId: "co-packitalia", quantity: 200, unitPrice: 7.0, delivery: "Spedizione", status: "Spedito", date: "2026-07-11", documents: ["Conferma d'ordine", "DDT"], history: [
    { status: "In attesa di conferma", date: "2026-07-11" },
    { status: "Confermato", date: "2026-07-12" },
    { status: "In preparazione", date: "2026-07-13" },
    { status: "Spedito", date: "2026-07-14" },
  ] }),
  mkOrder({ id: "ord-2026-0139", code: "ORD-2026-0139", lotId: "lot-001", lotTitle: "Cuscinetti a sfera SKF 6205-2RS — stock nuovo", buyerId: "co-ferraris", sellerId: "co-metalfer", quantity: 200, unitPrice: 3.2, delivery: "Spedizione", status: "Completato", date: "2026-07-02", documents: ["Conferma d'ordine", "DDT", "Fattura"], history: [
    { status: "In attesa di conferma", date: "2026-07-02" },
    { status: "Confermato", date: "2026-07-02" },
    { status: "Spedito", date: "2026-07-03" },
    { status: "Consegnato", date: "2026-07-05" },
    { status: "Completato", date: "2026-07-06" },
  ] }),
  mkOrder({ id: "ord-2026-0148", code: "ORD-2026-0148", lotId: "lot-005", lotTitle: "Pannelli isolanti in lana di roccia — 90 bancali", buyerId: "co-ferraris", sellerId: "co-edilforniture", quantity: 20, unitPrice: 140, delivery: "Ritiro in sede", status: "In preparazione", date: "2026-07-13", documents: ["Conferma d'ordine"], history: [
    { status: "In attesa di conferma", date: "2026-07-13" },
    { status: "Confermato", date: "2026-07-14" },
    { status: "In preparazione", date: "2026-07-15" },
  ] }),
  mkOrder({ id: "ord-2026-0132", code: "ORD-2026-0132", lotId: "lot-011", lotTitle: "Avvitatori a batteria professionali — 60 kit", buyerId: "co-ricambipro", sellerId: "co-metalfer", quantity: 10, unitPrice: 96, delivery: "Ritiro in sede", status: "Consegnato", date: "2026-06-28", documents: ["Conferma d'ordine", "DDT"], history: [
    { status: "In attesa di conferma", date: "2026-06-28" },
    { status: "Confermato", date: "2026-06-29" },
    { status: "Spedito", date: "2026-06-30" },
    { status: "Consegnato", date: "2026-07-02" },
  ] }),
  mkOrder({ id: "ord-2026-0160", code: "ORD-2026-0160", lotId: "lot-009", lotTitle: "Quadri elettrici BT preconfigurati — 12 unità", buyerId: "co-ferraris", sellerId: "co-tecnoelettra", quantity: 2, unitPrice: 640, delivery: "Spedizione", status: "In attesa di conferma", date: "2026-07-17", documents: [], history: [
    { status: "In attesa di conferma", date: "2026-07-17" },
  ] }),
  mkOrder({ id: "ord-2026-0121", code: "ORD-2026-0121", lotId: "lot-003", lotTitle: "Kit ricambi per riduttori epicicloidali — misto", buyerId: "co-edilforniture", sellerId: "co-ricambipro", quantity: 40, unitPrice: 12.0, delivery: "Spedizione", status: "Completato", date: "2026-06-24", documents: ["Conferma d'ordine", "DDT", "Fattura"], history: [
    { status: "In attesa di conferma", date: "2026-06-24" },
    { status: "Confermato", date: "2026-06-25" },
    { status: "Spedito", date: "2026-06-26" },
    { status: "Consegnato", date: "2026-06-28" },
    { status: "Completato", date: "2026-06-29" },
  ] }),
  mkOrder({ id: "ord-2026-0118", code: "ORD-2026-0118", lotId: "lot-018", lotTitle: "Cinghie trapezoidali industriali — lotto misto", buyerId: "co-ferraris", sellerId: "co-ricambipro", quantity: 200, unitPrice: 3.9, delivery: "Spedizione", status: "Contestato", date: "2026-06-21", documents: ["Conferma d'ordine", "DDT"], history: [
    { status: "In attesa di conferma", date: "2026-06-21" },
    { status: "Confermato", date: "2026-06-22" },
    { status: "Spedito", date: "2026-06-23" },
    { status: "Consegnato", date: "2026-06-25" },
    { status: "Contestato", date: "2026-06-27", note: "Difformità sulla quantità ricevuta." },
  ] }),
];

// ---------------------------------------------------------------------------
// Notifiche (10)
// ---------------------------------------------------------------------------

export const notifications: Notification[] = [
  { id: "nt-01", type: "offerta_ricevuta", title: "Nuova offerta ricevuta", detail: "RicambiPro Industriale ha proposto 88 €/kit sugli avvitatori.", date: "2026-07-17", read: false, href: "/venditore/offerte", audience: "seller" },
  { id: "nt-02", type: "ordine_aggiornato", title: "Ordine confermato", detail: "L'ordine ORD-2026-0155 è stato confermato.", date: "2026-07-17", read: false, href: "/venditore/ordini", audience: "seller" },
  { id: "nt-03", type: "offerta_ricevuta", title: "Offerta in valutazione", detail: "Officine Meccaniche Ferraris ha proposto 2,85 €/pz sui cuscinetti SKF.", date: "2026-07-15", read: true, href: "/venditore/offerte", audience: "seller" },
  { id: "nt-04", type: "lotto_scadenza", title: "Lotto in scadenza", detail: "Il lotto “Sensori fotoelettrici” scade tra 3 giorni.", date: "2026-07-16", read: false, href: "/venditore/lotti", audience: "seller" },
  { id: "nt-05", type: "verifica_completata", title: "Verifica azienda completata", detail: "La verifica KYB simulata della tua azienda è stata approvata.", date: "2026-07-10", read: true, audience: "both" },
  { id: "nt-06", type: "controproposta", title: "Controproposta ricevuta", detail: "TecnoElettra ha rilanciato a 615 €/pz sui quadri elettrici BT.", date: "2026-07-16", read: false, href: "/compratore/offerte", audience: "buyer" },
  { id: "nt-07", type: "offerta_accettata", title: "Offerta accettata", detail: "PackItalia ha accettato la tua offerta sui bancali EPAL.", date: "2026-07-11", read: true, href: "/compratore/offerte", audience: "buyer" },
  { id: "nt-08", type: "ordine_aggiornato", title: "Ordine spedito", detail: "L'ordine ORD-2026-0151 è stato affidato al corriere.", date: "2026-07-14", read: false, href: "/compratore/ordini", audience: "buyer" },
  { id: "nt-09", type: "messaggio", title: "Nuovo messaggio", detail: "Metalfer Componenti ha risposto sulla richiesta cuscinetti.", date: "2026-07-15", read: true, href: "/compratore/messaggi", audience: "buyer" },
  { id: "nt-10", type: "lotto_scadenza", title: "Ricerca salvata aggiornata", detail: "3 nuovi lotti corrispondono a “Cuscinetti · Lombardia · nuovo”.", date: "2026-07-13", read: true, href: "/compratore/ricerche", audience: "buyer" },
];

// ---------------------------------------------------------------------------
// Recensioni (8)
// ---------------------------------------------------------------------------

export const reviews: Review[] = [
  { id: "rev-01", companyId: "co-metalfer", authorCompany: "Officine Meccaniche Ferraris S.r.l.", rating: 5, date: "2026-07-04", title: "Prodotto conforme e imballo curato", body: "Cuscinetti perfettamente conformi alla scheda tecnica. Spedizione rapida e documentazione completa.", lotId: "lot-001" },
  { id: "rev-02", companyId: "co-packitalia", authorCompany: "LogiNord Distribuzione S.r.l.", rating: 5, date: "2026-07-11", title: "Bancali selezionati con cura", body: "Qualità dei bancali superiore alle attese. Ritiro organizzato in modo impeccabile.", lotId: "lot-007" },
  { id: "rev-03", companyId: "co-edilforniture", authorCompany: "Costruzioni Marche S.r.l.", rating: 4, date: "2026-07-14", title: "Buon materiale, tempi da migliorare", body: "Pannelli ottimi e prezzo competitivo. La programmazione del ritiro ha richiesto qualche giorno in più.", lotId: "lot-005" },
  { id: "rev-04", companyId: "co-tecnoelettra", authorCompany: "Elettro Sistemi Sud S.r.l.", rating: 5, date: "2026-07-09", title: "Quadri configurati alla perfezione", body: "Schemi elettrici chiari e prodotto pronto all'installazione. Interlocutore tecnico molto preparato.", lotId: "lot-009" },
  { id: "rev-05", companyId: "co-ricambipro", authorCompany: "Manutenzioni Tecniche Alfa S.r.l.", rating: 4, date: "2026-06-29", title: "Ricambi compatibili affidabili", body: "Distinta codici precisa e ricambi funzionanti. Consigliata per manutenzioni programmate.", lotId: "lot-003" },
  { id: "rev-06", companyId: "co-metalfer", authorCompany: "Impianti Verdi S.r.l.", rating: 5, date: "2026-07-15", title: "Trattativa trasparente", body: "Offerta gestita in modo professionale, controproposta ragionevole. Torneremo ad acquistare.", lotId: "lot-002" },
  { id: "rev-07", companyId: "co-packitalia", authorCompany: "Distribuzione Sud S.r.l.", rating: 5, date: "2026-06-30", title: "Fornitore affidabile", body: "Terzo acquisto, sempre puntuali e precisi sulle quantità.", lotId: "lot-019" },
  { id: "rev-08", companyId: "co-ricambipro", authorCompany: "Officine Meccaniche Ferraris S.r.l.", rating: 4, date: "2026-07-01", title: "Buon rapporto qualità prezzo", body: "Cinghie conformi e consegna nei tempi. Consigliato.", lotId: "lot-018" },
];

export function reviewsForCompany(companyId: string): Review[] {
  return reviews.filter((r) => r.companyId === companyId);
}

// ---------------------------------------------------------------------------
// Ricerche salvate (compratore)
// ---------------------------------------------------------------------------

export const savedSearches: SavedSearch[] = [
  { id: "ss-1", label: "Cuscinetti · Lombardia · nuovo", query: "cuscinetti", alerts: true },
  { id: "ss-2", label: "Quadri elettrici BT", query: "quadri elettrici", alerts: true },
  { id: "ss-3", label: "Bancali EPAL", query: "bancali", alerts: false },
];

export const savedLotIds = ["lot-002", "lot-009", "lot-012", "lot-014"];
