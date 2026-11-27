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
import { t, isFallback } from "@/db/types";
import { cityOf, nearby } from "@/db/queries";
import { RestaurantCard } from "@/components/cards/RestaurantCard";
import { cardInfo } from "@/features/helpers";
import { Price } from "@/features/Price";
import { FavouriteButton } from "@/features/FavouriteButton";
import { DemoBadge, Notice, StatusPill } from "@/components/ui/ui";
import { JsonLd } from "@/components/JsonLd";
import { buildHotelJsonLd } from "@/seo/jsonld";
import { HOTEL_CATEGORIES } from "@/data/categories";
import { ExternalIcon } from "@/components/ui/icons";

export const revalidate = 3600;
export const dynamicParams = false;
export async function generateStaticParams() {
  const d = await getDataset();
  return LOCALES.flatMap((locale) => d.hotels.map((h) => ({ locale, slug: h.slug })));
}
type P = { params: Promise<{ locale: string; slug: string }> };
async function load(params: P["params"]) {
  const ctx = await pageCtx(params);
  const { slug } = await params;
  const h = ctx.data.hotels.find((x) => x.slug === slug);
  if (!h) notFound();
  return { ...ctx, h };
}
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, h } = await load(params);
  return buildMetadata({ locale, path: `/hotel/${h.slug}/`, title: `${h.name} — ${h.address.locality}`, description: t(h.description, locale).slice(0, 158), image: imageSrc(h.images[0]!.key).src });
}
export default async function HotelPage({ params }: P) {
  const { locale, dict, data, h } = await load(params);
  const city = h.address.locality || t(cityOf(data, h.citySlug)?.name, locale);
  const rs = data.restaurants.filter((r) => h.restaurantSlugs.includes(r.slug));
  const near = nearby(data.restaurants.filter((r) => !h.restaurantSlugs.includes(r.slug)), h, 30, 3);
  const link = data.affiliateLinks.find((l) => l.id === h.affiliateId);
  return (
    <PageShell crumbs={[{ name: dict.common.home, path: `/${locale}/` }, { name: dict.nav.hotels, path: `/${locale}/hotels/` }, { name: h.name, path: `/${locale}/hotel/${h.slug}/` }]} title={h.name} eyebrow={HOTEL_CATEGORIES[h.category]![locale]}>
      {h.isDemo && <div className="mb-6"><Notice tone="warning">{dict.common.demoNotice}</Notice></div>}
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <SmartImage imageKey={h.images[0]!.key} alt={buildAlt(h.images[0]!, { name: h.name, city, locale })} sizes="(min-width:1024px) 760px, 100vw" ratio="16 / 9" priority label={dict.common.illustrative} />
          <p className="mt-6 text-lg leading-relaxed" lang={isFallback(h.description, locale) ? "en" : undefined}>{t(h.description, locale)}</p>
          <h2 className="mt-10 font-serif text-2xl">{tx(locale, "Amenities", "Servizi")}</h2>
          <ul className="mt-3 flex flex-wrap gap-2">{h.amenities.map((a) => <li key={a} className="rounded-full border border-line bg-white px-3 py-1 text-sm">{a}</li>)}<li className="rounded-full border border-line bg-white px-3 py-1 text-sm">{h.rooms} {tx(locale, "rooms", "camere")}</li></ul>
          {rs.length > 0 && (<><h2 className="mt-10 font-serif text-2xl">{tx(locale, "Dining", "Ristorazione")}</h2><ul className="mt-4 grid gap-6 sm:grid-cols-2">{rs.map((r) => <li key={r.slug}><RestaurantCard r={r} locale={locale} dict={dict} {...cardInfo(data, r, locale)} /></li>)}</ul></>)}
          {near.length > 0 && (<><h2 className="mt-10 font-serif text-2xl">{dict.profile.similar}</h2><ul className="mt-4 grid gap-6 sm:grid-cols-3">{near.map((r) => <li key={r.slug}><RestaurantCard r={r} locale={locale} dict={dict} {...cardInfo(data, r, locale)} /></li>)}</ul></>)}
        </div>
        <aside className="lg:col-span-4">
          <div className="sticky top-[calc(var(--header-h)+16px)] rounded-[12px] border border-line bg-white p-5 shadow-card">
            <div className="flex items-center gap-2">{h.isDemo && <DemoBadge label={dict.common.demoData} />}</div>
            {h.priceFrom ? <p className="mt-2 text-sm text-stone">{dict.common.from} <Price amount={h.priceFrom.amount} currency={h.priceFrom.currency} locale={locale} className="font-serif text-2xl text-ink" /> / {tx(locale, "night", "notte")} <StatusPill status={h.priceFrom.status} label={h.priceFrom.status === "verified" ? dict.common.verified : dict.common.estimated} /></p> : <p className="text-sm text-stone">{dict.profile.noPrice}</p>}
            {link ? (
              <a href={`/go/${link.id}/?from=${encodeURIComponent(`/${locale}/hotel/${h.slug}/`)}`} rel="sponsored nofollow noopener" target="_blank" className="mt-4 flex min-h-12 items-center justify-center gap-1 rounded-[8px] bg-carmine font-semibold text-white hover:bg-red-700">{link.label} <ExternalIcon size={16} /></a>
            ) : (
              <Link href={`/${locale}/concierge/?hotel=${h.slug}`} className="mt-4 flex min-h-12 items-center justify-center rounded-[8px] bg-carmine font-semibold text-white">{dict.profile.requestConcierge}</Link>
            )}
            <p className="mt-2 text-xs text-stone">{tx(locale, "Affiliate link: we may earn a commission. It never affects recognitions or ranking.", "Link di affiliazione: potremmo ricevere una commissione. Non influisce mai su riconoscimenti o classifica.")} <Link href={`/${locale}/legal/affiliate-disclosure/`} className="underline">{dict.footer.affiliate}</Link></p>
            <div className="mt-3"><FavouriteButton itemKey={`hotel:${h.slug}`} name={h.name} variant="inline" labels={{ add: dict.favourites.add, remove: dict.favourites.remove, saved: dict.common.saved, save: dict.common.save }} /></div>
          </div>
        </aside>
      </div>
      <JsonLd data={buildHotelJsonLd(h, { locale, imageUrls: h.images.map((i) => imageSrc(i.key).src), restaurants: rs.map((r) => ({ name: r.name, slug: r.slug })) })} />
    </PageShell>
  );
}
