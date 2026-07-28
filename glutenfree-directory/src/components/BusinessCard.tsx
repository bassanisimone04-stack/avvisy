import Link from "next/link";
import { MapPin, BadgeCheck, Truck, ShoppingBag } from "lucide-react";
import type { Business } from "@/lib/types";
import { getCategoryInfo, categoryLabel } from "@/lib/categories";
import { cityName } from "@/lib/i18n/place-names";
import { localeHref, type Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionary";
import PlaceholderImage from "./PlaceholderImage";
import RatingStars from "./RatingStars";
import FavoriteButton from "./FavoriteButton";

export default function BusinessCard({ business, locale = "it" }: { business: Business; locale?: Locale }) {
  const cat = getCategoryInfo(business.category);
  const t = getDictionary(locale);
  return (
    <Link
      href={localeHref(locale, `/directory/${business.slug}`)}
      className="card card-hover card-soft group flex flex-col overflow-hidden"
    >
      <div className="relative">
        <PlaceholderImage seed={business.gallerySeeds[0]} variant={business.category} label={business.name} className="transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span className="chip chip-neutral bg-white/90 backdrop-blur">{cat ? categoryLabel(cat, locale) : ""}</span>
          {business.aicCertified && (
            <span className="chip bg-white/90 text-brand-dark backdrop-blur">
              <BadgeCheck size={12} /> AIC
            </span>
          )}
        </div>
        <FavoriteButton id={business.id} className="absolute right-3 top-3" />
        {business.openNow && (
          <span className="chip absolute bottom-3 left-3 bg-brand-solid text-white">{t.common.openNow}</span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-ink">{business.name}</h3>
          <span className="shrink-0 text-sm font-medium text-ink-soft">{business.priceRange}</span>
        </div>
        <p className="flex items-center gap-1 text-xs text-muted">
          <MapPin size={13} /> {cityName(business.city, locale)}, {cityName(business.province, locale)}
        </p>
        <p className="line-clamp-2 text-sm text-ink-soft">{business.shortDescription}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center gap-1.5">
            <RatingStars rating={business.rating} />
            <span className="text-xs text-muted">{business.rating} ({business.reviewCount})</span>
          </div>
          <div className="flex items-center gap-1.5 text-ink-soft">
            {business.delivery && <Truck size={15} aria-label="Delivery" />}
            {business.takeaway && <ShoppingBag size={15} aria-label="Takeaway" />}
          </div>
        </div>
      </div>
    </Link>
  );
}
