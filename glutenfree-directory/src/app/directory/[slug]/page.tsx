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
  // Il titolo punta su ciò che questa pagina risponde e la scheda Google del
  // locale no: se è sicuro per un celiaco. Sulle ricerche per nome (es. "il
  // secchio e l'olivaro porto fluviale") è l'unico motivo per cui qualcuno
  // dovrebbe cliccare noi invece del sito del locale. Per le schede con
  // impressioni alte e zero clic (vedi audit Search Console) c'è un override
  // specifico con quartiere/via e un dettaglio di sicurezza reale.
  const override = businessSeoOverride(business.slug, "it");
  return pageMetadata({
    title: override?.title ?? (business.aicCertified
      ? `${business.name} a ${business.city}: certificato AIC senza glutine`
      : `${business.name} a ${business.city}: menu senza glutine verificato`),
    description: override?.description ?? (business.aicCertified
      ? `${business.shortDescription} Certificato AIC: indirizzo, orari, telefono e menu senza glutine verificati su Mappa Senza Glutine.`
      : `${business.shortDescription} Indirizzo, orari, telefono e menu senza glutine, verificati uno per uno su Mappa Senza Glutine.`),
    path: `/directory/${business.slug}`,
    type: "article",
    locale: "it",
  });
}

export default async function BusinessPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <BusinessDetailContent locale="it" slug={slug} />;
}
