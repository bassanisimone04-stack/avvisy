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
import { DemoBadge } from "@/components/ui/ui";
import { JsonLd } from "@/components/JsonLd";
import { buildItemListJsonLd } from "@/seo/jsonld";
import { EXP_CATEGORIES } from "@/data/categories";
import Link from "next/link";

type P = { params: Promise<{ locale: string }>; searchParams: Promise<{ category?: string; city?: string }> };
export async function generateMetadata({ params, searchParams }: P): Promise<Metadata> {
  const { locale, dict } = await pageCtx(params);
  const sp = await searchParams;
  return buildMetadata({ locale, path: "/experiences/", title: `${dict.nav.experiences} — chef's tables, tastings and food tours`, description: "Chef's tables, cooking classes, wine tastings, truffle hunts and culinary weekends.", noindex: Object.keys(sp).length > 0 });
}
export default async function Experiences({ params, searchParams }: P) {
  const { locale, dict, data } = await pageCtx(params);
  const sp = await searchParams;
  const cat = sp.category && EXP_CATEGORIES[sp.category] ? sp.category : undefined;
  const cities = [...new Set(data.experiences.map((x) => x.citySlug))];
  const list = data.experiences.filter((x) => (!cat || x.category === cat) && (!sp.city || x.citySlug === sp.city));
  return (
    <PageShell crumbs={[{ name: dict.common.home, path: `/${locale}/` }, { name: dict.nav.experiences, path: `/${locale}/experiences/` }]} title={dict.nav.experiences}>
      <CategoryChips base={`/${locale}/experiences/`} current={cat} allLabel={dict.common.viewAll} options={Object.entries(EXP_CATEGORIES).map(([k, v]) => ({ value: k, label: v[locale], count: data.experiences.filter((x) => x.category === k).length })).filter((o) => o.count > 0)} />
      <nav aria-label={dict.directory.f.city} className="-mt-4 mb-8 flex flex-wrap gap-x-4 gap-y-1 text-sm">{cities.map((c) => <Link key={c} href={`/${locale}/experiences/?city=${c}`} aria-current={sp.city === c ? "true" : undefined} className={sp.city === c ? "font-semibold text-carmine" : "text-stone hover:underline"}>{t(cityOf(data, c)?.name, locale)}</Link>)}</nav>
      <Grid>
        {list.map((x) => (
          <li key={x.slug}>
            <PhotoCard href={`/${locale}/experience/${x.slug}/`} imageKey={x.images[0]!.key} alt={buildAlt(x.images[0]!, { name: x.name, city: t(cityOf(data, x.citySlug)?.name, locale), locale })} titleAs="h2" title={x.name} subtitle={`${t(cityOf(data, x.citySlug)?.name, locale)} · ${EXP_CATEGORIES[x.category]![locale]} · ${x.durationHours} h`} sizes="(min-width:1024px) 360px, (min-width:640px) 50vw, 100vw" illustrativeLabel={dict.common.illustrative}
              badge={x.isDemo ? <DemoBadge label={dict.common.demoData} /> : undefined}
              meta={x.price ? <span>{dict.common.from} <Price amount={x.price.amount} currency={x.price.currency} locale={locale} />{x.price.status === "estimated" ? ` (${dict.common.estimate})` : ""}</span> : <span className="text-stone">{dict.profile.noPrice}</span>} />
          </li>
        ))}
      </Grid>
      <JsonLd data={buildItemListJsonLd(dict.nav.experiences, list.map((x) => ({ name: x.name, path: `/${locale}/experience/${x.slug}/` })))} />
    </PageShell>
  );
}
