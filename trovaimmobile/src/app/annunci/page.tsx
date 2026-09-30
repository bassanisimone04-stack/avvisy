import type { Metadata } from "next";
import Link from "next/link";
import { REGIONI, TIPOLOGIE } from "@/lib/italy";
import { locationFacets, PAGE_SIZE, searchListings, type SearchFilters } from "@/lib/listings";
import { advertiserStats } from "@/lib/trust";
import { ListingCard } from "@/components/ListingCard";
import { AutoSubmitSelect, FiltersDetails } from "@/components/AutoSubmit";
import { FraudWarning } from "@/components/trust";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Cerca casa in affitto" };

type SP = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() || undefined;
const num = (v: string | undefined) => (v && /^\d+$/.test(v) ? Number(v) : undefined);

export default async function SearchPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const regione = one(sp.regione);
  const filters: SearchFilters = {
    regione: regione && (REGIONI as readonly string[]).includes(regione) ? regione : undefined,
    comune: one(sp.comune),
    quartiere: one(sp.quartiere),
    tipologia: one(sp.tipologia),
    maxCanone: num(one(sp.max_canone)),
    maxIngresso: num(one(sp.max_ingresso)),
    inserzionista: one(sp.inserzionista) === "agency" ? "agency" : one(sp.inserzionista) === "private" ? "private" : undefined,
    soloConfermati: one(sp.solo_confermati) === "1",
    sort: (["rilevanza", "ingresso", "canone", "recenti"] as const).find((s) => s === one(sp.ordina)) ?? "rilevanza",
    page: num(one(sp.pagina)) ?? 1,
  };
  const { rows, total } = searchListings(filters);
  const stats = advertiserStats(rows.map((r) => r.advertiser_id));
  const facets = locationFacets(filters.regione, filters.comune);
  const pages = Math.ceil(total / PAGE_SIZE);
  const pageHref = (p: number) => {
    const q = new URLSearchParams();
    for (const [k, v] of Object.entries(sp)) if (typeof v === "string" && v && k !== "pagina") q.set(k, v);
    q.set("pagina", String(p));
    return `/annunci?${q}`;
  };
  const activeCount = [filters.regione, filters.comune, filters.quartiere, filters.tipologia, filters.maxCanone, filters.maxIngresso, filters.inserzionista, filters.soloConfermati || undefined].filter(Boolean).length;
  const where = [filters.quartiere, filters.comune, filters.regione].filter(Boolean).join(", ") || "tutta Italia";

  return (
    <div className="container section">
      <div className="search-layout">
        <aside className="filters card card-pad">
          <FiltersDetails summary={`Filtri${activeCount ? ` (${activeCount} attivi)` : ""} ▾`}>
            <form action="/annunci" className="stack" style={{ marginTop: 12 }}>
              <div className="field">
                <label htmlFor="f-regione">Regione</label>
                <AutoSubmitSelect id="f-regione" name="regione" defaultValue={filters.regione ?? ""}>
                  <option value="">Tutta Italia</option>
                  {REGIONI.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </AutoSubmitSelect>
              </div>
              <div className="field">
                <label htmlFor="f-comune">Città</label>
                <input id="f-comune" name="comune" className="input" list="comuni" defaultValue={filters.comune ?? ""} placeholder="Qualsiasi comune" />
                <datalist id="comuni">
                  {facets.comuni.map((c) => (
                    <option key={c.comune} value={c.comune}>
                      {c.n} annunci
                    </option>
                  ))}
                </datalist>
              </div>
              {facets.quartieri.length > 0 && (
                <div className="field">
                  <label htmlFor="f-q">Quartiere</label>
                  <AutoSubmitSelect id="f-q" name="quartiere" defaultValue={filters.quartiere ?? ""}>
                    <option value="">Tutti</option>
                    {facets.quartieri.map((q) => (
                      <option key={q.quartiere} value={q.quartiere}>
                        {q.quartiere} ({q.n})
                      </option>
                    ))}
                  </AutoSubmitSelect>
                </div>
              )}
              <div className="field">
                <label htmlFor="f-tip">Tipologia</label>
                <select id="f-tip" name="tipologia" defaultValue={filters.tipologia ?? ""}>
                  <option value="">Qualsiasi</option>
                  {TIPOLOGIE.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="f-mc">Canone massimo (€/mese)</label>
                <input id="f-mc" name="max_canone" className="input" inputMode="numeric" defaultValue={filters.maxCanone ?? ""} />
              </div>
              <div className="field">
                <label htmlFor="f-mi">Costo d&apos;ingresso massimo (€)</label>
                <input id="f-mi" name="max_ingresso" className="input" inputMode="numeric" defaultValue={filters.maxIngresso ?? ""} />
                <span className="hint">Canone + spese + cauzione + commissione</span>
              </div>
              <div className="field">
                <label htmlFor="f-ins">Inserzionista</label>
                <select id="f-ins" name="inserzionista" defaultValue={filters.inserzionista ?? ""}>
                  <option value="">Privati e agenzie</option>
                  <option value="private">Solo privati</option>
                  <option value="agency">Solo agenzie</option>
                </select>
              </div>
              <label className="check">
                <input type="checkbox" name="solo_confermati" value="1" defaultChecked={filters.soloConfermati} /> Solo confermati negli ultimi 7 giorni
              </label>
              <div className="field">
                <label htmlFor="f-ord">Ordina per</label>
                <select id="f-ord" name="ordina" defaultValue={filters.sort}>
                  <option value="rilevanza">Disponibilità più recente</option>
                  <option value="ingresso">Costo d&apos;ingresso più basso</option>
                  <option value="canone">Canone più basso</option>
                  <option value="recenti">Pubblicati di recente</option>
                </select>
              </div>
              <button className="btn btn-primary" type="submit">
                Applica filtri
              </button>
              <Link href="/annunci" className="small">
                Azzera filtri
              </Link>
            </form>
          </FiltersDetails>
        </aside>

        <section className="stack">
          <div>
            <h1 style={{ fontSize: "1.4rem" }}>Case in affitto: {where}</h1>
            <p className="muted small" style={{ margin: 0 }}>
              {total} {total === 1 ? "annuncio" : "annunci"}. Gli annunci non riconfermati dall&apos;inserzionista negli ultimi 7 giorni compaiono più in basso.
            </p>
          </div>
          <FraudWarning compact />
          {rows.length === 0 ? (
            <div className="card card-pad">
              <p style={{ margin: 0 }}>Nessun annuncio corrisponde ai filtri. Prova ad allargare la zona o il budget.</p>
            </div>
          ) : (
            <div className="grid grid-2">
              {rows.map((l) => (
                <ListingCard key={l.id} l={l} stats={stats.get(l.advertiser_id)} />
              ))}
            </div>
          )}
          {pages > 1 && (
            <nav className="pagination" aria-label="Pagine">
              {filters.page! > 1 && (
                <Link className="btn btn-sm" href={pageHref(filters.page! - 1)}>
                  ← Precedente
                </Link>
              )}
              <span className="small muted" style={{ alignSelf: "center" }}>
                Pagina {filters.page} di {pages}
              </span>
              {filters.page! < pages && (
                <Link className="btn btn-sm" href={pageHref(filters.page! + 1)}>
                  Successiva →
                </Link>
              )}
            </nav>
          )}
        </section>
      </div>
    </div>
  );
}
