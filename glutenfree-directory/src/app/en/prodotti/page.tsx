import ProductsContent from "@/components/pages/ProductsContent";
import { pageMetadata } from "@/lib/seo";
import { PRODUCTS, PRODUCT_CATEGORIES, PRODUCT_CATEGORY_EN } from "@/lib/mock-products";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const categoriaParam = Array.isArray(sp.categoria) ? sp.categoria[0] : sp.categoria;
  const cat = PRODUCT_CATEGORIES.find((c) => c === categoriaParam);

  if (cat) {
    const label = PRODUCT_CATEGORY_EN[cat];
    return pageMetadata({
      title: `Gluten-free ${label.toLowerCase()}: verified products | Mappa Senza Glutine`,
      description: `Certified gluten-free ${label.toLowerCase()} on sale in Italy: brand, price and AIC certification verified one by one.`,
      path: `/prodotti?categoria=${encodeURIComponent(cat)}`,
      locale: "en",
    });
  }

  return pageMetadata({
    title: `Verified gluten-free products (${PRODUCTS.length}) | Mappa Senza Glutine`,
    description: "Real gluten-free pasta, bread, flours, snacks and condiments on sale in Italy: brand, price and AIC certification verified, no invented reviews.",
    path: "/prodotti",
    locale: "en",
  });
}

export default async function ProductsPageEn({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  return <ProductsContent locale="en" sp={sp} />;
}
