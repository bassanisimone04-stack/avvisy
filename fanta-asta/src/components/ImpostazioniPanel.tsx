"use client";

import { useRef, useState } from "react";
import { NOME_RUOLO, ORDINE_RUOLI } from "@/lib/players";
import { esportaCsv, scaricaFile } from "@/lib/csv";
import { useAsta } from "@/lib/store";
import type { AstaState, Ruolo, SlotConfig } from "@/lib/types";
import { Avviso, Barra, RuoloBadge, Stat, TeamBadge } from "./ui";

const PRESET: {
  nome: string;
  descrizione: string;
  ripartizione: SlotConfig;
}[] = [
  {
    nome: "Classica",
    descrizione: "35/70/145/250 su 500 crediti: la divisione più consigliata dalle guide.",
    ripartizione: { P: 7, D: 14, C: 29, A: 50 },
  },
  {
    nome: "Attacco pesante",
    descrizione: "Due top in avanti e riempimento altrove: alza il tetto, alza il rischio.",
    ripartizione: { P: 5, D: 12, C: 25, A: 58 },
  },
  {
    nome: "Modificatore difesa",
    descrizione: "Portiere top e difesa di una squadra solida: punti dal modificatore, non dai bonus.",
    ripartizione: { P: 12, D: 24, C: 28, A: 36 },
  },
  {
    nome: "Centrocampo dominante",
    descrizione: "I centrocampisti da doppia cifra costano meno degli attaccanti equivalenti.",
    ripartizione: { P: 6, D: 14, C: 40, A: 40 },
  },
];

export default function ImpostazioniPanel() {
  const {
    state,
    pronto,
    listone,
    rose,
    mercato,
    aggiornaLega,
    aggiungiFantallenatore,
    rinominaFantallenatore,
    rimuoviFantallenatore,
    impostaIo,
    caricaStato,
    azzeraAsta,
    azzeraTutto,
    annullaAcquisto,
  } = useAsta();

  const [nuovoNome, setNuovoNome] = useState("");
  const [messaggio, setMessaggio] = useState<string | null>(null);
  const [espansa, setEspansa] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const byId = new Map(listone.map((p) => [p.id, p]));
  const sommaRipartizione = ORDINE_RUOLI.reduce(
    (sum, r) => sum + state.lega.ripartizione[r],
    0
  );
  const totaleSlot = ORDINE_RUOLI.reduce((sum, r) => sum + state.lega.slot[r], 0);

  function esportaBackup() {
    scaricaFile(
      `fantasta-${new Date().toISOString().slice(0, 10)}.json`,
      JSON.stringify(state, null, 2),
      "application/json"
    );
  }

  async function importaBackup(file: File) {
    try {
      const parsed = JSON.parse(await file.text()) as AstaState;
      if (!parsed?.lega || !Array.isArray(parsed.fantallenatori)) {
        setMessaggio("Il file non sembra un backup di FantAsta.");
        return;
      }
      caricaStato(parsed);
      setMessaggio("Backup caricato: asta, lega e squadre ripristinate.");
    } catch {
      setMessaggio("Non riesco a leggere il file: JSON non valido.");
    }
  }

  function esportaRose() {
    const headers = ["Squadra", "Ruolo", "Giocatore", "SerieA", "Prezzo", "Consigliato"];
    const righe = state.acquisti
      .map((a) => {
        const p = byId.get(a.playerId);
        const f = state.fantallenatori.find((x) => x.id === a.fantallenatoreId);
        return [
          f?.nome ?? a.fantallenatoreId,
          p?.r ?? "",
          p?.nome ?? a.playerId,
          p?.team ?? "",
          a.prezzo,
          mercato.get(a.playerId)?.consigliato ?? "",
        ];
      })
      .sort((a, b) => String(a[0]).localeCompare(String(b[0]), "it"));
    scaricaFile("rose-fantasta.csv", esportaCsv(headers, righe), "text/csv");
  }

  if (!pronto) {
    return <div className="panel p-8 text-center text-[color:var(--muted)]">Carico…</div>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-black">Impostazioni lega e rose</h1>

      {messaggio ? <Avviso livello="info">{messaggio}</Avviso> : null}

      <section className="panel p-4">
        <h2 className="text-sm font-black uppercase tracking-wide">Regolamento</h2>
        <p className="mt-1 text-[0.78rem] text-[color:var(--muted)]">
          Ogni valore qui dentro rientra subito nel calcolo dei prezzi consigliati: il modello
          distribuisce i crediti realmente disponibili in lega sui giocatori che verranno comprati.
        </p>

        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label>
            <span className="label">Nome lega</span>
            <input
              className="input mt-1"
              value={state.lega.nome}
              onChange={(e) => aggiornaLega({ nome: e.target.value })}
            />
          </label>
          <label>
            <span className="label">Modalità</span>
            <select
              className="input mt-1"
              value={state.lega.modalita}
              onChange={(e) =>
                aggiornaLega({ modalita: e.target.value as "classic" | "mantra" })
              }
            >
              <option value="classic">Classic</option>
              <option value="mantra">Mantra</option>
            </select>
          </label>
          <label>
            <span className="label">Budget per squadra</span>
            <input
              className="input num mt-1"
              type="number"
              min={50}
              step={10}
              value={state.lega.budget}
              onChange={(e) =>
                aggiornaLega({ budget: Math.max(50, Number(e.target.value) || 500) })
              }
            />
          </label>
          <label>
            <span className="label">Timer chiamata (secondi)</span>
            <input
              className="input num mt-1"
              type="number"
              min={0}
              max={120}
              value={state.lega.timer}
              onChange={(e) =>
                aggiornaLega({ timer: Math.max(0, Number(e.target.value) || 0) })
              }
            />
          </label>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <span className="label">Slot rosa ({totaleSlot} giocatori)</span>
            <div className="mt-1 grid grid-cols-4 gap-2">
              {ORDINE_RUOLI.map((r) => (
                <label key={r} className="panel-soft p-2">
                  <span className="flex items-center gap-1 text-[0.7rem] font-bold">
                    <RuoloBadge ruolo={r} size="sm" /> {NOME_RUOLO[r]}
                  </span>
                  <input
                    className="input num mt-1"
                    type="number"
                    min={1}
                    max={15}
                    value={state.lega.slot[r]}
                    onChange={(e) =>
                      aggiornaLega({
                        slot: {
                          ...state.lega.slot,
                          [r]: Math.max(1, Number(e.target.value) || 1),
                        },
                      })
                    }
                  />
                </label>
              ))}
            </div>
          </div>

          <div>
            <span className="label">
              Ripartizione budget ({sommaRipartizione}%{" "}
              {sommaRipartizione !== 100 ? "— dovrebbe fare 100" : "✓"})
            </span>
            <div className="mt-1 grid grid-cols-4 gap-2">
              {ORDINE_RUOLI.map((r) => (
                <label key={r} className="panel-soft p-2">
                  <span className="flex items-center gap-1 text-[0.7rem] font-bold">
                    <RuoloBadge ruolo={r} size="sm" />
                    <span className="num">
                      {Math.round((state.lega.budget * state.lega.ripartizione[r]) / 100)} cr
                    </span>
                  </span>
                  <input
                    className="input num mt-1"
                    type="number"
                    min={0}
                    max={100}
                    value={state.lega.ripartizione[r]}
                    onChange={(e) =>
                      aggiornaLega({
                        ripartizione: {
                          ...state.lega.ripartizione,
                          [r]: Math.max(0, Number(e.target.value) || 0),
                        },
                      })
                    }
                  />
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {PRESET.map((p) => (
            <button
              key={p.nome}
              className="btn btn-sm"
              title={p.descrizione}
              onClick={() => aggiornaLega({ ripartizione: p.ripartizione })}
            >
              {p.nome}
            </button>
          ))}
          <label className="btn btn-sm">
            <input
              type="checkbox"
              className="mr-1"
              checked={state.lega.modificatoreDifesa}
              onChange={(e) => aggiornaLega({ modificatoreDifesa: e.target.checked })}
            />
            Modificatore di difesa attivo
          </label>
        </div>

        {sommaRipartizione !== 100 ? (
          <div className="mt-3">
            <Avviso livello="attenzione">
              La ripartizione somma {sommaRipartizione}%: i prezzi consigliati restano coerenti tra
              loro ma il totale non corrisponderà al budget reale della lega.
            </Avviso>
          </div>
        ) : null}
      </section>

      <section className="panel p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-black uppercase tracking-wide">
            Partecipanti ({state.fantallenatori.length})
          </h2>
          <div className="flex gap-2">
            <input
              className="input max-w-[12rem]"
              placeholder="Nome squadra"
              value={nuovoNome}
              onChange={(e) => setNuovoNome(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  aggiungiFantallenatore(nuovoNome);
                  setNuovoNome("");
                }
              }}
            />
            <button
              className="btn btn-primary"
              onClick={() => {
                aggiungiFantallenatore(nuovoNome);
                setNuovoNome("");
              }}
            >
              Aggiungi
            </button>
          </div>
        </div>

        <p className="mt-1 text-[0.78rem] text-[color:var(--muted)]">
          Il numero di partecipanti determina quanti giocatori verranno comprati e quindi quanto si
          scaldano i prezzi: cambiarlo ricalcola tutto il listone.
        </p>

        <ul className="mt-3 space-y-2">
          {state.fantallenatori.map((f) => {
            const rosa = rose.get(f.id);
            const aperta = espansa === f.id;
            return (
              <li key={f.id} className="panel-soft p-3" style={f.io ? { borderColor: "#2f6b53" } : undefined}>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    className="input max-w-[14rem] flex-1"
                    value={f.nome}
                    onChange={(e) => rinominaFantallenatore(f.id, e.target.value)}
                  />
                  <button
                    className="btn btn-sm"
                    onClick={() => impostaIo(f.id)}
                    style={
                      f.io
                        ? { background: "rgba(34,197,94,0.16)", borderColor: "#2f6b53", color: "#4ade80" }
                        : undefined
                    }
                    title="Segna come la tua squadra: sblocca i consigli personali"
                  >
                    {f.io ? "▸ Sono io" : "Sono io"}
                  </button>
                  <button
                    className="btn btn-sm"
                    onClick={() => setEspansa(aperta ? null : f.id)}
                  >
                    {aperta ? "Chiudi rosa" : `Rosa (${rosa?.presiTotali ?? 0})`}
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => rimuoviFantallenatore(f.id)}
                    disabled={state.fantallenatori.length <= 2}
                  >
                    Elimina
                  </button>
                </div>

                {rosa ? (
                  <>
                    <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                      <Stat label="Residuo" value={rosa.residuo} tone="buono" />
                      <Stat label="Speso" value={rosa.speso} />
                      <Stat label="Slot vuoti" value={rosa.slotMancanti} />
                      <Stat label="Max offerta" value={rosa.maxOfferta} tone="attenzione" />
                    </div>
                    <div className="mt-2">
                      <Barra valore={rosa.speso} max={state.lega.budget} />
                    </div>

                    {aperta ? (
                      <div className="mt-3 space-y-3">
                        {ORDINE_RUOLI.map((r) => {
                          const rep = rosa.reparti[r];
                          const giocatori = rosa.acquisti
                            .filter((a) => byId.get(a.playerId)?.r === r)
                            .sort((a, b) => b.prezzo - a.prezzo);
                          return (
                            <div key={r}>
                              <div className="flex items-center gap-2 text-[0.75rem] font-bold">
                                <RuoloBadge ruolo={r} size="sm" />
                                {NOME_RUOLO[r]} {rep.presi}/{rep.slot}
                                <span className="num text-[color:var(--muted)]">
                                  {rep.speso} cr su {rep.budgetTeorico} previsti
                                  {rep.residuoTeorico < 0
                                    ? ` (sforato di ${Math.abs(rep.residuoTeorico)})`
                                    : ""}
                                </span>
                              </div>
                              {giocatori.length === 0 ? (
                                <p className="py-1 text-[0.75rem] text-[color:var(--muted)]">
                                  Nessun giocatore.
                                </p>
                              ) : (
                                <ul className="mt-1 divide-y divide-[color:var(--line)]">
                                  {giocatori.map((a) => {
                                    const p = byId.get(a.playerId);
                                    return (
                                      <li
                                        key={a.playerId}
                                        className="flex items-center gap-2 py-1 text-sm"
                                      >
                                        <span className="min-w-0 flex-1 truncate font-semibold">
                                          {p?.nome ?? a.playerId}
                                        </span>
                                        {p ? <TeamBadge team={p.team} /> : null}
                                        <span className="num font-black">{a.prezzo}</span>
                                        <button
                                          className="btn btn-sm btn-danger"
                                          onClick={() => annullaAcquisto(a.playerId)}
                                          aria-label={`Rimuovi ${p?.nome ?? a.playerId}`}
                                        >
                                          ✕
                                        </button>
                                      </li>
                                    );
                                  })}
                                </ul>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : null}
                  </>
                ) : null}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="panel p-4">
        <h2 className="text-sm font-black uppercase tracking-wide">Backup e ripartenza</h2>
        <p className="mt-1 text-[0.78rem] text-[color:var(--muted)]">
          Tutto è salvato solo nel tuo browser. Prima di un&apos;asta importante esporta il backup:
          ti permette di riprendere su un altro dispositivo o dopo aver svuotato la cache.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button className="btn" onClick={esportaBackup}>
            Esporta backup JSON
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void importaBackup(file);
              e.target.value = "";
            }}
          />
          <button className="btn" onClick={() => fileRef.current?.click()}>
            Importa backup JSON
          </button>
          <button className="btn" onClick={esportaRose} disabled={state.acquisti.length === 0}>
            Esporta rose CSV
          </button>
          <button
            className="btn btn-danger"
            onClick={() => {
              if (window.confirm("Cancello tutti gli acquisti? Lega e squadre restano.")) {
                azzeraAsta();
                setMessaggio("Acquisti azzerati: il listone è di nuovo tutto libero.");
              }
            }}
          >
            Azzera solo gli acquisti
          </button>
          <button
            className="btn btn-danger"
            onClick={() => {
              if (
                window.confirm(
                  "Riporto tutto allo stato iniziale: lega, squadre, acquisti, obiettivi e listone importato. Procedo?"
                )
              ) {
                azzeraTutto();
                setMessaggio("Tutto riportato allo stato iniziale.");
              }
            }}
          >
            Azzera tutto
          </button>
        </div>
      </section>
    </div>
  );
}
