import type { Metadata } from "next";
import BusinessDetailContent from "@/components/pages/BusinessDetailContent";
import { BUSINESSES, getBusinessBySlug } from "@/lib/mock-businesses";
import { getCategoryInfo } from "@/lib/categories";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return BUSINESSES.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const business = getBusinessBySlug(slug);
  if (!business) return {};
  const cat = getCategoryInfo(business.category);
  return pageMetadata({
    title: `${business.name} — ${cat?.label} a ${business.city} senza glutine`,
    description: `${business.shortDescription} Indirizzo, orari, telefono, menu senza glutine e recensioni verificate su Mappa Senza Glutine.`,
    path: `/directory/${business.slug}`,
    type: "article",
    locale: "it",
  });
}

export default async function BusinessPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <BusinessDetailContent locale="it" slug={slug} />;
}
