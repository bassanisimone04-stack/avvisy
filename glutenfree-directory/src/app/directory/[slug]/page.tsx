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
  // Il titolo punta su ciò che questa pagina risponde e la scheda Google del
  // locale no: se è sicuro per un celiaco. Sulle ricerche per nome (es. "il
  // secchio e l'olivaro porto fluviale") è l'unico motivo per cui qualcuno
  // dovrebbe cliccare noi invece del sito del locale.
  return pageMetadata({
    title: business.aicCertified
      ? `${business.name} a ${business.city}: certificato AIC senza glutine`
      : `${business.name} a ${business.city}: menu senza glutine verificato`,
    description: business.aicCertified
      ? `${business.shortDescription} Certificato AIC: indirizzo, orari, telefono e menu senza glutine verificati su Mappa Senza Glutine.`
      : `${business.shortDescription} Indirizzo, orari, telefono e menu senza glutine, verificati uno per uno su Mappa Senza Glutine.`,
    path: `/directory/${business.slug}`,
    type: "article",
    locale: "it",
  });
}

export default async function BusinessPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <BusinessDetailContent locale="it" slug={slug} />;
}
