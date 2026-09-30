import { TZ } from "./time";

const euro = new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
export const formatEuro = (n: number) => euro.format(n);

const dateFmt = new Intl.DateTimeFormat("it-IT", { timeZone: TZ, day: "numeric", month: "long", year: "numeric" });
const shortDateFmt = new Intl.DateTimeFormat("it-IT", { timeZone: TZ, day: "numeric", month: "short", year: "numeric" });
const slotFmt = new Intl.DateTimeFormat("it-IT", { timeZone: TZ, weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
const timeFmt = new Intl.DateTimeFormat("it-IT", { timeZone: TZ, hour: "2-digit", minute: "2-digit" });
const dayFmt = new Intl.DateTimeFormat("it-IT", { timeZone: TZ, weekday: "short", day: "numeric", month: "short" });

export const formatDate = (d: Date | string) => dateFmt.format(new Date(d));
export const formatShortDate = (d: Date | string) => shortDateFmt.format(new Date(d));
export const formatSlot = (d: Date | string) => slotFmt.format(new Date(d));
export const formatTime = (d: Date | string) => timeFmt.format(new Date(d));
export const formatDay = (d: Date | string) => dayFmt.format(new Date(d));

/** "3 ore fa", "2 giorni fa"… */
export function timeAgo(iso: string, now = Date.now()): string {
  const min = Math.max(0, Math.round((now - Date.parse(iso)) / 60000));
  if (min < 1) return "adesso";
  if (min < 60) return min === 1 ? "1 minuto fa" : `${min} minuti fa`;
  const h = Math.round(min / 60);
  if (h < 24) return h === 1 ? "1 ora fa" : `${h} ore fa`;
  const d = Math.round(h / 24);
  if (d < 30) return d === 1 ? "1 giorno fa" : `${d} giorni fa`;
  const m = Math.round(d / 30);
  return m <= 1 ? "1 mese fa" : `${m} mesi fa`;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${Math.max(1, Math.round(minutes))} min`;
  const h = minutes / 60;
  if (h < 24) return `${Math.round(h)} h`;
  const d = Math.round(h / 24);
  return d === 1 ? "1 giorno" : `${d} giorni`;
}

/** Nome pubblico di un privato: nome e iniziale del cognome ("Giulia R."). */
export function publicName(full: string): string {
  const [first, second] = full.trim().split(/\s+/);
  return second ? `${first} ${second[0].toUpperCase()}.` : first;
}
