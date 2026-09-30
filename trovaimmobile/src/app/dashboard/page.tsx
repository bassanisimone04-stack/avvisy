import Link from "next/link";
import { requireUser, isAdvertiser } from "@/lib/session";
import { listingsByAdvertiser } from "@/lib/listings";
import { contactsFor, visitsFor } from "@/lib/dashboard";
import { freshness } from "@/lib/freshness";
import { advertiserStats } from "@/lib/trust";
import { formatSlot, timeAgo } from "@/lib/format";
import { reconfirmAction } from "@/app/actions";
import { ResponseTime } from "@/components/trust";

export default async function DashboardHome({ searchParams }: { searchParams: Promise<{ visita?: string }> }) {
  const user = await requireUser();
  const sp = await searchParams;
  const adv = isAdvertiser(user);
  const now = Date.now();
  const visits = visitsFor(user.id);
  const upcoming = visits.filter((v) => v.status === "confirmed" && Date.parse(v.end_at) > now).reverse();
  const contacts = contactsFor(user.id);
  const booked = sp.visita ? visits.find((v) => v.id === Number(sp.visita)) : undefined;

  const listings = adv ? listingsByAdvertiser(user.id, true) : [];
  const toConfirm = listings.filter((l) => freshness(l.confirmed_at) !== "fresh");
  const unanswered = contacts.filter((c) => c.advertiser_id === user.id && !c.replied_at);
  const toReview = visits.filter((v) => v.seeker_id === user.id && Date.parse(v.end_at) < now && (v.status === "confirmed" || v.status === "completed") && !v.reviewed);
  const stats = adv ? advertiserStats([user.id]).get(user.id) : undefined;

  return (
    <div className="stack" style={{ gap: 16 }}>
      {booked && (
        <div className="alert alert-ok">
          <strong>Visita confermata</strong>
          {booked.title} — {formatSlot(booked.start_at)}, {booked.via} {booked.civico}, {booked.comune}. L&apos;inserzionista è stato avvisato. Ricorda: non pagare nulla prima della visita.
        </div>
      )}

      {adv && (
        <section className="card card-pad stack">
          <div className="spread">
            <h2 style={{ margin: 0 }}>Disponibilità da riconfermare</h2>
            <Link href="/pubblica" className="btn btn-primary btn-sm">
              + Nuovo annuncio
            </Link>
          </div>
          {toConfirm.length === 0 ? (
            <p className="small muted" style={{ margin: 0 }}>
              {listings.length === 0 ? "Non hai annunci attivi." : "Tutti i tuoi annunci sono confermati questa settimana. 👍"}
            </p>
          ) : (
            <ul className="list">
              {toConfirm.map((l) => (
                <li key={l.id} className="spread">
                  <div>
                    <Link href={`/annunci/${l.id}`}>{l.title}</Link>
                    <div className="xs muted">Ultima conferma {timeAgo(l.confirmed_at)} — sta perdendo posizioni nei risultati</div>
                  </div>
                  <form action={reconfirmAction}>
                    <input type="hidden" name="listingId" value={l.id} />
                    <button className="btn btn-primary btn-sm">Ancora disponibile</button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {adv && (
        <section className="card card-pad stack">
          <h2 style={{ margin: 0 }}>Il tuo profilo pubblico</h2>
          <ResponseTime stats={stats} />
          <p className="small" style={{ margin: 0 }}>
            {unanswered.length > 0 ? (
              <Link href="/dashboard/messaggi">{unanswered.length} richieste in attesa di risposta →</Link>
            ) : (
              <span className="muted">Nessuna richiesta in attesa.</span>
            )}
          </p>
          <Link href={`/inserzionisti/${user.id}`} className="small">
            Vedi come ti vedono gli altri →
          </Link>
        </section>
      )}

      <section className="card card-pad stack">
        <h2 style={{ margin: 0 }}>Prossime visite</h2>
        {upcoming.length === 0 ? (
          <p className="small muted" style={{ margin: 0 }}>Nessuna visita in programma.</p>
        ) : (
          <ul className="list">
            {upcoming.slice(0, 5).map((v) => (
              <li key={v.id}>
                <strong>{formatSlot(v.start_at)}</strong>
                <div className="small">
                  <Link href={`/annunci/${v.listing_id}`}>{v.title}</Link> · {v.via} {v.civico}, {v.comune}
                </div>
                <div className="xs muted">{v.advertiser_id === user.id ? `Con ${v.seeker_name}` : `Con ${v.advertiser_name}`}</div>
              </li>
            ))}
          </ul>
        )}
        <Link href="/dashboard/visite" className="small">
          Tutte le visite →
        </Link>
      </section>

      {toReview.length > 0 && (
        <section className="card card-pad">
          <h2>Recensioni da lasciare</h2>
          <p className="small" style={{ margin: 0 }}>
            Hai {toReview.length} {toReview.length === 1 ? "visita svolta" : "visite svolte"} da recensire. <Link href="/dashboard/visite">Scrivi una recensione →</Link>
          </p>
        </section>
      )}

      {!adv && (
        <div className="row">
          <Link href="/annunci" className="btn btn-primary">
            Cerca casa
          </Link>
        </div>
      )}
    </div>
  );
}
