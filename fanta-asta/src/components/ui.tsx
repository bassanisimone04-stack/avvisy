import { COLORE_RUOLO, NOME_RUOLO } from "@/lib/players";
import { COLORI_SQUADRA, nomeSquadra } from "@/lib/teams";
import type { PlayerTag, Ruolo, TeamCode } from "@/lib/types";

export function RuoloBadge({ ruolo, size = "md" }: { ruolo: Ruolo; size?: "sm" | "md" }) {
  const colore = COLORE_RUOLO[ruolo];
  const dim = size === "sm" ? "h-5 w-5 text-[0.65rem]" : "h-7 w-7 text-xs";
  return (
    <span
      className={`inline-flex ${dim} shrink-0 items-center justify-center rounded-md font-black`}
      style={{ background: `${colore}22`, color: colore, border: `1px solid ${colore}55` }}
      title={NOME_RUOLO[ruolo]}
    >
      {ruolo}
    </span>
  );
}

export function TeamBadge({ team, full = false }: { team: TeamCode; full?: boolean }) {
  const colore = COLORI_SQUADRA[team];
  return (
    <span
      className="chip"
      style={{ borderColor: `${colore}66`, color: "#dbe9e3", background: `${colore}1f` }}
      title={nomeSquadra(team)}
    >
      <span
        className="inline-block h-2 w-2 rounded-full"
        style={{ background: colore }}
        aria-hidden
      />
      {full ? nomeSquadra(team) : team}
    </span>
  );
}

const COLORI_FASCIA: Record<number, string> = {
  1: "#facc15",
  2: "#a3e635",
  3: "#38bdf8",
  4: "#94a3b8",
  5: "#64748b",
};

export function FasciaBadge({ fascia }: { fascia: number }) {
  const colore = COLORI_FASCIA[fascia] ?? "#64748b";
  return (
    <span
      className="chip num"
      style={{ borderColor: `${colore}55`, color: colore, background: `${colore}14` }}
      title={`Fascia d'asta ${fascia}`}
    >
      F{fascia}
    </span>
  );
}

export const ETICHETTE_TAG: Record<PlayerTag, { testo: string; colore: string; aiuto: string }> = {
  rig1: { testo: "Rigorista", colore: "#f59e0b", aiuto: "Primo rigorista della squadra" },
  rig2: { testo: "Rigori 2°", colore: "#d97706", aiuto: "Seconda scelta dal dischetto" },
  rig3: { testo: "Rigori 3°", colore: "#b45309", aiuto: "Terza scelta dal dischetto" },
  piazzati: { testo: "Piazzati", colore: "#8b5cf6", aiuto: "Batte punizioni e/o calci d'angolo" },
  titolare: { testo: "Titolare", colore: "#22c55e", aiuto: "Posto in formazione praticamente certo" },
  ballottaggio: { testo: "Ballottaggio", colore: "#eab308", aiuto: "Si gioca il posto con un compagno" },
  riserva: { testo: "Riserva", colore: "#94a3b8", aiuto: "Parte dalla panchina" },
  top: { testo: "Top", colore: "#f43f5e", aiuto: "Nome da primo slot" },
  lowcost: { testo: "Low cost", colore: "#14b8a6", aiuto: "Titolare a pochi crediti" },
  scommessa: { testo: "Scommessa", colore: "#0ea5e9", aiuto: "Potenziale alto, rischio alto" },
  bug: { testo: "Bug listone", colore: "#c084fc", aiuto: "Gioca più avanti del ruolo di listone" },
  neopromossa: { testo: "Neopromossa", colore: "#78716c", aiuto: "Gioca in una squadra appena salita" },
  rischio: { testo: "Rischio", colore: "#ef4444", aiuto: "Infortuni, mercato o minutaggio incerto" },
};

export function TagChip({ tag }: { tag: PlayerTag }) {
  const meta = ETICHETTE_TAG[tag];
  if (!meta) return null;
  return (
    <span
      className="chip"
      style={{ borderColor: `${meta.colore}55`, color: meta.colore, background: `${meta.colore}14` }}
      title={meta.aiuto}
    >
      {meta.testo}
    </span>
  );
}

export function Stat({
  label,
  value,
  hint,
  tone = "neutro",
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  tone?: "neutro" | "buono" | "attenzione" | "male";
}) {
  const colori: Record<string, string> = {
    neutro: "#e8f2ee",
    buono: "#4ade80",
    attenzione: "#fbbf24",
    male: "#f87171",
  };
  return (
    <div className="panel-soft px-3 py-2">
      <div className="label">{label}</div>
      <div className="num text-xl font-black" style={{ color: colori[tone] }}>
        {value}
      </div>
      {hint ? <div className="mt-0.5 text-[0.7rem] text-[color:var(--muted)]">{hint}</div> : null}
    </div>
  );
}

export function Barra({ valore, max, colore = "#22c55e" }: { valore: number; max: number; colore?: string }) {
  const pct = max <= 0 ? 0 : Math.min(100, Math.max(0, (valore / max) * 100));
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#0a1512]">
      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: colore }} />
    </div>
  );
}

export function Avviso({
  livello = "info",
  children,
}: {
  livello?: "info" | "attenzione" | "allarme";
  children: React.ReactNode;
}) {
  const stili: Record<string, { bg: string; bordo: string; testo: string }> = {
    info: { bg: "rgba(56,189,248,0.08)", bordo: "rgba(56,189,248,0.32)", testo: "#bae6fd" },
    attenzione: { bg: "rgba(251,191,36,0.08)", bordo: "rgba(251,191,36,0.32)", testo: "#fde68a" },
    allarme: { bg: "rgba(248,113,113,0.09)", bordo: "rgba(248,113,113,0.35)", testo: "#fecaca" },
  };
  const s = stili[livello];
  return (
    <div
      className="rounded-xl px-3 py-2 text-sm"
      style={{ background: s.bg, border: `1px solid ${s.bordo}`, color: s.testo }}
    >
      {children}
    </div>
  );
}
