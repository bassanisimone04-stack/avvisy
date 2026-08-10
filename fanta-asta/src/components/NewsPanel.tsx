"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ETICHETTE_CATEGORIA, FONTI } from "@/lib/news-sources";
import { Avviso } from "./ui";
import type { Articolo, StatoFonte } from "@/app/api/news/route";

interface Risposta {
  articoli: Articolo[];
  fonti: StatoFonte[];
  generatoIl: string;
}

const PAROLE_CHIAVE = [
  "listone",
  "quotazioni",
  "rigoristi",
  "asta",
  "infortunio",
  "probabili formazioni",
  "mercato",
];

function quando(iso: string | null): string {
  if (!iso) return "";
  const data = new Date(iso);
  const minuti = Math.round((Date.now() - data.getTime()) / 60000);
  if (minuti < 1) return "adesso";
  if (minuti < 60) return `${minuti} min fa`;
  const ore = Math.round(minuti / 60);
  if (ore < 24) return `${ore} h fa`;
  const giorni = Math.round(ore / 24);
  if (giorni <= 7) return `${giorni} g fa`;
  return data.toLocaleDateString("it-IT", { day: "numeric", month: "short" });
}

export default function NewsPanel() {
  const [dati, setDati] = useState<Risposta | null>(null);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState<string | null>(null);
  const [filtro, setFiltro] = useState("");
  const [fonteAttiva, setFonteAttiva] = useState<string>("TUTTE");

  const carica = useCallback(async () => {
    setCaricamento(true);
    setErrore(null);
    try {
      const risposta = await fetch("/api/news", { cache: "no-store" });
      if (!risposta.ok) throw new Error(`HTTP ${risposta.status}`);
      setDati((await risposta.json()) as Risposta);
    } catch (e) {
      setErrore(e instanceof Error ? e.message : "errore sconosciuto");
    } finally {
      setCaricamento(false);
    }
  }, []);

  useEffect(() => {
    void carica();
  }, [carica]);

  const articoli = useMemo(() => {
    if (!dati) return [];
    const q = filtro.trim().toLowerCase();
    return dati.articoli.filter((a) => {
      if (fonteAttiva !== "TUTTE" && a.fonteId !== fonteAttiva) return false;
      if (!q) return true;
      return (
        a.titolo.toLowerCase().includes(q) || a.estratto.toLowerCase().includes(q)
      );
    });
  }, [dati, filtro, fonteAttiva]);

  const fontiOk = dati?.fonti.filter((f) => f.ok) ?? [];
  const fontiKo = dati?.fonti.filter((f) => !f.ok) ?? [];

  return (
    <div className="space-y-4">
      <div className="panel p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-lg font-black">Rassegna stampa</h1>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[color:var(--muted)]">
              Le notizie delle principali testate di fantacalcio, sport e mercato in un unico
              flusso, ordinate dalla più recente. I feed vengono letti dal server e aggiornati ogni
              10 minuti: nei giorni che precedono l&apos;asta è qui che compaiono cambi di ruolo,
              infortuni e trasferimenti che spostano i prezzi.
            </p>
          </div>
          <button className="btn" onClick={() => void carica()} disabled={caricamento}>
            {caricamento ? "Aggiorno…" : "Aggiorna"}
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <input
            className="input max-w-xs"
            placeholder="Filtra le notizie…"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
          {PAROLE_CHIAVE.map((k) => (
            <button
              key={k}
              className="btn btn-sm"
              onClick={() => setFiltro(filtro === k ? "" : k)}
              style={
                filtro === k
                  ? { background: "rgba(34,197,94,0.16)", borderColor: "#2f6b53", color: "#4ade80" }
                  : undefined
              }
            >
              {k}
            </button>
          ))}
        </div>

        {dati && dati.fonti.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-1">
            <button
              className="btn btn-sm"
              onClick={() => setFonteAttiva("TUTTE")}
              style={
                fonteAttiva === "TUTTE"
                  ? { background: "rgba(34,197,94,0.16)", borderColor: "#2f6b53", color: "#4ade80" }
                  : undefined
              }
            >
              Tutte ({dati.articoli.length})
            </button>
            {fontiOk.map((f) => (
              <button
                key={f.id}
                className="btn btn-sm"
                onClick={() => setFonteAttiva(fonteAttiva === f.id ? "TUTTE" : f.id)}
                style={
                  fonteAttiva === f.id
                    ? { background: "rgba(34,197,94,0.16)", borderColor: "#2f6b53", color: "#4ade80" }
                    : undefined
                }
              >
                {f.nome} ({f.articoli})
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {errore ? (
        <Avviso livello="allarme">
          Non riesco a contattare l&apos;aggregatore ({errore}). Le fonti restano raggiungibili dai
          link qui sotto.
        </Avviso>
      ) : null}

      {!errore && !caricamento && articoli.length === 0 ? (
        <Avviso livello="attenzione">
          Nessuna notizia disponibile al momento. Può succedere se la rete in uscita è filtrata o se
          i feed sono temporaneamente irraggiungibili: usa l&apos;elenco delle testate in fondo alla
          pagina.
        </Avviso>
      ) : null}

      {caricamento ? (
        <div className="panel p-8 text-center text-[color:var(--muted)]">Carico le notizie…</div>
      ) : null}

      {articoli.length > 0 ? (
        <ul className="grid gap-2 lg:grid-cols-2">
          {articoli.map((a, i) => (
            <li key={`${a.link}-${i}`} className="panel p-3 transition-colors hover:bg-[#132522]">
              <a href={a.link} target="_blank" rel="noopener noreferrer" className="block">
                <div className="flex items-center justify-between gap-2 text-[0.7rem]">
                  <span className="font-bold text-[color:var(--accent)]">{a.fonteNome}</span>
                  <span className="text-[color:var(--muted)]">{quando(a.data)}</span>
                </div>
                <h2 className="mt-1 text-sm font-bold leading-snug">{a.titolo}</h2>
                {a.estratto ? (
                  <p className="mt-1 text-[0.78rem] leading-snug text-[color:var(--muted)]">
                    {a.estratto}
                  </p>
                ) : null}
              </a>
            </li>
          ))}
        </ul>
      ) : null}

      <section className="panel p-4">
        <h2 className="text-sm font-black uppercase tracking-wide">Le testate da seguire</h2>
        <p className="mt-1 text-[0.78rem] text-[color:var(--muted)]">
          Dove guardare quando serve una verifica di prima mano: quotazioni ufficiali, gerarchie dal
          dischetto, formazioni tipo e mercato.
        </p>
        <ul className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {FONTI.map((f) => {
            const stato = dati?.fonti.find((s) => s.id === f.id);
            return (
              <li key={f.id} className="panel-soft p-3">
                <div className="flex items-center justify-between gap-2">
                  <a
                    href={f.sito}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-bold hover:text-[color:var(--accent)]"
                  >
                    {f.nome} ↗
                  </a>
                  <span
                    className="chip"
                    style={
                      stato?.ok
                        ? { borderColor: "#2f6b53", color: "#4ade80" }
                        : { borderColor: "#5a4a20", color: "#fbbf24" }
                    }
                    title={stato?.errore ?? undefined}
                  >
                    {stato?.ok ? `feed ok` : "feed non raggiungibile"}
                  </span>
                </div>
                <div className="mt-1 text-[0.68rem] uppercase tracking-wide text-[color:var(--muted)]">
                  {ETICHETTE_CATEGORIA[f.categoria]}
                </div>
                <p className="mt-1 text-[0.78rem] leading-snug text-[#a9c4bb]">{f.descrizione}</p>
              </li>
            );
          })}
        </ul>
        {fontiKo.length > 0 ? (
          <p className="mt-3 text-[0.72rem] text-[color:var(--muted)]">
            {fontiKo.length} fonti non hanno risposto a questo giro. È normale: alcuni siti limitano
            le richieste automatiche. I link qui sopra restano validi.
          </p>
        ) : null}
      </section>
    </div>
  );
}
