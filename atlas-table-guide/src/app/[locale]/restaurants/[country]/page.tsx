import { HubPage, hubMetadata } from "@/features/directory/hubPage";
import { getDataset } from "@/db/repository";
import { LOCALES } from "@/i18n";

type P = { params: Promise<{ locale: string; country?: string; place?: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };
export const dynamicParams = false; // unknown countries → real 404
export async function generateStaticParams() {
  const d = await getDataset();
  return LOCALES.flatMap((locale) => d.countries.map((c) => ({ locale, country: c.slug })));
}
export const generateMetadata = (p: P) => hubMetadata(p);
export default function Page(p: P) {
  return HubPage(p);
}
