import type { Metadata } from "next";
import { Notice, Page } from "@/components/Section";
import { localeOf } from "@/components/PageHelpers";
import { T } from "@/lib/i18n";
import { meta } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> { const l = await localeOf(params); return meta(l, "experiences/last-minute", T(l)("Last-minute tables", "Tavoli dell’ultimo minuto")); }
export default async function LastMinute({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await localeOf(params);
  const t = T(locale);
  return <Page heading={t("Last-minute tables", "Tavoli dell’ultimo minuto")}><Notice>{t("Live availability is awaiting partner integration.", "La disponibilità in tempo reale è in attesa dell’integrazione con i partner.")}</Notice></Page>;
}
