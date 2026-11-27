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
import { buildExperienceJsonLd } from "@/seo/jsonld";
import { EXP_CATEGORIES } from "@/data/categories";
import { ExternalIcon } from "@/components/ui/icons";

export const revalidate = 3600;
export const dynamicParams = false;
export async function generateStaticParams() {
  const d = await getDataset();
  return LOCALES.flatMap((locale) => d.experiences.map((x) => ({ locale, slug: x.slug })));
}
type P = { params: Promise<{ locale: string; slug: string }> };
async function load(params: P["params"]) {
  const ctx = await pageCtx(params);
  const { slug } = await params;
  const x = ctx.data.experiences.find((e) => e.slug === slug);
  if (!x) notFound();
  return { ...ctx, x };
}
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, x } = await load(params);
  return buildMetadata({ locale, path: `/experience/${x.slug}/`, title: x.name, description: t(x.description, locale).slice(0, 158), image: imageSrc(x.images[0]!.key).src });
}
export default async function ExperiencePage({ params }: P) {
  const { locale, dict, data, x } = await load(params);
  const city = t(cityOf(data, x.citySlug)?.name, locale);
  const link = data.affiliateLinks.find((l) => l.id === x.affiliateId);
  const rest = x.restaurantSlug ? data.restaurants.find((r) => r.slug === x.restaurantSlug) : undefined;
  const near = nearby(data.restaurants, x, 30, 3);
  return (
    <PageShell crumbs={[{ name: dict.common.home, path: `/${locale}/` }, { name: dict.nav.experiences, path: `/${locale}/experiences/` }, { name: x.name, path: `/${locale}/experience/${x.slug}/` }]} title={x.name} eyebrow={`${EXP_CATEGORIES[x.category]![locale]} · ${city}`}>
      {x.isDemo && <div className="mb-6"><Notice tone="warning">{dict.common.demoNotice}</Notice></div>}
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <SmartImage imageKey={x.images[0]!.key} alt={buildAlt(x.images[0]!, { name: x.name, city, locale })} sizes="(min-width:1024px) 760px, 100vw" ratio="16 / 9" priority label={dict.common.illustrative} />
          <p className="mt-6 text-lg leading-relaxed" lang={isFallback(x.description, locale) ? "en" : undefined}>{t(x.description, locale)}</p>
          <dl className="mt-6 grid max-w-md grid-cols-2 gap-y-2 text-sm"><dt className="text-stone">{dict.profile.duration}</dt><dd>{x.durationHours} h</dd><dt className="text-stone">{dict.directory.f.city}</dt><dd>{city}</dd></dl>
          {rest && (<><h2 className="mt-10 font-serif text-2xl">{dict.nav.restaurants}</h2><div className="mt-4 max-w-sm"><RestaurantCard r={rest} locale={locale} dict={dict} {...cardInfo(data, rest, locale)} /></div></>)}
          {near.length > 0 && (<><h2 className="mt-10 font-serif text-2xl">{dict.profile.similar}</h2><ul className="mt-4 grid gap-6 sm:grid-cols-3">{near.map((r) => <li key={r.slug}><RestaurantCard r={r} locale={locale} dict={dict} {...cardInfo(data, r, locale)} /></li>)}</ul></>)}
        </div>
        <aside className="lg:col-span-4">
          <div className="sticky top-[calc(var(--header-h)+16px)] rounded-[12px] border border-line bg-white p-5 shadow-card">
            {x.isDemo && <DemoBadge label={dict.common.demoData} />}
            {x.price ? <p className="mt-2 text-sm text-stone">{dict.common.from} <Price amount={x.price.amount} currency={x.price.currency} locale={locale} className="font-serif text-2xl text-ink" /> <StatusPill status={x.price.status} label={x.price.status === "verified" ? dict.common.verified : dict.common.estimated} /></p> : <p className="text-sm text-stone">{dict.profile.noPrice}</p>}
            {link ? (
              <a href={`/go/${link.id}/?from=${encodeURIComponent(`/${locale}/experience/${x.slug}/`)}`} rel="sponsored nofollow noopener" target="_blank" className="mt-4 flex min-h-12 items-center justify-center gap-1 rounded-[8px] bg-carmine font-semibold text-white hover:bg-red-700">{link.label} <ExternalIcon size={16} /></a>
            ) : (
              <Link href={`/${locale}/concierge/?experience=${x.slug}`} className="mt-4 flex min-h-12 items-center justify-center rounded-[8px] bg-carmine font-semibold text-white">{dict.profile.requestConcierge}</Link>
            )}
            <p className="mt-2 text-xs text-stone">{tx(locale, "Availability is confirmed by the partner, not by us. Affiliate link — see", "La disponibilità è confermata dal partner, non da noi. Link di affiliazione — vedi")} <Link href={`/${locale}/legal/affiliate-disclosure/`} className="underline">{dict.footer.affiliate}</Link>.</p>
            <div className="mt-3"><FavouriteButton itemKey={`experience:${x.slug}`} name={x.name} variant="inline" labels={{ add: dict.favourites.add, remove: dict.favourites.remove, saved: dict.common.saved, save: dict.common.save }} /></div>
          </div>
        </aside>
      </div>
      <JsonLd data={buildExperienceJsonLd(x, { locale, imageUrls: x.images.map((i) => imageSrc(i.key).src) })} />
    </PageShell>
  );
}
