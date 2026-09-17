import DirectoryContent from "@/components/pages/DirectoryContent";
import { pageMetadata } from "@/lib/seo";
import { getCategoryInfo, categoryLabelPlural } from "@/lib/categories";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const categoriaParam = Array.isArray(sp.categoria) ? sp.categoria[0] : sp.categoria;
  const cat = categoriaParam ? getCategoryInfo(categoriaParam) : undefined;

  if (cat) {
    const label = categoryLabelPlural(cat, "it").toLowerCase();
    return pageMetadata({
      title: `${categoryLabelPlural(cat, "it")} senza glutine in Italia`,
      description: `Trova ${label} senza glutine verificati in Italia: ${cat.description.toLowerCase()}`,
      path: `/directory?categoria=${cat.slug}`,
      locale: "it",
    });
  }

  return pageMetadata({
    title: "Mappa dei ristoranti AIC e locali senza glutine in Italia",
    description: "La mappa dei ristoranti certificati AIC e dei locali senza glutine verificati in Italia: filtra per città, categoria e certificazione e trova indirizzo, orari e menu.",
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
