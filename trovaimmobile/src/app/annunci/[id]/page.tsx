import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getListing, listingPhotos, priceHistory, propertyListings } from "@/lib/listings";
import { advertiserStats } from "@/lib/trust";
import { getFreeSlots } from "@/lib/calendar";
import { currentUser } from "@/lib/session";
import { photoUrl } from "@/lib/storage";
import { formatDate, formatEuro, publicName, timeAgo } from "@/lib/format";
import { AdvertiserTypeBadge, AvailabilityBadge, CostCompact, CostTable, FraudWarning, ResponseTime, Stars } from "@/components/trust";
import { Photo } from "@/components/ListingCard";
import { SlotPicker } from "@/components/SlotPicker";
import { ContactForm } from "@/components/ContactForm";
import { PriceChart } from "@/components/PriceChart";
import { MapEmbed } from "@/components/MapEmbed";
import { IconCalendar, IconHistory, IconPin } from "@/components/icons";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | undefined>> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const l = getListing(Number((await params).id));
  return { title: l ? `${l.title} — ${l.comune}` : "Annuncio" };
}

export default async function ListingPage({ params, searchParams }: Props) {
  const id = Number((await params).id);
  const l = Number.isInteger(id) ? getListing(id) : null;
  if (!l) notFound();
  const sp = await searchParams;
  const user = await currentUser();
  const photos = listingPhotos(l.id);
  const stats = advertiserStats([l.advertiser_id]).get(l.advertiser_id)!;
  const history = propertyListings(l.property_id);
  const prices = priceHistory(l.property_id);
  const others = history.filter((h) => h.id !== l.id);
  const calendar = l.status === "active" ? await getFreeSlots(l.advertiser_id) : null;
  const isOwner = user?.id === l.advertiser_id;
  const address = `${l.via} ${l.civico}${l.interno ? `, int. ${l.interno}` : ""}, ${l.comune}`;

  return (
    <div className="container section">
      {sp.pubblicato && (
        <div className="alert alert-ok" style={{ marginBottom: 16 }}>
          <strong>Annuncio pubblicato.</strong>
          {sp.pubblicato === "agganciato"
            ? "L'indirizzo era già schedato: l'annuncio è stato collegato alla scheda esistente e al suo storico."
            : "È stata creata la scheda dell'immobile: resterà anche quando l'annuncio verrà chiuso."}
        </div>
      )}

      <div className="stack" style={{ marginBottom: 16 }}>
        <div className="row">
          <AvailabilityBadge confirmedAt={l.confirmed_at} status={l.status} />
          <AdvertiserTypeBadge role={l.advertiser_role} agencyName={l.agency_name} />
        </div>
        <h1 style={{ margin: 0 }}>{l.title}</h1>
        <div className="row muted small">
          <IconPin size={15} /> {address}
          {l.quartiere && <> · {l.quartiere}</>} · {l.regione}
        </div>
        <div className="only-mobile stack" style={{ gap: 8 }}>
          <CostCompact canone={l.canone} spese={l.spese} cauzione={l.cauzione} commissione={l.commissione} />
          <ResponseTime stats={stats} compact />
          {l.status === "active" && !isOwner && (
            <a className="btn btn-primary" href="#visita">
              Vedi orari di visita liberi
            </a>
          )}
        </div>
      </div>

      <div className="detail-layout">
        <div className="stack" style={{ gap: 20 }}>
          <div className="gallery">
            {photos.length === 0 ? (
              <div>
                <Photo storageKey={null} alt="" variant={l.property_id} />
              </div>
            ) : (
              photos.map((p, i) => (
                <div key={p}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photoUrl(p)} alt={`${l.title} — foto ${i + 1}`} loading={i === 0 ? "eager" : "lazy"} />
                </div>
              ))
            )}
          </div>

          <div className="facts">
            <div className="fact"><div className="k">Tipologia</div><div className="v">{l.tipologia}</div></div>
            <div className="fact"><div className="k">Superficie</div><div className="v">{l.mq} m²</div></div>
            <div className="fact"><div className="k">Locali / bagni</div><div className="v">{l.locali} / {l.bagni}</div></div>
            <div className="fact"><div className="k">Piano</div><div className="v">{l.piano ?? "—"}</div></div>
            <div className="fact"><div className="k">Contratto</div><div className="v">{l.contratto}</div></div>
            <div className="fact"><div className="k">Arredato</div><div className="v">{l.arredato ? "Sì" : "No"}</div></div>
            <div className="fact"><div className="k">Disponibile dal</div><div className="v">{l.disponibile_dal ? formatDate(l.disponibile_dal) : "Subito"}</div></div>
            <div className="fact"><div className="k">Pubblicato</div><div className="v">{timeAgo(l.created_at)}</div></div>
          </div>

          <section className="card card-pad">
            <h2>Descrizione</h2>
            <p style={{ whiteSpace: "pre-line", margin: 0 }}>{l.description}</p>
          </section>

          <section className="card card-pad stack">
            <div className="spread">
              <h2 style={{ margin: 0 }}>
                <IconHistory size={18} style={{ verticalAlign: "-3px" }} /> Storico dell&apos;immobile
              </h2>
              <Link href={`/immobili/${l.property_id}`} className="small">
                Scheda completa →
              </Link>
            </div>
            <PriceChart points={prices} />
            {others.length > 0 ? (
              <p className="small" style={{ margin: 0 }}>
                Questo immobile ha avuto <strong>{others.length}</strong> {others.length === 1 ? "altro annuncio" : "altri annunci"} su TrovaImmobile
                {others.some((o) => o.status === "active") && ", di cui almeno uno ancora attivo di un altro inserzionista"}.
              </p>
            ) : (
              <p className="small muted" style={{ margin: 0 }}>
                Primo annuncio per questo indirizzo dal {formatDate(history[history.length - 1].created_at)}.
              </p>
            )}
          </section>

          <section className="card card-pad">
            <h2>Posizione</h2>
            <MapEmbed lat={l.lat} lon={l.lon} label={address} />
            {l.geo_precision === "approx" && <p className="xs muted" style={{ marginTop: 6 }}>Posizione approssimata: il numero civico non è mappato su OpenStreetMap.</p>}
          </section>
        </div>

        <aside className="detail-aside stack">
          <section className="card card-pad stack">
            <div className="spread">
              <span className="price">{formatEuro(l.canone)}<span className="small muted"> /mese</span></span>
              {l.spese > 0 && <span className="small muted">+ {formatEuro(l.spese)} spese</span>}
            </div>
            <CostTable canone={l.canone} spese={l.spese} cauzione={l.cauzione} commissione={l.commissione} role={l.advertiser_role} />
          </section>

          <FraudWarning />

          {l.status === "active" && !isOwner && calendar && (
            <section className="card card-pad stack" id="visita">
              <h2 style={{ margin: 0 }}>
                <IconCalendar size={18} style={{ verticalAlign: "-3px" }} /> Prenota una visita
              </h2>
              <p className="xs muted" style={{ margin: 0 }}>
                {calendar.calendarLinked
                  ? `Fasce calcolate sul calendario reale dell'inserzionista (sincronizzato ${calendar.syncedAt ? timeAgo(calendar.syncedAt) : "—"}). La conferma è immediata.`
                  : "Fasce calcolate sulla disponibilità dichiarata e sulle visite già prenotate. La conferma è immediata."}
              </p>
              {calendar.syncError && calendar.slots.length === 0 ? (
                <p className="small muted">Il calendario dell&apos;inserzionista non è al momento sincronizzato: per non mostrarti orari falsi, le prenotazioni sono sospese. Puoi scrivergli qui sotto.</p>
              ) : (
                <SlotPicker listingId={l.id} slots={calendar.slots.map((s) => s.start.toISOString())} loggedIn={!!user} />
              )}
            </section>
          )}

          <section className="card card-pad stack">
            <div className="spread">
              <div>
                <div style={{ fontWeight: 700 }}>{l.advertiser_role === "agency" ? l.agency_name : publicName(l.advertiser_name)}</div>
                <AdvertiserTypeBadge role={l.advertiser_role} />
              </div>
              <Link href={`/inserzionisti/${l.advertiser_id}`} className="small">
                Profilo →
              </Link>
            </div>
            <ResponseTime stats={stats} />
            <div className="small">
              {stats.reviewsCount > 0 ? (
                <>
                  <Stars value={stats.avgRating!} /> {stats.avgRating} · {stats.reviewsCount} recensioni da visite verificate
                </>
              ) : (
                <span className="muted">Nessuna recensione da visite verificate</span>
              )}
            </div>
            {l.status === "active" && !isOwner && <ContactForm listingId={l.id} />}
            {isOwner && (
              <Link className="btn" href="/dashboard">
                Gestisci dalla dashboard
              </Link>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
