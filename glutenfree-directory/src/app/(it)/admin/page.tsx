import { Store, Newspaper, ShieldCheck, Star, Clock3 } from "lucide-react";
import AdminShell from "@/components/AdminShell";
import { BUSINESSES } from "@/lib/mock-businesses";
import { ARTICLES } from "@/lib/mock-articles";
import { formatDate } from "@/lib/format";

const STATS = [
  { label: "Attività pubblicate", value: BUSINESSES.length, icon: Store },
  { label: "Articoli pubblicati", value: ARTICLES.length, icon: Newspaper },
  { label: "Certificate AIC", value: BUSINESSES.filter((b) => b.aicCertified).length, icon: ShieldCheck },
  { label: "Recensioni totali", value: BUSINESSES.reduce((s, b) => s + b.reviewCount, 0), icon: Star },
];

const RECENT_BUSINESSES = [...BUSINESSES]
  .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  .slice(0, 5);

export default function AdminDashboard() {
  return (
    <AdminShell>
      <h1 className="text-2xl font-bold text-ink">Panoramica</h1>
      <p className="mt-1 text-ink-soft">Bentornato, ecco lo stato della piattaforma oggi.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="card card-soft p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand-dark"><s.icon size={18} /></span>
            <p className="mt-3 text-2xl font-bold text-ink">{s.value}</p>
            <p className="text-sm text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 card card-soft p-5">
        <h2 className="mb-4 flex items-center gap-2 font-semibold text-ink"><Clock3 size={16} className="text-brand" /> Ultime schede verificate</h2>
        <ul className="space-y-3">
          {RECENT_BUSINESSES.map((b) => (
            <li key={b.id} className="flex items-center justify-between text-sm">
              <p className="text-ink-soft">{b.name} — {b.city}</p>
              <p className="text-xs text-muted">{formatDate(b.createdAt, "it")}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-muted">
          Per il traffico reale del sito (visite, pagine più viste) vedi la sezione Analytics, collegata a Vercel Web Analytics.
        </p>
      </div>
    </AdminShell>
  );
}
