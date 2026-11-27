/** Minimal RFC 5545 calendar builder (floating local times, CRLF line endings, escaped text). */
export type IcsEvent = { uid: string; date: string; time: string; durationMin: number; summary: string; description?: string; url?: string };

const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
const fold = (line: string) => { const out: string[] = []; let l = line; while (l.length > 74) { out.push(l.slice(0, 74)); l = ` ${l.slice(74)}`; } out.push(l); return out.join("\r\n"); };
const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

export function buildIcs(name: string, events: IcsEvent[], now = new Date()): string {
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Atlas Table//Itinerary//EN", "CALSCALE:GREGORIAN", `X-WR-CALNAME:${esc(name)}`];
  for (const e of events) {
    const [h, m] = e.time.split(":").map(Number);
    const start = new Date(`${e.date}T00:00:00Z`);
    start.setUTCHours(h ?? 12, m ?? 0);
    const end = new Date(start.getTime() + e.durationMin * 60000);
    const local = (d: Date) => stamp(d).replace("Z", "");
    lines.push("BEGIN:VEVENT", `UID:${e.uid}`, `DTSTAMP:${stamp(now)}`, `DTSTART:${local(start)}`, `DTEND:${local(end)}`, `SUMMARY:${esc(e.summary)}`);
    if (e.description) lines.push(`DESCRIPTION:${esc(e.description)}`);
    if (e.url) lines.push(`URL:${e.url}`);
    lines.push("END:VEVENT");
  }
  lines.push("END:VCALENDAR");
  return lines.map(fold).join("\r\n") + "\r\n";
}
