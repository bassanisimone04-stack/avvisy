import type { Metadata } from "next";
import { pageCtx } from "../_ctx";
import { buildMetadata } from "@/seo/metadata";
import { PageShell } from "@/features/PageShell";
import { CategoryChips, Grid } from "@/features/ListingGrid";
import { PhotoCard } from "@/components/cards/Cards";
import { buildAlt } from "@/lib/alt";
import { t } from "@/db/types";
import { cityOf } from "@/db/queries";
import { Price } from "@/features/Price";
import { DemoBadge, StatusPill } from "@/components/ui/ui";
import { JsonLd } from "@/components/JsonLd";
import { buildItemListJsonLd } from "@/seo/jsonld";
import { HOTEL_CATEGORIES } from "@/data/categories";

type P = { params: Promise<{ locale: string }>; searchParams: Promise<{ category?: string; city?: string }> };
export async function generateMetadata({ params, searchParams }: P): Promise<Metadata> {
  const { locale, dict } = await pageCtx(params);
  const sp = await searchParams;
  return buildMetadata({ locale, path: "/hotels/", title: `${dict.nav.hotels} — dine & stay`, description: "Hotels built around their restaurants: restaurants with rooms, boutique hotels, wine estates and gastronomic resorts.", noindex: Object.keys(sp).length > 0 });
}
export default async function Hotels({ params, searchParams }: P) {
  const { locale, dict, data } = await pageCtx(params);
  const sp = await searchParams;
  const cat = sp.category && HOTEL_CATEGORIES[sp.category] ? sp.category : undefined;
  const list = data.hotels.filter((h) => (!cat || h.category === cat) && (!sp.city || h.citySlug === sp.city));
  const cityName = (s: string) => t(cityOf(data, s)?.name, locale);
  return (
    <PageShell crumbs={[{ name: dict.common.home, path: `/${locale}/` }, { name: dict.nav.hotels, path: `/${locale}/hotels/` }]} title={dict.nav.hotels} lead={dict.home.dineStaySub}>
      <CategoryChips base={`/${locale}/hotels/`} current={cat} allLabel={dict.common.viewAll} options={Object.entries(HOTEL_CATEGORIES).map(([k, v]) => ({ value: k, label: v[locale], count: data.hotels.filter((h) => h.category === k).length }))} />
      <Grid>
        {list.map((h) => (
          <li key={h.slug}>
            <PhotoCard href={`/${locale}/hotel/${h.slug}/`} imageKey={h.images[0]!.key} alt={buildAlt(h.images[0]!, { name: h.name, city: h.address.locality || cityName(h.citySlug), locale })} titleAs="h2" title={h.name} subtitle={`${h.address.locality || cityName(h.citySlug)} · ${HOTEL_CATEGORIES[h.category]![locale]}`} sizes="(min-width:1024px) 360px, (min-width:640px) 50vw, 100vw" illustrativeLabel={dict.common.illustrative}
              badge={h.isDemo ? <DemoBadge label={dict.common.demoData} /> : undefined}
              meta={h.priceFrom ? <span>{dict.common.from} <Price amount={h.priceFrom.amount} currency={h.priceFrom.currency} locale={locale} /> <StatusPill status={h.priceFrom.status} label={h.priceFrom.status === "verified" ? dict.common.verified : dict.common.estimated} /></span> : <span className="text-stone">{dict.profile.noPrice}</span>} />
          </li>
        ))}
      </Grid>
      <JsonLd data={buildItemListJsonLd(dict.nav.hotels, list.map((h) => ({ name: h.name, path: `/${locale}/hotel/${h.slug}/` })))} />
    </PageShell>
  );
}
