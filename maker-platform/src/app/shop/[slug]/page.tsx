import { FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BusinessRow } from "@/components/directory/business-row";
import { BuyBox } from "@/components/marketplace/buy-box";
import { CatalogView } from "@/components/marketplace/catalog-view";
import { PlanSheet } from "@/components/marketplace/plan-sheet";
import { Difficulty, ProductCard } from "@/components/marketplace/product-card";
import { ShopHeader } from "@/components/marketplace/shop-header";
import { JsonLd } from "@/components/seo/json-ld";
import { DemoBadge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { activeVerticals, getVertical } from "@/config/verticals";
import { formatDescriptions, productCategories } from "@/features/catalog/categories";
import { getProduct, getRelatedProducts, listProducts, parseCatalogQuery } from "@/features/catalog/repository";
import { getBusinessesByCategory } from "@/features/directory/repository";
import { formatNumber, inchesToCm } from "@/lib/format";
import { pageMetadata, productJsonLd } from "@/lib/seo";

/**
 * /shop/[slug] serves two kinds of URL (docs/SEO_STRATEGY.md):
 *   /shop/woodworking      → catalog filtered by vertical
 *   /shop/<product-slug>   → product page
 * Product slugs must never collide with vertical slugs.
 */
export function generateStaticParams() {
  return [...activeVerticals.map((v) => ({ slug: v.slug })), ...listProducts().map((p) => ({ slug: p.slug }))];
}

export async function generateMetadata({ params }: PageProps<"/shop/[slug]">) {
  const { slug } = await params;
  const vertical = getVertical(slug);
  if (vertical) {
    return pageMetadata({ title: `${vertical.name} plans & files`, description: vertical.summary, path: `/shop/${slug}`, index: false });
  }
  const p = getProduct(slug);
  if (!p) return {};
  return pageMetadata({ title: `${p.title} — ${p.subtitle}`, description: p.description[0], path: `/shop/${p.slug}`, index: !p.isDemo });
}

export default async function ShopSlugPage({ params, searchParams }: PageProps<"/shop/[slug]">) {
  const { slug } = await params;
  const vertical = getVertical(slug);
  if (vertical) {
    if (vertical.status !== "active") notFound();
    return (
      <>
        <ShopHeader
          title={`${vertical.name} plans & files`}
          crumbs={[
            { href: "/", label: "Home" },
            { href: "/shop", label: "Digital Projects" },
            { href: `/shop/${vertical.slug}`, label: vertical.name },
          ]}
        />
        <Suspense fallback={<div className="container-page h-96" />}>
          <VerticalCatalog vertical={vertical.slug} searchParams={searchParams} />
        </Suspense>
      </>
    );
  }
  const product = getProduct(slug);
  if (!product) notFound();
  return <ProductDetail slug={product.slug} />;
}

async function VerticalCatalog({ vertical, searchParams }: { vertical: string; searchParams: PageProps<"/shop/[slug]">["searchParams"] }) {
  return <CatalogView query={{ ...parseCatalogQuery(await searchParams), vertical }} base={`/shop/${vertical}`} />;
}

function ProductDetail({ slug }: { slug: string }) {
  const p = getProduct(slug)!;
  const category = productCategories.find((c) => c.slug === p.category);
  const related = getRelatedProducts(p, 3);
  const makers = getBusinessesByCategory(p.makeLocally, 3);

  return (
    <article>
      <JsonLd data={productJsonLd(p)} />
      <div className="container-page pt-6 md:pt-8">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/shop", label: "Digital Projects" },
            { href: `/shop?category=${p.category}`, label: category?.name ?? "Projects" },
            { href: `/shop/${p.slug}`, label: p.title },
          ]}
        />
      </div>

      <div className="container-page mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-16">
        {/* gallery */}
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-lg border border-line bg-white">
            <PlanSheet product={p} size="lg" className="aspect-[4/3.3]" priority />
            {p.isDemo ? <DemoBadge className="absolute top-5 left-5" label="Demo product" /> : null}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <figure className="relative aspect-[4/3] overflow-hidden rounded-md">
              <Image src={p.cover} alt="" fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover" />
              <figcaption className="absolute bottom-2 left-2 rounded-xs bg-black/40 px-2 py-0.5 text-[0.6875rem] text-white backdrop-blur-sm">Material reference</figcaption>
            </figure>
            <div className="flex flex-col rounded-md border border-line bg-ivory-deep/60 p-4">
              <p className="eyebrow">In the download</p>
              <ul className="mt-4 space-y-2.5">
                {p.includes.map((f) => (
                  <li key={`${f.name}-${f.format}`} className="flex items-center gap-2 text-sm">
                    <FileText className="size-4 shrink-0 text-sage-ink" aria-hidden />
                    <span className="truncate">{f.name}</span>
                    <span className="ml-auto font-mono text-[0.6875rem] text-muted">{f.format}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* buy column */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="eyebrow">{category?.name}</p>
          <h1 className="mt-3 text-display-lg text-balance">{p.title}</h1>
          <p className="mt-3 text-[1.0625rem] leading-relaxed text-muted">{p.subtitle}</p>

          <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line bg-line text-sm">
            {[
              ["Difficulty", <Difficulty key="d" level={p.difficulty} />],
              ["Formats", p.formats.join(" · ")],
              [
                "Finished size",
                p.dimensions
                  ? `${p.dimensions.width}″ × ${p.dimensions.depth}″ × ${p.dimensions.height}″ (${formatNumber(inchesToCm(p.dimensions.width), 0)} × ${formatNumber(inchesToCm(p.dimensions.depth), 0)} × ${formatNumber(inchesToCm(p.dimensions.height), 0)} cm)`
                  : "—",
              ],
              ["Units", "Imperial, with metric"],
            ].map(([k, v]) => (
              <div key={k as string} className="bg-white p-3.5">
                <dt className="text-xs text-muted">{k}</dt>
                <dd className="mt-1 text-ink">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 border-t border-line pt-8">
            <BuyBox product={p} />
          </div>
        </div>
      </div>

      <div className="container-page mt-20 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-16">
        <section aria-labelledby="desc-h">
          <h2 id="desc-h" className="text-display-sm">
            About this project
          </h2>
          <div className="prose-editorial mt-4">
            {p.description.map((d) => (
              <p key={d}>{d}</p>
            ))}
          </div>
          <ul className="mt-6 grid gap-3 sm:grid-cols-3">
            {p.highlights.map((h, i) => (
              <li key={h} className="rounded-md border border-line bg-white p-4">
                <span className="nums font-display text-[1.25rem] text-clay-ink italic">0{i + 1}</span>
                <p className="mt-1 text-sm text-ink">{h}</p>
              </li>
            ))}
          </ul>

          <h3 className="mt-12 text-[1.375rem]">Files &amp; compatibility</h3>
          <table className="mt-4 w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line-strong text-xs text-muted">
                <th scope="col" className="pb-2 font-medium">File</th>
                <th scope="col" className="pb-2 font-medium">Format</th>
                <th scope="col" className="pb-2 font-medium">Details</th>
              </tr>
            </thead>
            <tbody>
              {p.includes.map((f) => (
                <tr key={`${f.name}-${f.format}`} className="border-b border-line">
                  <td className="py-3 pr-3 text-ink">{f.name}</td>
                  <td className="py-3 pr-3">
                    <span className="font-mono text-xs">{f.format}</span> <span className="text-xs text-muted">— {formatDescriptions[f.format]}</span>
                  </td>
                  <td className="py-3 text-muted">{f.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <ul className="mt-4 space-y-1 text-sm text-muted">
            {p.compatibility.map((c) => (
              <li key={c}>· {c}</li>
            ))}
          </ul>
          {p.materials.length ? (
            <>
              <h3 className="mt-10 text-[1.375rem]">Materials</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {p.materials.map((m) => (
                  <li key={m} className="rounded-xs bg-ivory-deep px-2.5 py-1 text-sm">
                    {m}
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </section>

        <aside className="space-y-6">
          <div className="rounded-md bg-forest p-6 text-ivory">
            <p className="text-[0.6875rem] font-semibold tracking-[0.14em] text-ivory/75 uppercase">Licenses in plain English</p>
            <dl className="mt-4 space-y-4 text-sm">
              <div>
                <dt className="font-display text-lg">Personal</dt>
                <dd className="mt-1 text-ivory/75">Make as many as you like for yourself, family and friends.</dd>
              </div>
              <div>
                <dt className="font-display text-lg">Commercial</dt>
                <dd className="mt-1 text-ivory/75">Sell the finished pieces you make. Reselling or sharing the files is never allowed.</dd>
              </div>
            </dl>
            <Link href="/legal/digital-license" className="mt-5 inline-block text-sm text-[#E5A98A] underline underline-offset-4">
              Read the license draft
            </Link>
          </div>
          <div className="rounded-md border border-dashed border-line-strong p-5 text-sm text-muted">
            Files are checked by a person before any product goes on sale. Automatically generated technical files are never sold as production-ready.
          </div>
        </aside>
      </div>

      {makers.length ? (
        <section aria-labelledby="local-h" className="container-page mt-20">
          <div className="border-t border-line pt-12">
            <p className="eyebrow">Make it locally</p>
            <h2 id="local-h" className="mt-2 text-display-sm">
              Shops and suppliers that can help
            </h2>
            <div className="mt-6 grid gap-3 lg:grid-cols-3">
              {makers.map((b) => (
                <BusinessRow key={b.slug} business={b} compact />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {related.length ? (
        <section aria-labelledby="rel-h" className="container-page mt-20">
          <div className="border-t border-line pt-12">
            <h2 id="rel-h" className="text-display-sm">
              You might also build
            </h2>
            <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <ProductCard key={r.slug} product={r} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </article>
  );
}
