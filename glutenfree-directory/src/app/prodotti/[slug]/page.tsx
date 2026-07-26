import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, MapPin } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import PlaceholderImage from "@/components/PlaceholderImage";
import RatingStars from "@/components/RatingStars";
import ProductCard from "@/components/ProductCard";
import { PRODUCTS, getProductBySlug } from "@/lib/mock-products";
import { getBusinessBySlug, BUSINESSES } from "@/lib/mock-businesses";
import { formatPrice, slugify } from "@/lib/format";
import { JsonLd, pageMetadata, productJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return pageMetadata({
    title: `${product.name} — ${product.brand} | Prodotto senza glutine`,
    description: product.description,
    path: `/prodotti/${product.slug}`,
  });
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);
  const stores = product.whereToBuy
    .map((name) => BUSINESSES.find((b) => b.name === name) ?? getBusinessBySlug(slugify(name)))
    .filter(Boolean);

  return (
    <div className="container-page py-10">
      <JsonLd data={productJsonLd(product)} />
      <Breadcrumbs items={[{ name: "Prodotti", path: "/prodotti" }, { name: product.name, path: `/prodotti/${product.slug}` }]} />

      <div className="grid gap-10 lg:grid-cols-2">
        <PlaceholderImage seed={product.imageSeed} variant="prodotto" ratio="aspect-square" className="rounded-2xl" label={product.name} />
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-muted">{product.brand}</p>
          <h1 className="mt-1 text-3xl font-bold text-ink">{product.name}</h1>
          <div className="mt-3 flex items-center gap-2">
            <RatingStars rating={product.rating} />
            <span className="text-sm text-ink-soft">{product.rating} · {product.reviewCount} recensioni</span>
          </div>
          {product.aicCertified && <span className="chip chip-brand mt-3"><BadgeCheck size={12} /> Certificato AIC</span>}
          <p className="mt-4 text-2xl font-bold text-brand-dark">{formatPrice(product.price)}</p>
          <p className="mt-4 leading-relaxed text-ink-soft">{product.description}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {product.tags.map((t) => <span key={t} className="chip chip-neutral">#{t}</span>)}
          </div>

          {stores.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-3 font-semibold text-ink">Dove trovarlo</h2>
              <ul className="space-y-2">
                {stores.map((s) => s && (
                  <li key={s.id}>
                    <Link href={`/directory/${s.slug}`} className="flex items-center gap-2 rounded-xl border border-line px-4 py-3 text-sm text-ink-soft hover:border-brand hover:text-brand-dark">
                      <MapPin size={15} /> {s.name} — {s.city}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-14">
          <h2 className="mb-5 text-2xl font-bold text-ink">Prodotti simili</h2>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
