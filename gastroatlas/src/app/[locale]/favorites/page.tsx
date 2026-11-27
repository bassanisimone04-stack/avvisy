import type { Metadata } from "next";
import { FavoritesView } from "@/components/FavoritesView";
import { Page } from "@/components/Section";
import { title } from "@/data/catalog";
import type { Locale } from "@/lib/i18n";
import { meta } from "@/lib/seo";

type P = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: P): Promise<Metadata> { const l = (await params).locale as Locale; return meta(l, "favorites", title("favorites", l)); }
export default async function Favorites({ params }: P) {
  const locale = (await params).locale as Locale;
  return <Page heading={title("favorites", locale)}><FavoritesView locale={locale} /></Page>;
}
