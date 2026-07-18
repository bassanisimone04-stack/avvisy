import { COMMISSION_RATE } from "./types";

const eur = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 2,
});

const eur0 = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const num = new Intl.NumberFormat("it-IT");

export function formatEuro(value: number, compact = false): string {
  return compact ? eur0.format(value) : eur.format(value);
}

export function formatNumber(value: number): string {
  return num.format(value);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
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
