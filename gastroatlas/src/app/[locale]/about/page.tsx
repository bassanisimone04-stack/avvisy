import { Page } from "@/components/Section";
import { localeOf, sectionMeta } from "@/components/PageHelpers";
import { title } from "@/data/catalog";
import { T } from "@/lib/i18n";

export const generateMetadata = sectionMeta("about");
export default async function About({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await localeOf(params);
  return <Page heading={title("about", locale)}><p className="lead">{T(locale)("An independent editorial guide to fine dining and culinary travel. The current restaurant catalogue is illustrative.", "Una guida editoriale indipendente al fine dining e ai viaggi gastronomici. Il catalogo attuale dei ristoranti è dimostrativo.")}</p></Page>;
}
