import { Eye, Users, MousePointerClick, Clock } from "lucide-react";
import AdminShell from "@/components/AdminShell";

const STATS = [
  { label: "Visite mensili", value: "184.320", icon: Eye, trend: "+12,4%" },
  { label: "Utenti unici", value: "96.740", icon: Users, trend: "+8,1%" },
  { label: "Tasso di click su directory", value: "27,6%", icon: MousePointerClick, trend: "+3,2%" },
  { label: "Tempo medio sulla pagina", value: "3m 42s", icon: Clock, trend: "+0,4%" },
];

const TOP_PAGES = [
  { path: "/directory?citta=milano", views: 18420 },
  { path: "/blog/celiachia-cos-e-sintomi-e-come-si-diagnostica", views: 15230 },
  { path: "/", views: 42910 },
  { path: "/directory/osteria-senza-confini-milano", views: 9870 },
  { path: "/prodotti", views: 7620 },
];

export default function AdminAnalytics() {
  const max = Math.max(...TOP_PAGES.map((p) => p.views));
  return (
    <AdminShell>
      <h1 className="text-2xl font-bold text-ink">Analytics</h1>
      <p className="mt-1 text-ink-soft">Panoramica del traffico degli ultimi 30 giorni</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="card card-soft p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand-dark"><s.icon size={18} /></span>
            <p className="mt-3 text-2xl font-bold text-ink">{s.value}</p>
            <p className="text-sm text-muted">{s.label}</p>
            <p className="mt-1 text-xs font-medium text-brand-dark">{s.trend} rispetto al mese scorso</p>
          </div>
        ))}
      </div>

      <div className="card card-soft mt-6 p-5">
        <h2 className="mb-4 font-semibold text-ink">Pagine più visitate</h2>
        <div className="space-y-3">
          {TOP_PAGES.map((p) => (
            <div key={p.path}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="truncate text-ink-soft">{p.path}</span>
                <span className="font-medium text-ink">{p.views.toLocaleString("it-IT")}</span>
              </div>
              <div className="h-2 rounded-full bg-surface-2">
                <div className="h-2 rounded-full bg-brand" style={{ width: `${(p.views / max) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
