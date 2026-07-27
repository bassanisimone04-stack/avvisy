import DirectoryContent from "@/components/pages/DirectoryContent";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Directory: gluten-free restaurants, shops and hotels in Italy",
  description: "Search and filter thousands of gluten-free businesses: restaurants, pizzerias, hotels, pharmacies, supermarkets and shops AIC-certified across Italy.",
  path: "/directory",
  locale: "en",
});

export default async function DirectoryPageEn({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  return <DirectoryContent locale="en" sp={sp} />;
}
