"use client";

import { useMemo, useState } from "react";
import { ORDINE_RUOLI } from "@/lib/players";
import { COLORI_SQUADRA, SQUADRE } from "@/lib/teams";
import { useAsta } from "@/lib/store";
import PlayerSheet from "./PlayerSheet";
import { FasciaBadge, RuoloBadge, TagChip } from "./ui";

export default function SquadrePanel() {
  const { listone, mercato, assegnati, state, pronto } = useAsta();
  const [apertaCode, setApertaCode] = useState<string | null>(null);
  const [schedaId, setSchedaId] = useState<string | null>(null);

  const perSquadra = useMemo(() => {
    const map = new Map<string, typeof listone>();
    for (const p of listone) {
      const lista = map.get(p.team) ?? [];
      lista.push(p);
      map.set(p.team, lista);
    }
    for (const [code, lista] of map) {
      map.set(
        code,
        [...lista].sort(
          (a, b) =>
            ORDINE_RUOLI.indexOf(a.r) - ORDINE_RUOLI.indexOf(b.r) ||
            (mercato.get(b.id)?.consigliato ?? 0) - (mercato.get(a.id)?.consigliato ?? 0)
        )
      );
    }
    return map;
  }, [listone, mercato]);

  const scheda = schedaId ? listone.find((p) => p.id === schedaId) : undefined;

  if (!pronto) {
    return <div className="panel p-8 text-center text-[color:var(--muted)]">Carico…</div>;
  }

  return (
    <div className="space-y-4">
      <div className="panel p-4">
        <h1 className="text-lg font-black">Le 20 squadre della Serie A Enilive 2026/27</h1>
        <p className="mt-1 text-sm leading-relaxed text-[color:var(--muted)]">
          Allenatore, modulo, formazione tipo, gerarchia dai rigori e chiave di lettura per l&apos;asta,
          squadra per squadra. Il campionato parte nel weekend del 22-23 agosto 2026 e si chiude il
          30 maggio 2027. Apri una squadra per vedere i suoi giocatori con il prezzo consigliato.
        </p>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {SQUADRE.map((s) => {
          const colore = COLORI_SQUADRA[s.code];
          const aperta = apertaCode === s.code;
          const giocatori = perSquadra.get(s.code) ?? [];
          return (
            <section
              key={s.code}
              className="panel overflow-hidden"
              style={{ borderTop: `3px solid ${colore}` }}
            >
              <div className="p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-base font-black">
                    {s.nome}
                    {s.neopromossa ? (
                      <span className="chip ml-2 border-[#5a5148] text-[#d6c9b8]">Neopromossa</span>
                    ) : null}
                  </h2>
                  <span className="text-[0.75rem] text-[color:var(--muted)]">
                    {s.allenatore} · {s.modulo}
                  </span>
                </div>

                <dl className="mt-2 space-y-1.5 text-[0.82rem] leading-relaxed">
                  <div>
                    <dt className="label inline">Formazione tipo</dt>{" "}
                    <dd className="inline text-[#c8ddd5]">{s.formazioneTipo}</dd>
                  </div>
                  <div>
                    <dt className="label inline">Rigori</dt>{" "}
                    <dd className="inline text-[#c8ddd5]">{s.rigorista}</dd>
                  </div>
                  {s.piazzati ? (
                    <div>
                      <dt className="label inline">Piazzati</dt>{" "}
                      <dd className="inline text-[#c8ddd5]">{s.piazzati}</dd>
                    </div>
                  ) : null}
                </dl>

                <p className="mt-2 text-[0.82rem] leading-relaxed text-[#a9c4bb]">{s.nota}</p>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="chip text-[color:var(--muted)]">
                    Attacco {s.forza}/100
                  </span>
                  <span className="chip text-[color:var(--muted)]">Difesa {s.difesa}/100</span>
                  <button
                    className="btn btn-sm"
                    onClick={() => setApertaCode(aperta ? null : s.code)}
                  >
                    {aperta ? "Nascondi rosa" : `Rosa nel listone (${giocatori.length})`}
                  </button>
                </div>
              </div>

              {aperta ? (
                <ul className="divide-y divide-[color:var(--line)] border-t border-[color:var(--line)]">
                  {giocatori.map((p) => {
                    const v = mercato.get(p.id);
                    const preso = assegnati.get(p.id);
                    return (
                      <li key={p.id}>
                        <button
                          className="flex w-full items-center gap-2 px-4 py-1.5 text-left transition-colors hover:bg-[#132522]"
                          onClick={() => setSchedaId(p.id)}
                          style={preso ? { opacity: 0.5 } : undefined}
                        >
                          <RuoloBadge ruolo={p.r} size="sm" />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-bold">
                              {state.target.includes(p.id) ? "★ " : ""}
                              {p.nome}
                            </span>
                            <span className="flex flex-wrap gap-1 pt-0.5">
                              <FasciaBadge fascia={p.fascia} />
                              {p.tags.slice(0, 2).map((t) => (
                                <TagChip key={t} tag={t} />
                              ))}
                            </span>
                          </span>
                          <span className="num shrink-0 text-right">
                            <span className="block text-sm font-black text-[color:var(--accent)]">
                              {v?.consigliato ?? "—"}
                            </span>
                            <span className="block text-[0.65rem] text-[color:var(--muted)]">
                              {preso ? "preso" : `indice ${v?.indice ?? "—"}`}
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </section>
          );
        })}
      </div>

      {scheda ? <PlayerSheet player={scheda} onClose={() => setSchedaId(null)} /> : null}
    </div>
  );
}
