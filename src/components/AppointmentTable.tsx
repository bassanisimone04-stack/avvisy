import type { Appointment } from "@/lib/types";
import { getServiceById } from "@/lib/mock-data";
import {
  appointmentStatusClass,
  appointmentStatusLabel,
  cn,
  formatDate,
} from "@/lib/utils";

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

export default function AppointmentTable({
  appointments,
}: {
  appointments: Appointment[];
}) {
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
            </li>
          );
        })}
      </ul>
    </>
  );
}
