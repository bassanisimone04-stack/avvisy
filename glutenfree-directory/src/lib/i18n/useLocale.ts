"use client";

import { usePathname } from "next/navigation";
import { localeFromPathname, type Locale } from "./locale";
import { getDictionary } from "./dictionary";

export function useLocale(): Locale {
  const pathname = usePathname();
  return localeFromPathname(pathname);
}

export function useDictionary() {
  const locale = useLocale();
  return { locale, t: getDictionary(locale) };
}
