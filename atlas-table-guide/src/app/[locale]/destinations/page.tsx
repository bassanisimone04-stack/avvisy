import type { Metadata } from "next";
import { pageCtx } from "../_ctx";
import { buildMetadata } from "@/seo/metadata";
import { t } from "@/db/types";
import { PageShell } from "@/features/PageShell";
import { PhotoCard } from "@/components/cards/Cards";
import { buildAlt } from "@/lib/alt";
import { isVerified } from "@/db/queries";
import { JsonLd } from "@/components/JsonLd";
import { buildItemListJsonLd } from "@/seo/jsonld";
import { fmt } from "@/i18n";

export const revalidate = 3600;
type P = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, dict } = await pageCtx(params);
  return buildMetadata({ locale, path: "/destinations/", title: dict.home.destTitle, description: `${dict.home.destTitle}: ${dict.meta.homeDescription}` });
}

export default async function Destinations({ params }: P) {
  const { locale, dict, data } = await pageCtx(params);
  const items = data.cities.map((c) => ({ c, n: data.restaurants.filter((r) => r.citySlug === c.slug && isVerified(r)).length, path: `/${locale}/restaurants/${c.countrySlug}/${c.slug}/` }));
  return (
    <PageShell crumbs={[{ name: dict.common.home, path: `/${locale}/` }, { name: dict.nav.destinations, path: `/${locale}/destinations/` }]} title={dict.home.destTitle} eyebrow={dict.home.destEyebrow}>
      <ul className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {items.map(({ c, n, path }) => (
          <li key={c.slug}><PhotoCard href={path} imageKey={c.image.key} alt={buildAlt(c.image, { city: t(c.name, locale), locale })} ratio="3 / 4" sizes="(min-width:1280px) 280px, (min-width:768px) 33vw, 50vw" titleAs="h2" title={t(c.name, locale)} subtitle={`${t(data.countries.find((x) => x.slug === c.countrySlug)?.name, locale)}${n ? ` · ${fmt(dict.home.restaurantsCount, { n })}` : ""}`} illustrativeLabel={dict.common.illustrative} /></li>
        ))}
      </ul>
      <JsonLd data={buildItemListJsonLd(dict.home.destTitle, items.map((i) => ({ name: t(i.c.name, locale), path: i.path })))} />
    </PageShell>
  );
}
