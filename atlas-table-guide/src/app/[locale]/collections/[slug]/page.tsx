import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageCtx } from "../../_ctx";
import { LOCALES, fmt } from "@/i18n";
import { buildMetadata } from "@/seo/metadata";
import { PageShell } from "@/features/PageShell";
import { collections } from "@/data/collections";
import { collectionMembers } from "@/db/queries";
import { sortRestaurants } from "@/lib/filters";
import { t } from "@/db/types";
import { RestaurantCard } from "@/components/cards/RestaurantCard";
import { cardInfo } from "@/features/helpers";
import { EmptyState, Chip } from "@/components/ui/ui";
import { JsonLd } from "@/components/JsonLd";
import { buildItemListJsonLd } from "@/seo/jsonld";
import { SITE } from "@/config/site";

export const revalidate = 3600;
export const dynamicParams = false;
export function generateStaticParams() {
  return LOCALES.flatMap((locale) => collections.map((c) => ({ locale, slug: c.slug })));
}
type P = { params: Promise<{ locale: string; slug: string }> };
async function load(params: P["params"]) {
  const ctx = await pageCtx(params);
  const { slug } = await params;
  const c = collections.find((x) => x.slug === slug);
  if (!c) notFound();
  const members = sortRestaurants(collectionMembers(ctx.data, c, ctx.rates), { sort: c.rule.type === "maxPrice" || c.rule.type === "affordableRecognised" ? "price-asc" : "recommended" }, ctx.rates);
  return { ...ctx, c, members };
}
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, c, members } = await load(params);
  // Quality gate: thin collections stay out of the index
  return buildMetadata({ locale, path: `/collections/${c.slug}/`, title: t(c.title, locale), description: t(c.intro, locale).slice(0, 158), noindex: members.length < SITE.facetMinResults });
}
export default async function CollectionPage({ params }: P) {
  const { locale, dict, data, rates, c, members } = await load(params);
  const title = t(c.title, locale);
  return (
    <PageShell crumbs={[{ name: dict.common.home, path: `/${locale}/` }, { name: dict.nav.collections, path: `/${locale}/collections/` }, { name: title, path: `/${locale}/collections/${c.slug}/` }]} title={title} lead={t(c.intro, locale)} answer={`${fmt(dict.directory.results, { n: members.length })}.`}>
      {members.length === 0 ? (
        <EmptyState title={dict.directory.emptyTitle} body={dict.directory.emptyBody}>{collections.filter((x) => x.slug !== c.slug).slice(0, 4).map((x) => <Chip key={x.slug} href={`/${locale}/collections/${x.slug}/`}>{t(x.title, locale)}</Chip>)}</EmptyState>
      ) : (
        <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">{members.map((r) => <li key={r.slug}><RestaurantCard r={r} locale={locale} dict={dict} {...cardInfo(data, r, locale)} headingLevel={2} /></li>)}</ul>
      )}
      {rates.source !== "live" && <p className="mt-6 text-xs text-stone">{rates.source === "demo-reference" ? dict.prefs.fxDemo : dict.prefs.fxNone}</p>}
      <JsonLd data={buildItemListJsonLd(title, members.map((r) => ({ name: r.name, path: `/${locale}/restaurant/${r.slug}/` })))} />
    </PageShell>
  );
}
