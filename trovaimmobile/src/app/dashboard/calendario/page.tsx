import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser, isAdvertiser } from "@/lib/session";
import { saveAvailabilityAction, saveCalendarUrlAction, syncNowAction } from "@/app/actions";
import { ActionForm } from "@/components/ActionForm";
import { getFreeSlots } from "@/lib/calendar";
import { formatDay, formatTime, timeAgo } from "@/lib/format";
import { minutesToHHMM } from "@/lib/time";
import { appUrl } from "@/lib/url";

const DAYS = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"];

export default async function CalendarPage() {
  const user = await requireUser();
  if (!isAdvertiser(user)) redirect("/dashboard");
  const d = db();
  const u = d.prepare("SELECT ical_import_url, ical_token, ical_synced_at, ical_sync_error, ical_unsupported, slot_minutes FROM users WHERE id = ?").get(user.id) as {
    ical_import_url: string | null;
    ical_token: string;
    ical_synced_at: string | null;
    ical_sync_error: string | null;
    ical_unsupported: number;
    slot_minutes: number;
  };
  const rules = d.prepare("SELECT weekday, start_min, end_min FROM availability_rules WHERE user_id = ? ORDER BY weekday, start_min").all(user.id) as { weekday: number; start_min: number; end_min: number }[];
  const { slots } = await getFreeSlots(user.id);
  const feed = `${await appUrl()}/ical/${u.ical_token}.ics`;
  const preview = slots.slice(0, 12);

  return (
    <div className="stack" style={{ gap: 16 }}>
      <section className="card card-pad stack">
        <h2 style={{ margin: 0 }}>1. Quando puoi mostrare casa</h2>
        <p className="small muted" style={{ margin: 0 }}>
          Fasce settimanali (ora italiana). Più fasce nello stesso giorno separate da virgola, es. <code>09:00-12:00, 17:30-19:30</code>. Lascia vuoto un giorno per non ricevere visite.
        </p>
        <ActionForm action={saveAvailabilityAction} submitLabel="Salva disponibilità">
          <div className="grid grid-2">
            {DAYS.map((name, wd) => (
              <div className="field" key={wd}>
                <label htmlFor={`day_${wd}`}>{name}</label>
                <input
                  id={`day_${wd}`}
                  name={`day_${wd}`}
                  className="input"
                  defaultValue={rules
                    .filter((r) => r.weekday === wd)
                    .map((r) => `${minutesToHHMM(r.start_min)}-${minutesToHHMM(r.end_min)}`)
                    .join(", ")}
                  placeholder="Nessuna visita"
                />
              </div>
            ))}
            <div className="field">
              <label htmlFor="slot_minutes">Durata di una visita</label>
              <select id="slot_minutes" name="slot_minutes" defaultValue={u.slot_minutes}>
                {[15, 20, 30, 45, 60].map((m) => (
                  <option key={m} value={m}>
                    {m} minuti
                  </option>
                ))}
              </select>
            </div>
          </div>
        </ActionForm>
      </section>

      <section className="card card-pad stack">
        <h2 style={{ margin: 0 }}>2. Collega il tuo calendario (Google Calendar, Apple, Outlook)</h2>
        <p className="small muted" style={{ margin: 0 }}>
          I tuoi impegni vengono letti ogni 15 minuti e le fasce in cui sei occupato spariscono dal calendario visite. In Google Calendar: Impostazioni → il tuo calendario → «Indirizzo segreto in formato iCal». Leggiamo solo inizio e fine degli impegni.
        </p>
        <ActionForm action={saveCalendarUrlAction} submitLabel="Salva e sincronizza">
          <div className="field">
            <label htmlFor="ical_import_url">Indirizzo iCal del tuo calendario</label>
            <input id="ical_import_url" name="ical_import_url" className="input" defaultValue={u.ical_import_url ?? ""} placeholder="https://calendar.google.com/calendar/ical/…/basic.ics" />
          </div>
        </ActionForm>
        {u.ical_import_url && (
          <div className="stack" style={{ gap: 6 }}>
            <div className="small">
              {u.ical_synced_at ? `Ultima sincronizzazione ${timeAgo(u.ical_synced_at)}.` : "Mai sincronizzato."}
              {u.ical_sync_error && <span style={{ color: "var(--danger)" }}> Errore: {u.ical_sync_error}</span>}
            </div>
            {u.ical_unsupported > 0 && (
              <div className="alert alert-warn">
                {u.ical_unsupported} eventi ricorrenti usano regole avanzate non interpretate: per questi è bloccata solo la prima occorrenza. Controlla le fasce qui sotto.
              </div>
            )}
            <form action={syncNowAction}>
              <button className="btn btn-sm">Sincronizza ora</button>
            </form>
          </div>
        )}
      </section>

      <section className="card card-pad stack">
        <h2 style={{ margin: 0 }}>3. Ricevi le visite nel tuo calendario</h2>
        <p className="small muted" style={{ margin: 0 }}>
          Aggiungi questo indirizzo al tuo calendario («Aggiungi calendario → Da URL» in Google Calendar): ogni visita prenotata comparirà automaticamente. Non condividerlo.
        </p>
        <input className="input" readOnly value={feed} aria-label="Feed iCal delle visite" />
      </section>

      <section className="card card-pad stack">
        <h2 style={{ margin: 0 }}>Anteprima: cosa vedono i visitatori</h2>
        {preview.length === 0 ? (
          <p className="small muted" style={{ margin: 0 }}>Nessuna fascia libera nei prossimi 14 giorni.</p>
        ) : (
          <div className="row">
            {preview.map((s) => (
              <span key={s.start.toISOString()} className="badge badge-neutral">
                {formatDay(s.start)} {formatTime(s.start)}
              </span>
            ))}
            {slots.length > preview.length && <span className="xs muted">e altre {slots.length - preview.length}</span>}
          </div>
        )}
      </section>
    </div>
  );
}
