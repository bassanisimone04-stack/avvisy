/** Interpreta gli orari di apertura testuali (es. "Lun–Ven 9:00–13:00 / 14:30–18:00")
 * e calcola se la struttura è aperta in un dato momento. */

const DAYS: Record<string, number> = {
  dom: 0,
  lun: 1,
  mar: 2,
  mer: 3,
  gio: 4,
  ven: 5,
  sab: 6,
};

function parseDays(range: string): number[] {
  const parts = range
    .split(/[–-]/)
    .map((s) => DAYS[s.trim().slice(0, 3).toLowerCase()])
    .filter((n) => n !== undefined);
  if (parts.length === 1) return [parts[0]];
  if (parts.length === 2) {
    const out: number[] = [];
    for (let d = parts[0]; d <= parts[1]; d++) out.push(d);
    return out;
  }
  return [];
}

function toMin(hm: string): number {
  const [h, m] = hm.trim().split(":").map(Number);
  return h * 60 + (m || 0);
}

function fmt(min: number): string {
  return `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(
    min % 60
  ).padStart(2, "0")}`;
}

/** Interpreta la stringa orari in { giorni attivi, fasce orarie in minuti }. */
function parse(openingHours: string): {
  days: number[];
  ranges: [number, number][];
} {
  const m = openingHours.match(/^\s*(\S+)\s+(.+)$/);
  if (!m) return { days: [], ranges: [] };
  const days = parseDays(m[1]);
  const ranges = m[2]
    .split("/")
    .map((r) => r.split(/[–-]/))
    .filter((p) => p.length === 2)
    .map((p) => [toMin(p[0]), toMin(p[1])] as [number, number]);
  return { days, ranges };
}

/** La struttura è aperta in un dato giorno della settimana (0=Dom … 6=Sab)? */
export function isOpenOnWeekday(openingHours: string, weekday: number): boolean {
  return parse(openingHours).days.includes(weekday);
}

/** Prossimi `count` giorni (date ISO) in cui la struttura è aperta. */
export function nextOpenDays(openingHours: string, count: number): string[] {
  const out: string[] = [];
  const d = new Date();
  let guard = 0;
  while (out.length < count && guard < 60) {
    d.setDate(d.getDate() + 1);
    if (isOpenOnWeekday(openingHours, d.getDay())) {
      out.push(d.toISOString().slice(0, 10));
    }
    guard++;
  }
  return out;
}

/** Slot prenotabili (HH:mm) per un giorno, generati dalle fasce di apertura
 * a passo pari alla durata del servizio, in modo che il servizio ci stia. */
export function slotsForDate(
  openingHours: string,
  isoDate: string,
  durationMin: number
): string[] {
  const { days, ranges } = parse(openingHours);
  const weekday = new Date(`${isoDate}T00:00:00`).getDay();
  if (!days.includes(weekday)) return [];
  const step = Math.max(5, durationMin);
  const slots: string[] = [];
  for (const [open, close] of ranges) {
    for (let t = open; t + step <= close; t += step) slots.push(fmt(t));
  }
  return slots;
}

export type OpenStatus = { open: boolean; label: string };

export function computeOpenStatus(
  openingHours: string,
  now: Date
): OpenStatus | null {
  const { days, ranges } = parse(openingHours);
  if (days.length === 0) return null;

  const cur = now.getHours() * 60 + now.getMinutes();

  if (days.includes(now.getDay())) {
    for (const [o, c] of ranges) {
      if (cur >= o && cur < c) {
        return { open: true, label: `Aperto · chiude alle ${fmt(c)}` };
      }
    }
    const next = ranges
      .map((r) => r[0])
      .filter((o) => o > cur)
      .sort((a, b) => a - b)[0];
    if (next != null) {
      return { open: false, label: `Chiuso · apre alle ${fmt(next)}` };
    }
  }

  return { open: false, label: "Chiuso ora" };
}
