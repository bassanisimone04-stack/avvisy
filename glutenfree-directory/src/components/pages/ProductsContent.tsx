import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductCard from "@/components/ProductCard";
import FaqAccordion from "@/components/FaqAccordion";
import { JsonLd, faqJsonLd } from "@/lib/seo";
import { PRODUCTS, PRODUCT_CATEGORIES, productCategoryLabel } from "@/lib/mock-products";
import { localeHref, type Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionary";
import { PRODUCT_FAQS_IT, PRODUCT_FAQS_EN } from "@/lib/product-faqs";

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
  const esigenzaRaw = Array.isArray(sp.esigenza) ? sp.esigenza[0] : sp.esigenza;
  // Altre esigenze, ricavate dai tag gia' presenti sulle schede prodotto.
  const NEEDS = [
    { slug: "senza-lattosio", tag: "senza lattosio", label: locale === "en" ? "Lactose-free" : "Senza lattosio" },
    { slug: "vegano", tag: "vegano", label: locale === "en" ? "Vegan" : "Vegano" },
  ];
  const need = NEEDS.find((n) => n.slug === esigenzaRaw);
  const products = PRODUCTS.filter((p) => (!active || p.category === active) && (!need || p.tags.includes(need.tag)));
  const prodHref = localeHref(locale, "/prodotti");
  const faqs = locale === "en" ? PRODUCT_FAQS_EN : PRODUCT_FAQS_IT;

  return (
    <div className="container-page py-10">
      <JsonLd data={faqJsonLd(faqs)} />
      <Breadcrumbs locale={locale} items={[{ name: t.nav.products, path: "/prodotti" }]} />
      <h1 className="font-editorial text-3xl font-semibold text-ink sm:text-4xl">{t.products.title}</h1>
      <p className="mt-2 max-w-2xl text-ink-soft">{t.products.subtitle}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link href={prodHref} className={`chip ${!active ? "chip-brand" : "chip-neutral"}`}>{t.products.all}</Link>
        {PRODUCT_CATEGORIES.map((c) => (
          <Link key={c} href={`${prodHref}?categoria=${encodeURIComponent(c)}`} className={`chip ${active === c ? "chip-brand" : "chip-neutral"}`}>{productCategoryLabel(c, locale)}</Link>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-sm text-ink-soft">{locale === "en" ? "Also free from:" : "Anche:"}</span>
        {NEEDS.map((n) => {
          const href = need?.slug === n.slug
            ? `${prodHref}${active ? `?categoria=${encodeURIComponent(active)}` : ""}`
            : `${prodHref}?${active ? `categoria=${encodeURIComponent(active)}&` : ""}esigenza=${n.slug}`;
          return (
            <Link key={n.slug} href={href} aria-pressed={need?.slug === n.slug} className={`chip ${need?.slug === n.slug ? "chip-brand" : "chip-neutral"}`}>
              {n.label} ({PRODUCTS.filter((p) => (!active || p.category === active) && p.tags.includes(n.tag)).length})
            </Link>
          );
        })}
      </div>

      {products.length === 0 && (
        <p className="mt-8 text-sm text-ink-soft">{locale === "en" ? "No products match these filters yet." : "Nessun prodotto corrisponde a questi filtri, per ora."}</p>
      )}

      <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => <ProductCard key={p.id} product={p} locale={locale} />)}
      </div>

      <div className="mx-auto mt-14 max-w-3xl">
        <h2 className="mb-4 font-editorial text-xl font-semibold text-ink">{t.directory.faqTitle}</h2>
        <FaqAccordion items={faqs} />
      </div>
    </div>
  );
}
