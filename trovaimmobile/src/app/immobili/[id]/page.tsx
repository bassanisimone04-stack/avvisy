import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProperty, priceHistory, propertyListings } from "@/lib/listings";
import { formatDate, formatEuro } from "@/lib/format";
import { AdvertiserTypeBadge, AvailabilityBadge } from "@/components/trust";
import { PriceChart } from "@/components/PriceChart";
import { MapEmbed } from "@/components/MapEmbed";
import { entryCost } from "@/lib/costs";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProperty(Number((await params).id));
  return { title: p ? `${p.via} ${p.civico}, ${p.comune} — scheda immobile` : "Immobile" };
}

export default async function PropertyPage({ params }: Props) {
  const p = getProperty(Number((await params).id));
  if (!p) notFound();
  const listings = propertyListings(p.id);
  const prices = priceHistory(p.id);
  const address = `${p.via} ${p.civico}${p.interno ? `, interno ${p.interno}` : ""}`;

  return (
    <div className="container section stack" style={{ gap: 20 }}>
      <div>
        <p className="small muted" style={{ margin: 0 }}>Scheda immobile n. {p.id} · schedato dal {formatDate(p.created_at)}</p>
        <h1>{address}</h1>
        <p className="muted" style={{ margin: 0 }}>
          {p.cap ? `${p.cap} ` : ""}
          {p.comune}
          {p.quartiere ? ` · ${p.quartiere}` : ""} · {p.regione}
        </p>
      </div>

      <div className="alert alert-info">
        Ogni immobile ha una sola scheda, legata al suo indirizzo esatto. Gli annunci vanno e vengono — anche di inserzionisti diversi — ma lo storico resta qui.
      </div>

      <div className="grid grid-2">
        <section className="card card-pad">
          <h2>Andamento del canone</h2>
          <PriceChart points={prices} />
        </section>
        <section className="card card-pad">
          <h2>Posizione</h2>
          <MapEmbed lat={p.lat} lon={p.lon} label={address} />
        </section>
      </div>

      <section className="card card-pad">
        <h2>Annunci collegati ({listings.length})</h2>
        <div className="table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th>Annuncio</th>
                <th>Inserzionista</th>
                <th>Periodo</th>
                <th>Canone</th>
                <th>Ingresso</th>
                <th>Stato</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((l) => (
                <tr key={l.id}>
                  <td>
                    <Link href={`/annunci/${l.id}`}>{l.title}</Link>
                  </td>
                  <td>
                    <AdvertiserTypeBadge role={l.advertiser_role} />
                  </td>
                  <td className="small">
                    {formatDate(l.created_at)} → {l.closed_at ? formatDate(l.closed_at) : "oggi"}
                  </td>
                  <td>{formatEuro(l.canone)}</td>
                  <td>{formatEuro(entryCost(l))}</td>
                  <td>
                    {l.status === "closed" ? (
                      <span className="badge badge-neutral">{l.closed_reason === "affittato" ? "Affittato" : "Ritirato"}</span>
                    ) : (
                      <AvailabilityBadge confirmedAt={l.confirmed_at} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
