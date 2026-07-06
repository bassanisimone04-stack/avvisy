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

export type OpenStatus = { open: boolean; label: string };

export function computeOpenStatus(
  openingHours: string,
  now: Date
): OpenStatus | null {
  const m = openingHours.match(/^\s*(\S+)\s+(.+)$/);
  if (!m) return null;

  const days = parseDays(m[1]);
  const ranges = m[2]
    .split("/")
    .map((r) => r.split(/[–-]/))
    .filter((p) => p.length === 2)
    .map((p) => [toMin(p[0]), toMin(p[1])] as [number, number]);

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
