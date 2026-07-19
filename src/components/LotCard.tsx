import Link from "next/link";
import LotImage from "./LotImage";
import FavoriteButton from "./FavoriteButton";
import { ConditionChip, VerifiedBadge } from "./badges";
import { IconArrowRight, IconMapPin } from "./icons";
import { categoryName, companyById } from "@/lib/mock-data";
import { formatEuro, formatNumber } from "@/lib/format";
import { lotTotal, type Lot } from "@/lib/types";

export default function LotCard({ lot }: { lot: Lot }) {
  const seller = companyById(lot.sellerId);
  const verified = seller?.verification === "Verificata";
  return (
    <article className="card card-soft group flex flex-col overflow-hidden transition-shadow hover:shadow-[var(--shadow-lift)]">
      <div className="relative">
        <Link href={`/lotto/${lot.id}`} aria-label={lot.title}>
          <LotImage category={lot.category} seed={lot.images[0] ?? 1} />
        </Link>
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span className="chip bg-surface/95 text-ink-soft shadow-sm">
            {categoryName(lot.category)}
          </span>
        </div>
        <div className="absolute right-3 top-3 flex items-center gap-1.5">
          {verified && (
            <span className="rounded-full bg-surface/95 shadow-sm">
              <VerifiedBadge size="xs" />
            </span>
          )}
          <FavoriteButton lotId={lot.id} />
        </div>
        <span className="mono absolute bottom-2 left-3 rounded bg-surface/90 px-1.5 py-0.5 text-[0.65rem] text-ink-soft shadow-sm">
          {lot.code}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center gap-2">
          <ConditionChip condition={lot.condition} />
          {lot.negotiable && (
            <span className="chip bg-steel-soft text-steel">Negoziabile</span>
          )}
        </div>
        <h3 className="text-[0.975rem] font-semibold leading-snug text-ink">
          <Link href={`/lotto/${lot.id}`} className="hover:text-brand-dark">
            {lot.title}
          </Link>
        </h3>

        <p className="mt-1 flex items-center gap-1 text-sm text-muted">
          <IconMapPin width={14} height={14} />
          {lot.province}, {lot.region}
        </p>

        <div className="mt-3 grid grid-cols-2 gap-2 rounded-lg bg-surface-2 p-3 text-sm">
          <div>
            <p className="text-xs text-muted">Quantità</p>
            <p className="font-semibold text-ink">
              {formatNumber(lot.quantity)} {lot.unit}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted">Prezzo unitario</p>
            <p className="font-semibold text-ink">{formatEuro(lot.unitPrice)}</p>
          </div>
        </div>

        <div className="mt-auto flex items-end justify-between pt-4">
          <div>
            <p className="mono text-[0.65rem] uppercase tracking-wide text-muted">Valore totale</p>
            <p className="font-display text-lg font-extrabold text-brand">
              {formatEuro(lotTotal(lot), true)}
            </p>
          </div>
          <Link href={`/lotto/${lot.id}`} className="btn btn-outline btn-sm">
            Dettagli
            <IconArrowRight width={16} height={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}
