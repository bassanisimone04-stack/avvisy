import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductCard from "@/components/ProductCard";
import { PRODUCTS, PRODUCT_CATEGORIES } from "@/lib/mock-products";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Prodotti senza glutine consigliati: pasta, pane, snack e farine",
  description: "La selezione di prodotti senza glutine certificati più apprezzati dalla community: pasta, pane, farine, snack e dolci gluten free.",
  path: "/prodotti",
});

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const categoria = Array.isArray(sp.categoria) ? sp.categoria[0] : sp.categoria;
  const active = PRODUCT_CATEGORIES.find((c) => c === categoria);
  const products = active ? PRODUCTS.filter((p) => p.category === active) : PRODUCTS;

  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ name: "Prodotti", path: "/prodotti" }]} />
      <h1 className="text-3xl font-bold text-ink sm:text-4xl">Prodotti senza glutine consigliati</h1>
      <p className="mt-2 max-w-2xl text-ink-soft">
        Una selezione di prodotti certificati e apprezzati dalla community celiaca italiana, con indicazione dei punti vendita dove trovarli.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link href="/prodotti" className={`chip ${!active ? "chip-brand" : "chip-neutral"}`}>Tutti</Link>
        {PRODUCT_CATEGORIES.map((c) => (
          <Link key={c} href={`/prodotti?categoria=${encodeURIComponent(c)}`} className={`chip ${active === c ? "chip-brand" : "chip-neutral"}`}>{c}</Link>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}
