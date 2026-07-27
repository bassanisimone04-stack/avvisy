import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductCard from "@/components/ProductCard";
import { PRODUCTS, PRODUCT_CATEGORIES, productCategoryLabel } from "@/lib/mock-products";
import { localeHref, type Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionary";

export default function ProductsContent({
  locale,
  sp,
}: {
  locale: Locale;
  sp: Record<string, string | string[] | undefined>;
}) {
  const t = getDictionary(locale);
  const categoria = Array.isArray(sp.categoria) ? sp.categoria[0] : sp.categoria;
  const active = PRODUCT_CATEGORIES.find((c) => c === categoria);
  const products = active ? PRODUCTS.filter((p) => p.category === active) : PRODUCTS;
  const prodHref = localeHref(locale, "/prodotti");

  return (
    <div className="container-page py-10">
      <Breadcrumbs locale={locale} items={[{ name: t.nav.products, path: "/prodotti" }]} />
      <h1 className="text-3xl font-bold text-ink sm:text-4xl">{t.products.title}</h1>
      <p className="mt-2 max-w-2xl text-ink-soft">{t.products.subtitle}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link href={prodHref} className={`chip ${!active ? "chip-brand" : "chip-neutral"}`}>{t.products.all}</Link>
        {PRODUCT_CATEGORIES.map((c) => (
          <Link key={c} href={`${prodHref}?categoria=${encodeURIComponent(c)}`} className={`chip ${active === c ? "chip-brand" : "chip-neutral"}`}>{productCategoryLabel(c, locale)}</Link>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => <ProductCard key={p.id} product={p} locale={locale} />)}
      </div>
    </div>
  );
}
