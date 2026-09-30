"use client";

import { useMemo, useState } from "react";
import { bookVisitAction } from "@/app/actions";
import { useFormAction } from "./useFormAction";

const TZ = "Europe/Rome";
const dayKey = new Intl.DateTimeFormat("sv-SE", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" });
const dayLabel = new Intl.DateTimeFormat("it-IT", { timeZone: TZ, weekday: "short", day: "numeric", month: "short" });
const timeLabel = new Intl.DateTimeFormat("it-IT", { timeZone: TZ, hour: "2-digit", minute: "2-digit" });
const fullLabel = new Intl.DateTimeFormat("it-IT", { timeZone: TZ, weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });

/** Calendario delle fasce realmente libere: si prenota con conferma istantanea. */
export function SlotPicker({ listingId, slots, loggedIn }: { listingId: number; slots: string[]; loggedIn: boolean }) {
  const byDay = useMemo(() => {
    const m = new Map<string, string[]>();
    for (const s of slots) {
      const k = dayKey.format(new Date(s));
      if (!m.has(k)) m.set(k, []);
      m.get(k)!.push(s);
    }
    return [...m.entries()];
  }, [slots]);
  const [day, setDay] = useState(byDay[0]?.[0]);
  const [picked, setPicked] = useState<string | null>(null);
  const { state, onSubmit, pending } = useFormAction(bookVisitAction);

  if (byDay.length === 0) {
    return <p className="small muted">Nessuna fascia libera nei prossimi 14 giorni. Puoi scrivere all&apos;inserzionista qui sotto.</p>;
  }
  const daySlots = byDay.find(([k]) => k === day)?.[1] ?? [];

  return (
    <form onSubmit={onSubmit} className="stack">
      <input type="hidden" name="listingId" value={listingId} />
      <input type="hidden" name="start" value={picked ?? ""} />
      <div className="days" role="group" aria-label="Giorno">
        {byDay.map(([k, list]) => (
          <button
            key={k}
            type="button"
            className="day-btn"
            aria-pressed={k === day}
            onClick={() => {
              setDay(k);
              setPicked(null);
            }}
          >
            <div style={{ fontWeight: 700 }}>{dayLabel.format(new Date(list[0]))}</div>
            <div className="xs">{list.length} fasce</div>
          </button>
        ))}
      </div>
      <div className="slots" role="group" aria-label="Orario">
        {daySlots.map((s) => (
          <button key={s} type="button" className="slot-btn" aria-pressed={picked === s} onClick={() => setPicked(s)}>
            {timeLabel.format(new Date(s))}
          </button>
        ))}
      </div>
      {state?.error && <div className="alert alert-danger">{state.error}</div>}
      <button className="btn btn-primary" type="submit" disabled={!picked || pending}>
        {pending ? "Prenotazione…" : picked ? `Prenota ${fullLabel.format(new Date(picked))}` : "Scegli un orario"}
      </button>
      {!loggedIn && <p className="xs muted" style={{ margin: 0 }}>Ti chiederemo di accedere per confermare.</p>}
    </form>
  );
}
