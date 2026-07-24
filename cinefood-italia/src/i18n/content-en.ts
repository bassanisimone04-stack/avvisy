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
};

interface RestEn {
  descrizione?: string;
  /** Descrizione della scena, per slug di film. */
  scena?: Record<string, string>;
}

export const restaurantsEn: Record<string, RestEn> = {
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
  "trattoria-del-biscione": {
    descrizione: "A genuine Roman trattoria in the heart of the historic centre, between Campo de' Fiori and the Theatre of Pompey. Traditional cuisine: cacio e pepe, oxtail stew, macaroni.",
    scena: { "un-americano-a-roma": "The working-class atmosphere of Nando Mericoni's Rome, among macaroni and dishes of the local tradition made famous by the film." },
  },
  "caffe-del-duomo-crema": {
    descrizione: "A café overlooking Crema's scenic Piazza del Duomo, an ideal stop along the tour of Guadagnino's film locations.",
    scena: { "chiamami-col-tuo-nome": "The squares and arcades of Crema, the film's scenic heart, form the backdrop to the characters' summer days." },
  },
  "cinema-bistrot-milano": {
    descrizione: "A Milanese cinema-themed bistro: vintage posters, soft lighting and a menu that plays with the great Italian films. An example of a 'themed' venue, not a real location.",
    scena: { "la-grande-bellezza": "THEMED venue (not a real location): the room pays homage to the baroque elegance and atmosphere of The Great Beauty." },
  },
  "cafe-de-paris-roma": {
    descrizione: "A historic café on Via Vittorio Veneto, opened in 1948 and made famous by Fellini's 'La Dolce Vita'. A symbol of glamorous 1960s Rome, it closed in 2008.",
    scena: { "la-dolce-vita": "On Via Veneto, the worldly heart of Fellini's 'dolce vita', the Café de Paris was immortalised by Fellini in 1960, amid stars, paparazzi and the jet set." },
  },
  "enzo-a-mare-punta-secca": {
    descrizione: "A seafood restaurant on the seafront of Punta Secca, the village with the famous house of Inspector Montalbano. Sea cuisine of the Ragusa tradition.",
    scena: { "il-commissario-montalbano": "A few steps from Montalbano's house in Punta Secca, on the seafront where the inspector loves to enjoy the fresh fish of the Ragusa coast." },
  },
  "bar-paradiso-palazzo-adriano": {
    descrizione: "A bar overlooking the beautiful Piazza Umberto I of Palazzo Adriano, the village-set of Tornatore's Oscar winner. Ideal for a break between history and cinema.",
    scena: { "nuovo-cinema-paradiso": "On the scenic Piazza Umberto I, turned into the town of Giancaldo, heart of the Cinema Paradiso set." },
  },
  "trattoria-dell-isola-salina": {
    descrizione: "An Aeolian trattoria in Salina, the island of Il Postino: pane cunzato, capers, malvasia wine and fresh fish with a view over the Aeolian sea.",
    scena: { "il-postino": "Among the landscapes of Salina, the island-set of Il Postino, where Massimo Troisi gave life to the last, poetic role of his career." },
  },
  "caffe-di-piazza-navona": {
    descrizione: "A café overlooking the scenic Piazza Navona, among Bernini's fountains. One of Rome's finest open-air salons, dear to cinema.",
    scena: { "to-rome-with-love": "Among the tables of Piazza Navona, one of the squares featured in the Roman strolls of Woody Allen's comedy." },
  },
  "ristorante-brera-milano": {
    descrizione: "A refined restaurant in the heart of Brera, Milan's bohemian-chic district. Signature Italian cuisine in an elegant setting, between art and fashion.",
    scena: { "house-of-gucci": "In the elegant, ambitious Milan portrayed by Ridley Scott, between the Brera district and the fashion salons of the Gucci dynasty." },
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
