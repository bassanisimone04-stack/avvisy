import { HubPage, hubMetadata } from "@/features/directory/hubPage";
import { getDataset } from "@/db/repository";
import { LOCALES } from "@/i18n";

type P = { params: Promise<{ locale: string; country?: string; place?: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };
export const dynamicParams = false; // unknown regions/cities → real 404
export async function generateStaticParams() {
  const d = await getDataset();
  const places = [...d.cities.map((c) => ({ country: c.countrySlug, place: c.slug })), ...d.regions.map((r) => ({ country: r.countrySlug, place: r.slug }))];
  return LOCALES.flatMap((locale) => places.map((p) => ({ locale, ...p })));
}
export const generateMetadata = (p: P) => hubMetadata(p);
export default function Page(p: P) {
  return HubPage(p);
}
