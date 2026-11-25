/**
 * Language, market, currency and units are modelled independently
 * (docs/I18N_STRATEGY.md). Only en-US / US / USD is active today.
 */
export type LocaleCode = "en-US" | "it" | "de" | "fr" | "es";
export type MarketCode = "us" | "ca" | "uk" | "au" | "eu";
export type CurrencyCode = "USD" | "CAD" | "GBP" | "AUD" | "EUR";
export type UnitSystem = "imperial" | "metric";

export interface LocaleConfig {
  code: LocaleCode;
  label: string;
  /** URL prefix; the default locale has none. */
  prefix: string;
  status: "active" | "planned";
}

export const locales: LocaleConfig[] = [
  { code: "en-US", label: "English (US)", prefix: "", status: "active" },
  { code: "it", label: "Italiano", prefix: "/it", status: "planned" },
  { code: "de", label: "Deutsch", prefix: "/de", status: "planned" },
  { code: "fr", label: "Français", prefix: "/fr", status: "planned" },
  { code: "es", label: "Español", prefix: "/es", status: "planned" },
];

export interface MarketConfig {
  code: MarketCode;
  name: string;
  currency: CurrencyCode;
  defaultUnits: UnitSystem;
  /** Whether the physical directory covers this market. */
  directory: boolean;
  status: "active" | "planned";
}

export const markets: MarketConfig[] = [
  { code: "us", name: "United States", currency: "USD", defaultUnits: "imperial", directory: true, status: "active" },
  { code: "ca", name: "Canada", currency: "CAD", defaultUnits: "metric", directory: false, status: "planned" },
  { code: "uk", name: "United Kingdom", currency: "GBP", defaultUnits: "metric", directory: false, status: "planned" },
  { code: "au", name: "Australia", currency: "AUD", defaultUnits: "metric", directory: false, status: "planned" },
  { code: "eu", name: "Europe", currency: "EUR", defaultUnits: "metric", directory: false, status: "planned" },
];

export const activeMarket = markets[0];
