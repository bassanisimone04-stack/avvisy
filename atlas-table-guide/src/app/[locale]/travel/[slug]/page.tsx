import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { pageCtx } from "../../_ctx";
import { getDataset } from "@/db/repository";
import { LOCALES, tx } from "@/i18n";
import { buildMetadata } from "@/seo/metadata";
import { PageShell } from "@/features/PageShell";
import { SmartImage, imageSrc } from "@/components/media/SmartImage";
import { buildAlt } from "@/lib/alt";
import { t } from "@/db/types";
import { JsonLd } from "@/components/JsonLd";
import { buildItineraryJsonLd } from "@/seo/jsonld";
import { MiniMap } from "@/features/restaurant/MiniMap";
import { SITE } from "@/config/site";
import { ItineraryExport, ShareButton } from "@/features/ItineraryTools";
import { FavouriteButton } from "@/features/FavouriteButton";
import { Notice } from "@/components/ui/ui";
import { formatMoney } from "@/lib/price";

export const revalidate = 3600;
export const dynamicParams = false;
export async function generateStaticParams() {
  const d = await getDataset();
  return LOCALES.flatMap((locale) => d.itineraries.map((i) => ({ locale, slug: i.slug })));
}
type P = { params: Promise<{ locale: string; slug: string }> };
async function load(params: P["params"]) {
  const ctx = await pageCtx(params);
  const { slug } = await params;
  const it = ctx.data.itineraries.find((i) => i.slug === slug);
  if (!it) notFound();
  return { ...ctx, it };
}
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, it } = await load(params);
  return buildMetadata({ locale, path: `/travel/${it.slug}/`, title: t(it.title, locale), description: t(it.summary, locale), image: imageSrc(it.image.key).src });
}
export default async function ItineraryPage({ params }: P) {
  const { locale, dict, data, it } = await load(params);
  const resolve = (type: string, ref?: string) => {
    if (type === "restaurant") { const r = data.restaurants.find((x) => x.slug === ref); return r && { name: r.name, path: `/${locale}/restaurant/${r.slug}/`, lat: r.lat, lng: r.lng }; }
    if (type === "hotel") { const h = data.hotels.find((x) => x.slug === ref); return h && { name: h.name, path: `/${locale}/hotel/${h.slug}/`, lat: h.lat, lng: h.lng }; }
    if (type === "experience") { const x = data.experiences.find((e) => e.slug === ref); return x && { name: x.name, path: `/${locale}/experience/${x.slug}/`, lat: x.lat, lng: x.lng }; }
    return undefined;
  };
  const stops = it.days.flatMap((d) => d.items.map((i) => resolve(i.type, i.ref)).filter((x): x is NonNullable<typeof x> => !!x));
  const title = t(it.title, locale);
  return (
    <PageShell crumbs={[{ name: dict.common.home, path: `/${locale}/` }, { name: dict.nav.travel, path: `/${locale}/travel/` }, { name: title, path: `/${locale}/travel/${it.slug}/` }]} title={title} lead={t(it.summary, locale)}>
      {it.isDemo && <div className="mb-6"><Notice tone="warning">{dict.common.demoNotice}</Notice></div>}
      <SmartImage imageKey={it.image.key} alt={buildAlt(it.image, { name: title, city: t(data.cities.find((c) => c.slug === it.citySlugs[0])?.name, locale), locale })} sizes="(min-width:1232px) 1136px, 100vw" ratio="16 / 7" priority label={dict.common.illustrative} />
      <div className="no-print mt-6 flex flex-wrap items-end gap-2">
        <FavouriteButton itemKey={`itinerary:${it.slug}`} name={title} variant="inline" labels={{ add: dict.favourites.add, remove: dict.favourites.remove, saved: dict.common.saved, save: dict.common.save }} />
        <ShareButton label={dict.common.share} copied={dict.common.copied} title={title} />
        <ItineraryExport slug={it.slug} locale={locale} />
      </div>
      <div className="mt-10 grid gap-10 lg:grid-cols-12">
        <ol className="space-y-8 lg:col-span-7">
          {it.days.map((d) => (
            <li key={d.day}>
              <h2 className="font-serif text-2xl">{tx(locale, "Day", "Giorno")} {d.day} · {t(d.title, locale)}</h2>
              <ul className="mt-3 divide-y divide-line rounded-[12px] border border-line bg-white">
                {d.items.map((i, k) => { const r = resolve(i.type, i.ref); return (
                  <li key={k} className="flex gap-4 p-4"><span className="w-14 shrink-0 font-semibold tabular-nums">{i.time}</span><div><p className="font-semibold">{r ? <Link href={r.path} className="underline-offset-4 hover:underline">{r.name}</Link> : t(i.note, locale)}</p>{r && <p className="text-sm text-stone">{t(i.note, locale)}</p>}<p className="text-xs uppercase tracking-wide text-stone">{i.type}</p></div></li>
                ); })}
              </ul>
            </li>
          ))}
        </ol>
        <aside className="space-y-4 lg:col-span-5">
          <MiniMap lat={stops[0]?.lat ?? 0} lng={stops[0]?.lng ?? 0} name={title} styleUrl={SITE.mapStyleUrl} unavailable={dict.directory.mapUnavailable} points={stops.map((s) => ({ lat: s.lat, lng: s.lng, label: s.name }))} />
          <div className="rounded-[12px] border border-line bg-sand p-5">
            <p className="text-sm text-stone">{dict.common.estimate} · {dict.common.perPerson}</p>
            <p className="font-serif text-3xl">{formatMoney(it.budgetEstimate.amount, it.budgetEstimate.currency, locale)}</p>
            <p className="mt-1 text-xs text-stone">{tx(locale, "Estimate of meals, rooms and experiences listed; excludes transport. Availability is not confirmed — book each venue directly or via the concierge.", "Stima di pasti, camere ed esperienze elencati; esclusi i trasporti. La disponibilità non è confermata: prenota ogni locale direttamente o tramite il concierge.")}</p>
          </div>
        </aside>
      </div>
      <JsonLd data={buildItineraryJsonLd(it, { locale, imageUrl: imageSrc(it.image.key).src, stops })} />
    </PageShell>
  );
}
