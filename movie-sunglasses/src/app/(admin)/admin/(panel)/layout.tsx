import Link from "next/link";
import { requireAdmin } from "@/lib/auth-server";
import { ENTITIES } from "@/lib/admin/entities";
import { storageMode } from "@/lib/store";
import { logoutAction } from "./actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin", robots: { index: false, follow: false } };

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const s = await requireAdmin();
  const groups = ["Contenuti", "Commercio", "Editoriale", "Sistema"] as const;
  const readOnlyProd = storageMode() === "file" && !!process.env.VERCEL;
  return (
    <div className="min-h-screen bg-[#f4f2ec] lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="bg-ink p-5 text-sm text-white/80 lg:sticky lg:top-0 lg:h-screen lg:overflow-auto">
        <Link href="/admin" className="font-display text-2xl font-semibold text-white">Screen<span className="text-champagne">shade</span> <span className="text-xs font-sans font-normal text-white/50">admin</span></Link>
        <nav aria-label="Admin" className="mt-6 space-y-5">
          <ul><li><Link className="block rounded px-2 py-1.5 hover:bg-white/10" href="/admin">Dashboard</Link></li><li><Link className="block rounded px-2 py-1.5 hover:bg-white/10" href="/admin/stats">Statistiche e ricavi</Link></li></ul>
          {groups.map((g) => (
            <div key={g}><p className="eyebrow !text-champagne px-2">{g}</p>
              <ul className="mt-1">
                {ENTITIES.filter((e) => e.group === g).map((e) => <li key={e.key}><Link className="block rounded px-2 py-1.5 hover:bg-white/10" href={`/admin/${e.key}`}>{e.label}</Link></li>)}
                {g === "Editoriale" && <li><Link className="block rounded px-2 py-1.5 hover:bg-white/10" href="/admin/keywords">Keyword & cluster (CSV)</Link></li>}
              </ul></div>
          ))}
        </nav>
        <div className="mt-8 border-t border-white/10 pt-4 text-xs"><p className="truncate text-white/50">{s.sub}</p><Link className="mt-2 block underline" href="/" target="_blank">Apri il sito ↗</Link>
          <form action={logoutAction}><button className="mt-3 rounded-full border border-white/30 px-4 py-1.5 text-white hover:bg-white/10">Esci</button></form></div>
      </aside>
      <div className="min-w-0 p-5 sm:p-8">
        {readOnlyProd && <p role="alert" className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800"><strong>Attenzione:</strong> su Vercel il file system è in sola lettura. Configura Supabase (SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY) per salvare le modifiche.</p>}
        {children}
      </div>
    </div>
  );
}
