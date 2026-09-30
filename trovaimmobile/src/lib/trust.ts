import { db } from "./db";

// Metriche di affidabilità calcolate SOLO da interazioni reali avvenute sulla piattaforma.

export const MIN_CONTACTS_FOR_RESPONSE_TIME = 3;
const WINDOW_DAYS = 90;

export type AdvertiserStats = {
  advertiserId: number;
  /** Mediana dei minuti tra richiesta e prima risposta (ultimi 90 giorni), null se dati insufficienti */
  medianResponseMinutes: number | null;
  responseRate: number | null;
  contactsCount: number;
  reviewsCount: number;
  avgRating: number | null;
  completedVisits: number;
};

export function advertiserStats(ids: number[]): Map<number, AdvertiserStats> {
  const out = new Map<number, AdvertiserStats>();
  const unique = [...new Set(ids)];
  if (unique.length === 0) return out;
  const placeholders = unique.map(() => "?").join(",");
  const d = db();

  const contacts = d
    .prepare(
      `SELECT advertiser_id, created_at, replied_at FROM contacts
        WHERE advertiser_id IN (${placeholders}) AND created_at > strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-${WINDOW_DAYS} days')`,
    )
    .all(...unique) as { advertiser_id: number; created_at: string; replied_at: string | null }[];
  const reviews = d
    .prepare(`SELECT advertiser_id, COUNT(*) n, AVG(rating) avg FROM reviews WHERE advertiser_id IN (${placeholders}) GROUP BY advertiser_id`)
    .all(...unique) as { advertiser_id: number; n: number; avg: number }[];
  const visits = d
    .prepare(
      `SELECT advertiser_id, COUNT(*) n FROM visits
        WHERE advertiser_id IN (${placeholders}) AND status IN ('confirmed','completed') AND end_at < strftime('%Y-%m-%dT%H:%M:%fZ','now')
        GROUP BY advertiser_id`,
    )
    .all(...unique) as { advertiser_id: number; n: number }[];

  for (const id of unique) {
    const mine = contacts.filter((c) => c.advertiser_id === id);
    // Una richiesta ancora senza risposta dopo 48h conta come "non risposta" nel tasso.
    const decided = mine.filter((c) => c.replied_at || Date.now() - Date.parse(c.created_at) > 48 * 3600000);
    const answered = mine.filter((c) => c.replied_at).map((c) => (Date.parse(c.replied_at!) - Date.parse(c.created_at)) / 60000).sort((a, b) => a - b);
    const r = reviews.find((x) => x.advertiser_id === id);
    out.set(id, {
      advertiserId: id,
      medianResponseMinutes: answered.length >= MIN_CONTACTS_FOR_RESPONSE_TIME ? answered[Math.floor(answered.length / 2)] : null,
      responseRate: decided.length >= MIN_CONTACTS_FOR_RESPONSE_TIME ? answered.length / decided.length : null,
      contactsCount: mine.length,
      reviewsCount: r?.n ?? 0,
      avgRating: r ? Math.round(r.avg * 10) / 10 : null,
      completedVisits: visits.find((x) => x.advertiser_id === id)?.n ?? 0,
    });
  }
  return out;
}

// Frasi tipiche delle truffe con pagamento anticipato (finto "servizio di ricerca", caparra prima della visita…).
const PAYMENT_PATTERNS = [
  /\b(caparra|anticip\w*|acconto|bonifico|ricarica|postepay|western union|moneygram|paypal|crypto|bitcoin|iban)\b/i,
  /\b(quota|fee|tassa|costo) (di )?(iscrizione|ricerca|servizio|registrazione|prenotazione)\b/i,
  /\bpaga(re|mento)?\b.{0,40}\bprima\b/i,
  /\b(inviare|mandare|versare)\b.{0,30}\b(soldi|euro|€|\d+ ?€)/i,
];

// "Non pagare nulla prima…", "nessun anticipo" sono avvertimenti, non richieste.
const NEGATION = /(?:^|[^\p{L}])(non|nessun[oa]?|alcun[oa]?|mai|niente|nulla|senza|né)(?!\p{L})[^.!?\n]{0,25}$/iu;

export function mentionsAdvancePayment(text: string): boolean {
  return PAYMENT_PATTERNS.some((re) => {
    const g = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
    for (const m of text.matchAll(g)) {
      if (!NEGATION.test(text.slice(Math.max(0, m.index - 40), m.index))) return true;
    }
    return false;
  });
}
