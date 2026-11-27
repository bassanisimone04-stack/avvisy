import { More, Notice, Page } from "@/components/Section";
import { localeOf, sectionMeta } from "@/components/PageHelpers";
import { title } from "@/data/catalog";
import { T, url } from "@/lib/i18n";

export const generateMetadata = sectionMeta("price-index");
export default async function PriceIndex({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await localeOf(params);
  return <Page heading={title("price-index", locale)}><Notice>{T(locale)("Not enough verified data.", "Dati verificati insufficienti.")}</Notice><More href={url(locale, "methodology")} label={title("methodology", locale)} /></Page>;
}
