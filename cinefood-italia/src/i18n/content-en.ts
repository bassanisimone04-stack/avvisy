/**
 * ============================================================
 *  TRADUZIONI INGLESI DEI CONTENUTI (film e locali)
 * ============================================================
 *  Tutte le traduzioni in un unico file, indicizzate per "slug"
 *  (il nome del file senza .md). Se una voce manca, il sito usa
 *  automaticamente il testo italiano.
 */
import type { Restaurant, Film } from "../lib/utils";
import type { Lang } from "./ui";

interface FilmEn {
  titolo?: string;
  sinossi?: string;
  faq?: { domanda: string; risposta: string }[];
}

/**
 * Nomi delle città che cambiano in inglese (le altre restano invariate).
 * Usata solo per il TESTO visibile in inglese: gli slug delle pagine e gli
 * indirizzi reali restano in italiano (es. /en/roma, "00186 Roma RM").
 */
const CITTA_EN: Record<string, string> = {
  Roma: "Rome",
  Milano: "Milan",
  Napoli: "Naples",
  Venezia: "Venice",
};

/** Traduce il nome di una città per la lingua data (solo per il testo mostrato). */
export function tCitta(cittaIt: string, lang: Lang): string {
  if (lang !== "en") return cittaIt;
  return CITTA_EN[cittaIt] ?? cittaIt;
}

export const filmsEn: Record<string, FilmEn> = {
  "il-padrino": {
    titolo: "The Godfather",
    sinossi:
      "Coppola's masterpiece about the Corleone family. The 'Sicilian' scenes were shot in the villages of Savoca and Forza d'Agrò, near Messina.",
    faq: [
      { domanda: "Where was the Sicilian part of The Godfather filmed?", risposta: "In the villages of Savoca and Forza d'Agrò, near Messina: the town of Corleone looked too modern, so Coppola chose these untouched hamlets." },
      { domanda: "Where can you eat like in The Godfather in Savoca?", risposta: "At Bar Vitelli, in Piazza Fossia, the bar where Michael Corleone asks the owner for Apollonia's hand: it's still open and almost unchanged since 1972." },
    ],
  },
  "il-talento-di-mr-ripley": {
    titolo: "The Talented Mr. Ripley",
    sinossi:
      "A psychological thriller with Matt Damon and Jude Law, set in 1950s Italy between the coast, Rome and Venice.",
    faq: [
      { domanda: "Where was The Talented Mr. Ripley filmed in Venice?", risposta: "Its Venetian locations include the famous Caffè Florian in St Mark's Square, where Tom meets Marge and Dickie's father." },
      { domanda: "Does Caffè Florian still exist?", risposta: "Yes: opened in 1720, it is considered Italy's oldest café still in business, under the Procuratie Nuove in St Mark's Square." },
    ],
  },
  "mangia-prega-ama": {
    titolo: "Eat Pray Love",
    sinossi:
      "Based on Elizabeth Gilbert's memoir, starring Julia Roberts. The first part, set in Rome, is a hymn to Italian food and la dolce vita.",
    faq: [
      { domanda: "Where does Julia Roberts eat in Eat Pray Love in Rome?", risposta: "Several trattorias in the historic centre, including Trattoria Santa Lucia in Largo Febo (the famous Roman-dishes scene) and Da Pancrazio, in the cellars of the ancient Theatre of Pompey." },
      { domanda: "What is the film's most famous food scene?", risposta: "The one where the lead savours Roman cuisine in a trattoria: it became an icon of food scenes set in Italy." },
      { domanda: "Can you still visit the film's restaurants?", risposta: "Yes, they are real venues in central Rome. Always check opening hours and availability before going." },
    ],
  },
  "benvenuti-al-sud": {
    titolo: "Welcome to the South",
    sinossi:
      "A blockbuster comedy with Claudio Bisio and Alessandro Siani, largely shot in Castellabate, in the Cilento area.",
    faq: [
      { domanda: "Where was Welcome to the South filmed?", risposta: "Mainly in Castellabate, a village in the Cilento (province of Salerno), among the little square, the port of San Marco and the old alleys." },
      { domanda: "Where to eat like in the film in Castellabate?", risposta: "At the Le Gatte restaurant, on the port, where the colleagues' dinner is set, and in the bars of the little square overlooking the sea." },
    ],
  },
  "la-grande-bellezza": {
    titolo: "The Great Beauty",
    sinossi:
      "Winner of the Oscar for Best Foreign Film. A baroque, melancholic portrait of Rome, among terraces, palaces and atmospheric restaurants.",
    faq: [
      { domanda: "Where was The Great Beauty filmed in Rome?", risposta: "In many of the city's landmarks. Among the restaurants, Jep's dinner with Ramona is set at La Veranda of Hotel Columbus, in Borgo Santo Spirito, near the Vatican." },
      { domanda: "Where can you eat like in The Great Beauty?", risposta: "At La Veranda of Hotel Columbus, beneath Renaissance frescoes, to relive the elegance of the film's Roman scenes." },
    ],
  },
  "un-americano-a-roma": {
    titolo: "An American in Rome",
    sinossi:
      "A cult comedy with Alberto Sordi as Nando Mericoni, the Roman obsessed with America. His is the legendary 'macaroni' scene.",
    faq: [
      { domanda: "What is the most famous scene of An American in Rome?", risposta: "The 'macaroni' scene: after scorning American food, Nando gives in to Roman pasta with the line 'Macaroni, you provoked me and now I'll destroy you'." },
      { domanda: "Where can you eat the Roman cuisine of the film?", risposta: "In Rome's historic trattorias serving traditional dishes, like those loved by Nando Mericoni." },
    ],
  },
  "chiamami-col-tuo-nome": {
    titolo: "Call Me by Your Name",
    sinossi:
      "An Oscar-winning summer love story (Best Adapted Screenplay), filmed in the Lombard lowlands, with Crema and its surroundings at its scenic heart.",
    faq: [
      { domanda: "Where was Call Me by Your Name filmed?", risposta: "Around Crema, in Lombardy: the villa in Moscazzano, the squares and alleys of Crema's old town, and the surrounding countryside." },
      { domanda: "What to see and where to stop in Crema following the film?", risposta: "Piazza del Duomo and the cafés of the historic centre, perfect for a break while touring the film's locations." },
    ],
  },
  "la-dolce-vita": {
    titolo: "La Dolce Vita",
    sinossi:
      "Fellini's masterpiece with Marcello Mastroianni: the worldly, night-time Rome of Via Veneto, its cafés and the Trevi Fountain, between glamour and melancholy.",
    faq: [
      { domanda: "Where is La Dolce Vita set in Rome?", risposta: "Mostly on Via Veneto, with its elegant cafés and hotels, and at the Trevi Fountain (Anita Ekberg's famous bathe)." },
      { domanda: "Where to soak up the film's atmosphere today?", risposta: "At the historic cafés of Via Veneto, the heart of Rome's 'dolce vita' in the 1960s." },
    ],
  },
  "il-commissario-montalbano": {
    titolo: "Inspector Montalbano",
    sinossi:
      "The cult TV series based on Camilleri's novels, filmed in south-eastern Sicily (Ragusa, Scicli, Punta Secca). The inspector is also famous for his love of Sicilian food.",
    faq: [
      { domanda: "Where was the Montalbano series filmed?", risposta: "In the Ragusa area: Montalbano's house is in Punta Secca (Santa Croce Camerina), while the police station is in Scicli. Ragusa Ibla and the local baroque form the backdrop." },
      { domanda: "Where can you eat like Montalbano?", risposta: "In the seaside trattorias of the Ragusa coast, serving the Sicilian dishes the inspector loves: pasta 'ncasciata, arancini and fresh fish." },
    ],
  },
  "nuovo-cinema-paradiso": {
    titolo: "Cinema Paradiso",
    sinossi:
      "Winner of the Oscar for Best Foreign Film. A Sicilian boy's love story with cinema, with the famous square of Palazzo Adriano at the heart of the tale.",
    faq: [
      { domanda: "Where was Cinema Paradiso filmed?", risposta: "Mainly in Palazzo Adriano, in the province of Palermo, whose square with the octagonal fountain became the set of the town of Giancaldo." },
      { domanda: "What to see in Palazzo Adriano following the film?", risposta: "The beautiful Piazza Umberto I and the bars overlooking the square, where you can stop while visiting the village." },
    ],
  },
  "il-postino": {
    titolo: "Il Postino (The Postman)",
    sinossi:
      "Massimo Troisi's last, poetic film: the friendship between a humble postman and the poet Pablo Neruda, shot on the islands of Salina and Procida.",
    faq: [
      { domanda: "Where was Il Postino filmed?", risposta: "Across the Aeolian island of Salina (especially Pollara) and Procida, in the Gulf of Naples, with their almost untouched seascapes." },
      { domanda: "What to eat in Salina?", risposta: "Aeolian flavours: pane cunzato, Salina capers, malvasia wine and fish dishes in the trattorias overlooking the sea." },
    ],
  },
  "to-rome-with-love": {
    titolo: "To Rome with Love",
    sinossi:
      "Woody Allen's ensemble comedy set in Rome, among squares, alleys and restaurants of the Eternal City, in an ironic tribute to the capital.",
    faq: [
      { domanda: "Where was To Rome with Love filmed?", risposta: "In several Roman landmarks: Piazza Navona, the Capitoline Hill, Via Margutta and the streets of the historic centre." },
      { domanda: "Where to eat like in the film in Rome?", risposta: "In the cafés and trattorias of the historic centre, between Piazza Navona and the Pantheon, the heart of the film's Roman strolls." },
    ],
  },
  "house-of-gucci": {
    titolo: "House of Gucci",
    sinossi:
      "Ridley Scott's drama about the Gucci dynasty with Lady Gaga and Adam Driver, filmed between Milan, Lake Como and Rome, amid elegance and ambition.",
    faq: [
      { domanda: "Where was House of Gucci filmed in Italy?", risposta: "Between Milan (with its fashion and palaces), Lake Como and Rome, plus some Alpine locations." },
      { domanda: "Where to feel the film's atmosphere in Milan?", risposta: "In the elegant restaurants of the Brera district and the centre, the chic heart of the Milan portrayed in the film." },
    ],
  },
  "master-of-none": {
    sinossi:
      "The Netflix series created by Aziz Ansari and Alan Yang. Season 2 (2017) opens in Modena, where Dev learns the art of pasta and dines at Osteria Francescana, Massimo Bottura's three-Michelin-star restaurant.",
    faq: [
      { domanda: "Was Master of None really filmed in Modena?", risposta: "Yes: the start of season 2 (2017) was filmed entirely in Modena, where Dev moves to learn how to make fresh pasta." },
      { domanda: "What is the real restaurant that appears in the show?", risposta: "Osteria Francescana, chef Massimo Bottura's three-Michelin-star restaurant, voted the world's best restaurant in both 2016 and 2018." },
      { domanda: "Did Aziz Ansari really learn to make pasta for the role?", risposta: "Yes: the actor and co-creator actually moved to Modena for weeks, studying Italian and the art of hand-rolled pasta before filming." },
    ],
  },
  "succession": {
    sinossi:
      "The Emmy-winning HBO series about the Roy family. The wedding in the season 3 finale is filmed in Tuscany, between Villa La Foce and Villa Cetinale, in the Val d'Orcia.",
    faq: [
      { domanda: "Where was Succession filmed in Tuscany?", risposta: "In the Val d'Orcia: the Roy family stays at Villa La Foce, while the season 3 finale wedding is filmed at Villa Cetinale, near Siena." },
      { domanda: "Can you eat at one of Succession's real locations?", risposta: "Yes: Dopolavoro La Foce, the restaurant on the Villa La Foce estate, is open to the public near Pienza." },
    ],
  },
  "l-amica-geniale": {
    titolo: "My Brilliant Friend",
    sinossi:
      "The HBO/Rai series based on Elena Ferrante's novels, set in 1950s Naples. The neighbourhood is a built set, but many scenes are filmed in real locations across the city, including the historic Galleria Principe di Napoli.",
    faq: [
      { domanda: "Is My Brilliant Friend really filmed in Naples?", risposta: "Partly: the Rione Luzzatti where Lila and Elena live is actually a set built in Marcianise, near Caserta. Many other scenes, though, are shot in real Naples locations: the Galleria Principe di Napoli, the Caracciolo seafront, Piazza dei Martiri, the Teatro San Carlo." },
      { domanda: "What real venue appears in the show?", risposta: "Season 4 features ScottoJonno, a real café-bistrot inside the Galleria Principe di Napoli, reopened in 2023 in a 19th-century former café-chantant." },
    ],
  },
  "e-stata-la-mano-di-dio": {
    titolo: "The Hand of God",
    sinossi:
      "Paolo Sorrentino's Netflix film, Silver Lion winner in Venice and Oscar nominee, tells the story of his native Naples. Filmed in real city locations, including the Vomero district and Villa Giusso, on the Sorrentine Peninsula.",
    faq: [
      { domanda: "Was The Hand of God really filmed in Naples?", risposta: "Yes: among the real locations, the Schisa family home is filmed on Via San Domenico, in the Vomero district, one floor from Sorrentino's real childhood home. Piazza del Plebiscito and the Galleria Umberto I also appear." },
      { domanda: "Where was the family lunch scene filmed?", risposta: "At Villa Giusso, an agriturismo set in a 17th-century former monastery in Vico Equense, on the Sorrentine Peninsula, overlooking the Gulf of Naples." },
    ],
  },
};

interface RestEn {
  descrizione?: string;
  /** Descrizione della scena, per slug di film. */
  scena?: Record<string, string>;
}

export const restaurantsEn: Record<string, RestEn> = {
  "pizzeria-da-michele-napoli": {
    descrizione: "Founded in 1870 in the Forcella district, it is one of the most historic and famous pizzerias in Naples. An essential menu — marinara and margherita — baked in a wood-fired oven according to tradition. A simple, authentic setting, often with a queue outside.",
    scena: { "mangia-prega-ama": "It is the pizzeria where Liz (Julia Roberts) savours the famous Neapolitan margherita pizza, in one of the film's most iconic food scenes." },
  },
  "bar-vitelli-savoca": {
    descrizione: "Historic village bar overlooking the square of Savoca, famous for its granita and as one of the most visited Sicilian film locations.",
    scena: { "il-padrino": "In the village of Savoca, Michael Corleone asks the bar owner for the hand of his daughter Apollonia." },
  },
  "caffe-florian": {
    descrizione: "Opened in 1720 under the Procuratie Nuove, it is considered Italy's oldest café still in business. Frescoed rooms, live music and a view of St Mark's Basilica.",
    scena: { "il-talento-di-mr-ripley": "At the tables of the Florian, Tom Ripley meets Marge and Dickie's father: one of the film's best-known Venetian scenes." },
  },
  "trattoria-santa-lucia": {
    descrizione: "A trattoria a stone's throw from Piazza Navona, in Largo Febo. Traditional Roman cuisine: from Jewish-style artichokes to amatriciana and homemade pasta.",
    scena: { "mangia-prega-ama": "This is where Liz (Julia Roberts) orders and enjoys Roman dishes, in one of the film's most famous food scenes." },
  },
  "da-pancrazio": {
    descrizione: "A historic restaurant built above the remains of the ancient Theatre of Pompey: the lower rooms, among arches and Roman columns, are a real experience.",
    scena: { "mangia-prega-ama": "Among the Roman trattorias that form the backdrop of the film's Italian part, with the lead discovering local cuisine." },
  },
  "la-veranda-hotel-columbus": {
    descrizione: "A restaurant with Renaissance frescoes a short walk from the Vatican, inside Hotel Columbus in Borgo Santo Spirito. Elegant atmosphere and refined cuisine.",
    scena: { "la-grande-bellezza": "In the refined frescoed restaurant, Jep Gambardella dines with Ramona: one of the Roman scenes of the Oscar-winning film." },
  },
  "ristorante-le-gatte": {
    descrizione: "A seafood restaurant on the port of Castellabate, in the Cilento. Fresh fish dishes and sea views, among the locations of the blockbuster comedy.",
    scena: { "benvenuti-al-sud": "The restaurant is where the dinner among post-office colleagues is set, one of the film's funniest moments." },
  },
  "bar-la-piazzetta-castellabate": {
    descrizione: "A bar on the main square of Castellabate, a meeting point of the Cilento village made famous by 'Welcome to the South'. Perfect for a coffee with a sea view.",
    scena: { "benvenuti-al-sud": "The village's little square — the heart of town life in the film — where the bar overlooks the main square of Castellabate." },
  },
  "caffe-del-duomo-crema": {
    descrizione: "A café overlooking Crema's scenic Piazza del Duomo, an ideal stop along the tour of Guadagnino's film locations.",
    scena: { "chiamami-col-tuo-nome": "Piazza Duomo, the scenic heart of Crema, the film's real location: here Duomocafè is a real stop among the squares and arcades that form the backdrop to the characters' summer days." },
  },
  "cinema-bistrot-milano": {
    descrizione: "A Milanese cinema-themed bistro: vintage posters, soft lighting and a menu that plays with the great Italian films. An example of a 'themed' venue, not a real location.",
    scena: { "la-grande-bellezza": "THEMED venue (not a real location): the room pays homage to the baroque elegance and atmosphere of The Great Beauty." },
  },
  "cafe-de-paris-roma": {
    descrizione: "A historic café on Via Vittorio Veneto, opened in 1948, the real heart of the Roman 'dolce vita' that inspired Fellini's film. A symbol of glamorous 1960s Rome, it closed in 2008.",
    scena: { "la-dolce-vita": "The real worldly hangout on Via Veneto that inspired Fellini: here, in real late-1950s Rome, paparazzi photographed stars and the jet set — the very scene the director later recreated on a soundstage at Cinecittà for the film." },
  },
  "enzo-a-mare-punta-secca": {
    descrizione: "A seafood restaurant on the seafront of Punta Secca, the village with the famous house of Inspector Montalbano. Sea cuisine of the Ragusa tradition.",
    scena: { "il-commissario-montalbano": "A few steps from Montalbano's house in Punta Secca, on the seafront where the inspector loves to enjoy the fresh fish of the Ragusa coast." },
  },
  "bar-paradiso-palazzo-adriano": {
    descrizione: "A restaurant and pizzeria in Palazzo Adriano, the village-set of Tornatore's Oscar winner, a short walk from the scenic Piazza Umberto I. Ideal for a break between history and cinema.",
    scena: { "nuovo-cinema-paradiso": "In the village of Palazzo Adriano, where the scenic Piazza Umberto I was turned into the town of Giancaldo, heart of the Cinema Paradiso set: this historic hotel-restaurant is a real stop to eat in the same village as the film." },
  },
  "trattoria-dell-isola-salina": {
    descrizione: "A historic trattoria in the centre of Santa Marina Salina, the island of Il Postino: pane cunzato, capers, malvasia wine and fresh fish with a view over the Aeolian sea.",
    scena: { "il-postino": "In the historic centre of Santa Marina Salina, the island-set of Il Postino where Massimo Troisi gave life to the last, poetic role of his career: a real trattoria to taste the island's flavours." },
  },
  "caffe-di-piazza-navona": {
    descrizione: "A café overlooking the scenic Piazza Navona, among Bernini's fountains. One of Rome's finest open-air salons, dear to cinema.",
    scena: { "to-rome-with-love": "Among the tables of Piazza Navona, one of the squares featured in the Roman strolls of Woody Allen's comedy: Bar Navona is a real address for a stop here." },
  },
  "ristorante-brera-milano": {
    descrizione: "A historic restaurant since 1970 in the heart of Brera, Milan's bohemian-chic district. Signature Italian cuisine in an elegant setting, between art and fashion.",
    scena: { "house-of-gucci": "In the elegant, ambitious Milan portrayed by Ridley Scott, between the Brera district and the fashion salons of the Gucci dynasty: Nabucco, open since 1970, is a real address in the same district." },
  },
  "hosteria-giusti-modena": {
    descrizione: "A four-table osteria in the heart of Modena, carved out in 1989 from the former slaughterhouse behind the historic Giusti delicatessen, running since 1598: one of Europe's oldest food shops.",
    scena: { "master-of-none": "Among the real locations of Master of None season 2, set in Modena while Dev learns the art of fresh pasta." },
  },
  "dopolavoro-la-foce": {
    descrizione: "A restaurant on the historic Villa La Foce estate, in the Val d'Orcia: built in 1939 as a recreational club for the estate's workers, it now serves Tuscan cuisine grown in the villa's own gardens, minutes from Pienza and Montepulciano.",
    scena: { "succession": "The restaurant on the Villa La Foce estate, where the Roy family stays in season 3 of Succession, filmed in the Val d'Orcia." },
  },
  "scottojonno-napoli": {
    descrizione: "A café-bistrot inside the elegant Galleria Principe di Napoli, opposite the National Archaeological Museum. Born as a 19th-century café-chantant, reopened in 2023 by entrepreneur Luca Iannuzzi with cooking by chef Marco Ambrosino.",
    scena: { "l-amica-geniale": "In the historic Galleria Principe di Napoli, where ScottoJonno, a real café-bistrot reopened in 2023 in a 19th-century former café-chantant, appears in season 4 of the show." },
  },
  "villa-giusso-vico-equense": {
    descrizione: "An agriturismo set in a 17th-century former monastery on the hills above Vico Equense, on the Sorrentine Peninsula, overlooking the Gulf of Naples. Traditional Sorrentine cuisine using produce from the estate.",
    scena: { "e-stata-la-mano-di-dio": "In the 17th-century former monastery overlooking the Gulf of Naples, where Paolo Sorrentino filmed the family lunch scene." },
  },
};

/* -------- Helper: restituiscono la versione nella lingua richiesta -------- */
export function tFilmTitolo(film: Film, lang: Lang): string {
  return lang === "en" ? filmsEn[film.id]?.titolo ?? film.data.titolo : film.data.titolo;
}
export function tFilmSinossi(film: Film, lang: Lang): string {
  return lang === "en" ? filmsEn[film.id]?.sinossi ?? film.data.sinossi : film.data.sinossi;
}
export function tFilmFaq(film: Film, lang: Lang) {
  return lang === "en" ? filmsEn[film.id]?.faq ?? film.data.faq : film.data.faq;
}
export function tLocaleDesc(locale: Restaurant, lang: Lang): string {
  return lang === "en"
    ? restaurantsEn[locale.id]?.descrizione ?? locale.data.descrizione
    : locale.data.descrizione;
}
export function tScena(localeId: string, filmId: string, itText: string, lang: Lang): string {
  return lang === "en" ? restaurantsEn[localeId]?.scena?.[filmId] ?? itText : itText;
}
