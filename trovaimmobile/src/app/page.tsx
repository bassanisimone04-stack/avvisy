import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { TIPOLOGIE } from "@/lib/italy";
import { searchListings } from "@/lib/listings";
import { advertiserStats } from "@/lib/trust";
import { ListingCard } from "@/components/ListingCard";
import { RoomIllustration } from "@/components/RoomIllustration";

export const dynamic = "force-dynamic";

const METHOD = [
  { title: "Una scheda per ogni casa", text: "Ogni immobile ha un'identità legata al suo indirizzo: niente doppioni, e lo storico di prezzi e annunci resta visibile." },
  { title: "Disponibilità confermata", text: "Gli inserzionisti riconfermano ogni settimana con un click. Chi non lo fa scende nei risultati." },
  { title: "Visite su calendario vero", text: "Solo orari davvero liberi, sincronizzati con Google Calendar o iCal. Prenoti e hai subito la conferma." },
  { title: "Costo d'ingresso chiaro", text: "Canone, spese, cauzione e commissione sommati prima di contattare nessuno. Mai in testo libero." },
  { title: "Fiducia misurata", text: "Tempi di risposta reali, recensioni solo dopo visite svolte, privati e agenzie sempre distinti." },
];

// Una foto vera in public/hero.jpg sostituisce automaticamente l'illustrazione.
const HERO_PHOTO = fs.existsSync(path.join(process.cwd(), "public", "hero.jpg"));

export default function Home() {
  const { total } = searchListings({});
  const { rows } = searchListings({ soloConfermati: true, sort: "rilevanza" });
  const stats = advertiserStats(rows.map((r) => r.advertiser_id));
  return (
    <>
      <section className="hero">
        <div className="hero-media">
          {HERO_PHOTO ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src="/hero.jpg" alt="" />
          ) : (
            <RoomIllustration variant={0} />
          )}
        </div>
        <div className="container">
          <div className="eyebrow">Affitti verificati in tutta Italia</div>
          <h1>
            Case vere,
            <em>prezzi chiari.</em>
          </h1>
          <p className="lead">Disponibilità confermata ogni settimana, costo d&apos;ingresso in chiaro, visite su un calendario reale. E nulla da pagare prima di aver visto casa.</p>

          <form action="/annunci">
            <div className="phrase-search">
              <span className="word">Cerco</span>
              <label className="sr-only" htmlFor="h-tip">
                Tipologia
              </label>
              <select id="h-tip" name="tipologia" defaultValue="">
                <option value="">casa</option>
                {TIPOLOGIE.map((t) => (
                  <option key={t} value={t}>
                    {t.toLowerCase()}
                  </option>
                ))}
              </select>
              <span className="word">in affitto a</span>
              <label className="sr-only" htmlFor="h-comune">
                Città
              </label>
              <input id="h-comune" name="comune" placeholder="Roma" autoComplete="address-level2" />
            </div>
            <div className="hero-actions">
              <button className="btn btn-primary" type="submit">
                Vedi {total} annunci <span aria-hidden>→</span>
              </button>
              <Link href="/pubblica" className="btn btn-light">
                Pubblica un annuncio
              </Link>
            </div>
          </form>
        </div>
        <span className="scroll-hint">Scorri</span>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Il nostro metodo</div>
              <h2>
                Cinque promesse, <em>verificate.</em>
              </h2>
            </div>
            <Link href="/come-funziona" className="btn btn-sm">
              Come funziona
            </Link>
          </div>
          <div className="method">
            {METHOD.map((m, i) => (
              <div key={m.title} className="method-item">
                <div className="num">{String(i + 1).padStart(2, "0")}</div>
                <div>
                  <h3>{m.title}</h3>
                  <p>{m.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 8 }}>
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Disponibili adesso</div>
              <h2>
                Confermati <em>questa settimana</em>
              </h2>
            </div>
            <Link href="/annunci?solo_confermati=1" className="btn btn-sm">
              Vedi tutti
            </Link>
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

      <section className="band">
        <div className="container">
          <div>
            <h2>
              Hai una casa da <em>affittare?</em>
            </h2>
            <p>Pubblica gratis. Gli inquilini vedono costi chiari e prenotano visite solo quando sei libero.</p>
          </div>
          <Link href="/pubblica" className="btn btn-light">
            Pubblica annuncio gratis
          </Link>
        </div>
      </section>
    </>
  );
}
