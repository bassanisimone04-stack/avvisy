import DirectoryContent from "@/components/pages/DirectoryContent";
import { pageMetadata } from "@/lib/seo";
import { getCategoryInfo, categoryLabelPlural } from "@/lib/categories";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const categoriaParam = Array.isArray(sp.categoria) ? sp.categoria[0] : sp.categoria;
  const cat = categoriaParam ? getCategoryInfo(categoriaParam) : undefined;

  if (cat) {
    const label = categoryLabelPlural(cat, "en").toLowerCase();
    return pageMetadata({
      title: `Gluten-free ${label} in Italy`,
      description: cat.descriptionEn,
      path: `/directory?categoria=${cat.slug}`,
      locale: "en",
    });
  }

  return pageMetadata({
    title: "AIC-Certified Restaurants and Venues in Italy",
    description: "The map of AIC-certified restaurants and verified gluten-free venues in Italy: filter by city and category, find address and hours.",
    path: "/directory",
    locale: "en",
  });
}

export default async function DirectoryPageEn({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  return <DirectoryContent locale="en" sp={sp} />;
}
