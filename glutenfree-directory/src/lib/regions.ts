import type { RegionData } from "./types";

export const REGIONS: RegionData[] = [
  {
    name: "Lombardia",
    slug: "lombardia",
    provinces: [
      { name: "Milano", code: "MI", slug: "milano", comuni: ["Milano", "Monza", "Sesto San Giovanni"] },
      { name: "Bergamo", code: "BG", slug: "bergamo", comuni: ["Bergamo", "Treviglio"] },
      { name: "Brescia", code: "BS", slug: "brescia", comuni: ["Brescia", "Desenzano del Garda"] },
    ],
  },
  {
    name: "Lazio",
    slug: "lazio",
    provinces: [
      { name: "Roma", code: "RM", slug: "roma", comuni: ["Roma", "Tivoli", "Ostia"] },
      { name: "Latina", code: "LT", slug: "latina", comuni: ["Latina", "Sabaudia"] },
    ],
  },
  {
    name: "Campania",
    slug: "campania",
    provinces: [
      { name: "Napoli", code: "NA", slug: "napoli", comuni: ["Napoli", "Pozzuoli", "Sorrento"] },
      { name: "Salerno", code: "SA", slug: "salerno", comuni: ["Salerno", "Amalfi"] },
    ],
  },
  {
    name: "Toscana",
    slug: "toscana",
    provinces: [
      { name: "Firenze", code: "FI", slug: "firenze", comuni: ["Firenze", "Fiesole"] },
      { name: "Pisa", code: "PI", slug: "pisa", comuni: ["Pisa", "San Miniato"] },
      { name: "Siena", code: "SI", slug: "siena", comuni: ["Siena", "Montepulciano"] },
    ],
  },
  {
    name: "Sicilia",
    slug: "sicilia",
    provinces: [
      { name: "Palermo", code: "PA", slug: "palermo", comuni: ["Palermo", "Cefalù"] },
      { name: "Catania", code: "CT", slug: "catania", comuni: ["Catania", "Taormina"] },
    ],
  },
  {
    name: "Veneto",
    slug: "veneto",
    provinces: [
      { name: "Venezia", code: "VE", slug: "venezia", comuni: ["Venezia", "Mestre"] },
      { name: "Verona", code: "VR", slug: "verona", comuni: ["Verona", "Soave"] },
      { name: "Padova", code: "PD", slug: "padova", comuni: ["Padova", "Abano Terme"] },
    ],
  },
  {
    name: "Emilia-Romagna",
    slug: "emilia-romagna",
    provinces: [
      { name: "Bologna", code: "BO", slug: "bologna", comuni: ["Bologna", "Imola"] },
      { name: "Rimini", code: "RN", slug: "rimini", comuni: ["Rimini", "Riccione"] },
    ],
  },
  {
    name: "Piemonte",
    slug: "piemonte",
    provinces: [
      { name: "Torino", code: "TO", slug: "torino", comuni: ["Torino", "Moncalieri"] },
    ],
  },
  {
    name: "Puglia",
    slug: "puglia",
    provinces: [
      { name: "Bari", code: "BA", slug: "bari", comuni: ["Bari", "Modugno"] },
      { name: "Lecce", code: "LE", slug: "lecce", comuni: ["Lecce", "Otranto"] },
    ],
  },
];

export function allComuni() {
  return REGIONS.flatMap((r) => r.provinces.flatMap((p) => p.comuni));
}

export function findRegionBySlug(slug: string) {
  return REGIONS.find((r) => r.slug === slug);
}
