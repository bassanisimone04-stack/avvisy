import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Directory, DirectoryFallback, DemoNotice } from "@/components/Directory";
import { Page } from "@/components/Section";
import { cities, findCity } from "@/data/catalog";
import { LOCALES, type Locale } from "@/lib/i18n";
import { meta } from "@/lib/seo";

export const dynamicParams = false;
export const generateStaticParams = () => LOCALES.flatMap((locale) => cities.map((c) => ({ locale, city: c.slug })));
type P = { params: Promise<{ locale: string; city: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, city } = await params;
  const c = findCity(city);
  return meta(locale as Locale, `restaurants/${city}`, c?.name[locale as Locale]);
}

export default async function CityRestaurants({ params }: P) {
  const { locale: l, city } = await params;
  const locale = l as Locale;
  const c = findCity(city);
  if (!c) notFound();
  return (
    <Page heading={c.name[locale]}>
      <DemoNotice locale={locale} />
      <Suspense fallback={<DirectoryFallback locale={locale} city={city} />}><Directory locale={locale} forcedCity={city} /></Suspense>
    </Page>
  );
}
