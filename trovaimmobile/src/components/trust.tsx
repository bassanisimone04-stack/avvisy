import { freshness } from "@/lib/freshness";
import { formatDuration, formatEuro, timeAgo } from "@/lib/format";
import type { AdvertiserStats } from "@/lib/trust";
import { IconAlert, IconBuilding, IconCheck, IconClock, IconUser } from "./icons";
import { entryCost } from "@/lib/costs";

/** Badge "Disponibile — confermato X ore fa". */
export function AvailabilityBadge({ confirmedAt, status = "active" }: { confirmedAt: string; status?: "active" | "closed" }) {
  if (status === "closed") return <span className="badge badge-neutral">Non più disponibile</span>;
  const f = freshness(confirmedAt);
  if (f === "fresh")
    return (
      <span className="badge badge-ok" title="L'inserzionista ha confermato che l'immobile è ancora libero">
        <IconCheck size={14} /> Disponibile — confermato {timeAgo(confirmedAt)}
      </span>
    );
  if (f === "aging")
    return (
      <span className="badge badge-warn" title="L'inserzionista non ha riconfermato questa settimana">
        <span className="dot" /> Da riconfermare — ultima conferma {timeAgo(confirmedAt)}
      </span>
    );
  return (
    <span className="badge badge-danger" title="Nessuna conferma da oltre due settimane: potrebbe non essere più libero">
      <IconAlert size={14} /> Non confermato da {timeAgo(confirmedAt).replace(" fa", "")}
    </span>
  );
}

export function AdvertiserTypeBadge({ role, agencyName }: { role: "private" | "agency"; agencyName?: string | null }) {
  return role === "agency" ? (
    <span className="badge badge-agency" title="Agenzia o professionista: può applicare una commissione, dovuta solo alla firma del contratto">
      <IconBuilding size={14} /> Agenzia{agencyName ? ` · ${agencyName}` : ""}
    </span>
  ) : (
    <span className="badge badge-info" title="Proprietario privato: nessuna commissione">
      <IconUser size={14} /> Privato
    </span>
  );
}

export function ResponseTime({ stats, compact }: { stats?: AdvertiserStats; compact?: boolean }) {
  if (!stats || stats.medianResponseMinutes == null) {
    return (
      <span className="row small muted" title="Servono almeno 3 richieste reali ricevute sulla piattaforma per calcolarlo">
        <IconClock size={15} /> {compact ? "Tempo di risposta: dati insufficienti" : "Tempo di risposta non ancora calcolabile (meno di 3 richieste)"}
      </span>
    );
  }
  const rate = stats.responseRate != null ? ` · risponde al ${Math.round(stats.responseRate * 100)}%` : "";
  return (
    <span className="row small" title="Mediana calcolata sulle richieste reali ricevute su TrovaImmobile negli ultimi 90 giorni">
      <IconClock size={15} /> Risponde in ~{formatDuration(stats.medianResponseMinutes)}
      {!compact && <span className="muted">{rate}</span>}
    </span>
  );
}

type Costs = { canone: number; spese: number; cauzione: number; commissione: number };

/** Riepilogo costi a colpo d'occhio, per le card dei risultati. */
export function CostCompact(c: Costs) {
  return (
    <div className="cost cost-compact" aria-label="Costi">
      <span>Canone + spese / mese</span>
      <span>{formatEuro(c.canone + c.spese)}</span>
      <span className="muted">
        Cauzione {formatEuro(c.cauzione)}
        {c.commissione > 0 ? ` · commissione ${formatEuro(c.commissione)}` : " · no commissione"}
      </span>
      <span />
      <span className="total">Costo d&apos;ingresso</span>
      <span className="total">{formatEuro(entryCost(c))}</span>
    </div>
  );
}

/** Riepilogo completo del costo totale d'ingresso. */
export function CostTable(c: Costs & { role: "private" | "agency" }) {
  return (
    <div>
      <table className="cost-table">
        <tbody>
          <tr>
            <td>Primo canone mensile</td>
            <td>{formatEuro(c.canone)}</td>
          </tr>
          <tr>
            <td>Spese condominiali (mese)</td>
            <td>{formatEuro(c.spese)}</td>
          </tr>
          <tr>
            <td>
              Cauzione <span className="muted small">({Math.round((c.cauzione / c.canone) * 10) / 10} mensilità, restituibile)</span>
            </td>
            <td>{formatEuro(c.cauzione)}</td>
          </tr>
          <tr>
            <td>
              Commissione agenzia{" "}
              {c.commissione > 0 && <span className="muted small">(solo alla firma del contratto)</span>}
            </td>
            <td>{c.commissione > 0 ? formatEuro(c.commissione) : c.role === "private" ? "Nessuna (privato)" : formatEuro(0)}</td>
          </tr>
          <tr className="total">
            <td>Costo totale d&apos;ingresso</td>
            <td>{formatEuro(entryCost(c))}</td>
          </tr>
        </tbody>
      </table>
      <p className="xs muted" style={{ marginTop: 6 }}>
        Poi ogni mese: {formatEuro(c.canone + c.spese)} (canone + spese). Importi dichiarati dall&apos;inserzionista in campi strutturati obbligatori.
      </p>
    </div>
  );
}

export function FraudWarning({ compact }: { compact?: boolean }) {
  return (
    <div className="alert alert-danger" role="note">
      <strong>
        <IconAlert size={15} style={{ verticalAlign: "-2px" }} /> Non pagare nulla prima di aver visitato l&apos;immobile
      </strong>
      {compact
        ? "Nessuna caparra, «quota di iscrizione» o «servizio di ricerca» è mai dovuta prima della visita."
        : "Su TrovaImmobile nessun pagamento è richiesto per vedere una casa. Diffida di chi chiede caparre, bonifici, ricariche o una «quota per il servizio di ricerca» (tipicamente 200–260 €) prima della visita o della firma: è uno schema di truffa noto. La commissione di un'agenzia si paga solo alla firma del contratto."}
    </div>
  );
}

export function Stars({ value }: { value: number }) {
  const full = Math.round(value);
  return (
    <span className="stars" aria-label={`${value} su 5`}>
      {"★".repeat(full)}
      <span style={{ opacity: 0.3 }}>{"★".repeat(5 - full)}</span>
    </span>
  );
}
