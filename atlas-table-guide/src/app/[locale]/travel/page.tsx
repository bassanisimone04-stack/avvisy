import type { Metadata } from "next";
import { pageCtx } from "../_ctx";
import { buildMetadata } from "@/seo/metadata";
import { PageShell } from "@/features/PageShell";
import { PhotoCard } from "@/components/cards/Cards";
import { buildAlt } from "@/lib/alt";
import { t } from "@/db/types";
import { JsonLd } from "@/components/JsonLd";
import { buildItemListJsonLd } from "@/seo/jsonld";
import { formatMoney } from "@/lib/price";

export const revalidate = 3600;
type P = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, dict } = await pageCtx(params);
  return buildMetadata({ locale, path: "/travel/", title: dict.home.travelTitle, description: "Day-by-day culinary journeys: tasting menus, restaurants with rooms, wine estates and food experiences." });
}
export default async function Travel({ params }: P) {
  const { locale, dict, data } = await pageCtx(params);
  return (
    <PageShell crumbs={[{ name: dict.common.home, path: `/${locale}/` }, { name: dict.nav.travel, path: `/${locale}/travel/` }]} title={dict.home.travelTitle} lead={dict.home.journeysTitle}>
      <ul className="grid gap-x-6 gap-y-10 md:grid-cols-2">
        {data.itineraries.map((it) => (
          <li key={it.slug}><PhotoCard href={`/${locale}/travel/${it.slug}/`} imageKey={it.image.key} alt={buildAlt(it.image, { name: t(it.title, locale), city: t(data.cities.find((c) => c.slug === it.citySlugs[0])?.name, locale), locale })} titleAs="h2" title={t(it.title, locale)} subtitle={t(it.summary, locale)} meta={<span className="text-stone">{it.days.length} days · {dict.common.estimate}: {formatMoney(it.budgetEstimate.amount, it.budgetEstimate.currency, locale)} {dict.common.perPerson}</span>} sizes="(min-width:768px) 560px, 100vw" illustrativeLabel={dict.common.illustrative} /></li>
        ))}
      </ul>
      <JsonLd data={buildItemListJsonLd(dict.home.travelTitle, data.itineraries.map((i) => ({ name: t(i.title, locale), path: `/${locale}/travel/${i.slug}/` })))} />
    </PageShell>
  );
}
