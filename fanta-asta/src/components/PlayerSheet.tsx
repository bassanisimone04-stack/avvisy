"use client";

import { useEffect, useMemo, useState } from "react";
import { NOME_RUOLO } from "@/lib/players";
import { SQUADRE_BY_CODE } from "@/lib/teams";
import { useAsta } from "@/lib/store";
import type { Player } from "@/lib/types";
import { FasciaBadge, RuoloBadge, Stat, TagChip, TeamBadge } from "./ui";

const GIUDIZI: Record<string, { testo: string; colore: string; spiega: string }> = {
  affare: {
    testo: "Affare",
    colore: "#4ade80",
    spiega: "Rende molto più di quanto costa: da mettere in lista obiettivi.",
  },
  giusto: {
    testo: "Prezzo giusto",
    colore: "#38bdf8",
    spiega: "Valore e prezzo sono allineati: prendilo se ti serve lo slot.",
  },
  caro: {
    testo: "Caro",
    colore: "#fbbf24",
    spiega: "Il mercato lo paga più di quanto rende: lascialo agli altri.",
  },
  trappola: {
    testo: "Trappola",
    colore: "#f87171",
    spiega: "Rapporto valore/prezzo pessimo o rischio alto: meglio evitarlo.",
  },
};

export default function PlayerSheet({
  player,
  onClose,
}: {
  player: Player;
  onClose: () => void;
}) {
  const {
    state,
    mercato,
    assegnati,
    rose,
    assegna,
    annullaAcquisto,
    toggleTarget,
    toggleEscluso,
    impostaPrezzoCustom,
  } = useAsta();

  const valutazione = mercato.get(player.id);
  const acquisto = assegnati.get(player.id);
  const squadra = SQUADRE_BY_CODE[player.team];
  const io = state.fantallenatori.find((f) => f.io);
  const rosaIo = io ? rose.get(io.id) : undefined;

  const [prezzo, setPrezzo] = useState<number>(
    acquisto?.prezzo ?? valutazione?.consigliato ?? 1
  );
  const [destinatario, setDestinatario] = useState<string>(
    acquisto?.fantallenatoreId ?? io?.id ?? state.fantallenatori[0]?.id ?? ""
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const giudizio = valutazione ? GIUDIZI[valutazione.giudizio] : undefined;
  const personalizzato = state.prezziCustom[player.id];

  const sostenibile = useMemo(() => {
    if (!rosaIo) return true;
    return prezzo <= rosaIo.maxOfferta;
  }, [prezzo, rosaIo]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Scheda di ${player.nome}`}
      onClick={onClose}
    >
      <div
        className="panel max-h-[92vh] w-full max-w-2xl overflow-y-auto p-4 sm:p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <RuoloBadge ruolo={player.r} />
            <div>
              <h2 className="text-xl font-black leading-tight">{player.nome}</h2>
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                <TeamBadge team={player.team} full />
                <FasciaBadge fascia={player.fascia} />
                <span className="chip text-[color:var(--muted)]">
                  {NOME_RUOLO[player.r]}
                  {player.rm.length > 0 ? ` · Mantra ${player.rm.join("/")}` : ""}
                </span>
              </div>
            </div>
          </div>
          <button className="btn btn-sm" onClick={onClose} aria-label="Chiudi scheda">
            ✕
          </button>
        </div>

        {acquisto ? (
          <div className="mt-3 rounded-xl border border-[#3f6b4f] bg-[#12291d] px-3 py-2 text-sm">
            Già assegnato a{" "}
            <strong>
              {state.fantallenatori.find((f) => f.id === acquisto.fantallenatoreId)?.nome ??
                "—"}
            </strong>{" "}
            per <strong className="num">{acquisto.prezzo}</strong> crediti.
          </div>
        ) : null}

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Stat label="Fantaindice" value={valutazione?.indice ?? "—"} hint="Valore 0-100" />
          <Stat
            label="Consigliato"
            value={personalizzato ?? valutazione?.consigliato ?? "—"}
            hint={personalizzato ? "prezzo personalizzato" : "nella tua lega"}
            tone="buono"
          />
          <Stat
            label="Non oltre"
            value={valutazione?.strappo ?? "—"}
            hint="soglia di strappo"
            tone="attenzione"
          />
          <Stat
            label="Convenienza"
            value={valutazione ? `${valutazione.convenienza}` : "—"}
            hint="100 = media del ruolo"
            tone={
              !valutazione
                ? "neutro"
                : valutazione.convenienza >= 125
                  ? "buono"
                  : valutazione.convenienza >= 92
                    ? "neutro"
                    : "male"
            }
          />
        </div>

        {giudizio ? (
          <div
            className="mt-3 rounded-xl px-3 py-2 text-sm"
            style={{
              background: `${giudizio.colore}14`,
              border: `1px solid ${giudizio.colore}44`,
              color: giudizio.colore,
            }}
          >
            <strong>{giudizio.testo}.</strong>{" "}
            <span className="opacity-90">{giudizio.spiega}</span>
          </div>
        ) : null}

        {player.tags.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {player.tags.map((t) => (
              <TagChip key={t} tag={t} />
            ))}
          </div>
        ) : null}

        {player.nota ? (
          <p className="mt-3 text-sm leading-relaxed text-[#c8ddd5]">{player.nota}</p>
        ) : null}

        {(player.fm !== undefined ||
          player.gol !== undefined ||
          player.assist !== undefined) && (
          <div className="mt-4">
            <div className="label mb-1.5">Stagione 2025/26</div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Stat label="Fantamedia" value={player.fm ?? "—"} />
              <Stat label="Gol" value={player.gol ?? "—"} />
              <Stat label="Assist" value={player.assist ?? "—"} />
              <Stat label="Presenze" value={player.presenze ?? "—"} />
            </div>
          </div>
        )}

        {squadra ? (
          <div className="panel-soft mt-4 p-3">
            <div className="label mb-1">
              {squadra.nome} · {squadra.allenatore} · {squadra.modulo}
            </div>
            <p className="text-[0.82rem] leading-relaxed text-[#b9d1c9]">
              <strong>Formazione tipo:</strong> {squadra.formazioneTipo}
            </p>
            <p className="mt-1 text-[0.82rem] leading-relaxed text-[#b9d1c9]">
              <strong>Rigori:</strong> {squadra.rigorista}
              {squadra.piazzati ? ` · Piazzati: ${squadra.piazzati}` : ""}
            </p>
          </div>
        ) : null}

        <div className="panel-soft mt-4 p-3">
          <div className="label mb-2">Assegna all&apos;asta</div>
          <div className="flex flex-wrap items-end gap-2">
            <label className="flex-1 min-w-[9rem]">
              <span className="label">Prezzo</span>
              <input
                className="input num mt-1"
                type="number"
                min={1}
                value={prezzo}
                onChange={(e) => setPrezzo(Math.max(1, Number(e.target.value) || 1))}
              />
            </label>
            <label className="flex-[2] min-w-[11rem]">
              <span className="label">Squadra</span>
              <select
                className="input mt-1"
                value={destinatario}
                onChange={(e) => setDestinatario(e.target.value)}
              >
                {state.fantallenatori.map((f) => {
                  const rosa = rose.get(f.id);
                  return (
                    <option key={f.id} value={f.id}>
                      {f.nome}
                      {rosa ? ` — ${rosa.residuo} cr, max ${rosa.maxOfferta}` : ""}
                    </option>
                  );
                })}
              </select>
            </label>
            <button
              className="btn btn-primary"
              disabled={!destinatario}
              onClick={() => {
                assegna(player.id, destinatario, prezzo);
                onClose();
              }}
            >
              Aggiudica
            </button>
          </div>

          {rosaIo && !sostenibile ? (
            <p className="mt-2 text-[0.78rem] text-[#fca5a5]">
              Attenzione: con {rosaIo.residuo} crediti e {rosaIo.slotMancanti} slot da
              riempire, la tua offerta massima è {rosaIo.maxOfferta}.
            </p>
          ) : null}

          <div className="mt-3 flex flex-wrap gap-2">
            <button className="btn btn-sm" onClick={() => toggleTarget(player.id)}>
              {state.target.includes(player.id) ? "★ Togli da obiettivi" : "☆ Metti in obiettivi"}
            </button>
            <button className="btn btn-sm" onClick={() => toggleEscluso(player.id)}>
              {state.esclusi.includes(player.id) ? "Togli da evitati" : "Segna da evitare"}
            </button>
            <button
              className="btn btn-sm"
              onClick={() =>
                impostaPrezzoCustom(
                  player.id,
                  personalizzato !== undefined ? null : prezzo
                )
              }
            >
              {personalizzato !== undefined
                ? "Rimuovi prezzo personale"
                : `Fissa il mio prezzo (${prezzo})`}
            </button>
            {acquisto ? (
              <button
                className="btn btn-sm btn-danger"
                onClick={() => {
                  annullaAcquisto(player.id);
                  onClose();
                }}
              >
                Annulla assegnazione
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
