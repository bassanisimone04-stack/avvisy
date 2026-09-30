// Lettura e scrittura minimale di calendari iCalendar (RFC 5545).
// Import: il feed "indirizzo segreto in formato iCal" di Google Calendar (o di qualunque altro
// calendario) viene letto per ricavare gli intervalli occupati dell'inserzionista.
// Export: le visite confermate vengono pubblicate come feed .ics a cui Google/Apple/Outlook si abbonano.

import { addDays, TZ, zonedToUtc } from "./time";

export type BusyInterval = { start: Date; end: Date };
export type ParseResult = { busy: BusyInterval[]; unsupported: number };

type Prop = { value: string; params: Record<string, string> };
type RawEvent = Record<string, Prop[]>;

function unfold(text: string): string[] {
  return text.replace(/\r\n/g, "\n").replace(/\n[ \t]/g, "").split("\n");
}

function parseLine(line: string): { name: string; prop: Prop } | null {
  // Il primo ":" fuori da virgolette separa nome/parametri dal valore.
  let inQuotes = false;
  let idx = -1;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') inQuotes = !inQuotes;
    else if (ch === ":" && !inQuotes) {
      idx = i;
      break;
    }
  }
  if (idx < 0) return null;
  const [name, ...rawParams] = line.slice(0, idx).split(";");
  const params: Record<string, string> = {};
  for (const p of rawParams) {
    const eq = p.indexOf("=");
    if (eq > 0) params[p.slice(0, eq).toUpperCase()] = p.slice(eq + 1).replace(/^"|"$/g, "");
  }
  return { name: name.toUpperCase(), prop: { value: line.slice(idx + 1), params } };
}

type DateVal = { date: Date; allDay: boolean; tz: string; wall: { y: number; m: number; d: number; h: number; mi: number; s: number } };

function parseDate(prop: Prop, fallbackTz: string): DateVal | null {
  const v = prop.value.trim();
  const m = /^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})(Z)?)?$/.exec(v);
  if (!m) return null;
  const [y, mo, d] = [+m[1], +m[2], +m[3]];
  if (!m[4] || prop.params.VALUE === "DATE") {
    const tz = fallbackTz;
    return { date: zonedToUtc(tz, y, mo, d), allDay: true, tz, wall: { y, m: mo, d, h: 0, mi: 0, s: 0 } };
  }
  const [h, mi, s] = [+m[4], +m[5], +m[6]];
  if (m[7]) {
    return { date: new Date(Date.UTC(y, mo - 1, d, h, mi, s)), allDay: false, tz: "UTC", wall: { y, m: mo, d, h, mi, s } };
  }
  let tz = prop.params.TZID ?? fallbackTz;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
  } catch {
    tz = fallbackTz; // TZID non IANA (es. nomi Windows): si assume il fuso di default
  }
  return { date: zonedToUtc(tz, y, mo, d, h, mi, s), allDay: false, tz, wall: { y, m: mo, d, h, mi, s } };
}

function parseDuration(s: string): number | null {
  const m = /^([+-])?P(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/.exec(s.trim());
  if (!m) return null;
  const sign = m[1] === "-" ? -1 : 1;
  const [w, d, h, mi, se] = [m[2], m[3], m[4], m[5], m[6]].map((x) => +(x ?? 0));
  return sign * ((((w * 7 + d) * 24 + h) * 60 + mi) * 60 + se) * 1000;
}

const BYDAY_CODES = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
const MAX_ITERATIONS = 20000;

/** Espande una ricorrenza e restituisce gli inizi (UTC) che cadono prima di windowEnd. */
function expandRRule(rrule: string, start: DateVal, windowEnd: Date): Date[] | null {
  const rule: Record<string, string> = {};
  for (const part of rrule.split(";")) {
    const [k, v] = part.split("=");
    if (k && v) rule[k.toUpperCase()] = v.toUpperCase();
  }
  const freq = rule.FREQ;
  const interval = Math.max(1, +(rule.INTERVAL ?? 1));
  const count = rule.COUNT ? +rule.COUNT : Infinity;
  let until = Infinity;
  if (rule.UNTIL) {
    const u = parseDate({ value: rule.UNTIL, params: {} }, start.tz);
    if (u) until = u.allDay ? u.date.getTime() + 86400000 - 1 : u.date.getTime();
  }
  // Regole avanzate non gestite: il chiamante le conta come "non interpretate".
  const supportedKeys = new Set(["FREQ", "INTERVAL", "COUNT", "UNTIL", "BYDAY", "WKST"]);
  if (Object.keys(rule).some((k) => !supportedKeys.has(k))) return null;
  if (!["DAILY", "WEEKLY", "MONTHLY", "YEARLY"].includes(freq)) return null;
  if (rule.BYDAY && (freq !== "WEEKLY" || rule.BYDAY.split(",").some((d) => !BYDAY_CODES.includes(d)))) return null;

  const w = start.wall;
  const toUtc = (y: number, m: number, d: number) => zonedToUtc(start.tz, y, m, d, w.h, w.mi, w.s);
  const out: Date[] = [];
  let produced = 0;
  const startWeekday = addDays(w.y, w.m, w.d, 0).weekday;

  for (let k = 0; k < MAX_ITERATIONS; k++) {
    let candidates: { y: number; m: number; d: number }[] = [];
    if (freq === "DAILY") {
      candidates = [addDays(w.y, w.m, w.d, k * interval)];
    } else if (freq === "WEEKLY") {
      const days = rule.BYDAY ? rule.BYDAY.split(",").map((c) => BYDAY_CODES.indexOf(c)).sort((a, b) => a - b) : [startWeekday];
      candidates = days.map((wd) => addDays(w.y, w.m, w.d, k * interval * 7 - startWeekday + wd));
    } else {
      const months = freq === "MONTHLY" ? k * interval : k * interval * 12;
      const total = w.y * 12 + (w.m - 1) + months;
      const y = Math.floor(total / 12);
      const m = (total % 12) + 1;
      const t = new Date(Date.UTC(y, m - 1, w.d));
      // Il 31 di un mese che non lo ha viene saltato (come da RFC).
      if (t.getUTCMonth() === m - 1) candidates = [{ y, m, d: w.d }];
    }
    let stop = false;
    for (const c of candidates) {
      const occ = toUtc(c.y, c.m, c.d);
      if (occ.getTime() < start.date.getTime()) continue;
      if (occ.getTime() > until || produced >= count || occ > windowEnd) {
        stop = true;
        break;
      }
      produced++;
      out.push(occ);
    }
    if (stop) break;
  }
  return out;
}

export function parseICalBusy(text: string, windowStart: Date, windowEnd: Date, fallbackTz = TZ): ParseResult {
  const events: RawEvent[] = [];
  let current: RawEvent | null = null;
  let depth = 0;
  for (const line of unfold(text)) {
    if (/^BEGIN:VEVENT$/i.test(line)) {
      current = {};
      depth = 0;
      continue;
    }
    if (!current) continue;
    if (/^BEGIN:/i.test(line)) depth++;
    else if (/^END:VEVENT$/i.test(line) && depth === 0) {
      events.push(current);
      current = null;
    } else if (/^END:/i.test(line)) depth--;
    else if (depth === 0) {
      const parsed = parseLine(line);
      if (parsed) (current[parsed.name] ??= []).push(parsed.prop);
    }
  }

  // Occorrenze modificate singolarmente (RECURRENCE-ID) sostituiscono quella originale della serie.
  const overridden = new Map<string, Set<number>>();
  for (const ev of events) {
    const rid = ev["RECURRENCE-ID"]?.[0];
    const uid = ev.UID?.[0]?.value;
    if (rid && uid) {
      const d = parseDate(rid, fallbackTz);
      if (d) {
        if (!overridden.has(uid)) overridden.set(uid, new Set());
        overridden.get(uid)!.add(d.date.getTime());
      }
    }
  }

  const busy: BusyInterval[] = [];
  let unsupported = 0;
  for (const ev of events) {
    if (ev.STATUS?.[0]?.value.toUpperCase() === "CANCELLED") continue;
    if (ev.TRANSP?.[0]?.value.toUpperCase() === "TRANSPARENT") continue;
    const start = ev.DTSTART?.[0] && parseDate(ev.DTSTART[0], fallbackTz);
    if (!start) continue;

    let duration: number;
    const endProp = ev.DTEND?.[0] && parseDate(ev.DTEND[0], fallbackTz);
    if (endProp) duration = endProp.date.getTime() - start.date.getTime();
    else if (ev.DURATION?.[0]) duration = parseDuration(ev.DURATION[0].value) ?? 0;
    else duration = start.allDay ? 86400000 : 0;
    if (duration <= 0) continue;

    let starts: Date[] = [start.date];
    const rrule = ev.RRULE?.[0]?.value;
    if (rrule && !ev["RECURRENCE-ID"]) {
      const expanded = expandRRule(rrule, start, windowEnd);
      if (expanded) starts = expanded;
      else unsupported++;
      const excluded = new Set<number>(overridden.get(ev.UID?.[0]?.value ?? "") ?? []);
      for (const ex of ev.EXDATE ?? []) {
        for (const v of ex.value.split(",")) {
          const d = parseDate({ value: v, params: ex.params }, fallbackTz);
          if (d) excluded.add(d.date.getTime());
        }
      }
      starts = starts.filter((s) => !excluded.has(s.getTime()));
    }

    for (const s of starts) {
      const e = new Date(s.getTime() + duration);
      if (e > windowStart && s < windowEnd) busy.push({ start: s, end: e });
    }
  }
  busy.sort((a, b) => a.start.getTime() - b.start.getTime());
  return { busy, unsupported };
}

// ---------------------------------------------------------------------------
// Export

function icalDate(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function escapeText(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

function fold(line: string): string {
  const out: string[] = [];
  let rest = line;
  while (rest.length > 74) {
    out.push(rest.slice(0, 74));
    rest = " " + rest.slice(74);
  }
  out.push(rest);
  return out.join("\r\n");
}

export type ExportEvent = { uid: string; start: Date; end: Date; summary: string; description: string; location: string; cancelled?: boolean };

export function buildICal(name: string, events: ExportEvent[]): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//TrovaImmobile//Visite//IT",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeText(name)}`,
    "X-PUBLISHED-TTL:PT15M",
  ];
  const stamp = icalDate(new Date());
  for (const ev of events) {
    lines.push(
      "BEGIN:VEVENT",
      `UID:${ev.uid}`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${icalDate(ev.start)}`,
      `DTEND:${icalDate(ev.end)}`,
      `SUMMARY:${escapeText(ev.summary)}`,
      `DESCRIPTION:${escapeText(ev.description)}`,
      `LOCATION:${escapeText(ev.location)}`,
      `STATUS:${ev.cancelled ? "CANCELLED" : "CONFIRMED"}`,
      "END:VEVENT",
    );
  }
  lines.push("END:VCALENDAR");
  return lines.map(fold).join("\r\n") + "\r\n";
}

