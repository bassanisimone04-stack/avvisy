import Link from "next/link";
import type { Locale } from "@/config/brand";
import type { Restaurant } from "@/db/types";
import type { Dict } from "@/i18n/en";
import { fmt } from "@/i18n";
import { SmartImage } from "@/components/media/SmartImage";
import { buildAlt } from "@/lib/alt";
import { priceFrom } from "@/lib/price";
import { Price } from "@/features/Price";
import { FavouriteButton } from "@/features/FavouriteButton";
import { CompareToggle } from "@/features/CompareToggle";
import { DemoBadge } from "@/components/ui/ui";
import { RecognitionText } from "./Recognition";

export function RestaurantCard({ r, locale, dict, city, country, cuisines, priority, headingLevel = 3 }: {
  r: Restaurant; locale: Locale; dict: Dict; city: string; country: string; cuisines: string[]; priority?: boolean; headingLevel?: 2 | 3;
}) {
  const img = r.images[0]!;
  const from = priceFrom(r);
  const H = headingLevel === 2 ? "h2" : "h3";
  const href = `/${locale}/restaurant/${r.slug}/`;
  return (
    <article className="card-lift group relative flex flex-col" data-restaurant={r.slug}>
      <div className="relative">
        <Link href={href} tabIndex={-1} aria-hidden="true">
          <SmartImage imageKey={img.key} alt={buildAlt(img, { name: r.name, city, locale })} sizes="(min-width:1280px) 280px, (min-width:768px) 33vw, 90vw" ratio="4 / 3" priority={priority} label={dict.common.illustrative} />
        </Link>
        <FavouriteButton itemKey={`restaurant:${r.slug}`} name={r.name} labels={{ add: dict.favourites.add, remove: dict.favourites.remove, saved: dict.common.saved, save: dict.common.save }} className="absolute right-2 top-2" />
        <CompareToggle slug={r.slug} name={r.name} label={dict.common.compare} fullMsg={dict.compare.full} className="absolute bottom-2 left-2" />
        {r.isDemo && <DemoBadge label={dict.common.demoData} className="absolute left-2 top-2" />}
      </div>
      <div className="pt-3">
        <H className="font-sans text-base font-bold leading-snug">
          <Link href={href} className="after:absolute after:inset-0 after:content-[''] hover:underline">{r.name}</Link>
        </H>
        <p className="text-[13px] text-stone">{city}, {country}</p>
        <p className="mt-1 text-[13px] leading-snug">
          {cuisines.join(" · ")}
          {from && <> · <span className="font-medium">{fmt(dict.common.tastingFrom, { price: "" }).trim()} <Price amount={from.amount} currency={from.currency} locale={locale} /></span></>}
        </p>
        <p className="relative z-10 mt-1 text-xs text-stone"><RecognitionText r={r} dict={dict} compact /></p>
      </div>
    </article>
  );
}
