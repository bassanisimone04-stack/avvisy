import { NotConfigured, localeOf, sectionMeta } from "@/components/PageHelpers";
import { title } from "@/data/catalog";

export const generateMetadata = sectionMeta("gifts");
export default async function Gifts({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await localeOf(params);
  return <NotConfigured locale={locale} heading={title("gifts", locale)} />;
}
