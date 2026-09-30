export const REGIONI = [
  "Abruzzo",
  "Basilicata",
  "Calabria",
  "Campania",
  "Emilia-Romagna",
  "Friuli-Venezia Giulia",
  "Lazio",
  "Liguria",
  "Lombardia",
  "Marche",
  "Molise",
  "Piemonte",
  "Puglia",
  "Sardegna",
  "Sicilia",
  "Toscana",
  "Trentino-Alto Adige",
  "Umbria",
  "Valle d'Aosta",
  "Veneto",
] as const;

export type Regione = (typeof REGIONI)[number];

export function isRegione(s: string): s is Regione {
  return (REGIONI as readonly string[]).includes(s);
}

export const TIPOLOGIE = ["Monolocale", "Bilocale", "Trilocale", "Quadrilocale", "Appartamento", "Attico", "Villetta", "Stanza singola", "Stanza doppia"] as const;

export const CONTRATTI = ["4+4 libero", "3+2 concordato", "Transitorio", "Studenti universitari", "Uso foresteria"] as const;

// Capoluoghi usati dal geocoder "mock" (solo sviluppo/test, senza rete).
export const MOCK_COMUNI: Record<string, { regione: Regione; lat: number; lon: number }> = {
  milano: { regione: "Lombardia", lat: 45.4642, lon: 9.19 },
  roma: { regione: "Lazio", lat: 41.9028, lon: 12.4964 },
  napoli: { regione: "Campania", lat: 40.8518, lon: 14.2681 },
  torino: { regione: "Piemonte", lat: 45.0703, lon: 7.6869 },
  bologna: { regione: "Emilia-Romagna", lat: 44.4949, lon: 11.3426 },
  firenze: { regione: "Toscana", lat: 43.7696, lon: 11.2558 },
  palermo: { regione: "Sicilia", lat: 38.1157, lon: 13.3615 },
  bari: { regione: "Puglia", lat: 41.1171, lon: 16.8719 },
  genova: { regione: "Liguria", lat: 44.4056, lon: 8.9463 },
  venezia: { regione: "Veneto", lat: 45.4408, lon: 12.3155 },
  verona: { regione: "Veneto", lat: 45.4384, lon: 10.9916 },
  padova: { regione: "Veneto", lat: 45.4064, lon: 11.8768 },
  trieste: { regione: "Friuli-Venezia Giulia", lat: 45.6495, lon: 13.7768 },
  cagliari: { regione: "Sardegna", lat: 39.2238, lon: 9.1217 },
  catania: { regione: "Sicilia", lat: 37.5079, lon: 15.083 },
  perugia: { regione: "Umbria", lat: 43.1107, lon: 12.3908 },
  ancona: { regione: "Marche", lat: 43.6158, lon: 13.5189 },
  pescara: { regione: "Abruzzo", lat: 42.4618, lon: 14.2161 },
  potenza: { regione: "Basilicata", lat: 40.6401, lon: 15.8056 },
  catanzaro: { regione: "Calabria", lat: 38.9098, lon: 16.5877 },
  campobasso: { regione: "Molise", lat: 41.5603, lon: 14.6627 },
  trento: { regione: "Trentino-Alto Adige", lat: 46.0748, lon: 11.1217 },
  bolzano: { regione: "Trentino-Alto Adige", lat: 46.4983, lon: 11.3548 },
  aosta: { regione: "Valle d'Aosta", lat: 45.7376, lon: 7.3172 },
  pisa: { regione: "Toscana", lat: 43.7228, lon: 10.4017 },
  bergamo: { regione: "Lombardia", lat: 45.6983, lon: 9.6773 },
};
