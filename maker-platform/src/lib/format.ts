import { siteConfig } from "@/config/site";

const currency = new Intl.NumberFormat(siteConfig.defaultLocale, {
  style: "currency",
  currency: siteConfig.defaultCurrency,
});
const currencyWhole = new Intl.NumberFormat(siteConfig.defaultLocale, {
  style: "currency",
  currency: siteConfig.defaultCurrency,
  maximumFractionDigits: 0,
});

/** Prices are stored in integer cents to avoid float drift. */
export function formatPrice(cents: number): string {
  return cents % 100 === 0 ? currencyWhole.format(cents / 100) : currency.format(cents / 100);
}

export function formatNumber(value: number, maxFractionDigits = 2): string {
  return new Intl.NumberFormat(siteConfig.defaultLocale, {
    maximumFractionDigits: maxFractionDigits,
  }).format(value);
}

export function formatMiles(miles: number): string {
  return `${formatNumber(miles, miles < 10 ? 1 : 0)} mi`;
}

/** Inches to a friendly imperial string plus metric, e.g. 72" (183 cm). */
export function formatInches(inches: number): string {
  return `${formatNumber(inches, 2)}″`;
}

export function inchesToCm(inches: number): number {
  return inches * 2.54;
}
