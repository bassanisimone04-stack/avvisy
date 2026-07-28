import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { localeHref, type Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionary";

export default function Breadcrumbs({ items, locale = "it" }: { items: { name: string; path: string }[]; locale?: Locale }) {
  const t = getDictionary(locale);
  const full = [{ name: t.common.home, path: "/" }, ...items];
  const localizedFull = full.map((item) => ({ name: item.name, path: localeHref(locale, item.path) }));

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <JsonLd data={breadcrumbJsonLd(localizedFull)} />
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
        {localizedFull.map((item, i) => (
          <li key={item.path} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight size={14} className="text-muted" />}
            {i === localizedFull.length - 1 ? (
              <span className="font-medium text-ink" aria-current="page">{item.name}</span>
            ) : (
              <Link href={item.path} className="hover:text-brand-dark link-underline">{item.name}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
