import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Gallery } from "@/components/Gallery";
import { RestaurantCard } from "@/components/Cards";
import { CompareCheck, CompareLink, SaveButton } from "@/components/Controls";
import { Notice, Page } from "@/components/Section";
import { findRestaurant, restaurants, title } from "@/data/catalog";
import { LOCALES, T, money, url, type Locale } from "@/lib/i18n";
import { meta } from "@/lib/seo";
import { demoCopy } from "@/lib/demo";

export const dynamicParams = false;
export const generateStaticParams = () => LOCALES.flatMap((locale) => restaurants.map((r) => ({ locale, slug: r.slug })));
type P = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, slug } = await params;
  const r = findRestaurant(slug);
  return meta(locale as Locale, `restaurant/${slug}`, r ? `${r.name} (demo)` : undefined);
}

export default async function Profile({ params }: P) {
  const { locale: l, slug } = await params;
  const locale = l as Locale;
  const r = findRestaurant(slug);
  if (!r) notFound();
  const t = T(locale);
  const demo = demoCopy(locale);
  const images = [{ name: r.image, label: t("Main photo", "Immagine principale") }, { name: "tasting", label: t("Tasting menu", "Menù degustazione") }, { name: "dining", label: t("Dining room", "Sala") }];
  const prices: [string, string | null][] = [[t("Lunch menu", "Menù pranzo"), null], [t("Dinner tasting menu", "Menù degustazione cena"), money(r.price, locale)], [t("Wine pairing", "Abbinamento vini"), null], [t("Combined experience", "Esperienza completa"), null]];
  const nearby = restaurants.filter((x) => x.city === r.city && x !== r);
  return (
    <Page heading={r.name}>
      <div className="profile">
        <p className="lead profile-intro">{r.city.name[locale]}, {r.city.country[locale]} · {r.cuisine.name[locale]} · <span className="tag demo">Demo</span> <span className="tag">{demo.level(r.level)}</span></p>
        <Notice>{demo.notice}</Notice>
        <Gallery images={images} locale={locale} name={r.name} />
        <div className="split topline">
          <div>
            <h2>{t("Menus and prices", "Menù e prezzi")}</h2>
            <div className="price-grid">{prices.map(([label, value]) => <div key={label}>{label}<strong>{value ?? "—"}</strong><span className="tag">{value ? demo.label : t("Missing", "Dato assente")}</span></div>)}</div>
          </div>
          <div className="filters">
            <h2>{t("Plan your visit", "Organizza la visita")}</h2>
            <p>{t("Reservations are unavailable for demo listings.", "Le schede dimostrative non accettano prenotazioni.")}</p>
            <div className="row">
              <SaveButton slug={r.slug} name={r.name} locale={locale} labelled />
              <CompareCheck slug={r.slug} name={r.name} locale={locale} />
              <CompareLink locale={locale} />
              <Link className="btn" href={url(locale, "concierge")}>{t("Plan an itinerary", "Crea un itinerario")}</Link>
            </div>
          </div>
        </div>
        {nearby.length > 0 && <>
          <h2 className="topline">{t("Explore nearby", "Esplora nei dintorni")}</h2>
          <div className="grid">{nearby.map((x) => <RestaurantCard key={x.slug} r={x} locale={locale} />)}</div>
        </>}
        <p className="topline"><Link className="more" href={url(locale, "restaurants")}>{title("restaurants", locale)} →</Link></p>
      </div>
    </Page>
  );
}
