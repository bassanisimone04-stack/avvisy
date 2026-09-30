import type { Metadata } from "next";
import BusinessDetailContent from "@/components/pages/BusinessDetailContent";
import { BUSINESSES, getBusinessBySlug } from "@/lib/mock-businesses";
import { getLocalizedBusiness } from "@/lib/i18n/content-business";
import { cityName } from "@/lib/i18n/place-names";
import { businessSeoOverride } from "@/lib/business-seo-overrides";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return BUSINESSES.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const base = getBusinessBySlug(slug);
  if (!base) return {};
  const business = getLocalizedBusiness(base, "en");
  const override = businessSeoOverride(base.slug, "en");
  return pageMetadata({
    title: override?.title ?? `${business.name} in ${cityName(business.city, "en")}`,
    description: override?.description ?? `${business.shortDescription} Address, hours and menu on Mappa Senza Glutine.`,
    path: `/directory/${business.slug}`,
    type: "article",
    locale: "en",
  });
}

export default async function BusinessPageEn({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <BusinessDetailContent locale="en" slug={slug} />;
}
