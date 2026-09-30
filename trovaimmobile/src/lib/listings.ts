import { db, nowIso } from "./db";
import { addressKey, buildingKey, prettyCivico, prettyVia } from "./address";
import { freshnessRankSql } from "./freshness";

export type AdvertiserRole = "private" | "agency";

export type ListingRow = {
  id: number;
  property_id: number;
  advertiser_id: number;
  title: string;
  description: string;
  status: "active" | "closed";
  canone: number;
  spese: number;
  cauzione: number;
  commissione: number;
  contratto: string;
  arredato: number;
  disponibile_dal: string | null;
  confirmed_at: string;
  created_at: string;
  closed_at: string | null;
  closed_reason: string | null;
  // immobile
  regione: string;
  comune: string;
  quartiere: string | null;
  via: string;
  civico: string;
  interno: string | null;
  lat: number;
  lon: number;
  geo_precision: "exact" | "approx";
  tipologia: string;
  mq: number;
  locali: number;
  bagni: number;
  piano: string | null;
  // inserzionista
  advertiser_name: string;
  advertiser_role: AdvertiserRole;
  agency_name: string | null;
  cover: string | null;
  entry_cost: number;
};

const SELECT = `
  SELECT l.*, p.regione, p.comune, p.quartiere, p.via, p.civico, p.interno, p.lat, p.lon, p.geo_precision,
         p.tipologia, p.mq, p.locali, p.bagni, p.piano,
         u.name AS advertiser_name, u.role AS advertiser_role, u.agency_name,
         (SELECT storage_key FROM listing_photos ph WHERE ph.listing_id = l.id ORDER BY position LIMIT 1) AS cover,
         (l.canone + l.spese + l.cauzione + l.commissione) AS entry_cost
    FROM listings l
    JOIN properties p ON p.id = l.property_id
    JOIN users u ON u.id = l.advertiser_id`;

export type SearchFilters = {
  regione?: string;
  comune?: string;
  quartiere?: string;
  tipologia?: string;
  maxCanone?: number;
  maxIngresso?: number;
  inserzionista?: "private" | "agency";
  soloConfermati?: boolean;
  sort?: "rilevanza" | "ingresso" | "canone" | "recenti";
  page?: number;
};

export const PAGE_SIZE = 12;

export function searchListings(f: SearchFilters): { rows: ListingRow[]; total: number } {
  const where = ["l.status = 'active'"];
  const args: (string | number)[] = [];
  if (f.regione) (where.push("p.regione = ?"), args.push(f.regione));
  if (f.comune) (where.push("p.comune = ? COLLATE NOCASE"), args.push(f.comune));
  if (f.quartiere) (where.push("p.quartiere = ? COLLATE NOCASE"), args.push(f.quartiere));
  if (f.tipologia) (where.push("p.tipologia = ?"), args.push(f.tipologia));
  if (f.maxCanone) (where.push("l.canone <= ?"), args.push(f.maxCanone));
  if (f.maxIngresso) (where.push("(l.canone + l.spese + l.cauzione + l.commissione) <= ?"), args.push(f.maxIngresso));
  if (f.inserzionista) (where.push("u.role = ?"), args.push(f.inserzionista));
  if (f.soloConfermati) where.push(`${freshnessRankSql("l.confirmed_at")} = 0`);

  // "Rilevanza" = prima gli annunci riconfermati di recente: chi non riconferma perde posizione.
  const order = {
    rilevanza: `${freshnessRankSql("l.confirmed_at")} ASC, l.confirmed_at DESC`,
    ingresso: "entry_cost ASC, l.confirmed_at DESC",
    canone: "l.canone ASC, l.confirmed_at DESC",
    recenti: "l.created_at DESC",
  }[f.sort ?? "rilevanza"];

  const page = Math.max(1, f.page ?? 1);
  const d = db();
  const total = (d.prepare(`SELECT COUNT(*) n FROM listings l JOIN properties p ON p.id = l.property_id JOIN users u ON u.id = l.advertiser_id WHERE ${where.join(" AND ")}`).get(...args) as { n: number }).n;
  const rows = d.prepare(`${SELECT} WHERE ${where.join(" AND ")} ORDER BY ${order} LIMIT ? OFFSET ?`).all(...args, PAGE_SIZE, (page - 1) * PAGE_SIZE) as ListingRow[];
  return { rows, total };
}

/** Comuni e quartieri con annunci attivi, per i filtri a cascata regione → città → quartiere. */
export function locationFacets(regione?: string, comune?: string) {
  const d = db();
  const comuni = d
    .prepare(
      `SELECT p.comune, COUNT(*) n FROM listings l JOIN properties p ON p.id = l.property_id
        WHERE l.status = 'active' ${regione ? "AND p.regione = ?" : ""} GROUP BY p.comune ORDER BY n DESC, p.comune`,
    )
    .all(...(regione ? [regione] : [])) as { comune: string; n: number }[];
  const quartieri = comune
    ? (d
        .prepare(
          `SELECT p.quartiere, COUNT(*) n FROM listings l JOIN properties p ON p.id = l.property_id
            WHERE l.status = 'active' AND p.comune = ? COLLATE NOCASE AND p.quartiere IS NOT NULL GROUP BY p.quartiere ORDER BY p.quartiere`,
        )
        .all(comune) as { quartiere: string; n: number }[])
    : [];
  return { comuni, quartieri };
}

export function getListing(id: number): ListingRow | null {
  return (db().prepare(`${SELECT} WHERE l.id = ?`).get(id) as ListingRow | undefined) ?? null;
}

export function listingPhotos(listingId: number): string[] {
  return (db().prepare("SELECT storage_key FROM listing_photos WHERE listing_id = ? ORDER BY position").all(listingId) as { storage_key: string }[]).map((r) => r.storage_key);
}

export function listingsByAdvertiser(advertiserId: number, onlyActive = false): ListingRow[] {
  return db()
    .prepare(`${SELECT} WHERE l.advertiser_id = ? ${onlyActive ? "AND l.status = 'active'" : ""} ORDER BY l.status, l.created_at DESC`)
    .all(advertiserId) as ListingRow[];
}

export type PropertyRow = {
  id: number;
  regione: string;
  comune: string;
  quartiere: string | null;
  via: string;
  civico: string;
  interno: string | null;
  cap: string | null;
  lat: number;
  lon: number;
  geo_precision: "exact" | "approx";
  tipologia: string;
  mq: number;
  locali: number;
  bagni: number;
  piano: string | null;
  created_at: string;
};

export function getProperty(id: number): PropertyRow | null {
  return (db().prepare("SELECT * FROM properties WHERE id = ?").get(id) as PropertyRow | undefined) ?? null;
}

/** Tutti gli annunci (attivi e passati) di un immobile: lo storico della scheda. */
export function propertyListings(propertyId: number): ListingRow[] {
  return db().prepare(`${SELECT} WHERE l.property_id = ? ORDER BY l.created_at DESC`).all(propertyId) as ListingRow[];
}

export type PricePoint = { canone: number; spese: number; recorded_at: string; listing_id: number };

export function priceHistory(propertyId: number): PricePoint[] {
  return db().prepare("SELECT canone, spese, recorded_at, listing_id FROM price_history WHERE property_id = ? ORDER BY recorded_at").all(propertyId) as PricePoint[];
}

export type BuildingMatch = PropertyRow & { active_listings: number; total_listings: number; same_unit: number };

/** Immobili già schedati allo stesso civico: servono a proporre l'aggancio invece di un duplicato. */
export function findBuildingMatches(a: { comune: string; via: string; civico: string; interno?: string | null }): BuildingMatch[] {
  const bKey = buildingKey(a);
  const fullKey = addressKey(a);
  return db()
    .prepare(
      `SELECT p.*,
              (SELECT COUNT(*) FROM listings l WHERE l.property_id = p.id AND l.status = 'active') AS active_listings,
              (SELECT COUNT(*) FROM listings l WHERE l.property_id = p.id) AS total_listings,
              (p.address_key = ?) AS same_unit
         FROM properties p
        WHERE substr(p.address_key, 1, length(?) + 1) = ? || '|'
        ORDER BY same_unit DESC, p.interno`,
    )
    .all(fullKey, bKey, bKey) as BuildingMatch[];
}

export type NewListing = {
  advertiserId: number;
  address: { regione: string; comune: string; quartiere: string | null; via: string; civico: string; interno: string | null; cap: string | null };
  geo: { lat: number; lon: number; precision: "exact" | "approx" };
  property: { tipologia: string; mq: number; locali: number; bagni: number; piano: string | null };
  listing: { title: string; description: string; canone: number; spese: number; cauzione: number; commissione: number; contratto: string; arredato: boolean; disponibile_dal: string | null };
  photoKeys: string[];
};

export type CreateResult = { ok: true; listingId: number; propertyId: number; attached: boolean } | { ok: false; error: string };

export function createListing(input: NewListing): CreateResult {
  const d = db();
  const key = addressKey(input.address);
  return d.transaction((): CreateResult => {
    let property = d.prepare("SELECT id FROM properties WHERE address_key = ?").get(key) as { id: number } | undefined;
    const attached = !!property;
    if (!property) {
      const a = input.address;
      const p = input.property;
      const info = d
        .prepare(
          `INSERT INTO properties (address_key, regione, comune, quartiere, via, civico, interno, cap, lat, lon, geo_precision,
                                   tipologia, mq, locali, bagni, piano, created_by)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .run(key, a.regione, a.comune.trim(), a.quartiere, prettyVia(a.via), prettyCivico(a.civico), a.interno, a.cap, input.geo.lat, input.geo.lon, input.geo.precision, p.tipologia, p.mq, p.locali, p.bagni, p.piano, input.advertiserId);
      property = { id: Number(info.lastInsertRowid) };
    }

    const dup = d.prepare("SELECT id FROM listings WHERE property_id = ? AND advertiser_id = ? AND status = 'active'").get(property.id, input.advertiserId) as { id: number } | undefined;
    if (dup) return { ok: false, error: `Hai già un annuncio attivo per questo immobile (n. ${dup.id}). Aggiorna quello invece di pubblicarne un altro.` };

    const l = input.listing;
    const now = nowIso();
    const info = d
      .prepare(
        `INSERT INTO listings (property_id, advertiser_id, title, description, canone, spese, cauzione, commissione, contratto, arredato, disponibile_dal, confirmed_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(property.id, input.advertiserId, l.title, l.description, l.canone, l.spese, l.cauzione, l.commissione, l.contratto, l.arredato ? 1 : 0, l.disponibile_dal, now);
    const listingId = Number(info.lastInsertRowid);
    d.prepare("INSERT INTO price_history (property_id, listing_id, canone, spese) VALUES (?, ?, ?, ?)").run(property.id, listingId, l.canone, l.spese);
    const ins = d.prepare("INSERT INTO listing_photos (listing_id, storage_key, position) VALUES (?, ?, ?)");
    input.photoKeys.forEach((k, i) => ins.run(listingId, k, i));
    return { ok: true, listingId, propertyId: property.id, attached };
  })();
}

export function reconfirmListing(listingId: number, advertiserId: number): boolean {
  const r = db().prepare("UPDATE listings SET confirmed_at = ?, reminder_sent_at = NULL WHERE id = ? AND advertiser_id = ? AND status = 'active'").run(nowIso(), listingId, advertiserId);
  return r.changes > 0;
}

export function closeListing(listingId: number, advertiserId: number, reason: string): boolean {
  const r = db().prepare("UPDATE listings SET status = 'closed', closed_at = ?, closed_reason = ? WHERE id = ? AND advertiser_id = ? AND status = 'active'").run(nowIso(), reason, listingId, advertiserId);
  return r.changes > 0;
}

/** Cambio di prezzo: aggiorna l'annuncio e registra il punto nello storico della scheda immobile. */
export function updatePrice(listingId: number, advertiserId: number, c: { canone: number; spese: number; cauzione: number; commissione: number }): boolean {
  const d = db();
  return d.transaction(() => {
    const l = d.prepare("SELECT property_id, canone, spese FROM listings WHERE id = ? AND advertiser_id = ? AND status = 'active'").get(listingId, advertiserId) as { property_id: number; canone: number; spese: number } | undefined;
    if (!l) return false;
    d.prepare("UPDATE listings SET canone = ?, spese = ?, cauzione = ?, commissione = ?, confirmed_at = ? WHERE id = ?").run(c.canone, c.spese, c.cauzione, c.commissione, nowIso(), listingId);
    if (l.canone !== c.canone || l.spese !== c.spese) {
      d.prepare("INSERT INTO price_history (property_id, listing_id, canone, spese) VALUES (?, ?, ?, ?)").run(l.property_id, listingId, c.canone, c.spese);
    }
    return true;
  })();
}

