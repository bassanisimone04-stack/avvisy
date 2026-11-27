import { NotConfigured, localeOf, sectionMeta } from "@/components/PageHelpers";
import { title } from "@/data/catalog";

export const generateMetadata = sectionMeta("business");
export default async function Business({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await localeOf(params);
  return <NotConfigured locale={locale} heading={title("business", locale)} />;
}
