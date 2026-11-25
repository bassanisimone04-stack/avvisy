import { ArrowUpRight, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FavoriteButton } from "@/components/marketplace/favorite-button";
import { DemoBadge } from "@/components/ui/badge";
import { getCategory } from "@/features/directory/categories";
import type { Business } from "@/features/directory/types";
import { formatMiles } from "@/lib/format";
import { cn } from "@/lib/utils";

export function businessHighlights(b: Business): string[] {
  const out: string[] = [];
  if (b.attributes.publicAccess) out.push("Public access");
  if (b.attributes.cncMachines.length) out.push(b.attributes.cncMachines[0]);
  if (b.attributes.classes) out.push("Classes");
  if (b.attributes.hourlyRental) out.push("Hourly rental");
  if (b.attributes.laserCutting) out.push("Laser cutting");
  if (b.attributes.toolRental) out.push("Tool rental");
  if (b.attributes.customFabrication) out.push("Custom work");
  if (!out.length && b.attributes.materials.length) out.push(...b.attributes.materials.slice(0, 2));
  return out.slice(0, 3);
}

export function BusinessRow({
  business: b,
  distance,
  index,
  active,
  compact,
  onHover,
}: {
  business: Business;
  distance?: number | null;
  index?: number;
  active?: boolean;
  compact?: boolean;
  onHover?: (slug: string | null) => void;
}) {
  return (
    <article
      onMouseEnter={onHover ? () => onHover(b.slug) : undefined}
      onMouseLeave={onHover ? () => onHover(null) : undefined}
      onFocus={onHover ? () => onHover(b.slug) : undefined}
      data-active={active || undefined}
      id={`biz-${b.slug}`}
      className={cn(
        "group relative grid gap-4 rounded-md border bg-white p-3 transition-[border-color,box-shadow] duration-300",
        compact ? "grid-cols-[4.5rem_1fr]" : "grid-cols-[5.5rem_1fr] sm:grid-cols-[7.5rem_1fr]",
        active ? "border-forest shadow-soft" : "border-line hover:border-line-strong hover:shadow-soft",
      )}
    >
      <div className="relative aspect-square overflow-hidden rounded-sm">
        <Image src={b.image} alt="" fill sizes="120px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
        {typeof index === "number" ? (
          <span className="nums absolute top-1.5 left-1.5 grid size-6 place-items-center rounded-full bg-forest text-[0.6875rem] font-semibold text-ivory">
            {index}
          </span>
        ) : null}
      </div>
      <div className="flex min-w-0 flex-col py-0.5 pr-8">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.75rem] text-sage-ink">
          <span className="font-semibold tracking-wide uppercase">{getCategory(b.primaryCategory)?.name}</span>
          {b.isDemo ? <DemoBadge /> : null}
        </p>
        <h3 className="mt-1 truncate text-[1.1875rem] leading-snug">
          <Link href={`/business/${b.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {b.name}
          </Link>
        </h3>
        <p className="mt-0.5 flex items-center gap-1 text-[0.8125rem] text-muted">
          <MapPin className="size-3.5 shrink-0" aria-hidden />
          <span className="truncate">
            {b.neighborhood}, {b.city}, {b.stateCode}
          </span>
          {typeof distance === "number" ? <span className="nums shrink-0 text-forest">· {formatMiles(distance)}</span> : null}
        </p>
        {!compact ? <p className="mt-2 line-clamp-2 hidden text-sm leading-relaxed text-ink/80 sm:block">{b.summary}</p> : null}
        <ul className="mt-auto flex flex-wrap gap-1.5 pt-2.5">
          {businessHighlights(b).map((h) => (
            <li key={h} className="rounded-xs bg-sage-tint px-1.5 py-0.5 text-[0.6875rem] text-sage-ink">
              {h}
            </li>
          ))}
        </ul>
      </div>
      <div className="absolute top-3 right-3 z-10 flex flex-col items-center gap-2">
        <FavoriteButton item={{ kind: "business", slug: b.slug }} label={b.name} className="size-8 bg-ivory" />
        <ArrowUpRight className="size-4 text-subtle opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
      </div>
    </article>
  );
}
