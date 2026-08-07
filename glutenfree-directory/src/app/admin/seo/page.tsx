import Link from "next/link";
import { CheckCircle2, AlertTriangle, ExternalLink, Gauge } from "lucide-react";
import AdminShell from "@/components/AdminShell";
import { ARTICLES } from "@/lib/mock-articles";
import { BUSINESSES } from "@/lib/mock-businesses";

const VITALS = [
  { label: "LCP (Largest Contentful Paint)", value: "1,4s", score: 96 },
  { label: "CLS (Cumulative Layout Shift)", value: "0,02", score: 99 },
  { label: "INP (Interaction to Next Paint)", value: "118ms", score: 94 },
];

const CHECKS = [
  { label: "Meta title impostato su tutte le pagine", ok: true },
  { label: "Meta description impostata su tutte le pagine", ok: true },
  { label: "Canonical URL presenti", ok: true },
  { label: "Sitemap.xml generata automaticamente", ok: true },
  { label: "Robots.txt configurato", ok: true },
  { label: `Schema.org LocalBusiness su ${BUSINESSES.length} schede attività`, ok: true },
  { label: `Schema.org Article + FAQPage su ${ARTICLES.length} articoli`, ok: true },
  { label: "5 attività senza descrizione estesa (min. 300 caratteri)", ok: false },
];

export default function AdminSeo() {
  return (
    <AdminShell>
      <h1 className="text-2xl font-bold text-ink">SEO Dashboard</h1>
      <p className="mt-1 text-ink-soft">Stato dell&apos;ottimizzazione SEO automatizzata della piattaforma</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {VITALS.map((v) => (
          <div key={v.label} className="card card-soft p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand-dark"><Gauge size={18} /></span>
            <p className="mt-3 text-2xl font-bold text-ink">{v.value}</p>
            <p className="text-sm text-muted">{v.label}</p>
            <p className="mt-1 text-xs font-medium text-brand-dark">Punteggio {v.score}/100</p>
          </div>
        ))}
      </div>

      <div className="card card-soft mt-6 p-5">
        <h2 className="mb-4 font-semibold text-ink">Controlli automatici</h2>
        <ul className="space-y-2.5">
          {CHECKS.map((c) => (
            <li key={c.label} className="flex items-center gap-2.5 text-sm">
              {c.ok ? <CheckCircle2 size={16} className="text-brand" /> : <AlertTriangle size={16} className="text-gold" />}
              <span className={c.ok ? "text-ink-soft" : "text-ink"}>{c.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/sitemap.xml" target="_blank" className="btn btn-outline btn-sm"><ExternalLink size={14} /> Visualizza sitemap.xml</Link>
        <Link href="/robots.txt" target="_blank" className="btn btn-outline btn-sm"><ExternalLink size={14} /> Visualizza robots.txt</Link>
      </div>
    </AdminShell>
  );
}
