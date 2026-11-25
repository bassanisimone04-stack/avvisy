import Link from "next/link";
import { DemoBadge } from "@/components/ui/badge";
import type { Product } from "@/features/catalog/types";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { FavoriteButton } from "./favorite-button";
import { PlanSheet } from "./plan-sheet";

const difficultyDots = { Beginner: 1, Intermediate: 2, Advanced: 3 } as const;

export function Difficulty({ level, className }: { level: Product["difficulty"]; className?: string }) {
  const n = difficultyDots[level];
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span className="flex gap-0.5" aria-hidden>
        {[1, 2, 3].map((i) => (
          <span key={i} className={cn("h-2.5 w-1 rounded-[1px]", i <= n ? "bg-forest" : "bg-line-strong")} />
        ))}
      </span>
      {level}
    </span>
  );
}

export function FormatList({ formats, className }: { formats: string[]; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-1", className)} aria-label="File formats">
      {formats.map((f) => (
        <li key={f} className="rounded-xs border border-line-strong px-1.5 py-px font-mono text-[0.625rem] tracking-wider text-muted">
          {f}
        </li>
      ))}
    </ul>
  );
}

export function ProductCard({ product, className, priority }: { product: Product; className?: string; priority?: boolean }) {
  return (
    <article className={cn("group relative flex flex-col", className)}>
      <div className="relative overflow-hidden rounded-md border border-line bg-white transition-shadow duration-500 group-hover:shadow-lift">
        <PlanSheet product={product} className="aspect-[4/3.2] transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.025]" priority={priority} />
        <div className="absolute top-3 left-3 flex gap-1.5">{product.isDemo ? <DemoBadge /> : null}</div>
        <FavoriteButton item={{ kind: "product", slug: product.slug }} label={product.title} className="absolute right-3 bottom-3 z-10" />
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[0.75rem] text-muted">
            <Difficulty level={product.difficulty} />
          </p>
          <h3 className="mt-1.5 text-[1.25rem] leading-tight">
            <Link href={`/shop/${product.slug}`} className="after:absolute after:inset-0 after:content-['']">
              {product.title}
            </Link>
          </h3>
          <p className="mt-1 line-clamp-1 text-sm text-muted">{product.subtitle}</p>
        </div>
        <p className="nums shrink-0 pt-6 font-display text-[1.25rem] text-forest">{formatPrice(product.prices.personal)}</p>
      </div>
      <FormatList formats={product.formats} className="mt-3" />
    </article>
  );
}
