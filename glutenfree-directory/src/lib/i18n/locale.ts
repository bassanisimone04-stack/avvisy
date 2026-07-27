export type Locale = "it" | "en";

export const LOCALES: Locale[] = ["it", "en"];
export const DEFAULT_LOCALE: Locale = "it";

/** Antepone /en al percorso quando la lingua non è quella di default (IT, senza prefisso). */
export function localeHref(locale: Locale, path: string): string {
  if (locale === DEFAULT_LOCALE) return path;
  return path === "/" ? "/en" : `/en${path}`;
}

/** Rimuove l'eventuale prefisso /en da un pathname per ottenere il percorso "canonico" IT. */
export function stripLocale(pathname: string): string {
  if (pathname === "/en") return "/";
  if (pathname.startsWith("/en/")) return pathname.slice(3);
  return pathname;
}

export function localeFromPathname(pathname: string | null): Locale {
  if (pathname === "/en" || pathname?.startsWith("/en/")) return "en";
  return "it";
}
