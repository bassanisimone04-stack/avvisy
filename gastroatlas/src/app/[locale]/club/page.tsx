import { NotConfigured, localeOf, sectionMeta } from "@/components/PageHelpers";
import { title } from "@/data/catalog";

export const generateMetadata = sectionMeta("club");
export default async function Club({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await localeOf(params);
  return <NotConfigured locale={locale} heading={title("club", locale)} />;
}
