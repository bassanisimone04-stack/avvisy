import Link from "next/link";
import { requireUser } from "@/lib/session";
import { visitsFor, type VisitRow } from "@/lib/dashboard";
import { formatSlot } from "@/lib/format";
import { cancelVisitAction, reviewAction, visitOutcomeAction } from "@/app/actions";
import { ActionForm } from "@/components/ActionForm";

const STATUS: Record<VisitRow["status"], [string, string]> = {
  confirmed: ["Confermata", "badge-ok"],
  completed: ["Svolta", "badge-ok"],
  cancelled: ["Annullata", "badge-neutral"],
  no_show: ["Non presentato", "badge-danger"],
};

export default async function VisitsPage() {
  const user = await requireUser();
  const now = Date.now();
  const visits = visitsFor(user.id);
  const upcoming = visits.filter((v) => Date.parse(v.end_at) > now).reverse();
  const past = visits.filter((v) => Date.parse(v.end_at) <= now);

  const Item = ({ v }: { v: VisitRow }) => {
    const mineAsAdvertiser = v.advertiser_id === user.id;
    const isPast = Date.parse(v.end_at) <= now;
    const [label, cls] = isPast && v.status === "confirmed" ? ["Svolta (in attesa di esito)", "badge-neutral"] : STATUS[v.status];
    return (
      <li className="stack" style={{ gap: 8 }}>
        <div className="spread">
          <strong>{formatSlot(v.start_at)}</strong>
          <span className="row">
            <span className={`badge ${cls}`}>{label}</span>
            {v.contract_signed ? <span className="badge badge-ok">Contratto firmato</span> : null}
          </span>
        </div>
        <div className="small">
          <Link href={`/annunci/${v.listing_id}`}>{v.title}</Link> · {v.via} {v.civico}, {v.comune}
        </div>
        <div className="xs muted">{mineAsAdvertiser ? `Visitatore: ${v.seeker_name} (${v.seeker_email})` : `Inserzionista: ${v.advertiser_name}`}</div>

        {!isPast && v.status === "confirmed" && (
          <form action={cancelVisitAction}>
            <input type="hidden" name="visitId" value={v.id} />
            <button className="btn btn-sm btn-danger">Annulla visita</button>
          </form>
        )}

        {isPast && mineAsAdvertiser && v.status !== "cancelled" && (
          <form action={visitOutcomeAction} className="row">
            <input type="hidden" name="visitId" value={v.id} />
            <span className="xs muted">Esito:</span>
            <button className="btn btn-sm" name="outcome" value="completed">
              Svolta
            </button>
            <button className="btn btn-sm" name="outcome" value="contract">
              Contratto firmato
            </button>
            <button className="btn btn-sm btn-danger" name="outcome" value="no_show">
              Non si è presentato
            </button>
          </form>
        )}

        {isPast && !mineAsAdvertiser && (v.status === "confirmed" || v.status === "completed") && !v.reviewed && (
          <details>
            <summary className="small" style={{ cursor: "pointer" }}>
              Lascia una recensione verificata
            </summary>
            <div style={{ marginTop: 8 }}>
              <ActionForm action={reviewAction} submitLabel="Pubblica recensione" hideOnSuccess>
                <input type="hidden" name="visitId" value={v.id} />
                <div className="field">
                  <label htmlFor={`r-${v.id}`}>Voto</label>
                  <select id={`r-${v.id}`} name="rating" defaultValue="5">
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>
                        {"★".repeat(n)} ({n})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor={`t-${v.id}`}>Com&apos;è andata?</label>
                  <textarea id={`t-${v.id}`} name="text" minLength={20} required placeholder="Puntualità, corrispondenza con l'annuncio, trasparenza sui costi…" />
                </div>
              </ActionForm>
            </div>
          </details>
        )}
      </li>
    );
  };

  return (
    <div className="stack" style={{ gap: 16 }}>
      <section className="card card-pad">
        <h2>In programma ({upcoming.length})</h2>
        {upcoming.length === 0 ? <p className="small muted">Nessuna visita in programma.</p> : <ul className="list">{upcoming.map((v) => <Item key={v.id} v={v} />)}</ul>}
      </section>
      <section className="card card-pad">
        <h2>Passate ({past.length})</h2>
        {past.length === 0 ? <p className="small muted">Nessuna visita passata.</p> : <ul className="list">{past.map((v) => <Item key={v.id} v={v} />)}</ul>}
      </section>
    </div>
  );
}
