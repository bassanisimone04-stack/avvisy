import ProductsContent from "@/components/pages/ProductsContent";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Prodotti senza glutine consigliati: pasta, pane, snack e farine",
  description: "La selezione di prodotti senza glutine certificati più apprezzati dalla community: pasta, pane, farine, snack e dolci gluten free.",
  path: "/prodotti",
  locale: "it",
});

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  return <ProductsContent locale="it" sp={sp} />;
}
