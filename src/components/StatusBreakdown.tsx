import type { Appointment, AppointmentStatus } from "@/lib/types";
import { appointmentStatusLabel } from "@/lib/utils";

/** Colori pieni per le barre (distinti e leggibili, coerenti coi badge). */
const barColor: Record<AppointmentStatus, string> = {
  confermato: "#0e7a68",
  "check-in": "#c9760a",
  "in-corso": "#0284c7",
  completato: "#78716c",
  annullato: "#dc2626",
};

const order: AppointmentStatus[] = [
  "confermato",
  "check-in",
  "in-corso",
  "completato",
  "annullato",
];

export default function StatusBreakdown({
  appointments,
}: {
  appointments: Appointment[];
}) {
  const counts = order.map((status) => ({
    status,
    n: appointments.filter((a) => a.status === status).length,
  }));
  const max = Math.max(1, ...counts.map((c) => c.n));

  return (
    <div className="rounded-xl border border-line bg-card p-5">
      <h2 className="text-lg font-bold">Appuntamenti di oggi per stato</h2>
      <dl className="mt-4 flex flex-col gap-3">
        {counts.map(({ status, n }) => (
          <div key={status} className="flex items-center gap-3">
            <dt className="w-24 shrink-0 text-sm text-muted">
              {appointmentStatusLabel[status]}
            </dt>
            <dd className="flex flex-1 items-center gap-2">
              <div
                className="h-3 rounded-full transition-all"
                style={{
                  width: `${(n / max) * 100}%`,
                  minWidth: n > 0 ? "0.75rem" : "0",
                  backgroundColor: barColor[status],
                }}
                aria-hidden
              />
              <span className="font-mono text-sm font-semibold tabular-nums">
                {n}
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
