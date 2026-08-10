export interface FonteNews {
  id: string;
  nome: string;
  /** Feed RSS/Atom interrogato dal server */
  feed: string;
  /** Pagina da aprire a mano quando il feed non risponde */
  sito: string;
  categoria: "fantacalcio" | "sportiva" | "mercato";
  descrizione: string;
}

/**
 * Le testate interrogate dalla rassegna stampa. I feed sono pubblici e la
 * richiesta parte dal server, così il browser non incontra problemi di CORS.
 * Se una fonte cambia indirizzo o smette di esporre l'RSS la pagina continua a
 * funzionare: il feed rotto viene segnalato e resta il link al sito.
 */
export const FONTI: FonteNews[] = [
  {
    id: "fantacalcioit",
    nome: "Fantacalcio.it",
    feed: "https://www.fantacalcio.it/rss",
    sito: "https://www.fantacalcio.it/",
    categoria: "fantacalcio",
    descrizione:
      "Il sito di riferimento: listone ufficiale, quotazioni, probabili formazioni e voti.",
  },
  {
    id: "sosfanta",
    nome: "SOS Fanta",
    feed: "https://www.sosfanta.com/feed/",
    sito: "https://www.sosfanta.com/",
    categoria: "fantacalcio",
    descrizione: "Guida all'asta divisa per fasce, consigli su chi prendere e chi evitare.",
  },
  {
    id: "fantamaster",
    nome: "FantaMaster",
    feed: "https://www.fantamaster.it/feed/",
    sito: "https://www.fantamaster.it/",
    categoria: "fantacalcio",
    descrizione: "Rigoristi aggiornati in tempo reale, probabili formazioni e bug del listone.",
  },
  {
    id: "calciodangolo",
    nome: "Calcio d'Angolo",
    feed: "https://calciodangolo.com/feed/",
    sito: "https://calciodangolo.com/",
    categoria: "fantacalcio",
    descrizione: "Analisi tattiche applicate al fantacalcio e occasioni nascoste nel listone.",
  },
  {
    id: "pazzidifanta",
    nome: "Pazzi di Fanta",
    feed: "https://www.pazzidifanta.com/feed/",
    sito: "https://www.pazzidifanta.com/",
    categoria: "fantacalcio",
    descrizione: "Formazioni tipo squadra per squadra e novità sui ruoli Classic e Mantra.",
  },
  {
    id: "tuttofantacalcio",
    nome: "TuttoFantacalcio",
    feed: "https://www.tuttofantacalcio.it/rss",
    sito: "https://www.tuttofantacalcio.it/",
    categoria: "fantacalcio",
    descrizione: "Voti, statistiche storiche e approfondimenti sui rigoristi.",
  },
  {
    id: "gazzetta",
    nome: "Gazzetta dello Sport",
    feed: "https://www.gazzetta.it/rss/calcio.xml",
    sito: "https://www.gazzetta.it/Calcio/",
    categoria: "sportiva",
    descrizione: "Cronaca e retroscena di Serie A: infortuni e gerarchie prima dell'asta.",
  },
  {
    id: "corrieredellosport",
    nome: "Corriere dello Sport",
    feed: "https://www.corrieredellosport.it/rss/calcio",
    sito: "https://www.corrieredellosport.it/calcio",
    categoria: "sportiva",
    descrizione: "Notizie di campo e formazioni, utili per capire chi gioca davvero.",
  },
  {
    id: "tmw",
    nome: "TuttoMercatoWeb",
    feed: "https://www.tuttomercatoweb.com/rss",
    sito: "https://www.tuttomercatoweb.com/",
    categoria: "mercato",
    descrizione: "Mercato h24: un trasferimento dell'ultimo giorno può ribaltare un'asta.",
  },
  {
    id: "calciomercato",
    nome: "Calciomercato.com",
    feed: "https://www.calciomercato.com/rss",
    sito: "https://www.calciomercato.com/competizione/serie-a",
    categoria: "mercato",
    descrizione: "Arrivi e partenze ufficiali delle 20 squadre di Serie A.",
  },
];

export const ETICHETTE_CATEGORIA: Record<FonteNews["categoria"], string> = {
  fantacalcio: "Fantacalcio",
  sportiva: "Testata sportiva",
  mercato: "Calciomercato",
};
