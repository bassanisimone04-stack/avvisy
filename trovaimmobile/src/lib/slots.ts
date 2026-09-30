import { addDays, overlaps, romeToUtc, wallTime } from "./time";

export type Rule = { weekday: number; start_min: number; end_min: number };
export type Interval = { start: Date; end: Date };

export const BOOKING_HORIZON_DAYS = 14;
export const MIN_LEAD_MINUTES = 120;

/**
 * Fasce prenotabili = fasce settimanali dichiarate dall'inserzionista
 *   − impegni del suo calendario esterno (Google/iCal)
 *   − visite già confermate su TrovaImmobile (su qualunque suo annuncio)
 *   − tutto ciò che inizia tra meno di MIN_LEAD_MINUTES.
 */
export function computeFreeSlots(opts: {
  rules: Rule[];
  busy: Interval[];
  booked: Interval[];
  slotMinutes: number;
  now: Date;
  days?: number;
  leadMinutes?: number;
}): Interval[] {
  const { rules, busy, booked, slotMinutes, now } = opts;
  const days = opts.days ?? BOOKING_HORIZON_DAYS;
  const earliest = now.getTime() + (opts.leadMinutes ?? MIN_LEAD_MINUTES) * 60000;
  const blocked = [...busy, ...booked].map((b) => [b.start.getTime(), b.end.getTime()] as const);
  const today = wallTime(now);
  const out: Interval[] = [];

  for (let i = 0; i <= days; i++) {
    const day = addDays(today.y, today.m, today.d, i);
    for (const r of rules.filter((x) => x.weekday === day.weekday).sort((a, b) => a.start_min - b.start_min)) {
      for (let t = r.start_min; t + slotMinutes <= r.end_min; t += slotMinutes) {
        const start = romeToUtc(day.y, day.m, day.d, Math.floor(t / 60), t % 60);
        const end = new Date(start.getTime() + slotMinutes * 60000);
        if (start.getTime() < earliest) continue;
        if (blocked.some(([bs, be]) => overlaps(start.getTime(), end.getTime(), bs, be))) continue;
        if (out.some((o) => o.start.getTime() === start.getTime())) continue; // fasce sovrapposte nelle regole
        out.push({ start, end });
      }
    }
  }
  return out.sort((a, b) => a.start.getTime() - b.start.getTime());
}
