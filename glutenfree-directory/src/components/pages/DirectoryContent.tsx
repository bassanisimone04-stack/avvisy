import Link from "next/link";
import { SlidersHorizontal, SearchX } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import BusinessCard from "@/components/BusinessCard";
import DirectoryFilters from "@/components/DirectoryFilters";
import SortSelect from "@/components/SortSelect";
import { JsonLd, itemListJsonLd } from "@/lib/seo";
import { parseFilters, filterBusinesses } from "@/lib/filter-businesses";
import { getCategoryInfo, categoryLabelPlural } from "@/lib/categories";
import { getLocalizedBusiness } from "@/lib/i18n/content-business";
import { cityName } from "@/lib/i18n/place-names";
import { localeHref, type Locale } from "@/lib/i18n/locale";
import { getDictionary, tf } from "@/lib/i18n/dictionary";

const PAGE_SIZE = 9;

export default function DirectoryContent({
  locale,
  sp,
}: {
  locale: Locale;
  sp: Record<string, string | string[] | undefined>;
}) {
  const t = getDictionary(locale);
  const filters = parseFilters(sp);
  const results = filterBusinesses(filters);
  const page = Math.max(1, Number(Array.isArray(sp.page) ? sp.page[0] : sp.page) || 1);
  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const pageResults = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((b) => getLocalizedBusiness(b, locale));
  const catInfo = filters.categoria ? getCategoryInfo(filters.categoria) : undefined;
  const dirHref = localeHref(locale, "/directory");
  const cityLabel = filters.comune ? cityName(filters.comune, locale) : undefined;

  const title = catInfo
    ? tf(cityLabel ? t.directory.titleCategoryCity : t.directory.titleCategory, { category: categoryLabelPlural(catInfo, locale), city: cityLabel ?? "" })
    : cityLabel
      ? tf(t.directory.titleCity, { city: cityLabel })
      : t.directory.title;

  return (
    <div className="container-page py-10">
      <JsonLd data={itemListJsonLd(pageResults.map((b) => ({ name: b.name, path: localeHref(locale, `/directory/${b.slug}`) })))} />
      <Breadcrumbs locale={locale} items={[{ name: t.nav.directory, path: "/directory" }]} />

      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-editorial text-3xl font-semibold text-ink">{title}</h1>
          <p className="mt-1 text-ink-soft">{results.length} {results.length === 1 ? t.directory.resultFound : t.directory.resultsFound}</p>
        </div>
        <SortSelect />
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <DirectoryFilters />

        <div>
          {pageResults.length === 0 ? (
            <div className="card card-soft flex flex-col items-center gap-3 p-14 text-center">
              <SearchX size={32} className="text-muted" />
              <p className="font-semibold text-ink">{t.directory.emptyTitle}</p>
              <p className="max-w-sm text-sm text-ink-soft">{t.directory.emptyBody}</p>
              <Link href={dirHref} className="btn btn-outline mt-2"><SlidersHorizontal size={15} /> {t.directory.resetFilters}</Link>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {pageResults.map((b) => <BusinessCard key={b.id} business={b} locale={locale} />)}
            </div>
          )}

          {totalPages > 1 && (
            <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Pagination">
              {Array.from({ length: totalPages }).map((_, i) => {
                const params = new URLSearchParams(sp as Record<string, string>);
                params.set("page", String(i + 1));
                return (
                  <Link
                    key={i}
                    href={`${dirHref}?${params.toString()}`}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium ${page === i + 1 ? "bg-brand-solid text-white" : "bg-surface-2 text-ink-soft hover:bg-surface"}`}
                  >
                    {i + 1}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
