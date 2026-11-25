import Link from "next/link";
import { ProductCard } from "@/components/marketplace/product-card";
import { difficultyOptions, formatOptions, productCategories } from "@/features/catalog/categories";
import { listProducts, searchCatalog, type CatalogQuery } from "@/features/catalog/repository";
import { cn } from "@/lib/utils";
import { AutoSubmitSelect } from "./auto-submit-select";

function href(base: string, q: CatalogQuery, patch: Partial<CatalogQuery>) {
  const next = { ...q, ...patch };
  const p = new URLSearchParams();
  if (next.q) p.set("q", next.q);
  if (next.category) p.set("category", next.category);
  if (next.format) p.set("format", next.format);
  if (next.difficulty) p.set("difficulty", next.difficulty);
  if (next.sort && next.sort !== "featured") p.set("sort", next.sort);
  const s = p.toString();
  return s ? `${base}?${s}` : base;
}

export function CatalogView({ query, base }: { query: CatalogQuery; base: string }) {
  const products = searchCatalog(listProducts(), query);
  return (
    <div className="container-page">
      {/* category rail */}
      <nav aria-label="Categories" className="-mx-5 overflow-x-auto px-5 md:mx-0 md:px-0">
        <ul className="flex min-w-max gap-2 border-b border-line pb-4">
          <li>
            <Link
              href={href(base, query, { category: "" })}
              aria-current={!query.category ? "page" : undefined}
              className={cn("block rounded-full px-4 py-2 text-sm transition-colors", !query.category ? "bg-forest text-ivory" : "text-ink/75 hover:bg-forest/[0.06] hover:text-forest")}
            >
              All projects
            </Link>
          </li>
          {productCategories.map((c) => (
            <li key={c.slug}>
              <Link
                href={href(base, query, { category: c.slug })}
                aria-current={query.category === c.slug ? "page" : undefined}
                className={cn("block rounded-full px-4 py-2 text-sm transition-colors", query.category === c.slug ? "bg-forest text-ivory" : "text-ink/75 hover:bg-forest/[0.06] hover:text-forest")}
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <form action={base} method="get" className="mt-5 flex flex-wrap items-end gap-3" aria-label="Refine projects">
        {query.category ? <input type="hidden" name="category" value={query.category} /> : null}
        <div className="min-w-0 flex-[1_1_14rem]">
          <label htmlFor="shop-q" className="mb-1.5 block text-[0.8125rem] font-medium text-forest">
            Search
          </label>
          <input id="shop-q" name="q" defaultValue={query.q} placeholder="Bench, DXF, walnut…" className="h-10 w-full rounded-sm border border-line-strong bg-white px-3 text-sm focus:border-forest focus:outline-none" />
        </div>
        <AutoSubmitSelect id="shop-format" name="format" label="Format" value={query.format ?? ""} options={[["", "Any format"], ...formatOptions.map((f) => [f, f] as [string, string])]} />
        <AutoSubmitSelect id="shop-difficulty" name="difficulty" label="Difficulty" value={query.difficulty ?? ""} options={[["", "Any level"], ...difficultyOptions.map((d) => [d, d] as [string, string])]} />
        <AutoSubmitSelect
          id="shop-sort"
          name="sort"
          label="Sort by"
          value={query.sort ?? "featured"}
          options={[
            ["featured", "Featured"],
            ["price-asc", "Price: low to high"],
            ["price-desc", "Price: high to low"],
            ["title", "Name"],
          ]}
        />
        <button type="submit" className="h-10 rounded-sm bg-forest px-4 text-sm font-medium text-ivory hover:bg-forest-deep">
          Apply
        </button>
      </form>

      <p className="mt-6 text-sm text-muted" aria-live="polite">
        <strong className="nums text-forest">{products.length}</strong> {products.length === 1 ? "project" : "projects"}
        {query.q ? <> matching “{query.q}”</> : null}
      </p>

      {products.length ? (
        <div className="mt-6 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p, i) => (
            <ProductCard key={p.slug} product={p} priority={i < 4} />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-md border border-dashed border-line-strong px-6 py-14 text-center">
          <p className="font-display text-2xl text-forest">No projects match those filters.</p>
          <Link href={base} className="mt-4 inline-block text-sm font-medium text-clay-ink underline underline-offset-4">
            Clear filters
          </Link>
        </div>
      )}
    </div>
  );
}
