import type { Business } from "./types";

/** Minuscolo, senza accenti né punteggiatura: "Città" e "citta" si equivalgono. */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Testo su cui si cerca, calcolato una sola volta per locale. */
export function searchHaystack(b: Business): string {
  return normalize(`${b.name} ${b.city} ${b.provinceCode} ${b.region} ${b.address} ${b.category}`);
}

/**
 * Ogni parola digitata deve comparire da qualche parte (ordine libero):
 * "pizz roma" trova le pizzerie di Roma già mentre si scrive.
 */
export function matchesQuery(haystack: string, query: string): boolean {
  const tokens = normalize(query).split(" ").filter(Boolean);
  return tokens.every((t) => haystack.includes(t));
}

/** Distanza in km tra due coordinate (formula di haversine). */
export function distanceKm(a: [number, number], b: [number, number]): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
