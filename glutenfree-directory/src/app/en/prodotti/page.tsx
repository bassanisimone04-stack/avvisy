import ProductsContent from "@/components/pages/ProductsContent";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Recommended gluten-free products: pasta, bread, snacks and flours",
  description: "The selection of certified gluten-free products most loved by the community: pasta, bread, flours, snacks and gluten-free sweets.",
  path: "/prodotti",
  locale: "en",
});

export default async function ProductsPageEn({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  return <ProductsContent locale="en" sp={sp} />;
}
