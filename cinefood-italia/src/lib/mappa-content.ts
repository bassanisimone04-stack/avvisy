/** Testi e dati per la pagina mappa (IT/EN): statistiche, regioni, FAQ. */
import type { Lang } from "../i18n/ui";
import type { Restaurant } from "./utils";
import { filmIdsDiLocale } from "./utils";

export const REGIONE_EN: Record<string, string> = {
  Lombardia: "Lombardy", Toscana: "Tuscany", Sicilia: "Sicily", Sardegna: "Sardinia",
  Piemonte: "Piedmont", "Valle d'Aosta": "Aosta Valley",
};
export function tRegione(r: string, lang: Lang): string {
  return lang === "en" ? (REGIONE_EN[r] ?? r) : r;
}

export function statistiche(locali: Restaurant[]) {
  const film = new Set(locali.flatMap(filmIdsDiLocale));
  return {
    locali: locali.length,
    citta: new Set(locali.map((l) => l.data.citta)).size,
    regioni: new Set(locali.map((l) => l.data.regione)).size,
    film: film.size,
    aperti: locali.filter((l) => l.data.stato === "aperto").length,
    chiusi: locali.filter((l) => l.data.stato !== "aperto").length,
  };
}

export function faqMappa(lang: Lang, s: ReturnType<typeof statistiche>) {
  if (lang === "en") {
    return [
      { domanda: "How do I use the venue map?", risposta: "Zoom and drag the map, then click a marker to see the venue's name, city, type and the films it is linked to. \"Discover more\" opens the full venue page. Use the filters above the map to narrow down by category, region or open venues only." },
      { domanda: "How many venues are on the map?", risposta: `The map shows ${s.locali} venues in ${s.citta} cities across ${s.regioni} regions, linked to ${s.film} films and TV shows. It updates automatically every time we add a venue.` },
      { domanda: "What is the difference between \"Real location\" and \"Film-related\"?", risposta: "\"Real location\" means the scene was actually shot there. \"Film-related\" means a real venue that was not filmed in the movie (for example near the set, or tied to the phenomenon the film portrays). We always say so on the venue page." },
      { domanda: "Are the markers exact?", risposta: "For some venues the marker position is approximate. Before you travel, always check the written address on the venue page, and the opening hours." },
      { domanda: "Are there closed venues on the map?", risposta: "Yes: a few historic venues that have closed stay published with a \"closed\" status because of their film history. Tick \"Open venues only\" to hide them." },
      { domanda: "Do I need to book?", risposta: "It's advisable, especially for small venues and starred restaurants. Check the venue's official website for hours and availability, which can change." },
      { domanda: "How can I plan a trip following the films?", risposta: "Pick a city page to see all its film venues together, read the blog itineraries, or download the PDF guide with four ready-made itineraries." },
      { domanda: "How do I report a missing venue or a mistake?", risposta: "Use the \"Add a venue\" page. We only publish venues with a verifiable source linking them to a real film or TV show." },
    ];
  }
  return [
    { domanda: "Come si usa la mappa dei locali?", risposta: "Ingrandisci e trascina la mappa, poi clicca un segnaposto per vedere nome, città, tipo di locale e i film collegati. \"Scopri di più\" apre la scheda completa. Con i filtri sopra la mappa puoi scegliere categoria, regione o solo i locali aperti." },
    { domanda: "Quanti locali ci sono sulla mappa?", risposta: `La mappa mostra ${s.locali} locali in ${s.citta} città di ${s.regioni} regioni, collegati a ${s.film} film e serie TV. Si aggiorna da sola ogni volta che aggiungiamo un locale.` },
    { domanda: "Che differenza c'è tra \"Location reale\" e \"Legato al film\"?", risposta: "\"Location reale\" significa che la scena è stata girata davvero lì. \"Legato al film\" indica un locale reale che non è stato girato nel film (per esempio vicino al set o legato al fenomeno raccontato). Lo dichiariamo sempre nella scheda." },
    { domanda: "I segnaposto sono precisi?", risposta: "Per alcuni locali la posizione del segnaposto è approssimativa. Prima di partire controlla sempre l'indirizzo scritto nella scheda e gli orari di apertura." },
    { domanda: "Sulla mappa ci sono locali chiusi?", risposta: "Sì: alcuni locali storici ormai chiusi restano pubblicati con lo stato \"chiuso\" per il loro valore cinematografico. Spunta \"Solo locali aperti\" per nasconderli." },
    { domanda: "Serve prenotare?", risposta: "È consigliato, soprattutto per i locali piccoli e per i ristoranti stellati. Controlla il sito ufficiale del locale per orari e disponibilità, che possono cambiare." },
    { domanda: "Come organizzo un viaggio seguendo i film?", risposta: "Scegli la pagina di una città per vedere insieme tutti i suoi locali del cinema, leggi gli itinerari del blog oppure scarica la guida PDF con quattro itinerari pronti." },
    { domanda: "Come segnalo un locale che manca o un errore?", risposta: "Usa la pagina \"Aggiungi locale\". Pubblichiamo solo locali con una fonte verificabile che li colleghi a un film o a una serie TV reali." },
  ];
}
