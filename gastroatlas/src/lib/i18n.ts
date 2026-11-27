export const LOCALES = ["it", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "it";
export const isLocale = (s: string | undefined): s is Locale => !!s && (LOCALES as readonly string[]).includes(s);

/** Inline bilingual text: `T(locale)("English", "Italiano")`. */
export const T = (locale: Locale) => (en: string, it: string) => (locale === "it" ? it : en);
export const other = (locale: Locale): Locale => (locale === "it" ? "en" : "it");

/** Locale-prefixed path with trailing slash: url("it", "restaurants") → /it/restaurants/ */
export const url = (locale: Locale, path = "") => `/${locale}/${path ? `${path.replace(/^\/|\/$/g, "")}/` : ""}`;

export const money = (n: number, locale: Locale) => new Intl.NumberFormat(locale, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

/** Lower-case, accent-insensitive text for searching ("Parigi" ⇄ "parigi", "Aubépine" ⇄ "aubepine"). */
export const normalize = (s: string, locale: Locale = "it") => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLocaleLowerCase(locale);
