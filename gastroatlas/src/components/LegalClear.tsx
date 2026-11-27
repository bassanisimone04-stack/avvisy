"use client";

import { T, type Locale } from "@/lib/i18n";
import { clearLocalData } from "@/lib/store";

export function LegalClear({ locale }: { locale: Locale }) {
  return <button id="clear-data" type="button" onClick={clearLocalData}>{T(locale)("Clear local preferences", "Cancella le preferenze locali")}</button>;
}
