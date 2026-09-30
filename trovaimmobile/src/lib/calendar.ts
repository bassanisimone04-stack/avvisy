import { db, nowIso } from "./db";
import { parseICalBusy } from "./ical";
import { fetchPublicText, normalizeFeedUrl } from "./safe-fetch";
import { BOOKING_HORIZON_DAYS, computeFreeSlots, type Interval, type Rule } from "./slots";
import { sendMail } from "./mail";
import { formatSlot } from "./format";

const SYNC_MAX_AGE_MS = 15 * 60 * 1000;

type CalendarUser = { id: number; ical_import_url: string | null; ical_synced_at: string | null; slot_minutes: number };

function calendarUser(userId: number) {
  return db().prepare("SELECT id, ical_import_url, ical_synced_at, slot_minutes FROM users WHERE id = ?").get(userId) as CalendarUser | undefined;
}

/** Importa il calendario esterno dell'inserzionista e sostituisce i suoi blocchi "occupato". */
export async function syncCalendar(userId: number): Promise<{ ok: boolean; error?: string; blocks?: number; unsupported?: number }> {
  const user = calendarUser(userId);
  if (!user?.ical_import_url) {
    db().prepare("DELETE FROM busy_blocks WHERE user_id = ?").run(userId);
    return { ok: true, blocks: 0 };
  }
  const url = normalizeFeedUrl(user.ical_import_url);
  if (!url) return { ok: false, error: "URL del calendario non valido (serve https:// o webcal://)." };

  const windowStart = new Date(Date.now() - 86400000);
  const windowEnd = new Date(Date.now() + (BOOKING_HORIZON_DAYS + 2) * 86400000);
  try {
    const text = await fetchPublicText(url);
    if (!/BEGIN:VCALENDAR/i.test(text)) throw new Error("Il link non restituisce un calendario iCal.");
    const { busy, unsupported } = parseICalBusy(text, windowStart, windowEnd);
    const d = db();
    d.transaction(() => {
      d.prepare("DELETE FROM busy_blocks WHERE user_id = ?").run(userId);
      const ins = d.prepare("INSERT INTO busy_blocks (user_id, start_at, end_at) VALUES (?, ?, ?)");
      for (const b of busy) ins.run(userId, b.start.toISOString(), b.end.toISOString());
      d.prepare("UPDATE users SET ical_synced_at = ?, ical_sync_error = NULL, ical_unsupported = ? WHERE id = ?").run(nowIso(), unsupported, userId);
    })();
    return { ok: true, blocks: busy.length, unsupported };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Errore di sincronizzazione.";
    db().prepare("UPDATE users SET ical_sync_error = ? WHERE id = ?").run(msg, userId);
    return { ok: false, error: msg };
  }
}

function loadCalendarState(advertiserId: number) {
  const d = db();
  const rules = d.prepare("SELECT weekday, start_min, end_min FROM availability_rules WHERE user_id = ?").all(advertiserId) as Rule[];
  const toInterval = (r: { start_at: string; end_at: string }): Interval => ({ start: new Date(r.start_at), end: new Date(r.end_at) });
  const horizon = new Date(Date.now() + (BOOKING_HORIZON_DAYS + 2) * 86400000).toISOString();
  const busy = (d.prepare("SELECT start_at, end_at FROM busy_blocks WHERE user_id = ? AND end_at > ? AND start_at < ?").all(advertiserId, nowIso(), horizon) as { start_at: string; end_at: string }[]).map(toInterval);
  const booked = (
    d.prepare("SELECT start_at, end_at FROM visits WHERE advertiser_id = ? AND status = 'confirmed' AND end_at > ? AND start_at < ?").all(advertiserId, nowIso(), horizon) as { start_at: string; end_at: string }[]
  ).map(toInterval);
  return { rules, busy, booked };
}

/** Fasce realmente libere per le visite di un inserzionista (sincronizza il calendario se non aggiornato). */
export async function getFreeSlots(advertiserId: number): Promise<{ slots: Interval[]; calendarLinked: boolean; syncedAt: string | null; syncError: string | null }> {
  let user = calendarUser(advertiserId);
  if (!user) return { slots: [], calendarLinked: false, syncedAt: null, syncError: null };
  let syncError: string | null = null;
  if (user.ical_import_url && (!user.ical_synced_at || Date.now() - Date.parse(user.ical_synced_at) > SYNC_MAX_AGE_MS)) {
    const r = await syncCalendar(advertiserId);
    if (!r.ok) syncError = r.error ?? null;
    user = calendarUser(advertiserId)!;
  }
  const state = loadCalendarState(advertiserId);
  // Se il calendario collegato non è sincronizzabile da oltre un'ora non si mostrano fasce:
  // meglio nessuna fascia che una fascia che potrebbe essere falsa.
  if (user.ical_import_url && (!user.ical_synced_at || Date.now() - Date.parse(user.ical_synced_at) > 4 * SYNC_MAX_AGE_MS)) {
    return { slots: [], calendarLinked: true, syncedAt: user.ical_synced_at, syncError: syncError ?? "Calendario non sincronizzato" };
  }
  return {
    slots: computeFreeSlots({ ...state, slotMinutes: user.slot_minutes, now: new Date() }),
    calendarLinked: !!user.ical_import_url,
    syncedAt: user.ical_synced_at,
    syncError,
  };
}

export type BookingResult = { ok: true; visitId: number } | { ok: false; error: string };

/** Prenotazione con conferma istantanea. Tutti i controlli avvengono in una transazione. */
export function bookVisit(listingId: number, seekerId: number, startIso: string): BookingResult {
  const d = db();
  const result = d.transaction((): BookingResult => {
    const listing = d
      .prepare(
        `SELECT l.id, l.title, l.status, l.advertiser_id, u.email AS advertiser_email, u.slot_minutes,
                p.via, p.civico, p.comune
           FROM listings l JOIN users u ON u.id = l.advertiser_id JOIN properties p ON p.id = l.property_id
          WHERE l.id = ?`,
      )
      .get(listingId) as
      | { id: number; title: string; status: string; advertiser_id: number; advertiser_email: string; slot_minutes: number; via: string; civico: string; comune: string }
      | undefined;
    if (!listing || listing.status !== "active") return { ok: false, error: "Annuncio non più disponibile." };
    if (listing.advertiser_id === seekerId) return { ok: false, error: "Non puoi prenotare una visita a un tuo annuncio." };

    const start = new Date(startIso);
    if (Number.isNaN(start.getTime())) return { ok: false, error: "Fascia oraria non valida." };
    const state = loadCalendarState(listing.advertiser_id);
    const free = computeFreeSlots({ ...state, slotMinutes: listing.slot_minutes, now: new Date() });
    const slot = free.find((s) => s.start.getTime() === start.getTime());
    if (!slot) return { ok: false, error: "Questa fascia non è più libera. Scegline un'altra." };

    const existing = d.prepare("SELECT 1 FROM visits WHERE listing_id = ? AND seeker_id = ? AND status = 'confirmed' AND end_at > ?").get(listingId, seekerId, nowIso());
    if (existing) return { ok: false, error: "Hai già una visita in programma per questo immobile." };
    const clash = d
      .prepare("SELECT 1 FROM visits WHERE seeker_id = ? AND status = 'confirmed' AND start_at < ? AND end_at > ?")
      .get(seekerId, slot.end.toISOString(), slot.start.toISOString());
    if (clash) return { ok: false, error: "Hai già un'altra visita in questo orario." };

    const info = d
      .prepare("INSERT INTO visits (listing_id, advertiser_id, seeker_id, start_at, end_at) VALUES (?, ?, ?, ?, ?)")
      .run(listingId, listing.advertiser_id, seekerId, slot.start.toISOString(), slot.end.toISOString());
    sendMail(
      listing.advertiser_email,
      `Nuova visita confermata: ${listing.title}`,
      `È stata prenotata una visita per ${formatSlot(slot.start)} in ${listing.via} ${listing.civico}, ${listing.comune}.\nLa trovi nella tua dashboard e nel feed calendario.`,
    );
    return { ok: true, visitId: Number(info.lastInsertRowid) };
  })();
  return result;
}
