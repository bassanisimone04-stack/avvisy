import { COMMISSION_RATE } from "./types";

// Formattazione deterministica in stile italiano (separatore migliaia ".",
// decimali ","). NON usiamo Intl a runtime perché i dati locale di ICU possono
// differire tra il server Node e il browser, generando disallineamenti di
// idratazione (es. "1133 €" sul server vs "1.133 €" sul client).

/** Inserisce il separatore delle migliaia in una stringa di sole cifre. */
function groupThousands(digits: string): string {
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function formatEuro(value: number, compact = false): string {
  const neg = value < 0;
  const abs = Math.abs(value);
  const fixed = compact ? Math.round(abs).toFixed(0) : abs.toFixed(2);
  const [intPart, decPart] = fixed.split(".");
  const grouped = groupThousands(intPart);
  const body = decPart ? `${grouped},${decPart}` : grouped;
  return `${neg ? "-" : ""}${body} €`;
}

export function formatNumber(value: number): string {
  const neg = value < 0;
  const abs = Math.abs(value);
  const rounded = Math.round(abs * 100) / 100;
  const fixed = Number.isInteger(rounded) ? rounded.toString() : rounded.toString();
  const [intPart, decPart] = fixed.split(".");
  const grouped = groupThousands(intPart);
  return `${neg ? "-" : ""}${decPart ? `${grouped},${decPart}` : grouped}`;
}

const MONTHS_IT = [
  "gen", "feb", "mar", "apr", "mag", "giu",
  "lug", "ago", "set", "ott", "nov", "dic",
];

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = MONTHS_IT[d.getUTCMonth()];
  const year = d.getUTCFullYear();
  return `${day} ${month} ${year}`;
}

/** Relative-ish label used in feeds ("2 giorni fa"). */
export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days <= 0) return "oggi";
  if (days === 1) return "ieri";
  if (days < 30) return `${days} giorni fa`;
  const months = Math.floor(days / 30);
  if (months === 1) return "1 mese fa";
  return `${months} mesi fa`;
}

export function commission(total: number): number {
  return Math.round(total * COMMISSION_RATE * 100) / 100;
}

export function commissionRateLabel(): string {
  return "2,5%";
}

/** Data di riferimento del prototipo (dati dimostrativi). */
export const DEMO_TODAY = "2026-07-18";

/** Giorni residui rispetto alla data di riferimento del prototipo. */
export function daysUntil(iso: string): number {
  const target = new Date(iso).getTime();
  const today = new Date(DEMO_TODAY).getTime();
  return Math.round((target - today) / 86_400_000);
}

/** Differenza percentuale del prezzo proposto rispetto a quello richiesto. */
export function percentDiff(proposed: number, asking: number): number {
  if (!asking) return 0;
  return Math.round(((proposed - asking) / asking) * 1000) / 10;
}

export function formatPercent(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toString().replace(".", ",")}%`;
}
