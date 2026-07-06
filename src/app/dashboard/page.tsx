import Link from "next/link";
import AppointmentTable from "@/components/AppointmentTable";
import StatusBreakdown from "@/components/StatusBreakdown";
import { getAppointmentsByOrg, getQueueByOrg } from "@/lib/mock-data";

const ORG_ID = "org-1"; // CAF Navigli (mock: in futuro dall'autenticazione)
const TODAY = "2026-07-03";

export default function DashboardPage() {
  const appointments = getAppointmentsByOrg(ORG_ID);
  const today = appointments.filter((a) => a.date === TODAY);
  const queue = getQueueByOrg(ORG_ID);
  const waiting = queue.filter((q) => q.status !== "in-servizio").length;
  const serving = queue.find((q) => q.status === "in-servizio");

  const stats = [
    { label: "Appuntamenti oggi", value: String(today.length) },
    { label: "In coda ora", value: String(waiting) },
    { label: "In servizio", value: serving?.ticket ?? "—", mono: true },
    {
      label: "Completati oggi",
      value: String(today.filter((a) => a.status === "completato").length),
    },
  ];

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">Panoramica</h1>
      <p className="mt-1 text-sm text-muted">
        Venerdì 3 luglio · CAF Navigli
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-line bg-card p-4 shadow-soft"
          >
            <p
              className={
                stat.mono
                  ? "font-mono text-2xl font-bold text-signal"
                  : "font-display text-2xl font-bold"
              }
            >
              {stat.value}
            </p>
            <p className="mt-1 text-xs text-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      <section className="mt-8">
        <StatusBreakdown appointments={today} />
      </section>

      <section className="mt-8">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-lg font-bold">Appuntamenti di oggi</h2>
          <Link
            href="/dashboard/appointments"
            className="text-sm font-semibold text-brand-dark hover:underline"
          >
            Vedi tutti
          </Link>
        </div>
        <AppointmentTable appointments={today} />
      </section>

      <section className="mt-8 rounded-2xl border border-line bg-card p-5 shadow-soft">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold">Coda live</h2>
            <p className="text-sm text-muted">
              {waiting} persone in attesa
              {serving ? ` · in servizio ${serving.ticket}` : ""}.
            </p>
          </div>
          <Link
            href="/dashboard/queue"
            className="rounded-full bg-brand px-5 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            Gestisci la coda
          </Link>
        </div>
      </section>
    </>
  );
}
