import Link from "next/link";
import { BRAND } from "@/config/brand";
import { SITE, integrations } from "@/config/site";
import { logout } from "./actions";

const NAV = [["Dashboard", "/admin/"], ["Restaurants", "/admin/restaurants/"], ["Menus & pricing", "/admin/prices/"], ["Import / export", "/admin/import/"], ["Demo data", "/admin/demo/"], ["Audit log", "/admin/audit/"]] as const;

export function AdminFrame({ title, children, user }: { title: string; children: React.ReactNode; user: string }) {
  return (
    <div className="min-h-screen">
      <header className="on-dark bg-garnet text-ivory">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 py-3">
          <Link href="/admin/" className="font-serif tracking-[0.18em]">{BRAND.name} · ADMIN</Link>
          <form action={logout} className="flex items-center gap-3 text-sm"><span>{user}</span><button type="submit" className="min-h-9 rounded-[6px] border border-ivory/60 px-3">Sign out</button></form>
        </div>
      </header>
      {SITE.allowDemoData && <div role="status" className="bg-[#FBF1E2] px-6 py-2 text-center text-sm text-ink">Demo data is visible on this deployment (ALLOW_DEMO_DATA≠false). Use “Demo data” to archive it before launch.</div>}
      <div className="mx-auto grid max-w-[1400px] gap-8 px-6 py-8 lg:grid-cols-[220px_1fr]">
        <nav aria-label="Admin"><ul className="space-y-1">{NAV.map(([l, h]) => <li key={h}><Link href={h} className="block rounded-[8px] px-3 py-2 text-sm hover:bg-sand">{l}</Link></li>)}</ul>
          <p className="mt-6 px-3 text-xs text-stone">Database: {integrations().supabaseService ? "connected" : "not configured — read-only on bundled data"}</p></nav>
        <main id="main"><h1 className="mb-6 font-serif text-3xl">{title}</h1>{children}</main>
      </div>
    </div>
  );
}
