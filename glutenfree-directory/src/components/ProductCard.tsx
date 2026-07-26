import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import PlaceholderImage from "./PlaceholderImage";
import RatingStars from "./RatingStars";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/prodotti/${product.slug}`} className="card card-hover card-soft group flex flex-col overflow-hidden">
      <div className="relative">
        <PlaceholderImage seed={product.imageSeed} variant="prodotto" label={product.name} ratio="aspect-square" className="transition-transform duration-500 group-hover:scale-105" />
        {product.aicCertified && (
          <span className="chip absolute left-3 top-3 bg-white/90 text-brand-dark backdrop-blur">
            <BadgeCheck size={12} /> AIC
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">{product.brand}</p>
        <h3 className="text-sm font-semibold text-ink line-clamp-2">{product.name}</h3>
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center gap-1">
            <RatingStars rating={product.rating} size={13} />
          </div>
          <span className="font-semibold text-brand-dark">{formatPrice(product.price)}</span>
        </div>
      </div>
    </Link>
  );
}
