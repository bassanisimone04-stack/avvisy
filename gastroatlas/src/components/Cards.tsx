import Link from "next/link";
import { Photo } from "./Photo";
import { SaveButton, CompareCheck } from "./Controls";
import { T, url, money, type Locale } from "@/lib/i18n";
import type { City, Restaurant } from "@/data/catalog";

/** Generic photo card: photo, title and a grey line below, the whole card is one link. */
export function Card({ img, heading, desc, href, sizes }: { img: string; heading: string; desc: string; href: string; sizes?: string }) {
  return (
    <article className="card">
      <Link href={href}>
        <Photo name={img} alt={heading} sizes={sizes} />
        <h3>{heading}</h3>
        <p className="muted">{desc}</p>
      </Link>
    </article>
  );
}

export function CityCard({ city, locale }: { city: City; locale: Locale }) {
  return <Card img={city.slug} heading={city.name[locale]} desc={city.country[locale]} href={url(locale, `restaurants/${city.slug}`)} sizes="(min-width: 1100px) 380px, (min-width: 661px) 33vw, 33vw" />;
}

/** Restaurant card. Every venue here is fictional: the DEMO badge, level tag and "demo menu" label say so. */
export function RestaurantCard({ r, locale }: { r: Restaurant; locale: Locale }) {
  const t = T(locale);
  return (
    <article className="card" data-restaurant={r.slug}>
      <Link href={url(locale, `restaurant/${r.slug}`)}>
        <Photo name={r.image} alt={`${r.name} — ${t("demo listing, illustrative photo", "scheda dimostrativa, foto illustrativa")}`} sizes="(min-width: 1100px) 380px, (min-width: 661px) 33vw, 100vw" />
        <h3>{r.name}</h3>
      </Link>
      <SaveButton slug={r.slug} name={r.name} locale={locale} />
      <span className="tag demo">{t("Demo", "Demo")}</span> <span className="tag">{t("Demo distinction · Level ", "Distinzione demo · Livello ")}{r.level}</span>
      <p>{r.city.name[locale]}, {r.city.country[locale]}</p>
      <p className="muted">{r.cuisine.name[locale]} · {t("Demo menu", "Menù demo")} {money(r.price, locale)}</p>
      <CompareCheck slug={r.slug} name={r.name} locale={locale} />
    </article>
  );
}
