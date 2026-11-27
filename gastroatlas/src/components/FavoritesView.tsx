"use client";

import Link from "next/link";
import { KEYS, useList } from "@/lib/store";
import { Notice } from "./Section";
import { RestaurantCard } from "./Cards";
import { restaurants, title } from "@/data/catalog";
import { T, url, type Locale } from "@/lib/i18n";
import { demoCopy } from "@/lib/demo";

export function FavoritesView({ locale }: { locale: Locale }) {
  const t = T(locale);
  const saved = useList(KEYS.saves);
  const list = restaurants.filter((r) => saved.includes(r.slug));
  return (
    <>
      <Notice>{saved.length ? demoCopy(locale).notice : t("Your saved restaurants appear here.", "Qui troverai i ristoranti che salvi.")}</Notice>
      <div className="grid">{list.map((r) => <RestaurantCard key={r.slug} r={r} locale={locale} />)}</div>
      <p className="topline"><Link className="more" href={url(locale, "restaurants")}>{title("restaurants", locale)} →</Link></p>
    </>
  );
}
