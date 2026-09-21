import type { Metadata } from "next";
import ProductDetailContent from "@/components/pages/ProductDetailContent";
import { PRODUCTS, getProductBySlug } from "@/lib/mock-products";
import { getLocalizedProduct } from "@/lib/i18n/content-product";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const base = getProductBySlug(slug);
  if (!base) return {};
  const product = getLocalizedProduct(base, "en");
  return pageMetadata({
    title: product.metaTitle ?? `${product.name} ${product.brand}`,
    description: product.metaDescription ?? `${product.description} Indicative price and where to find it on Mappa Senza Glutine.`,
    path: `/prodotti/${product.slug}`,
    type: "article",
    locale: "en",
  });
}

export default async function ProductPageEn({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProductDetailContent locale="en" slug={slug} />;
}
