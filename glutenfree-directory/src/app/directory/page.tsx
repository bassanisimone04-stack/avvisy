import Link from "next/link";
import { SlidersHorizontal, SearchX } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import BusinessCard from "@/components/BusinessCard";
import DirectoryFilters from "@/components/DirectoryFilters";
import SortSelect from "@/components/SortSelect";
import { JsonLd, itemListJsonLd, pageMetadata } from "@/lib/seo";
import { parseFilters, filterBusinesses } from "@/lib/filter-businesses";
import { getCategoryInfo } from "@/lib/categories";

export const metadata = pageMetadata({
  title: "Directory: ristoranti, negozi e hotel senza glutine in Italia",
  description: "Cerca e filtra migliaia di attività senza glutine: ristoranti, pizzerie, hotel, farmacie, supermercati e negozi certificati AIC in tutta Italia.",
  path: "/directory",
});

const PAGE_SIZE = 9;

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const filters = parseFilters(sp);
  const results = filterBusinesses(filters);
  const page = Math.max(1, Number(Array.isArray(sp.page) ? sp.page[0] : sp.page) || 1);
  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const pageResults = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const catInfo = filters.categoria ? getCategoryInfo(filters.categoria) : undefined;

  const title = catInfo
    ? `${catInfo.labelPlural}${filters.comune ? ` a ${filters.comune}` : ""}`
    : filters.comune
      ? `Attività senza glutine a ${filters.comune}`
      : "Directory attività senza glutine";

  return (
    <div className="container-page py-10">
      <JsonLd data={itemListJsonLd(pageResults.map((b) => ({ name: b.name, path: `/directory/${b.slug}` })))} />
      <Breadcrumbs items={[{ name: "Directory", path: "/directory" }]} />

      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-ink">{title}</h1>
          <p className="mt-1 text-ink-soft">{results.length} attivit{results.length === 1 ? "à trovata" : "à trovate"}</p>
        </div>
        <SortSelect />
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <DirectoryFilters />

        <div>
          {pageResults.length === 0 ? (
            <div className="card card-soft flex flex-col items-center gap-3 p-14 text-center">
              <SearchX size={32} className="text-muted" />
              <p className="font-semibold text-ink">Nessuna attività trovata</p>
              <p className="max-w-sm text-sm text-ink-soft">Prova a modificare o rimuovere alcuni filtri per ampliare la ricerca.</p>
              <Link href="/directory" className="btn btn-outline mt-2"><SlidersHorizontal size={15} /> Reimposta filtri</Link>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {pageResults.map((b) => <BusinessCard key={b.id} business={b} />)}
            </div>
          )}

          {totalPages > 1 && (
            <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Paginazione risultati">
              {Array.from({ length: totalPages }).map((_, i) => {
                const params = new URLSearchParams(sp as Record<string, string>);
                params.set("page", String(i + 1));
                return (
                  <Link
                    key={i}
                    href={`/directory?${params.toString()}`}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium ${page === i + 1 ? "bg-brand text-white" : "bg-surface-2 text-ink-soft hover:bg-surface"}`}
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
