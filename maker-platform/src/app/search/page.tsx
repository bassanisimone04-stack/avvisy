import Link from "next/link";
import { Suspense } from "react";
import { BusinessRow } from "@/components/directory/business-row";
import { SimplePage } from "@/components/layout/simple-page";
import { ProductCard } from "@/components/marketplace/product-card";
import { listProducts, searchCatalog } from "@/features/catalog/repository";
import { listBusinesses } from "@/features/directory/repository";
import { searchDirectory } from "@/features/directory/search";
import { tools } from "@/features/tools/registry";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Search", description: "Search places, projects and tools.", path: "/search", index: false });

async function Results({ searchParams }: { searchParams: PageProps<"/search">["searchParams"] }) {
  const sp = await searchParams;
  const q = (Array.isArray(sp.q) ? sp.q[0] : sp.q)?.slice(0, 120).trim() ?? "";
  if (!q) return <p className="text-muted">Type something to search.</p>;
  const places = searchDirectory(listBusinesses(), { q, pageSize: 6 });
  const projects = searchCatalog(listProducts(), { q }).slice(0, 8);
  const matchingTools = tools.filter((t) => `${t.name} ${t.summary}`.toLowerCase().includes(q.toLowerCase()));
  const nothing = !places.total && !projects.length && !matchingTools.length;
  return (
    <div className="space-y-14">
      <p className="text-sm text-muted" aria-live="polite">
        Results for <strong className="text-forest">“{q}”</strong>
      </p>
      {nothing ? <p className="font-display text-2xl text-forest">No results. Try “CNC”, “walnut” or “bench”.</p> : null}
      {places.total ? (
        <section aria-labelledby="s-places">
          <div className="flex items-end justify-between">
            <h2 id="s-places" className="text-display-sm">
              Places
            </h2>
            <Link href={`/explore/us/woodworking?q=${encodeURIComponent(q)}`} className="text-sm font-medium text-forest">
              See all {places.total} on the map →
            </Link>
          </div>
          <div className="mt-6 grid gap-3 lg:grid-cols-2">
            {places.items.map((i) => (
              <BusinessRow key={i.business.slug} business={i.business} />
            ))}
          </div>
        </section>
      ) : null}
      {projects.length ? (
        <section aria-labelledby="s-projects">
          <h2 id="s-projects" className="text-display-sm">
            Projects
          </h2>
          <div className="mt-6 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {projects.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      ) : null}
      {matchingTools.length ? (
        <section aria-labelledby="s-tools">
          <h2 id="s-tools" className="text-display-sm">
            Tools
          </h2>
          <ul className="mt-4 space-y-2">
            {matchingTools.map((t) => (
              <li key={t.slug}>
                <Link href={`/tools/${t.slug}`} className="font-display text-xl text-forest hover:underline">
                  {t.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

export default function SearchPage({ searchParams }: PageProps<"/search">) {
  return (
    <SimplePage title="Search" path="/search" label="Search">
      <form action="/search" method="get" role="search" className="mb-10 flex max-w-xl gap-2">
        <label htmlFor="search-page-q" className="sr-only">
          Search
        </label>
        <input id="search-page-q" name="q" placeholder="Search places, projects and tools" className="h-12 flex-1 rounded-sm border border-line-strong bg-white px-4 focus:border-forest focus:outline-none" />
        <button type="submit" className="h-12 rounded-sm bg-forest px-5 text-sm font-medium text-ivory">
          Search
        </button>
      </form>
      <Suspense fallback={<p className="text-muted">Searching…</p>}>
        <Results searchParams={searchParams} />
      </Suspense>
    </SimplePage>
  );
}
