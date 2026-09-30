import Link from "next/link";
import { REGIONI, TIPOLOGIE } from "@/lib/italy";
import { searchListings } from "@/lib/listings";
import { advertiserStats } from "@/lib/trust";
import { ListingCard } from "@/components/ListingCard";
import { IconCalendar, IconCheck, IconEuro, IconHistory, IconShield } from "@/components/icons";

export const dynamic = "force-dynamic";

const PILLARS = [
  { icon: <IconHistory />, title: "Una scheda per ogni casa", text: "Ogni immobile ha un'identità unica legata all'indirizzo: niente doppioni, storico prezzi e annunci passati sempre visibili." },
  { icon: <IconCheck />, title: "Disponibilità confermata", text: "Gli inserzionisti riconfermano ogni settimana con un click. Chi non lo fa scende nei risultati." },
  { icon: <IconCalendar />, title: "Visite su calendario vero", text: "Vedi solo le fasce davvero libere, sincronizzate con Google Calendar o iCal. Prenoti e ricevi conferma subito." },
  { icon: <IconEuro />, title: "Costo d'ingresso chiaro", text: "Canone, spese, cauzione e commissione sommati prima di contattare nessuno. Mai in testo libero." },
  { icon: <IconShield />, title: "Fiducia misurata", text: "Tempi di risposta reali, recensioni solo dopo visite effettive, privati e agenzie sempre distinti." },
];

export default function Home() {
  const { rows } = searchListings({ soloConfermati: true, sort: "rilevanza" });
  const stats = advertiserStats(rows.map((r) => r.advertiser_id));
  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>Affitti in tutta Italia, verificati prima del contatto.</h1>
          <p className="muted" style={{ maxWidth: 640 }}>
            Disponibilità confermata di recente, costo totale d&apos;ingresso in chiaro, visite prenotabili su un calendario reale. E un avviso sempre visibile: non si paga nulla prima di aver visto la casa.
          </p>
          <form action="/annunci" className="hero-search card card-pad">
            <div className="field">
              <label htmlFor="h-regione">Regione</label>
              <select id="h-regione" name="regione" defaultValue="">
                <option value="">Tutta Italia</option>
                {REGIONI.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="h-comune">Città</label>
              <input id="h-comune" name="comune" className="input" placeholder="Es. Bologna" autoComplete="address-level2" />
            </div>
            <div className="field">
              <label htmlFor="h-tip">Tipologia</label>
              <select id="h-tip" name="tipologia" defaultValue="">
                <option value="">Qualsiasi</option>
                {TIPOLOGIE.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <button className="btn btn-primary" type="submit">
              Cerca
            </button>
          </form>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="pillars">
            {PILLARS.map((p) => (
              <div key={p.title} className="card pillar">
                <div className="ico">{p.icon}</div>
                <h3>{p.title}</h3>
                <p className="small muted" style={{ margin: 0 }}>
                  {p.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="spread" style={{ marginBottom: 12 }}>
            <h2 style={{ margin: 0 }}>Confermati questa settimana</h2>
            <Link href="/annunci?solo_confermati=1">Vedi tutti →</Link>
          </div>
          {rows.length === 0 ? (
            <p className="muted">Nessun annuncio confermato negli ultimi 7 giorni.</p>
          ) : (
            <div className="grid grid-2 grid-3">
              {rows.slice(0, 6).map((l) => (
                <ListingCard key={l.id} l={l} stats={stats.get(l.advertiser_id)} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
