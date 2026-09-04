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
      description: `Find verified gluten-free ${label} in Italy: ${cat.descriptionEn.toLowerCase()}`,
      path: `/directory?categoria=${cat.slug}`,
      locale: "en",
    });
  }

  return pageMetadata({
    title: "Directory: gluten-free restaurants, shops and hotels in Italy",
    description: "Search and filter gluten-free businesses verified by the community: restaurants, pizzerias, hotels, pharmacies, supermarkets and shops AIC-certified across Italy.",
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
