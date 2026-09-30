export const TZ = "Europe/Rome";

const fmtCache = new Map<string, Intl.DateTimeFormat>();
function formatter(tz: string) {
  let f = fmtCache.get(tz);
  if (!f) {
    f = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      weekday: "short",
    });
    fmtCache.set(tz, f);
  }
  return f;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export type WallTime = { y: number; m: number; d: number; h: number; mi: number; s: number; weekday: number };

/** Ora "da orologio" di un istante in un fuso orario. weekday: 0 = lunedì. */
export function wallTime(date: Date, tz = TZ): WallTime {
  const parts: Record<string, string> = {};
  for (const p of formatter(tz).formatToParts(date)) parts[p.type] = p.value;
  return {
    y: +parts.year,
    m: +parts.month,
    d: +parts.day,
    h: +parts.hour,
    mi: +parts.minute,
    s: +parts.second,
    weekday: WEEKDAYS.indexOf(parts.weekday),
  };
}

function offsetMs(date: Date, tz: string): number {
  const w = wallTime(date, tz);
  return Date.UTC(w.y, w.m - 1, w.d, w.h, w.mi, w.s) - (date.getTime() - date.getMilliseconds());
}

/** Converte un'ora locale (in un fuso IANA) nell'istante UTC corrispondente. Gestisce l'ora legale. */
export function zonedToUtc(tz: string, y: number, m: number, d: number, h = 0, mi = 0, s = 0): Date {
  const guess = Date.UTC(y, m - 1, d, h, mi, s);
  let ts = guess - offsetMs(new Date(guess), tz);
  // Seconda passata: vicino al cambio d'ora l'offset stimato può essere quello "sbagliato".
  ts = guess - offsetMs(new Date(ts), tz);
  return new Date(ts);
}

export function romeToUtc(y: number, m: number, d: number, h = 0, mi = 0): Date {
  return zonedToUtc(TZ, y, m, d, h, mi);
}

/** Aggiunge giorni di calendario a una data (y, m, d), senza fuso orario. */
export function addDays(y: number, m: number, d: number, days: number) {
  const t = new Date(Date.UTC(y, m - 1, d + days));
  return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate(), weekday: (t.getUTCDay() + 6) % 7 };
}

export function overlaps(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
  return aStart < bEnd && bStart < aEnd;
}

export function minutesToHHMM(min: number): string {
  return `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
}

export function hhmmToMinutes(s: string): number | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(s.trim());
  if (!m) return null;
  const h = +m[1];
  const mi = +m[2];
  if (h > 24 || mi > 59 || (h === 24 && mi > 0)) return null;
  return h * 60 + mi;
}
