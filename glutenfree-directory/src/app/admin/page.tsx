import { Store, Newspaper, Users, Star, TrendingUp, MessageSquareWarning } from "lucide-react";
import AdminShell from "@/components/AdminShell";
import { BUSINESSES } from "@/lib/mock-businesses";
import { ARTICLES } from "@/lib/mock-articles";

const STATS = [
  { label: "Attività pubblicate", value: BUSINESSES.length, icon: Store },
  { label: "Articoli pubblicati", value: ARTICLES.length, icon: Newspaper },
  { label: "Utenti registrati", value: "4.812", icon: Users },
  { label: "Recensioni totali", value: BUSINESSES.reduce((s, b) => s + b.reviewCount, 0), icon: Star },
];

const RECENT_ACTIVITY = [
  { text: "Nuova attività in attesa di verifica: 'Panificio Verde' — Bari", time: "2 ore fa" },
  { text: "Recensione segnalata su 'Pizzeria Vesuvio Gluten Free'", time: "5 ore fa" },
  { text: "Articolo pubblicato: 'Novità normative 2026'", time: "1 giorno fa" },
  { text: "Nuova iscrizione newsletter: +142 contatti questa settimana", time: "2 giorni fa" },
];

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

      <div className="mt-6 grid gap-5 lg:grid-cols-[2fr_1fr]">
        <div className="card card-soft p-5">
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-ink"><TrendingUp size={16} className="text-brand" /> Crescita ultimi 6 mesi</h2>
          <div className="flex h-48 items-end gap-3">
            {[38, 52, 47, 63, 71, 88].map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div className="w-full rounded-t-lg bg-brand" style={{ height: `${(v / 100) * 160}px` }} />
                <span className="text-xs text-muted">{["Feb", "Mar", "Apr", "Mag", "Giu", "Lug"][i]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card card-soft p-5">
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-ink"><MessageSquareWarning size={16} className="text-brand" /> Attività recente</h2>
          <ul className="space-y-3">
            {RECENT_ACTIVITY.map((a, i) => (
              <li key={i} className="text-sm">
                <p className="text-ink-soft">{a.text}</p>
                <p className="text-xs text-muted">{a.time}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AdminShell>
  );
}
