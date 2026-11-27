import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageCtx } from "../../_ctx";
import { getDataset } from "@/db/repository";
import { LOCALES } from "@/i18n";
import { buildMetadata } from "@/seo/metadata";
import { PageShell } from "@/features/PageShell";
import { RestaurantCard } from "@/components/cards/RestaurantCard";
import { cardInfo } from "@/features/helpers";
import { isFallback, t } from "@/db/types";
import { DemoBadge } from "@/components/ui/ui";
import { JsonLd } from "@/components/JsonLd";
import { buildChefJsonLd } from "@/seo/jsonld";

export const revalidate = 3600;
export const dynamicParams = false;
export async function generateStaticParams() {
  const d = await getDataset();
  return LOCALES.flatMap((locale) => d.chefs.map((c) => ({ locale, slug: c.slug })));
}
type P = { params: Promise<{ locale: string; slug: string }> };
async function load(params: P["params"]) {
  const ctx = await pageCtx(params);
  const { slug } = await params;
  const chef = ctx.data.chefs.find((c) => c.slug === slug);
  if (!chef) notFound();
  return { ...ctx, chef };
}
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, chef } = await load(params);
  return buildMetadata({ locale, path: `/chefs/${chef.slug}/`, title: `${chef.name} — ${locale === "it" ? "profilo dello chef" : "chef profile"}`, description: t(chef.bio, locale).slice(0, 158) });
}
export default async function ChefPage({ params }: P) {
  const { locale, dict, data, chef } = await load(params);
  const rs = data.restaurants.filter((r) => r.chefSlug === chef.slug);
  return (
    <PageShell crumbs={[{ name: dict.common.home, path: `/${locale}/` }, { name: dict.footer.chefs, path: `/${locale}/chefs/` }, { name: chef.name, path: `/${locale}/chefs/${chef.slug}/` }]} title={chef.name}>
      {chef.isDemo && <DemoBadge label={dict.common.demoData} />}
      <p className="mt-3 max-w-2xl text-lg leading-relaxed" lang={isFallback(chef.bio, locale) ? "en" : undefined}>{t(chef.bio, locale)}</p>
      <h2 className="mt-10 font-serif text-2xl">{dict.nav.restaurants}</h2>
      <ul className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{rs.map((r) => <li key={r.slug}><RestaurantCard r={r} locale={locale} dict={dict} {...cardInfo(data, r, locale)} /></li>)}</ul>
      <JsonLd data={buildChefJsonLd(chef, { locale, restaurants: rs.map((r) => ({ name: r.name, slug: r.slug })) })} />
    </PageShell>
  );
}
