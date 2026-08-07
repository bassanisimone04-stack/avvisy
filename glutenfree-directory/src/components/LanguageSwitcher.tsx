"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { localeFromPathname, localeHref, stripLocale } from "@/lib/i18n/locale";

export default function LanguageSwitcher() {
  const pathname = usePathname() ?? "/";
  const searchParams = useSearchParams();
  const locale = localeFromPathname(pathname);
  const basePath = stripLocale(pathname);
  const query = searchParams.toString();
  const suffix = query ? `?${query}` : "";

  const itHref = `${localeHref("it", basePath)}${suffix}`;
  const enHref = `${localeHref("en", basePath)}${suffix}`;

  return (
    <div className="flex items-center gap-0.5 rounded-full border border-line bg-surface p-0.5" role="group" aria-label="Cambia lingua / Change language">
      <Link
        href={itHref}
        aria-label="Italiano"
        aria-current={locale === "it" ? "true" : undefined}
        className={`flex h-7 w-7 items-center justify-center rounded-full text-base transition ${locale === "it" ? "bg-brand-soft ring-1 ring-inset ring-brand" : "opacity-50 hover:opacity-100"}`}
      >
        🇮🇹
      </Link>
      <Link
        href={enHref}
        aria-label="English"
        aria-current={locale === "en" ? "true" : undefined}
        className={`flex h-7 w-7 items-center justify-center rounded-full text-base transition ${locale === "en" ? "bg-brand-soft ring-1 ring-inset ring-brand" : "opacity-50 hover:opacity-100"}`}
      >
        🇬🇧
      </Link>
    </div>
  );
}
