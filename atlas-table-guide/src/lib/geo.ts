const R = 6371e3;
const rad = (d: number) => (d * Math.PI) / 180;

/** Great-circle distance in metres. */
export function haversine(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

export type BBox = [west: number, south: number, east: number, north: number];

export function inBBox(p: { lat: number; lng: number }, b: BBox): boolean {
  const [w, s, e, n] = b;
  const inLng = w <= e ? p.lng >= w && p.lng <= e : p.lng >= w || p.lng <= e;
  return inLng && p.lat >= s && p.lat <= n;
}

export function formatDistance(m: number, units: "metric" | "imperial" = "metric"): string {
  if (units === "imperial") {
    const mi = m / 1609.344;
    return mi < 0.2 ? `${Math.round(m * 3.28084)} ft` : `${mi.toFixed(mi < 10 ? 1 : 0)} mi`;
  }
  return m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(m < 10000 ? 1 : 0)} km`;
}
