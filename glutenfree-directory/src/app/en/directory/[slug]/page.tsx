import type { Metadata } from "next";
import BusinessDetailContent from "@/components/pages/BusinessDetailContent";
import { BUSINESSES, getBusinessBySlug } from "@/lib/mock-businesses";
import { getCategoryInfo, categoryLabel } from "@/lib/categories";
import { getLocalizedBusiness } from "@/lib/i18n/content-business";
import { cityName } from "@/lib/i18n/place-names";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return BUSINESSES.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const base = getBusinessBySlug(slug);
  if (!base) return {};
  const business = getLocalizedBusiness(base, "en");
  const cat = getCategoryInfo(business.category);
  return pageMetadata({
    title: `${business.name} — Gluten-Free ${cat ? categoryLabel(cat, "en") : ""} in ${cityName(business.city, "en")}`,
    description: `${business.shortDescription} Address, hours, phone, gluten-free menu and verified reviews on GlutenFree Directory.`,
    path: `/directory/${business.slug}`,
    type: "article",
    locale: "en",
  });
}

export default async function BusinessPageEn({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <BusinessDetailContent locale="en" slug={slug} />;
}
