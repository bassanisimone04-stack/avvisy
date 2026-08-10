"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { NOME_RUOLO, ORDINE_RUOLI } from "@/lib/players";
import { useAsta } from "@/lib/store";
import { semaforoOfferta, suggerimenti } from "@/lib/valuation";
import type { Player, Ruolo } from "@/lib/types";
import CoperturaListone from "./CoperturaListone";
import PlayerSheet from "./PlayerSheet";
import { Avviso, Barra, FasciaBadge, RuoloBadge, Stat, TagChip, TeamBadge } from "./ui";

function normalizza(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const COLORI_SEMAFORO: Record<string, { bordo: string; testo: string; etichetta: string }> = {
  ok: { bordo: "#22c55e", testo: "#4ade80", etichetta: "Sei dentro il prezzo consigliato" },
  attenzione: {
    bordo: "#eab308",
    testo: "#fbbf24",
    etichetta: "Sopra il consigliato: valuta se ti serve davvero",
  },
  strappo: {
    bordo: "#f97316",
    testo: "#fb923c",
    etichetta: "Strappo: stai pagando oltre il valore reale",
  },
  impossibile: {
    bordo: "#ef4444",
    testo: "#f87171",
    etichetta: "Oltre la tua offerta massima: non puoi permettertelo",
  },
};

export default function AstaBoard() {
  const {
    state,
    pronto,
    listone,
    mercato,
    assegnati,
    rose,
    liberiPerRuolo,
    io,
    assegna,
    annullaUltimo,
    toggleTarget,
  } = useAsta();

  const [query, setQuery] = useState("");
  const [ruoloFiltro, setRuoloFiltro] = useState<Ruolo | "TUTTI">("TUTTI");
  const [soloObiettivi, setSoloObiettivi] = useState(false);
  const [lottoId, setLottoId] = useState<string | null>(null);
  const [offerta, setOfferta] = useState(1);
  const [acquirente, setAcquirente] = useState<string>("");
  const [schedaId, setSchedaId] = useState<string | null>(null);
  const [secondi, setSecondi] = useState(0);
  const [timerAttivo, setTimerAttivo] = useState(false);
  const ricercaRef = useRef<HTMLInputElement>(null);

  const byId = useMemo(() => new Map(listone.map((p) => [p.id, p])), [listone]);
  const lotto = lottoId ? byId.get(lottoId) : undefined;
  const valutazioneLotto = lotto ? mercato.get(lotto.id) : undefined;
  const rosaIo = io ? rose.get(io.id) : undefined;

  useEffect(() => {
    if (!acquirente && state.fantallenatori.length > 0) {
      setAcquirente(io?.id ?? state.fantallenatori[0].id);
    }
  }, [acquirente, io, state.fantallenatori]);

  // Scorciatoia: "/" porta sempre alla ricerca, come nei gestionali da tastiera.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const inCampo =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "SELECT" ||
          target.tagName === "TEXTAREA");
      if (e.key === "/" && !inCampo) {
        e.preventDefault();
        ricercaRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!timerAttivo) return;
    const id = window.setInterval(() => {
      setSecondi((s) => {
        if (s <= 1) {
          window.clearInterval(id);
          setTimerAttivo(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [timerAttivo]);

  const liberi = useMemo(() => {
    const q = normalizza(query.trim());
    return listone
      .filter((p) => !assegnati.has(p.id))
      .filter((p) => (ruoloFiltro === "TUTTI" ? true : p.r === ruoloFiltro))
      .filter((p) => (soloObiettivi ? state.target.includes(p.id) : true))
      .filter((p) => {
        if (!q) return true;
        return (
          normalizza(p.nome).includes(q) || normalizza(p.team).includes(q)
        );
      })
      .sort((a, b) => {
        const va = mercato.get(a.id)?.consigliato ?? 0;
        const vb = mercato.get(b.id)?.consigliato ?? 0;
        return vb - va;
      });
  }, [listone, assegnati, ruoloFiltro, soloObiettivi, state.target, query, mercato]);

  const apriLotto = useCallback(
    (player: Player) => {
      setLottoId(player.id);
      const consigliato =
        state.prezziCustom[player.id] ?? mercato.get(player.id)?.consigliato ?? 1;
      setOfferta(Math.max(1, Math.round(consigliato * 0.6)));
      if (state.lega.timer > 0) {
        setSecondi(state.lega.timer);
        setTimerAttivo(true);
      }
    },
    [mercato, state.lega.timer, state.prezziCustom]
  );

  const aggiudica = useCallback(() => {
    if (!lotto || !acquirente) return;
    assegna(lotto.id, acquirente, offerta);
    setLottoId(null);
    setQuery("");
    setTimerAttivo(false);
    setSecondi(0);
    ricercaRef.current?.focus();
  }, [acquirente, assegna, lotto, offerta]);

  const semaforo = semaforoOfferta(
    offerta,
    valutazioneLotto,
    acquirente ? rose.get(acquirente) : undefined
  );
  const stileSemaforo = COLORI_SEMAFORO[semaforo];

  const totaleSpeso = state.acquisti.reduce((sum, a) => sum + a.prezzo, 0);
  const totaleSlot =
    state.fantallenatori.length *
    ORDINE_RUOLI.reduce((sum, r) => sum + state.lega.slot[r], 0);

  const consigli = rosaIo
    ? suggerimenti(rosaIo, state.lega, liberiPerRuolo)
    : [];

  const cronologia = useMemo(
    () => [...state.acquisti].sort((a, b) => b.ts - a.ts).slice(0, 14),
    [state.acquisti]
  );

  if (!pronto) {
    return (
      <div className="panel p-8 text-center text-[color:var(--muted)]">
        Carico l&apos;asta salvata…
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <CoperturaListone />

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-6">
        <Stat
          label="Giocatori assegnati"
          value={`${state.acquisti.length}/${totaleSlot}`}
          hint={`${liberi.length} liberi con i filtri attuali`}
        />
        <Stat label="Crediti spesi in lega" value={totaleSpeso} hint="somma di tutte le squadre" />
        <Stat
          label="I miei crediti"
          value={rosaIo ? rosaIo.residuo : "—"}
          hint={rosaIo ? `${rosaIo.slotMancanti} slot da riempire` : "imposta la tua squadra"}
          tone={rosaIo && rosaIo.residuo < 20 ? "attenzione" : "buono"}
        />
        <Stat
          label="Mia offerta max"
          value={rosaIo ? rosaIo.maxOfferta : "—"}
          hint="tenendo 1 credito per slot"
          tone="buono"
        />
        <Stat
          label="Media per slot"
          value={rosaIo ? rosaIo.mediaPerSlot.toFixed(1) : "—"}
          hint="crediti disponibili per slot vuoto"
        />
        <Stat
          label="Obiettivi liberi"
          value={state.target.filter((id) => !assegnati.has(id)).length}
          hint={`su ${state.target.length} in lista`}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        {/* Colonna ricerca */}
        <section className="panel p-3 xl:col-span-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-black uppercase tracking-wide">Chiama un giocatore</h2>
            <span className="text-[0.7rem] text-[color:var(--muted)]">premi /</span>
          </div>

          <input
            ref={ricercaRef}
            className="input mt-2"
            placeholder="Cerca per nome o squadra…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && liberi.length > 0) {
                e.preventDefault();
                apriLotto(liberi[0]);
              }
            }}
          />

          <div className="mt-2 flex flex-wrap items-center gap-1">
            {(["TUTTI", ...ORDINE_RUOLI] as const).map((r) => (
              <button
                key={r}
                className="btn btn-sm"
                onClick={() => setRuoloFiltro(r as Ruolo | "TUTTI")}
                style={
                  ruoloFiltro === r
                    ? { background: "rgba(34,197,94,0.16)", borderColor: "#2f6b53", color: "#4ade80" }
                    : undefined
                }
              >
                {r === "TUTTI" ? "Tutti" : `${r} · ${liberiPerRuolo[r as Ruolo]}`}
              </button>
            ))}
            <button
              className="btn btn-sm"
              onClick={() => setSoloObiettivi((v) => !v)}
              style={
                soloObiettivi
                  ? { background: "rgba(250,204,21,0.14)", borderColor: "#8a6d1f", color: "#facc15" }
                  : undefined
              }
            >
              ★ Obiettivi
            </button>
          </div>

          <ul className="mt-2 max-h-[30rem] divide-y divide-[color:var(--line)] overflow-y-auto">
            {liberi.slice(0, 200).map((p) => {
              const v = mercato.get(p.id);
              const inTarget = state.target.includes(p.id);
              const escluso = state.esclusi.includes(p.id);
              return (
                <li key={p.id}>
                  <div className="flex items-center gap-2 py-1.5">
                    <button
                      className="flex min-w-0 flex-1 items-center gap-2 text-left"
                      onClick={() => apriLotto(p)}
                      title="Metti in asta"
                    >
                      <RuoloBadge ruolo={p.r} size="sm" />
                      <span className="min-w-0 flex-1">
                        <span
                          className="block truncate text-sm font-bold"
                          style={{ color: escluso ? "#7d8f89" : undefined }}
                        >
                          {inTarget ? "★ " : ""}
                          {p.nome}
                        </span>
                        <span className="text-[0.7rem] text-[color:var(--muted)]">
                          {p.team} · F{p.fascia} · indice {v?.indice ?? "—"}
                        </span>
                      </span>
                      <span className="num shrink-0 text-right">
                        <span
                          className="block text-sm font-black"
                          style={{
                            color:
                              v?.giudizio === "affare"
                                ? "#4ade80"
                                : v?.giudizio === "caro" || v?.giudizio === "trappola"
                                  ? "#fbbf24"
                                  : "#e8f2ee",
                          }}
                        >
                          {state.prezziCustom[p.id] ?? v?.consigliato ?? "—"}
                        </span>
                        <span className="block text-[0.65rem] text-[color:var(--muted)]">
                          max {v?.strappo ?? "—"}
                        </span>
                      </span>
                    </button>
                    <button
                      className="btn btn-sm"
                      onClick={() => setSchedaId(p.id)}
                      aria-label={`Apri scheda di ${p.nome}`}
                      title="Scheda giocatore"
                    >
                      ℹ
                    </button>
                  </div>
                </li>
              );
            })}
            {liberi.length === 0 ? (
              <li className="py-6 text-center text-sm text-[color:var(--muted)]">
                Nessun giocatore libero con questi filtri.
              </li>
            ) : null}
          </ul>
        </section>

        {/* Colonna lotto in asta */}
        <section className="space-y-4 xl:col-span-5">
          <div
            className="panel p-4"
            style={lotto ? { borderColor: stileSemaforo.bordo } : undefined}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black uppercase tracking-wide">In asta ora</h2>
              {state.lega.timer > 0 && lotto ? (
                <div className="flex items-center gap-2">
                  <span
                    className="num text-lg font-black"
                    style={{ color: secondi <= 5 && timerAttivo ? "#f87171" : "#e8f2ee" }}
                  >
                    {secondi}s
                  </span>
                  <button
                    className="btn btn-sm"
                    onClick={() => {
                      setSecondi(state.lega.timer);
                      setTimerAttivo(true);
                    }}
                  >
                    ↻
                  </button>
                  <button className="btn btn-sm" onClick={() => setTimerAttivo((v) => !v)}>
                    {timerAttivo ? "Pausa" : "Via"}
                  </button>
                </div>
              ) : null}
            </div>

            {!lotto ? (
              <p className="py-10 text-center text-sm text-[color:var(--muted)]">
                Cerca un giocatore e premi Invio per metterlo in asta.
              </p>
            ) : (
              <>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <RuoloBadge ruolo={lotto.r} />
                  <span className="text-2xl font-black leading-none">{lotto.nome}</span>
                  <TeamBadge team={lotto.team} full />
                  <FasciaBadge fascia={lotto.fascia} />
                  <button className="btn btn-sm" onClick={() => toggleTarget(lotto.id)}>
                    {state.target.includes(lotto.id) ? "★" : "☆"}
                  </button>
                  <button className="btn btn-sm" onClick={() => setSchedaId(lotto.id)}>
                    Scheda
                  </button>
                </div>

                {lotto.tags.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {lotto.tags.map((t) => (
                      <TagChip key={t} tag={t} />
                    ))}
                  </div>
                ) : null}

                <div className="mt-3 grid grid-cols-3 gap-2">
                  <Stat label="Consigliato" value={valutazioneLotto?.consigliato ?? "—"} tone="buono" />
                  <Stat label="Non oltre" value={valutazioneLotto?.strappo ?? "—"} tone="attenzione" />
                  <Stat label="Fantaindice" value={valutazioneLotto?.indice ?? "—"} />
                </div>

                <div className="mt-4">
                  <div className="label mb-1">Offerta corrente</div>
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      className="input num max-w-[7rem] text-2xl font-black"
                      type="number"
                      min={1}
                      value={offerta}
                      onChange={(e) => setOfferta(Math.max(1, Number(e.target.value) || 1))}
                    />
                    {[1, 5, 10].map((step) => (
                      <button
                        key={step}
                        className="btn"
                        onClick={() => setOfferta((o) => o + step)}
                      >
                        +{step}
                      </button>
                    ))}
                    <button
                      className="btn"
                      onClick={() => setOfferta((o) => Math.max(1, o - 1))}
                    >
                      −1
                    </button>
                    <button
                      className="btn btn-sm"
                      onClick={() =>
                        setOfferta(valutazioneLotto?.consigliato ?? offerta)
                      }
                    >
                      = consigliato
                    </button>
                  </div>

                  <p className="mt-2 text-sm font-semibold" style={{ color: stileSemaforo.testo }}>
                    ● {stileSemaforo.etichetta}
                  </p>

                  <div className="mt-3 flex flex-wrap items-end gap-2">
                    <label className="flex-1 min-w-[12rem]">
                      <span className="label">Aggiudicato a</span>
                      <select
                        className="input mt-1"
                        value={acquirente}
                        onChange={(e) => setAcquirente(e.target.value)}
                      >
                        {state.fantallenatori.map((f) => {
                          const rosa = rose.get(f.id);
                          const puo = !rosa || rosa.maxOfferta >= offerta;
                          return (
                            <option key={f.id} value={f.id}>
                              {puo ? "" : "⚠ "}
                              {f.nome} — {rosa?.residuo ?? 0} cr · max {rosa?.maxOfferta ?? 0}
                            </option>
                          );
                        })}
                      </select>
                    </label>
                    <button className="btn btn-primary" onClick={aggiudica}>
                      Aggiudica per {offerta}
                    </button>
                    <button className="btn" onClick={() => setLottoId(null)}>
                      Invenduto
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {consigli.length > 0 ? (
            <div className="panel space-y-2 p-3">
              <h2 className="text-sm font-black uppercase tracking-wide">
                La tua asta, adesso
              </h2>
              {consigli.map((c, i) => (
                <Avviso key={i} livello={c.livello}>
                  {c.testo}
                </Avviso>
              ))}
            </div>
          ) : null}

          <div className="panel p-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black uppercase tracking-wide">Ultimi acquisti</h2>
              <button
                className="btn btn-sm btn-danger"
                onClick={annullaUltimo}
                disabled={state.acquisti.length === 0}
              >
                Annulla ultimo
              </button>
            </div>
            {cronologia.length === 0 ? (
              <p className="py-4 text-center text-sm text-[color:var(--muted)]">
                Nessun giocatore assegnato.
              </p>
            ) : (
              <ul className="mt-2 divide-y divide-[color:var(--line)] text-sm">
                {cronologia.map((a) => {
                  const p = byId.get(a.playerId);
                  const f = state.fantallenatori.find((x) => x.id === a.fantallenatoreId);
                  const v = p ? mercato.get(p.id) : undefined;
                  const sopra = v ? a.prezzo - v.consigliato : 0;
                  return (
                    <li key={a.playerId} className="flex items-center gap-2 py-1.5">
                      {p ? <RuoloBadge ruolo={p.r} size="sm" /> : null}
                      <span className="min-w-0 flex-1 truncate font-semibold">
                        {p?.nome ?? a.playerId}
                      </span>
                      <span className="truncate text-[0.75rem] text-[color:var(--muted)]">
                        {f?.nome ?? "—"}
                      </span>
                      <span className="num font-black">{a.prezzo}</span>
                      <span
                        className="num w-12 text-right text-[0.72rem]"
                        style={{ color: sopra > 0 ? "#fbbf24" : "#4ade80" }}
                      >
                        {sopra > 0 ? `+${sopra}` : sopra}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>

        {/* Colonna partecipanti */}
        <section className="panel p-3 xl:col-span-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-wide">Squadre</h2>
            <Link href="/impostazioni" className="btn btn-sm">
              Gestisci
            </Link>
          </div>

          <ul className="mt-2 space-y-2">
            {state.fantallenatori.map((f) => {
              const rosa = rose.get(f.id);
              if (!rosa) return null;
              return (
                <li
                  key={f.id}
                  className="panel-soft p-2.5"
                  style={f.io ? { borderColor: "#2f6b53" } : undefined}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-black">
                      {f.io ? "▸ " : ""}
                      {f.nome}
                    </span>
                    <span className="num text-sm font-black text-[color:var(--accent)]">
                      {rosa.residuo}
                    </span>
                  </div>
                  <div className="mt-1.5">
                    <Barra
                      valore={rosa.speso}
                      max={state.lega.budget}
                      colore={rosa.residuo < state.lega.budget * 0.1 ? "#f87171" : "#22c55e"}
                    />
                  </div>
                  <div className="mt-1.5 flex gap-1 text-[0.68rem]">
                    {ORDINE_RUOLI.map((r) => {
                      const rep = rosa.reparti[r];
                      const completo = rep.mancanti === 0;
                      return (
                        <span
                          key={r}
                          className="num flex-1 rounded-md px-1 py-0.5 text-center font-bold"
                          style={{
                            background: completo ? "rgba(34,197,94,0.14)" : "rgba(255,255,255,0.04)",
                            color: completo ? "#4ade80" : "#9dbab1",
                          }}
                          title={`${NOME_RUOLO[r]}: ${rep.presi}/${rep.slot} — spesi ${rep.speso} su ${rep.budgetTeorico} previsti`}
                        >
                          {r} {rep.presi}/{rep.slot}
                        </span>
                      );
                    })}
                  </div>
                  <div className="mt-1 text-[0.68rem] text-[color:var(--muted)]">
                    max offerta <strong className="num">{rosa.maxOfferta}</strong> · media/slot{" "}
                    <strong className="num">{rosa.mediaPerSlot.toFixed(1)}</strong>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      {schedaId && byId.get(schedaId) ? (
        <PlayerSheet player={byId.get(schedaId)!} onClose={() => setSchedaId(null)} />
      ) : null}
    </div>
  );
}
