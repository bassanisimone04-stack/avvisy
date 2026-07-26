import { BUSINESSES } from "./mock-businesses";
import type { Business, Category, PriceRange } from "./types";

export interface DirectoryFilters {
  q?: string;
  regione?: string;
  provincia?: string;
  comune?: string;
  categoria?: Category;
  prezzo?: PriceRange[];
  valutazione?: number;
  apertoOra?: boolean;
  consegna?: boolean;
  takeaway?: boolean;
  certificato?: boolean;
  ordina?: "rating" | "recenti" | "nome";
}

export function parseFilters(sp: Record<string, string | string[] | undefined>): DirectoryFilters {
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const prezzoRaw = one(sp.prezzo);
  return {
    q: one(sp.q),
    regione: one(sp.regione),
    provincia: one(sp.provincia),
    comune: one(sp.comune),
    categoria: one(sp.categoria) as Category | undefined,
    prezzo: prezzoRaw ? (prezzoRaw.split(",") as PriceRange[]) : undefined,
    valutazione: one(sp.valutazione) ? Number(one(sp.valutazione)) : undefined,
    apertoOra: one(sp.apertoOra) === "1",
    consegna: one(sp.consegna) === "1",
    takeaway: one(sp.takeaway) === "1",
    certificato: one(sp.certificato) === "1",
    ordina: (one(sp.ordina) as DirectoryFilters["ordina"]) ?? undefined,
  };
}

export function filterBusinesses(filters: DirectoryFilters): Business[] {
  let list = BUSINESSES.filter((b) => {
    if (filters.q) {
      const q = filters.q.toLowerCase();
      if (!b.name.toLowerCase().includes(q) && !b.city.toLowerCase().includes(q) && !b.description.toLowerCase().includes(q)) return false;
    }
    if (filters.regione && b.region.toLowerCase() !== filters.regione.replace(/-/g, " ")) {
      if (b.region.toLowerCase().replace(/\s+/g, "-") !== filters.regione) return false;
    }
    if (filters.provincia && b.province.toLowerCase().replace(/\s+/g, "-") !== filters.provincia) return false;
    if (filters.comune && b.city.toLowerCase() !== filters.comune.toLowerCase()) return false;
    if (filters.categoria && b.category !== filters.categoria) return false;
    if (filters.prezzo && filters.prezzo.length > 0 && !filters.prezzo.includes(b.priceRange)) return false;
    if (filters.valutazione && b.rating < filters.valutazione) return false;
    if (filters.apertoOra && !b.openNow) return false;
    if (filters.consegna && !b.delivery) return false;
    if (filters.takeaway && !b.takeaway) return false;
    if (filters.certificato && !b.aicCertified) return false;
    return true;
  });

  if (filters.ordina === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
  else if (filters.ordina === "recenti") list = [...list].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  else if (filters.ordina === "nome") list = [...list].sort((a, b) => a.name.localeCompare(b.name));

  return list;
}
