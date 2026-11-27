import type { Metadata } from "next";
import { Suspense } from "react";
import { Directory, DirectoryFallback, DemoNotice } from "@/components/Directory";
import { Page } from "@/components/Section";
import { title } from "@/data/catalog";
import type { Locale } from "@/lib/i18n";
import { meta } from "@/lib/seo";

type P = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: P): Promise<Metadata> { const l = (await params).locale as Locale; return meta(l, "restaurants", title("restaurants", l)); }

export default async function Restaurants({ params }: P) {
  const locale = (await params).locale as Locale;
  return (
    <Page heading={title("restaurants", locale)}>
      <DemoNotice locale={locale} />
      <Suspense fallback={<DirectoryFallback locale={locale} />}><Directory locale={locale} /></Suspense>
    </Page>
  );
}
