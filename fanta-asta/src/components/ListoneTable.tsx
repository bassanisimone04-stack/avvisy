"use client";

import { useMemo, useRef, useState } from "react";
import { LISTONE_AGGIORNATO_AL, NOME_RUOLO, ORDINE_RUOLI } from "@/lib/players";
import { SQUADRE } from "@/lib/teams";
import { esportaCsv, importaListoneCsv, scaricaFile } from "@/lib/csv";
import { useAsta } from "@/lib/store";
import type { PlayerTag, Ruolo, TeamCode } from "@/lib/types";
import CoperturaListone from "./CoperturaListone";
import PlayerSheet from "./PlayerSheet";
import { Avviso, ETICHETTE_TAG, FasciaBadge, RuoloBadge, TagChip, TeamBadge } from "./ui";

type Ordinamento =
  | "consigliato"
  | "indice"
  | "convenienza"
  | "fvm"
  | "fascia"
  | "nome";

type Stato = "tutti" | "liberi" | "presi";

function normalizza(value: string): string {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

const COLORI_GIUDIZIO: Record<string, string> = {
  affare: "#4ade80",
  giusto: "#38bdf8",
  caro: "#fbbf24",
  trappola: "#f87171",
};

const TAG_FILTRABILI: PlayerTag[] = [
  "top",
  "rig1",
  "piazzati",
  "titolare",
  "bug",
  "lowcost",
  "scommessa",
  "neopromossa",
  "rischio",
];

export default function ListoneTable() {
  const {
    state,
    pronto,
    listone,
    mercato,
    assegnati,
    importaListone,
    ripristinaListone,
  } = useAsta();

  const [query, setQuery] = useState("");
  const [ruolo, setRuolo] = useState<Ruolo | "TUTTI">("TUTTI");
  const [squadra, setSquadra] = useState<TeamCode | "TUTTE">("TUTTE");
  const [fascia, setFascia] = useState<number | "TUTTE">("TUTTE");
  const [tagAttivi, setTagAttivi] = useState<PlayerTag[]>([]);
  const [stato, setStato] = useState<Stato>("liberi");
  const [soloObiettivi, setSoloObiettivi] = useState(false);
  const [ordine, setOrdine] = useState<Ordinamento>("consigliato");
  const [schedaId, setSchedaId] = useState<string | null>(null);
  const [esitoImport, setEsitoImport] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const righe = useMemo(() => {
    const q = normalizza(query.trim());
    const filtrati = listone.filter((p) => {
      if (ruolo !== "TUTTI" && p.r !== ruolo) return false;
      if (squadra !== "TUTTE" && p.team !== squadra) return false;
      if (fascia !== "TUTTE" && p.fascia !== fascia) return false;
      if (soloObiettivi && !state.target.includes(p.id)) return false;
      if (stato === "liberi" && assegnati.has(p.id)) return false;
      if (stato === "presi" && !assegnati.has(p.id)) return false;
      if (tagAttivi.length > 0 && !tagAttivi.every((t) => p.tags.includes(t))) {
        return false;
      }
      if (q && !normalizza(p.nome).includes(q) && !normalizza(p.team).includes(q)) {
        return false;
      }
      return true;
    });

    return filtrati.sort((a, b) => {
      const va = mercato.get(a.id);
      const vb = mercato.get(b.id);
      switch (ordine) {
        case "indice":
          return (vb?.indice ?? 0) - (va?.indice ?? 0);
        case "convenienza":
          return (vb?.convenienza ?? 0) - (va?.convenienza ?? 0);
        case "fvm":
          return b.fvm - a.fvm;
        case "fascia":
          return a.fascia - b.fascia || (vb?.consigliato ?? 0) - (va?.consigliato ?? 0);
        case "nome":
          return a.nome.localeCompare(b.nome, "it");
        default:
          return (vb?.consigliato ?? 0) - (va?.consigliato ?? 0);
      }
    });
  }, [
    listone,
    query,
    ruolo,
    squadra,
    fascia,
    tagAttivi,
    stato,
    soloObiettivi,
    assegnati,
    state.target,
    mercato,
    ordine,
  ]);

  const scheda = schedaId ? listone.find((p) => p.id === schedaId) : undefined;

  async function onFile(file: File) {
    const testo = await file.text();
    const esito = importaListoneCsv(testo);
    if (esito.players.length === 0) {
      setEsitoImport(
        `Import fallito. ${esito.errori.join(" ") || "Nessun giocatore riconosciuto."}`
      );
      return;
    }
    importaListone(esito.players);
    setEsitoImport(
      `Importati ${esito.importati} giocatori (${esito.arricchiti} arricchiti con tag e note del dataset interno, ${esito.scartati} righe scartate).`
    );
  }

  function esporta() {
    const headers = [
      "Nome",
      "Squadra",
      "Ruolo",
      "Mantra",
      "Fascia",
      "Qt",
      "FVM",
      "Fantaindice",
      "Consigliato",
      "NonOltre",
      "Convenienza",
      "Giudizio",
      "Stato",
      "Acquirente",
      "PrezzoPagato",
      "Tag",
      "Nota",
    ];
    const dati = righe.map((p) => {
      const v = mercato.get(p.id);
      const a = assegnati.get(p.id);
      return [
        p.nome,
        p.team,
        p.r,
        p.rm.join("/"),
        p.fascia,
        p.qt,
        p.fvm,
        v?.indice,
        v?.consigliato,
        v?.strappo,
        v?.convenienza,
        v?.giudizio,
        a ? "preso" : "libero",
        a
          ? state.fantallenatori.find((f) => f.id === a.fantallenatoreId)?.nome
          : "",
        a?.prezzo,
        p.tags.join(" "),
        p.nota,
      ];
    });
    scaricaFile("listone-fantasta.csv", esportaCsv(headers, dati), "text/csv");
  }

  if (!pronto) {
    return <div className="panel p-8 text-center text-[color:var(--muted)]">Carico il listone…</div>;
  }

  return (
    <div className="space-y-4">
      <CoperturaListone />

      <div className="panel p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="text-lg font-black">Listone e valutazioni</h1>
            <p className="text-[0.78rem] text-[color:var(--muted)]">
              {listone.length} giocatori ·{" "}
              {state.listoneCustom
                ? "listone importato da te"
                : `dataset interno aggiornato al ${LISTONE_AGGIORNATO_AL}`}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <input
              ref={fileRef}
              type="file"
              accept=".csv,text/csv,text/plain"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void onFile(file);
                e.target.value = "";
              }}
            />
            <button className="btn" onClick={() => fileRef.current?.click()}>
              Importa listone CSV
            </button>
            <button className="btn" onClick={esporta}>
              Esporta CSV
            </button>
            {state.listoneCustom ? (
              <button
                className="btn btn-danger"
                onClick={() => {
                  ripristinaListone();
                  setEsitoImport("Ripristinato il dataset interno.");
                }}
              >
                Ripristina dataset interno
              </button>
            ) : null}
          </div>
        </div>

        {esitoImport ? (
          <div className="mt-3">
            <Avviso livello="info">{esitoImport}</Avviso>
          </div>
        ) : null}

        {!state.listoneCustom ? (
          <div className="mt-3">
            <Avviso livello="attenzione">
              Le quotazioni del dataset interno sono <strong>stime</strong> ricostruite dalle guide
              d&apos;asta. Scarica il listone ufficiale da Leghe Fantacalcio, salvalo in CSV e
              importalo qui: servono le colonne <em>Nome</em>, <em>Squadra</em>, <em>R</em>,{" "}
              <em>RM</em>, <em>Qt.A</em>, <em>FVM</em>. Tag, note e statistiche già presenti
              vengono mantenuti.
            </Avviso>
          </div>
        ) : null}
      </div>

      <div className="panel space-y-2 p-3">
        <div className="flex flex-wrap gap-2">
          <input
            className="input max-w-xs"
            placeholder="Cerca giocatore o squadra…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            className="input max-w-[10rem]"
            value={ruolo}
            onChange={(e) => setRuolo(e.target.value as Ruolo | "TUTTI")}
          >
            <option value="TUTTI">Tutti i ruoli</option>
            {ORDINE_RUOLI.map((r) => (
              <option key={r} value={r}>
                {NOME_RUOLO[r]}
              </option>
            ))}
          </select>
          <select
            className="input max-w-[10rem]"
            value={squadra}
            onChange={(e) => setSquadra(e.target.value as TeamCode | "TUTTE")}
          >
            <option value="TUTTE">Tutte le squadre</option>
            {SQUADRE.map((s) => (
              <option key={s.code} value={s.code}>
                {s.nome}
              </option>
            ))}
          </select>
          <select
            className="input max-w-[9rem]"
            value={String(fascia)}
            onChange={(e) =>
              setFascia(e.target.value === "TUTTE" ? "TUTTE" : Number(e.target.value))
            }
          >
            <option value="TUTTE">Tutte le fasce</option>
            {[1, 2, 3, 4, 5].map((f) => (
              <option key={f} value={f}>
                Fascia {f}
              </option>
            ))}
          </select>
          <select
            className="input max-w-[9rem]"
            value={stato}
            onChange={(e) => setStato(e.target.value as Stato)}
          >
            <option value="liberi">Solo liberi</option>
            <option value="presi">Solo presi</option>
            <option value="tutti">Tutti</option>
          </select>
          <select
            className="input max-w-[12rem]"
            value={ordine}
            onChange={(e) => setOrdine(e.target.value as Ordinamento)}
          >
            <option value="consigliato">Ordina per prezzo consigliato</option>
            <option value="indice">Ordina per fantaindice</option>
            <option value="convenienza">Ordina per convenienza</option>
            <option value="fvm">Ordina per fantavalore</option>
            <option value="fascia">Ordina per fascia</option>
            <option value="nome">Ordina per nome</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-1">
          <button
            className="btn btn-sm"
            onClick={() => setSoloObiettivi((v) => !v)}
            style={
              soloObiettivi
                ? { background: "rgba(250,204,21,0.14)", borderColor: "#8a6d1f", color: "#facc15" }
                : undefined
            }
          >
            ★ Solo obiettivi
          </button>
          {TAG_FILTRABILI.map((t) => {
            const attivo = tagAttivi.includes(t);
            const meta = ETICHETTE_TAG[t];
            return (
              <button
                key={t}
                className="btn btn-sm"
                title={meta.aiuto}
                onClick={() =>
                  setTagAttivi((prev) =>
                    prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
                  )
                }
                style={
                  attivo
                    ? {
                        background: `${meta.colore}22`,
                        borderColor: `${meta.colore}77`,
                        color: meta.colore,
                      }
                    : undefined
                }
              >
                {meta.testo}
              </button>
            );
          })}
          {tagAttivi.length > 0 ? (
            <button className="btn btn-sm btn-danger" onClick={() => setTagAttivi([])}>
              Pulisci
            </button>
          ) : null}
        </div>

        <p className="text-[0.75rem] text-[color:var(--muted)]">
          {righe.length} risultati. Il <strong>fantaindice</strong> dice quanto vale un giocatore
          (0-100), il <strong>consigliato</strong> quanto dovrebbe costare nella tua lega, la{" "}
          <strong>convenienza</strong> mette in rapporto i due: 100 è la media del ruolo, sopra 125
          è un affare.
        </p>
      </div>

      <div className="panel overflow-x-auto">
        <table className="w-full min-w-[62rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-[color:var(--line)] text-left">
              <th className="px-3 py-2 text-[0.7rem] uppercase tracking-wide text-[color:var(--muted)]">
                Giocatore
              </th>
              <th className="px-2 py-2 text-[0.7rem] uppercase tracking-wide text-[color:var(--muted)]">
                Squadra
              </th>
              <th className="px-2 py-2 text-right text-[0.7rem] uppercase tracking-wide text-[color:var(--muted)]">
                FVM
              </th>
              <th className="px-2 py-2 text-right text-[0.7rem] uppercase tracking-wide text-[color:var(--muted)]">
                Indice
              </th>
              <th className="px-2 py-2 text-right text-[0.7rem] uppercase tracking-wide text-[color:var(--muted)]">
                Consigliato
              </th>
              <th className="px-2 py-2 text-right text-[0.7rem] uppercase tracking-wide text-[color:var(--muted)]">
                Non oltre
              </th>
              <th className="px-2 py-2 text-right text-[0.7rem] uppercase tracking-wide text-[color:var(--muted)]">
                Conv.
              </th>
              <th className="px-3 py-2 text-[0.7rem] uppercase tracking-wide text-[color:var(--muted)]">
                Note e tag
              </th>
            </tr>
          </thead>
          <tbody>
            {righe.slice(0, 400).map((p) => {
              const v = mercato.get(p.id);
              const a = assegnati.get(p.id);
              const inTarget = state.target.includes(p.id);
              return (
                <tr
                  key={p.id}
                  className="cursor-pointer border-b border-[color:var(--line)] align-top transition-colors hover:bg-[#132522]"
                  onClick={() => setSchedaId(p.id)}
                  style={a ? { opacity: 0.55 } : undefined}
                >
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <RuoloBadge ruolo={p.r} size="sm" />
                      <div className="min-w-0">
                        <div className="truncate font-bold">
                          {inTarget ? "★ " : ""}
                          {p.nome}
                        </div>
                        <div className="text-[0.68rem] text-[color:var(--muted)]">
                          {p.rm.join("/") || "—"}
                          {p.fm !== undefined ? ` · FM ${p.fm}` : ""}
                          {p.gol !== undefined ? ` · ${p.gol}G` : ""}
                          {p.assist !== undefined ? ` ${p.assist}A` : ""}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-2">
                    <div className="flex flex-col items-start gap-1">
                      <TeamBadge team={p.team} />
                      <FasciaBadge fascia={p.fascia} />
                    </div>
                  </td>
                  <td className="num px-2 py-2 text-right text-[color:var(--muted)]">{p.fvm}</td>
                  <td className="num px-2 py-2 text-right font-bold">{v?.indice ?? "—"}</td>
                  <td className="num px-2 py-2 text-right text-base font-black text-[color:var(--accent)]">
                    {state.prezziCustom[p.id] ?? v?.consigliato ?? "—"}
                  </td>
                  <td className="num px-2 py-2 text-right text-[#fbbf24]">{v?.strappo ?? "—"}</td>
                  <td className="num px-2 py-2 text-right">
                    <span
                      className="font-bold"
                      style={{ color: v ? COLORI_GIUDIZIO[v.giudizio] : undefined }}
                    >
                      {v?.convenienza ?? "—"}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    {a ? (
                      <div className="mb-1 text-[0.72rem] font-bold text-[#fbbf24]">
                        Preso da{" "}
                        {state.fantallenatori.find((f) => f.id === a.fantallenatoreId)?.nome ??
                          "—"}{" "}
                        per {a.prezzo}
                      </div>
                    ) : null}
                    <div className="flex flex-wrap gap-1">
                      {p.tags.slice(0, 4).map((t) => (
                        <TagChip key={t} tag={t} />
                      ))}
                    </div>
                    {p.nota ? (
                      <p className="mt-1 max-w-md text-[0.72rem] leading-snug text-[color:var(--muted)]">
                        {p.nota}
                      </p>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {righe.length === 0 ? (
          <p className="py-8 text-center text-sm text-[color:var(--muted)]">
            Nessun giocatore con questi filtri.
          </p>
        ) : null}
        {righe.length > 400 ? (
          <p className="py-3 text-center text-[0.75rem] text-[color:var(--muted)]">
            Mostrati i primi 400 di {righe.length}: restringi i filtri per vedere gli altri.
          </p>
        ) : null}
      </div>

      {scheda ? <PlayerSheet player={scheda} onClose={() => setSchedaId(null)} /> : null}
    </div>
  );
}
