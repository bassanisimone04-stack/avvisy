import type { Appointment } from "@/lib/types";
import { getServiceById } from "@/lib/mock-data";
import {
  appointmentStatusClass,
  appointmentStatusLabel,
  cn,
  formatDate,
} from "@/lib/utils";

const RESCHEDULE_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
];

type Actions = {
  onCancel?: (id: string) => void;
  onReschedule?: (id: string, time: string) => void;
};

function StatusBadge({ status }: { status: Appointment["status"] }) {
  return (
    <span
      className={cn(
        "inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        appointmentStatusClass[status]
      )}
    >
      {appointmentStatusLabel[status]}
    </span>
  );
}

function RowActions({
  apt,
  onCancel,
  onReschedule,
}: { apt: Appointment } & Actions) {
  const disabled = apt.status === "annullato" || apt.status === "completato";
  const slots = RESCHEDULE_SLOTS.includes(apt.time)
    ? RESCHEDULE_SLOTS
    : [apt.time, ...RESCHEDULE_SLOTS];

  return (
    <div className="flex items-center gap-2">
      {onReschedule && (
        <label className="sr-only" htmlFor={`resched-${apt.id}`}>
          Sposta orario di {apt.customerName}
        </label>
      )}
      {onReschedule && (
        <select
          id={`resched-${apt.id}`}
          value={apt.time}
          disabled={disabled}
          onChange={(e) => onReschedule(apt.id, e.target.value)}
          className="rounded-lg border border-line bg-card px-2 py-1.5 font-mono text-sm outline-none transition-colors focus:border-brand disabled:opacity-40"
        >
          {slots.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      )}
      {onCancel && (
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            if (confirm(`Annullare l'appuntamento di ${apt.customerName}?`)) {
              onCancel(apt.id);
            }
          }}
          className="rounded-full border border-line px-3 py-1.5 text-sm font-semibold text-ink transition-colors hover:border-red-500 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-40"
        >
          Annulla
        </button>
      )}
    </div>
  );
}

export default function AppointmentTable({
  appointments,
  onCancel,
  onReschedule,
}: {
  appointments: Appointment[];
} & Actions) {
  const hasActions = Boolean(onCancel || onReschedule);

  if (appointments.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-line bg-card p-8 text-center text-sm text-muted">
        Nessun appuntamento in vista. Condividi la tua pagina pubblica per
        ricevere le prime prenotazioni.
      </div>
    );
  }

  return (
    <>
      {/* Tabella (desktop) */}
      <div className="hidden overflow-hidden rounded-xl border border-line bg-card md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-canvas text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Orario</th>
              <th className="px-4 py-3 font-semibold">Cliente</th>
              <th className="px-4 py-3 font-semibold">Servizio</th>
              <th className="px-4 py-3 font-semibold">Ticket</th>
              <th className="px-4 py-3 font-semibold">Stato</th>
              {hasActions && (
                <th className="px-4 py-3 text-right font-semibold">Azioni</th>
              )}
            </tr>
          </thead>
          <tbody>
            {appointments.map((apt) => {
              const service = getServiceById(apt.serviceId);
              return (
                <tr key={apt.id} className="border-b border-line last:border-0">
                  <td className="whitespace-nowrap px-4 py-3 font-mono">
                    <span className="capitalize">{formatDate(apt.date)}</span>{" "}
                    · {apt.time}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{apt.customerName}</p>
                    <p className="font-mono text-xs text-muted">
                      {apt.customerPhone}
                    </p>
                  </td>
                  <td className="px-4 py-3">{service?.name ?? "—"}</td>
                  <td className="px-4 py-3 font-mono font-semibold">
                    {apt.ticket ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={apt.status} />
                  </td>
                  {hasActions && (
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        <RowActions
                          apt={apt}
                          onCancel={onCancel}
                          onReschedule={onReschedule}
                        />
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Card (mobile) */}
      <ul className="flex flex-col gap-3 md:hidden">
        {appointments.map((apt) => {
          const service = getServiceById(apt.serviceId);
          return (
            <li
              key={apt.id}
              className="rounded-xl border border-line bg-card p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-sm font-semibold">
                    <span className="capitalize">{formatDate(apt.date)}</span>{" "}
                    · {apt.time}
                  </p>
                  <p className="mt-1 font-medium">{apt.customerName}</p>
                  <p className="text-sm text-muted">{service?.name ?? "—"}</p>
                </div>
                <StatusBadge status={apt.status} />
              </div>
              {apt.ticket && (
                <p className="mt-2 font-mono text-xs text-muted">
                  Ticket {apt.ticket}
                </p>
              )}
              {hasActions && (
                <div className="mt-3 border-t border-line pt-3">
                  <RowActions
                    apt={apt}
                    onCancel={onCancel}
                    onReschedule={onReschedule}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}
