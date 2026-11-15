"use client";

import Link from "next/link";
import { CompassIcon } from "lucide-react";
import { useDictionary } from "@/lib/i18n/useLocale";
import { localeHref } from "@/lib/i18n/locale";

export default function NotFound() {
  const { locale } = useDictionary();
  const en = locale === "en";

  return (
    <div className="container-page flex flex-col items-center gap-4 py-24 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-soft text-brand-dark"><CompassIcon size={28} /></span>
      <h1 className="text-3xl font-bold text-ink">{en ? "Page not found" : "Pagina non trovata"}</h1>
      <p className="max-w-sm text-ink-soft">{en ? "The page you're looking for doesn't exist or has been moved. Go back home or explore the directory." : "La pagina che cerchi non esiste o è stata spostata. Torna alla home o esplora la directory."}</p>
      <div className="flex gap-3">
        <Link href={localeHref(locale, "/")} className="btn btn-outline">{en ? "Back to home" : "Torna alla home"}</Link>
        <Link href={localeHref(locale, "/directory")} className="btn btn-primary">{en ? "Go to directory" : "Vai alla directory"}</Link>
      </div>
    </div>
  );
}
