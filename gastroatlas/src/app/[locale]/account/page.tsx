import { NotConfigured, localeOf, sectionMeta } from "@/components/PageHelpers";
import { title } from "@/data/catalog";

export const generateMetadata = sectionMeta("account");
export default async function Account({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await localeOf(params);
  return <NotConfigured locale={locale} heading={title("account", locale)} />;
}
