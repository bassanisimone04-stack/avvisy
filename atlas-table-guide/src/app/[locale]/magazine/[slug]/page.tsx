import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { pageCtx } from "../../_ctx";
import { getDataset } from "@/db/repository";
import { LOCALES, tx } from "@/i18n";
import { buildMetadata } from "@/seo/metadata";
import { PageShell } from "@/features/PageShell";
import { SmartImage, imageSrc } from "@/components/media/SmartImage";
import { PhotoCard } from "@/components/cards/Cards";
import { buildAlt } from "@/lib/alt";
import { t, type ArticleCategory } from "@/db/types";
import { JsonLd } from "@/components/JsonLd";
import { buildArticleJsonLd, buildItemListJsonLd } from "@/seo/jsonld";
import { slugify } from "@/lib/slug";
import { formatDate } from "@/lib/format";
import { RestaurantCard } from "@/components/cards/RestaurantCard";
import { cardInfo } from "@/features/helpers";
import { NewsletterForm } from "@/features/forms/Forms";
import { BRAND } from "@/config/brand";
import { Notice } from "@/components/ui/ui";

export const revalidate = 3600;
export const dynamicParams = false;
const CATEGORIES: ArticleCategory[] = ["fine-dining", "chefs", "restaurants", "wine-champagne", "luxury-travel", "hotels", "news", "guides", "interviews", "price-index"];
export async function generateStaticParams() {
  const d = await getDataset();
  return LOCALES.flatMap((locale) => [...CATEGORIES, ...d.articles.map((a) => a.slug)].map((slug) => ({ locale, slug })));
}
type P = { params: Promise<{ locale: string; slug: string }> };
async function load(params: P["params"]) {
  const ctx = await pageCtx(params);
  const { slug } = await params;
  const article = ctx.data.articles.find((a) => a.slug === slug);
  const category = CATEGORIES.find((c) => c === slug);
  if (!article && !category) notFound();
  return { ...ctx, article, category };
}
const catLabel = (c: string) => c.replace(/-/g, " ").replace(/^\w/, (x) => x.toUpperCase());

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, dict, data, article, category } = await load(params);
  if (article) return buildMetadata({ locale, path: `/magazine/${article.slug}/`, title: t(article.title, locale), description: t(article.excerpt, locale), type: "article", image: imageSrc(article.image.key).src });
  const n = data.articles.filter((a) => a.category === category).length;
  return buildMetadata({ locale, path: `/magazine/${category}/`, title: `${catLabel(category!)} — ${dict.home.magazineTitle}`, description: `${dict.home.magazineTitle}: ${catLabel(category!)}`, noindex: n === 0 });
}

export default async function MagazineSlug({ params }: P) {
  const { locale, dict, data, article, category } = await load(params);
  const crumbs = [{ name: dict.common.home, path: `/${locale}/` }, { name: dict.nav.magazine, path: `/${locale}/magazine/` }];
  if (!article) {
    const list = data.articles.filter((a) => a.category === category);
    return (
      <PageShell crumbs={[...crumbs, { name: catLabel(category!), path: `/${locale}/magazine/${category}/` }]} title={catLabel(category!)}>
        {list.length === 0 ? <p className="text-stone">{dict.common.empty}</p> : (
          <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">{list.map((a) => <li key={a.slug}><PhotoCard href={`/${locale}/magazine/${a.slug}/`} imageKey={a.image.key} alt={buildAlt({ subject: "dish" }, { name: t(a.title, locale), city: "", locale })} titleAs="h2" title={t(a.title, locale)} subtitle={t(a.excerpt, locale)} sizes="(min-width:1024px) 360px, 50vw" /></li>)}</ul>
        )}
        <JsonLd data={buildItemListJsonLd(catLabel(category!), list.map((a) => ({ name: t(a.title, locale), path: `/${locale}/magazine/${a.slug}/` })))} />
      </PageShell>
    );
  }
  const a = article;
  const title = t(a.title, locale);
  const related = data.restaurants.filter((r) => a.relatedRestaurants.includes(r.slug));
  const cities = data.cities.filter((c) => a.relatedCities.includes(c.slug));
  const more = data.articles.filter((x) => x.slug !== a.slug && x.category === a.category).slice(0, 3);
  return (
    <PageShell crumbs={[...crumbs, { name: catLabel(a.category), path: `/${locale}/magazine/${a.category}/` }, { name: title, path: `/${locale}/magazine/${a.slug}/` }]} title={title} lead={t(a.excerpt, locale)} eyebrow={catLabel(a.category)}>
      {a.sponsored && <div className="mb-6"><Notice tone="warning" title={dict.common.sponsored}>{tx(locale, "Paid partnership with", "Collaborazione a pagamento con")} {a.sponsor}. {tx(locale, "Sponsors do not influence recognitions or directory ranking.", "Gli sponsor non influenzano riconoscimenti né classifiche.")} <Link href={`/${locale}/legal/sponsored-content/`} className="underline">{dict.footer.sponsoredPolicy}</Link></Notice></div>}
      {a.isDemo && <div className="mb-6"><Notice tone="info">{dict.common.demoNotice}</Notice></div>}
      <p className="text-sm text-stone">{a.author.name} · {a.author.role} · {tx(locale, "Published", "Pubblicato il")} <time dateTime={a.publishedAt}>{formatDate(a.publishedAt, locale)}</time>{a.updatedAt !== a.publishedAt && <> · {tx(locale, "Updated", "Aggiornato il")} <time dateTime={a.updatedAt}>{formatDate(a.updatedAt, locale)}</time></>}</p>
      <div className="mt-6"><SmartImage imageKey={a.image.key} alt={buildAlt({ subject: "dish" }, { name: title, city: "", locale })} sizes="(min-width:1232px) 1136px, 100vw" ratio="16 / 7" priority label={dict.common.illustrative} /></div>
      <div className="mt-10 grid gap-10 lg:grid-cols-12">
        <nav aria-label={tx(locale, "Table of contents", "Indice dei contenuti")} className="lg:col-span-3"><p className="eyebrow mb-2">{tx(locale, "Contents", "Contenuti")}</p><ol className="space-y-1 text-sm">{a.sections.map((s) => <li key={s.heading}><a href={`#${slugify(s.heading)}`} className="hover:text-carmine hover:underline">{s.heading}</a></li>)}</ol></nav>
        <div className="prose-editorial max-w-2xl lg:col-span-9" lang={locale !== "en" && !a.sectionsIt ? "en" : undefined}>
          {locale !== "en" && !a.sectionsIt && <p className="mb-4 text-xs text-stone" lang={locale}>{dict.common.translationPending}</p>}
          {a.sections.map((s) => (<section key={s.heading}><h2 id={slugify(s.heading)} className="font-serif">{s.heading}</h2>{s.paragraphs.map((p, i) => <p key={i}>{p}</p>)}</section>))}
          {cities.length > 0 && <p className="mt-6 text-sm">{tx(locale, "Destinations", "Destinazioni")}: {cities.map((c, i) => <span key={c.slug}>{i > 0 && ", "}<Link href={`/${locale}/restaurants/${c.countrySlug}/${c.slug}/`} className="text-carmine underline">{t(c.name, locale)}</Link></span>)}</p>}
        </div>
      </div>
      {related.length > 0 && (<section className="mt-12"><h2 className="font-serif text-2xl">{dict.nav.restaurants}</h2><ul className="mt-4 grid gap-6 sm:grid-cols-3">{related.map((r) => <li key={r.slug}><RestaurantCard r={r} locale={locale} dict={dict} {...cardInfo(data, r, locale)} /></li>)}</ul></section>)}
      {more.length > 0 && (<section className="mt-12"><h2 className="font-serif text-2xl">{tx(locale, "More in", "Altro in")} {catLabel(a.category)}</h2><ul className="mt-4 grid gap-6 sm:grid-cols-3">{more.map((x) => <li key={x.slug}><PhotoCard href={`/${locale}/magazine/${x.slug}/`} imageKey={x.image.key} alt={buildAlt({ subject: "dish" }, { name: t(x.title, locale), city: "", locale })} title={t(x.title, locale)} sizes="360px" /></li>)}</ul></section>)}
      <section className="mt-12 rounded-[12px] border border-line bg-white p-6"><h2 className="font-serif text-2xl">{dict.home.newsletterTitle}</h2><p className="mb-4 text-stone">{dict.home.newsletterSub}</p><NewsletterForm locale={locale} compact d={{ ...dict.forms, submit: dict.common.submit, sending: dict.common.sending }} entity={BRAND.legalEntity} privacyHref={`/${locale}/legal/privacy/`} /></section>
      <JsonLd data={buildArticleJsonLd(a, { locale, imageUrl: imageSrc(a.image.key).src })} />
    </PageShell>
  );
}
