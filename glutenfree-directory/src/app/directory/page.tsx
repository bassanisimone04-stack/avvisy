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
    title: "Directory: ristoranti, negozi e hotel senza glutine in Italia",
    description: "Cerca e filtra le attività senza glutine verificate dalla community: ristoranti, pizzerie, hotel, farmacie, supermercati e negozi certificati AIC in tutta Italia.",
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
