import type { Metadata } from "next";
import ProductDetailContent from "@/components/pages/ProductDetailContent";
import { PRODUCTS, getProductBySlug } from "@/lib/mock-products";
import { pageMetadata } from "@/lib/seo";

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
    locale: "it",
  });
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProductDetailContent locale="it" slug={slug} />;
}
