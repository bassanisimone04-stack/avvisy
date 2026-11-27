import type { Metadata } from "next";
import { Suspense } from "react";
import { ComparisonView } from "@/components/ComparisonView";
import { Page } from "@/components/Section";
import { title } from "@/data/catalog";
import type { Locale } from "@/lib/i18n";
import { meta } from "@/lib/seo";

type P = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: P): Promise<Metadata> { const l = (await params).locale as Locale; return meta(l, "compare", title("compare", l)); }
export default async function Compare({ params }: P) {
  const locale = (await params).locale as Locale;
  return <Page heading={title("compare", locale)}><Suspense fallback={<p className="muted">…</p>}><ComparisonView locale={locale} /></Suspense></Page>;
}
