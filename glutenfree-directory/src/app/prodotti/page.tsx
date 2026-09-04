import ProductsContent from "@/components/pages/ProductsContent";
import { pageMetadata } from "@/lib/seo";
import { PRODUCTS, PRODUCT_CATEGORIES } from "@/lib/mock-products";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const categoriaParam = Array.isArray(sp.categoria) ? sp.categoria[0] : sp.categoria;
  const cat = PRODUCT_CATEGORIES.find((c) => c === categoriaParam);

  if (cat) {
    return pageMetadata({
      title: `${cat} senza glutine: prodotti verificati | Mappa Senza Glutine`,
      description: `${cat} certificati senza glutine in vendita in Italia: marca, prezzo e certificazione AIC verificati uno per uno.`,
      path: `/prodotti?categoria=${encodeURIComponent(cat)}`,
      locale: "it",
    });
  }

  return pageMetadata({
    title: `Prodotti senza glutine verificati (${PRODUCTS.length}) | Mappa Senza Glutine`,
    description: "Pasta, pane, farine, snack e condimenti senza glutine reali, in vendita in farmacia, supermercato o online: marca, prezzo e certificazione AIC verificati, nessuna recensione inventata.",
    path: "/prodotti",
    locale: "it",
  });
}

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  return <ProductsContent locale="it" sp={sp} />;
}
