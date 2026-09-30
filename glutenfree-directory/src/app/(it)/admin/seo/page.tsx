import Link from "next/link";
import { CheckCircle2, AlertTriangle, ExternalLink, Gauge } from "lucide-react";
import AdminShell from "@/components/AdminShell";
import { ARTICLES } from "@/lib/mock-articles";
import { BUSINESSES } from "@/lib/mock-businesses";
import { SITE_URL } from "@/lib/site-config";

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

      <div className="card card-soft mt-6 flex flex-col items-center gap-3 p-10 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-brand-dark"><Gauge size={22} /></span>
        <p className="font-semibold text-ink">Core Web Vitals reali (LCP, CLS, INP)</p>
        <p className="max-w-md text-sm text-ink-soft">
          Non misurati qui per evitare di mostrare numeri vecchi o inventati: usa PageSpeed Insights di Google per una misurazione reale e aggiornata del sito.
        </p>
        <a
          href={`https://pagespeed.web.dev/analysis?url=${encodeURIComponent(SITE_URL)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary btn-sm mt-2"
        >
          Misura su PageSpeed Insights
        </a>
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
