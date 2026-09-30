import Link from "next/link";
import type { ListingRow } from "@/lib/listings";
import type { AdvertiserStats } from "@/lib/trust";
import { photoUrl } from "@/lib/storage";
import { AdvertiserTypeBadge, AvailabilityBadge, CostCompact, ResponseTime } from "./trust";
import { IconPin } from "./icons";
import { RoomIllustration } from "./RoomIllustration";

export function Photo({ storageKey, alt, variant = 0 }: { storageKey: string | null; alt: string; variant?: number }) {
  if (!storageKey)
    return (
      <div className="placeholder" role="img" aria-label="Illustrazione: nessuna foto caricata">
        <RoomIllustration variant={variant} />
      </div>
    );
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={photoUrl(storageKey)} alt={alt} loading="lazy" />;
}

/** Card dei risultati: disponibilità, tempo di risposta e costo totale visibili senza aprire l'annuncio. */
export function ListingCard({ l, stats }: { l: ListingRow; stats?: AdvertiserStats }) {
  return (
    <Link href={`/annunci/${l.id}`} className="listing-card">
      <div className="media">
        <Photo storageKey={l.cover} alt={l.title} variant={l.property_id} />
        <div className="badge-float">
          <AvailabilityBadge confirmedAt={l.confirmed_at} status={l.status} />
        </div>
      </div>
      <div className="body">
        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}>
            {l.comune}
            {l.quartiere ? ` · ${l.quartiere}` : ""}
          </div>
          <div className="title">{l.title}</div>
          <div className="row small muted" style={{ marginTop: 6 }}>
            <IconPin size={14} />
            {l.tipologia} · {l.mq} m² · {l.locali} {l.locali === 1 ? "locale" : "locali"}
          </div>
        </div>
        <CostCompact canone={l.canone} spese={l.spese} cauzione={l.cauzione} commissione={l.commissione} />
        <div className="spread" style={{ marginTop: "auto" }}>
          <AdvertiserTypeBadge role={l.advertiser_role} />
          <ResponseTime stats={stats} compact />
        </div>
      </div>
    </Link>
  );
}
