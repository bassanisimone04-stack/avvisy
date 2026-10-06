/**
 * Contenuti generati dai dati reali per le pagine città (IT/EN):
 * paragrafo introduttivo, domande frequenti, città vicine.
 * Tutto deriva dalle schede: nessun testo inventato.
 */
import type { Lang } from "../i18n/ui";
import type { Restaurant, Film } from "./utils";
import { tipoLabel } from "./utils";
import { tFilmTitolo, tCitta } from "../i18n/content-en";

export interface StatCitta {
  totale: number;
  setReali: number;
  legati: number;
  aperti: number;
  chiusi: Restaurant[];
  tipi: { tipo: string; n: number }[];
  prezzi: string[];
}

export function statCitta(locali: Restaurant[]): StatCitta {
  const conta = new Map<string, number>();
  for (const l of locali) conta.set(l.data.tipo, (conta.get(l.data.tipo) ?? 0) + 1);
  return {
    totale: locali.length,
    setReali: locali.filter((l) => l.data.categoria === "set-reale").length,
    legati: locali.filter((l) => l.data.categoria !== "set-reale").length,
    aperti: locali.filter((l) => l.data.stato === "aperto").length,
    chiusi: locali.filter((l) => l.data.stato !== "aperto"),
    tipi: [...conta.entries()].map(([tipo, n]) => ({ tipo, n })).sort((a, b) => b.n - a.n),
    prezzi: [...new Set(locali.map((l) => l.data.prezzo))].sort((a, b) => a.length - b.length),
  };
}

/** Elenco leggibile: "A, B e C". */
function elenco(voci: string[], lang: Lang): string {
  if (voci.length === 0) return "";
  if (voci.length === 1) return voci[0];
  const e = lang === "en" ? "and" : "e";
  return `${voci.slice(0, -1).join(", ")} ${e} ${voci[voci.length - 1]}`;
}

/** Plurale del tipo di locale nelle due lingue (es. "ristorante" -> "ristoranti"). */
function tipoPlurale(tipo: string, n: number, lang: Lang): string {
  const et = tipoLabel(tipo, lang);
  if (n === 1) return et;
  if (lang === "en") return et === "pastry shop" ? "pastry shops" : et === "café" ? "cafés" : `${et}s`;
  const pl: Record<string, string> = {
    ristorante: "ristoranti", trattoria: "trattorie", pizzeria: "pizzerie",
    pasticceria: "pasticcerie", bar: "bar", "caffè": "caffè",
  };
  return pl[et] ?? et;
}

export function introCitta(citta: string, locali: Restaurant[], films: Film[], lang: Lang): string {
  const s = statCitta(locali);
  const city = tCitta(citta, lang);
  const uno = s.totale === 1;
  const tipi = elenco(s.tipi.map((t) => `${t.n} ${tipoPlurale(t.tipo, t.n, lang).toLowerCase()}`), lang);
  const titoli = elenco(films.slice(0, 4).map((f) => tFilmTitolo(f, lang)), lang);
  if (lang === "en") {
    const mix = s.setReali > 0 && s.legati > 0
      ? `${s.setReali} ${s.setReali === 1 ? "is a real filming location" : "are real filming locations"}, while ${s.legati} ${s.legati === 1 ? "is" : "are"} marked as film-related: a real venue that was not filmed in the movie`
      : s.setReali > 0
        ? `${uno ? "It is a real filming location" : `All ${s.setReali} are real filming locations`}`
        : `${uno ? "It is marked as film-related" : `All ${s.legati} are marked as film-related`}: a real venue that was not filmed in the movie`;
    return `${city} has ${s.totale} venue${uno ? "" : "s"} in this directory${tipi ? ` (${tipi})` : ""}, ${films.length === 1 ? `linked to ${titoli}` : `linked to ${films.length} films and shows${titoli ? ` such as ${titoli}` : ""}`}. ${mix}. Every address is checked against a source, and each page says exactly which scene it is linked to.`;
  }
  const mix = s.setReali > 0 && s.legati > 0
    ? `${s.setReali} ${s.setReali === 1 ? "è una location reale delle riprese" : "sono location reali delle riprese"}, mentre ${s.legati} ${s.legati === 1 ? "è segnalato" : "sono segnalati"} come "legato al film": un locale vero che nel film non è stato girato`
    : s.setReali > 0
      ? `${uno ? "È una location reale delle riprese" : `Sono tutti e ${s.setReali} location reali delle riprese`}`
      : `${uno ? "È segnalato" : `Sono tutti e ${s.legati} segnalati`} come "legato al film": un locale vero che nel film non è stato girato`;
  return `A ${city} ${uno ? "c'è 1 locale" : `abbiamo ${s.totale} locali`} in directory${tipi ? ` (${tipi})` : ""}, ${films.length === 1 ? `${uno ? "collegato" : "collegati"} a ${titoli}` : `${uno ? "collegato" : "collegati"} a ${films.length} film e serie${titoli ? ` come ${titoli}` : ""}`}. ${mix}. Ogni indirizzo è verificato con una fonte, e in ogni scheda diciamo a quale scena è collegato.`;
}

export function faqCitta(
  citta: string,
  locali: Restaurant[],
  films: Film[],
  lang: Lang
): { domanda: string; risposta: string }[] {
  const s = statCitta(locali);
  const city = tCitta(citta, lang);
  const nomi = elenco(locali.slice(0, 6).map((l) => l.data.nome), lang);
  const titoli = elenco(films.map((f) => tFilmTitolo(f, lang)), lang);
  const prezzi = s.prezzi.join(", ");
  const out: { domanda: string; risposta: string }[] = [];
  if (lang === "en") {
    out.push({
      domanda: `Which restaurants in ${city} appear in films?`,
      risposta: `${nomi}${locali.length > 6 ? ` and ${locali.length - 6} more` : ""}. Each one has its own page with the address, the film and the scene it is linked to.`,
    });
    out.push({
      domanda: `How many film venues are there in ${city}?`,
      risposta: `${s.totale}. ${s.setReali > 0 ? `Of these, ${s.setReali} ${s.setReali === 1 ? "is a real filming location" : "are real filming locations"}${s.legati ? ` and ${s.legati} ${s.legati === 1 ? "is" : "are"} film-related: a real venue that was not filmed in the movie` : ""}.` : `${s.legati === 1 ? "It is" : "They are all"} film-related: a real venue that was not filmed in the movie.`}`,
    });
    if (films.length) out.push({
      domanda: `Which films and shows were filmed in ${city}?`,
      risposta: `${titoli}. Each film has a page listing all the venues linked to it.`,
    });
    out.push({
      domanda: `Are the venues in ${city} still open?`,
      risposta: s.chiusi.length
        ? `${s.aperti} of ${s.totale} are open. ${elenco(s.chiusi.map((l) => l.data.nome), lang)} ${s.chiusi.length === 1 ? "is" : "are"} closed, but we keep ${s.chiusi.length === 1 ? "it" : "them"} listed for ${s.chiusi.length === 1 ? "its" : "their"} film history. Hours can change, so check the venue's website before you travel.`
        : `Yes, all ${s.totale} of them. Hours and availability can change, so check the venue's website before you travel.`,
    });
    out.push({
      domanda: `How much does it cost to eat at the film venues in ${city}?`,
      risposta: `The price bands range across ${prezzi}: from a coffee in a historic café to a Michelin-starred dinner. Each page shows the band for that venue.`,
    });
    out.push({
      domanda: `How do I plan a route around ${city}?`,
      risposta: `Open the map, filter by region and you'll see every venue with the films it is linked to. The PDF guide also has four ready-made itineraries.`,
    });
    return out;
  }
  out.push({
    domanda: `Quali ristoranti di ${city} si vedono nei film?`,
    risposta: `${nomi}${locali.length > 6 ? ` e altri ${locali.length - 6}` : ""}. Ognuno ha la sua scheda con l'indirizzo, il film e la scena a cui è collegato.`,
  });
  out.push({
    domanda: `Quanti locali del cinema ci sono a ${city}?`,
    risposta: `${s.totale}. ${s.setReali > 0 ? `Di questi, ${s.setReali} ${s.setReali === 1 ? "è una location reale delle riprese" : "sono location reali delle riprese"}${s.legati ? ` e ${s.legati} ${s.legati === 1 ? "è segnalato come legato al film" : "sono segnalati come legati al film"}, cioè locali veri che nel film non sono stati girati` : ""}.` : `${s.legati === 1 ? "È segnalato come legato al film" : "Sono tutti segnalati come legati al film"}: ${s.legati === 1 ? "un locale vero" : "locali veri"} che nel film non ${s.legati === 1 ? "è stato girato" : "sono stati girati"}.`}`,
  });
  if (films.length) out.push({
    domanda: `Quali film e serie sono stati girati a ${city}?`,
    risposta: `${titoli}. Ogni film ha una pagina con l'elenco dei locali collegati.`,
  });
  out.push({
    domanda: `I locali di ${city} sono ancora aperti?`,
    risposta: s.chiusi.length
      ? `${s.aperti} su ${s.totale} sono aperti. ${elenco(s.chiusi.map((l) => l.data.nome), lang)} ${s.chiusi.length === 1 ? "risulta chiuso" : "risultano chiusi"}, ma ${s.chiusi.length === 1 ? "lo teniamo" : "li teniamo"} in elenco per il valore cinematografico. Gli orari cambiano: controlla il sito del locale prima di partire.`
      : `Sì, tutti e ${s.totale}. Orari e disponibilità possono cambiare: controlla il sito del locale prima di partire.`,
  });
  out.push({
    domanda: `Quanto si spende nei locali dei film a ${city}?`,
    risposta: `Le fasce di prezzo vanno da ${prezzi}: si va dal caffè in un locale storico alla cena stellata. In ogni scheda trovi la fascia di quel locale.`,
  });
  out.push({
    domanda: `Come organizzo un giro a ${city}?`,
    risposta: `Apri la mappa, filtra per regione e vedrai tutti i locali con i film collegati. Nella guida PDF ci sono anche quattro itinerari pronti.`,
  });
  return out;
}
