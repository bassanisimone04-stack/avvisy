import { BRAND, type Locale } from "@/config/brand";
import { en, type Dict } from "./en";
import { it } from "./it";

export const LOCALES = BRAND.locales as readonly Locale[];
export const isLocale = (s: string | undefined): s is Locale => !!s && (LOCALES as readonly string[]).includes(s);

const DICTS: Record<Locale, Dict> = { en, it };
export function getDict(locale: Locale): Dict {
  return DICTS[locale] ?? en;
}

/** Interpolate {placeholders}. */
export function fmt(s: string, vars: Record<string, string | number> = {}): string {
  return s.replace(/\{(\w+)\}/g, (_, k: string) => (vars[k] !== undefined ? String(vars[k]) : `{${k}}`));
}

export const LOCALE_NAMES: Record<Locale, string> = { en: "English", it: "Italiano" };
export const HTML_LANG: Record<Locale, string> = { en: "en", it: "it" };

/** Inline bilingual text for page copy that is not worth a dictionary key. */
export const tx = (locale: string, en: string, it: string) => (locale === "it" ? it : en);
