import DirectoryContent from "@/components/pages/DirectoryContent";
import { pageMetadata } from "@/lib/seo";
import { getCategoryInfo, categoryLabelPlural } from "@/lib/categories";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const categoriaParam = Array.isArray(sp.categoria) ? sp.categoria[0] : sp.categoria;
  const cat = categoriaParam ? getCategoryInfo(categoriaParam) : undefined;

  if (cat) {
    return pageMetadata({
      title: `${categoryLabelPlural(cat, "it")} senza glutine in Italia`,
      description: cat.description,
      path: `/directory?categoria=${cat.slug}`,
      locale: "it",
    });
  }

  return pageMetadata({
    title: "Ristoranti e locali certificati AIC in Italia",
    description: "La mappa dei ristoranti certificati AIC e dei locali senza glutine verificati in Italia: filtra per città e categoria, trova indirizzo e orari.",
    path: "/directory",
    locale: "it",
  });
}

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  return <DirectoryContent locale="it" sp={sp} />;
}
