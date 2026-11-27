import type { Metadata } from "next";
import { pageCtx } from "../../_ctx";
import { buildMetadata } from "@/seo/metadata";
import { PageShell } from "@/features/PageShell";
import { FavouritesList } from "@/features/AccountPanel";
import { t } from "@/db/types";

type P = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, dict } = await pageCtx(params);
  return buildMetadata({ locale, path: "/account/favourites/", title: dict.favourites.title, description: dict.favourites.title, noindex: true });
}
export default async function Favourites({ params }: P) {
  const { locale, dict, data } = await pageCtx(params);
  const city = (s: string) => t(data.cities.find((c) => c.slug === s)?.name, locale);
  const index = [
    ...data.restaurants.map((r) => ({ key: `restaurant:${r.slug}`, name: r.name, href: `/${locale}/restaurant/${r.slug}/`, sub: `${dict.search.types.restaurant} · ${city(r.citySlug)}` })),
    ...data.hotels.map((h) => ({ key: `hotel:${h.slug}`, name: h.name, href: `/${locale}/hotel/${h.slug}/`, sub: `${dict.search.types.hotel} · ${h.address.locality}` })),
    ...data.experiences.map((x) => ({ key: `experience:${x.slug}`, name: x.name, href: `/${locale}/experience/${x.slug}/`, sub: `${dict.search.types.experience} · ${city(x.citySlug)}` })),
    ...data.itineraries.map((i) => ({ key: `itinerary:${i.slug}`, name: t(i.title, locale), href: `/${locale}/travel/${i.slug}/`, sub: dict.nav.travel })),
  ];
  return (
    <PageShell crumbs={[{ name: dict.common.home, path: `/${locale}/` }, { name: dict.nav.account, path: `/${locale}/account/` }, { name: dict.favourites.title, path: `/${locale}/account/favourites/` }]} title={dict.favourites.title}>
      <FavouritesList index={index} labels={{ empty: dict.favourites.empty, remove: dict.favourites.remove, count: dict.favourites.count }} />
    </PageShell>
  );
}
