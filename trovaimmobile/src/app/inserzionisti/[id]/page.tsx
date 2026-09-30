import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { listingsByAdvertiser } from "@/lib/listings";
import { advertiserStats } from "@/lib/trust";
import { formatDate, formatDuration, publicName } from "@/lib/format";
import { AdvertiserTypeBadge, ResponseTime, Stars } from "@/components/trust";
import { ListingCard } from "@/components/ListingCard";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };
type Adv = { id: number; name: string; role: "seeker" | "private" | "agency"; agency_name: string | null; agency_vat: string | null; created_at: string };

function loadAdvertiser(id: number) {
  return db().prepare("SELECT id, name, role, agency_name, agency_vat, created_at FROM users WHERE id = ?").get(id) as Adv | undefined;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = loadAdvertiser(Number((await params).id));
  return { title: a ? (a.agency_name ?? a.name) : "Inserzionista" };
}

export default async function AdvertiserPage({ params }: Props) {
  const a = loadAdvertiser(Number((await params).id));
  if (!a || a.role === "seeker") notFound();
  const stats = advertiserStats([a.id]).get(a.id)!;
  const listings = listingsByAdvertiser(a.id, true);
  const reviews = db()
    .prepare(
      `SELECT r.rating, r.text, r.created_at, v.start_at, v.contract_signed, u.name AS reviewer, l.title, l.id AS listing_id
         FROM reviews r JOIN visits v ON v.id = r.visit_id JOIN users u ON u.id = r.reviewer_id JOIN listings l ON l.id = v.listing_id
        WHERE r.advertiser_id = ? ORDER BY r.created_at DESC LIMIT 30`,
    )
    .all(a.id) as { rating: number; text: string; created_at: string; start_at: string; contract_signed: number; reviewer: string; title: string; listing_id: number }[];
  const role = a.role as "private" | "agency";

  return (
    <div className="container section stack" style={{ gap: 20 }}>
      <section className="card card-pad stack">
        <div className="row">
          <AdvertiserTypeBadge role={role} />
          <span className="small muted">su TrovaImmobile dal {formatDate(a.created_at)}</span>
        </div>
        <h1 style={{ margin: 0 }}>{a.agency_name ?? publicName(a.name)}</h1>
        {role === "agency" ? (
          <p className="small muted" style={{ margin: 0 }}>
            Agenzia · P. IVA {a.agency_vat} (dichiarata in registrazione). Può applicare una commissione, dovuta solo alla firma del contratto.
          </p>
        ) : (
          <p className="small muted" style={{ margin: 0 }}>Proprietario privato: non applica commissioni.</p>
        )}
        <div className="facts">
          <div className="fact">
            <div className="k">Tempo di risposta (mediana)</div>
            <div className="v">{stats.medianResponseMinutes != null ? formatDuration(stats.medianResponseMinutes) : "—"}</div>
          </div>
          <div className="fact">
            <div className="k">Tasso di risposta</div>
            <div className="v">{stats.responseRate != null ? `${Math.round(stats.responseRate * 100)}%` : "—"}</div>
          </div>
          <div className="fact">
            <div className="k">Visite svolte</div>
            <div className="v">{stats.completedVisits}</div>
          </div>
          <div className="fact">
            <div className="k">Valutazione</div>
            <div className="v">{stats.avgRating != null ? `${stats.avgRating} / 5` : "—"}</div>
          </div>
        </div>
        <ResponseTime stats={stats} />
        <p className="xs muted" style={{ margin: 0 }}>
          Metriche calcolate automaticamente dalle richieste ricevute e dalle visite prenotate su TrovaImmobile negli ultimi 90 giorni. Non sono modificabili dall&apos;inserzionista.
        </p>
      </section>

      <section>
        <h2>Recensioni da visite verificate ({reviews.length})</h2>
        {reviews.length === 0 ? (
          <p className="muted">Ancora nessuna recensione. Si può recensire solo dopo una visita prenotata e svolta su TrovaImmobile.</p>
        ) : (
          <ul className="list card card-pad">
            {reviews.map((r, i) => (
              <li key={i}>
                <div className="spread">
                  <Stars value={r.rating} />
                  <span className="row">
                    <span className="badge badge-ok">Visita verificata del {formatDate(r.start_at)}</span>
                    {r.contract_signed ? <span className="badge badge-ok">Contratto firmato</span> : null}
                  </span>
                </div>
                <p style={{ margin: "6px 0" }}>{r.text}</p>
                <div className="xs muted">
                  {publicName(r.reviewer)} · per «{r.title}»
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Annunci attivi ({listings.length})</h2>
        <div className="grid grid-2 grid-3">
          {listings.map((l) => (
            <ListingCard key={l.id} l={l} stats={stats} />
          ))}
        </div>
      </section>
    </div>
  );
}
