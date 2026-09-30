import { db } from "./db";
import { normalizeCivico, normalizeComune, normalizeVia, stripAccents } from "./address";
import { MOCK_COMUNI } from "./italy";

export type GeocodeInput = { via: string; civico: string; comune: string; cap?: string };

export type GeocodeResult =
  | {
      ok: true;
      lat: number;
      lon: number;
      /** exact = trovato il numero civico; approx = trovata solo la via */
      precision: "exact" | "approx";
      cap?: string;
      quartiere?: string;
      displayName: string;
    }
  | { ok: false; error: string };

type NominatimItem = {
  lat: string;
  lon: string;
  display_name: string;
  address?: Record<string, string>;
};

let lastNominatimCall = 0;

async function nominatim(input: GeocodeInput): Promise<GeocodeResult> {
  const base = process.env.NOMINATIM_URL ?? "https://nominatim.openstreetmap.org";
  const params = new URLSearchParams({
    street: `${input.civico} ${input.via}`,
    city: input.comune,
    country: "Italia",
    countrycodes: "it",
    format: "jsonv2",
    addressdetails: "1",
    limit: "3",
    "accept-language": "it",
  });
  if (input.cap) params.set("postalcode", input.cap);

  // Policy Nominatim: massimo 1 richiesta al secondo.
  const wait = lastNominatimCall + 1100 - Date.now();
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastNominatimCall = Date.now();

  let items: NominatimItem[];
  try {
    const res = await fetch(`${base}/search?${params}`, {
      headers: { "User-Agent": process.env.NOMINATIM_USER_AGENT ?? "TrovaImmobile/0.1" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return { ok: false, error: `Servizio di geocoding non disponibile (HTTP ${res.status}). Riprova tra poco.` };
    items = (await res.json()) as NominatimItem[];
  } catch {
    return { ok: false, error: "Servizio di geocoding non raggiungibile. Riprova tra poco." };
  }

  const wantedComune = normalizeComune(input.comune);
  const wantedCivico = normalizeCivico(input.civico);
  const inComune = items.filter((it) => {
    const a = it.address ?? {};
    const place = a.city ?? a.town ?? a.village ?? a.municipality ?? "";
    return normalizeComune(place) === wantedComune;
  });
  const best = inComune[0];
  if (!best) {
    return { ok: false, error: `Indirizzo non trovato nel comune di ${input.comune}. Controlla via, civico e comune.` };
  }
  const a = best.address ?? {};
  const exact = !!a.house_number && normalizeCivico(a.house_number) === wantedCivico;
  return {
    ok: true,
    lat: Number(best.lat),
    lon: Number(best.lon),
    precision: exact ? "exact" : "approx",
    cap: a.postcode,
    quartiere: a.suburb ?? a.quarter ?? a.neighbourhood ?? a.city_district,
    displayName: best.display_name,
  };
}

/** Geocoder offline deterministico: SOLO per sviluppo/test senza rete. */
function mock(input: GeocodeInput): GeocodeResult {
  const c = MOCK_COMUNI[stripAccents(input.comune).toLowerCase().trim()];
  if (!c) return { ok: false, error: `Comune "${input.comune}" non presente nel geocoder di prova.` };
  let h = 0;
  for (const ch of normalizeVia(input.via) + normalizeCivico(input.civico)) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const dLat = ((h % 1000) / 1000 - 0.5) * 0.03;
  const dLon = (((h >>> 10) % 1000) / 1000 - 0.5) * 0.04;
  return {
    ok: true,
    lat: +(c.lat + dLat).toFixed(6),
    lon: +(c.lon + dLon).toFixed(6),
    precision: "approx",
    displayName: `${input.via} ${input.civico}, ${input.comune} (posizione simulata)`,
  };
}

export async function geocode(input: GeocodeInput): Promise<GeocodeResult> {
  const provider = process.env.GEOCODER ?? "nominatim";
  const key = [provider, normalizeComune(input.comune), normalizeVia(input.via), normalizeCivico(input.civico), input.cap ?? ""].join("|");
  const cached = db().prepare("SELECT result FROM geocode_cache WHERE query = ?").get(key) as { result: string } | undefined;
  if (cached) return JSON.parse(cached.result) as GeocodeResult;

  const result = provider === "mock" ? mock(input) : await nominatim(input);
  // Si mettono in cache solo i risultati positivi: un errore di rete non deve restare "appiccicato".
  if (result.ok) db().prepare("INSERT OR REPLACE INTO geocode_cache (query, result) VALUES (?, ?)").run(key, JSON.stringify(result));
  return result;
}
