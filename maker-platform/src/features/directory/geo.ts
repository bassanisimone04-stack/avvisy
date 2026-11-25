/** Great-circle distance in miles (haversine). */
export function distanceMiles(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 3958.8;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

export interface Bounds {
  west: number;
  south: number;
  east: number;
  north: number;
}

export function inBounds(p: { lat: number; lng: number }, b: Bounds): boolean {
  return p.lng >= b.west && p.lng <= b.east && p.lat >= b.south && p.lat <= b.north;
}

export interface ResolvedPlace {
  label: string;
  lat: number;
  lng: number;
}

/**
 * DEMO GEOCODER — a fixed lookup table, not a real geocoding service.
 * It only knows the four demo metros and a few ZIP codes. Phase 3 replaces it
 * with a licensed geocoding provider (docs/DATA_SOURCES.md).
 */
const demoPlaces: (ResolvedPlace & { keys: string[] })[] = [
  { label: "Austin, TX", lat: 30.2672, lng: -97.7431, keys: ["austin", "austin tx", "austin, tx", "tx", "texas", "787"] },
  { label: "Portland, OR", lat: 45.5152, lng: -122.6784, keys: ["portland", "portland or", "portland, or", "or", "oregon", "972"] },
  { label: "Brooklyn, NY", lat: 40.6782, lng: -73.9442, keys: ["brooklyn", "brooklyn ny", "brooklyn, ny", "new york", "nyc", "ny", "112"] },
  { label: "Denver, CO", lat: 39.7392, lng: -104.9903, keys: ["denver", "denver co", "denver, co", "co", "colorado", "802"] },
];

export const demoPlaceLabels = demoPlaces.map((p) => p.label);

export function resolveDemoPlace(input: string | undefined | null): ResolvedPlace | null {
  if (!input) return null;
  const q = input.trim().toLowerCase();
  if (!q) return null;
  if (/^\d{5}$/.test(q)) {
    const hit = demoPlaces.find((p) => p.keys.some((k) => /^\d{3}$/.test(k) && q.startsWith(k)));
    return hit ? { label: `${q} (${hit.label})`, lat: hit.lat, lng: hit.lng } : null;
  }
  const hit = demoPlaces.find((p) => p.keys.includes(q) || p.label.toLowerCase().startsWith(q));
  return hit ? { label: hit.label, lat: hit.lat, lng: hit.lng } : null;
}
