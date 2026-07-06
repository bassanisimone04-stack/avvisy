import StatusBreakdown from "@/components/StatusBreakdown";
import { getAppointmentsByOrg } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

const ORG_ID = "org-1";

export default function ReportPage() {
  const appts = getAppointmentsByOrg(ORG_ID);

  const total = appts.length;
  const completati = appts.filter((a) => a.status === "completato").length;
  const annullati = appts.filter((a) => a.status === "annullato").length;
  const rate = total ? Math.round((completati / total) * 100) : 0;

  const byDay = new Map<string, number>();
  for (const a of appts) byDay.set(a.date, (byDay.get(a.date) ?? 0) + 1);
  const days = [...byDay.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  const max = Math.max(1, ...days.map(([, n]) => n));

  const stats = [
    { label: "Appuntamenti", value: String(total) },
    { label: "Completati", value: String(completati) },
    { label: "Annullati", value: String(annullati) },
    { label: "Tasso completamento", value: `${rate}%` },
  ];

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">Report</h1>
      <p className="mt-1 text-sm text-muted">
        Andamento degli appuntamenti della tua struttura.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-line bg-card p-4"
          >
            <p className="font-display text-2xl font-bold">{s.value}</p>
            <p className="mt-1 text-xs text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      <section className="mt-8 rounded-xl border border-line bg-card p-5">
        <h2 className="text-lg font-bold">Appuntamenti per giorno</h2>
        <div className="mt-5 flex items-end gap-4" style={{ height: 180 }}>
          {days.map(([date, n]) => (
            <div
              key={date}
              className="flex flex-1 flex-col items-center gap-2"
            >
              <span className="font-mono text-sm font-semibold">{n}</span>
              <div
                className="w-full rounded-t-md bg-brand"
                style={{ height: `${(n / max) * 140}px` }}
              />
              <span className="text-center text-xs capitalize text-muted">
                {formatDate(date)}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <StatusBreakdown appointments={appts} />
      </section>
    </>
  );
}
