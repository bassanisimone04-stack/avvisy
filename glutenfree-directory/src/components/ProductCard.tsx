import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { getLocalizedProduct } from "@/lib/i18n/content-product";
import { localeHref, type Locale } from "@/lib/i18n/locale";
import PlaceholderImage from "./PlaceholderImage";
import CoverPhoto from "./CoverPhoto";
import RatingStars from "./RatingStars";

export default function ProductCard({ product, locale = "it" }: { product: Product; locale?: Locale }) {
  const p = getLocalizedProduct(product, locale);
  return (
    <Link href={localeHref(locale, `/prodotti/${product.slug}`)} className="card card-hover card-soft group flex flex-col overflow-hidden">
      <div className="relative">
        {p.photoUrl ? (
          <CoverPhoto photoUrl={p.photoUrl} seed={p.imageSeed} variant="prodotto" label={p.name} ratio="aspect-square" className="transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <PlaceholderImage seed={p.imageSeed} variant="prodotto" label={p.name} ratio="aspect-square" className="transition-transform duration-500 group-hover:scale-105" />
        )}
        {p.aicCertified && (
          <span className="chip absolute left-3 top-3 bg-white/90 text-brand-dark backdrop-blur">
            <BadgeCheck size={12} /> AIC
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">{p.brand}</p>
        <h3 className="text-sm font-semibold text-ink line-clamp-2">{p.name}</h3>
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center gap-1">
            <RatingStars rating={p.rating} size={13} />
          </div>
          <span className="font-semibold text-brand-dark">{formatPrice(p.price, locale)}</span>
        </div>
      </div>
    </Link>
  );
}
