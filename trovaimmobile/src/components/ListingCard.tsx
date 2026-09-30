import Link from "next/link";
import type { ListingRow } from "@/lib/listings";
import type { AdvertiserStats } from "@/lib/trust";
import { photoUrl } from "@/lib/storage";
import { AdvertiserTypeBadge, AvailabilityBadge, CostCompact, ResponseTime } from "./trust";
import { IconHome, IconPin } from "./icons";

export function Photo({ storageKey, alt }: { storageKey: string | null; alt: string }) {
  if (!storageKey)
    return (
      <div className="placeholder" role="img" aria-label="Nessuna foto">
        <IconHome size={36} />
      </div>
    );
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={photoUrl(storageKey)} alt={alt} loading="lazy" />;
}

/** Card dei risultati: disponibilità, tempo di risposta e costo totale visibili senza aprire l'annuncio. */
export function ListingCard({ l, stats }: { l: ListingRow; stats?: AdvertiserStats }) {
  return (
    <Link href={`/annunci/${l.id}`} className="card listing-card">
      <div className="media">
        <Photo storageKey={l.cover} alt={l.title} />
        <div className="badge-float">
          <AvailabilityBadge confirmedAt={l.confirmed_at} status={l.status} />
        </div>
      </div>
      <div className="body">
        <div>
          <div className="title">{l.title}</div>
          <div className="row small muted" style={{ marginTop: 4 }}>
            <IconPin size={14} />
            {l.quartiere ? `${l.quartiere}, ` : ""}
            {l.comune}
            <span>·</span>
            {l.tipologia} · {l.mq} m²
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
