"use client";

import type { Business } from "@/lib/types";
import type { Locale } from "@/lib/i18n/locale";
import BusinessMapExplorer from "./BusinessMapExplorer";

/** Mappa dei soli ristoranti e pizzerie aderenti al programma AIC (l'elenco arriva già filtrato). */
export default function AicRestaurantsMap({ businesses, locale }: { businesses: Business[]; locale: Locale }) {
  return <BusinessMapExplorer businesses={businesses} locale={locale} variant="aic" />;
}
