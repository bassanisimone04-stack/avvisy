import type { Metadata } from "next";
import BusinessDetailContent from "@/components/pages/BusinessDetailContent";
import { BUSINESSES, getBusinessBySlug } from "@/lib/mock-businesses";
import { getCategoryInfo } from "@/lib/categories";
import { businessSeoOverride } from "@/lib/business-seo-overrides";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return BUSINESSES.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const business = getBusinessBySlug(slug);
  if (!business) return {};
  const cat = getCategoryInfo(business.category);
  // Titolo breve (nome + città) per restare nel limite SEO di ~60 caratteri
  // anche con i nomi locale più lunghi (vedi audit meta title/description):
  // il dettaglio "certificato AIC" o "verificato" resta nella description,
  // che ha più margine di caratteri. Per le schede con impressioni alte e
  // zero clic (vedi audit Search Console) c'è un override specifico con
  // quartiere/via e un dettaglio di sicurezza reale.
  const override = businessSeoOverride(business.slug, "it");
  return pageMetadata({
    title: override?.title ?? `${business.name} a ${business.city}`,
    description: override?.description ?? `${business.shortDescription} Indirizzo, orari e menu su Mappa Senza Glutine.`,
    path: `/directory/${business.slug}`,
    type: "article",
    locale: "it",
  });
}

export default async function BusinessPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <BusinessDetailContent locale="it" slug={slug} />;
}
