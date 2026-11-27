import { requireAdmin } from "@/features/admin/auth";
import { AdminFrame } from "@/features/admin/AdminFrame";
import { getDataset } from "@/db/repository";
import { effectiveVerification } from "@/db/queries";
import { integrations } from "@/config/site";

export const dynamic = "force-dynamic";
export default async function Dashboard() {
  const s = await requireAdmin();
  const d = await getDataset();
  const prices = d.restaurants.flatMap((r) => r.menus);
  const stalePrices = d.restaurants.filter((r) => effectiveVerification(r) === "stale").length;
  const db = integrations().supabaseService;
  const kpis: [string, string | number, string?][] = [
    ["Restaurants", d.restaurants.length], ["Verified", d.restaurants.filter((r) => effectiveVerification(r) === "verified").length], ["Countries", new Set(d.restaurants.map((r) => r.countrySlug)).size],
    ["Cities", new Set(d.restaurants.map((r) => r.citySlug)).size], ["Hotels", d.hotels.length], ["Experiences", d.experiences.length],
    ["Users", db ? "see Supabase" : "—", db ? undefined : "requires database"], ["Partners", db ? "see Supabase" : "—", db ? undefined : "requires database"],
    ["Subscription revenue", "—", integrations().stripe ? "Stripe test mode" : "Stripe not configured"], ["Affiliate clicks", db ? "see audit" : "—", db ? undefined : "requires database"],
    ["Pending claims", db ? "see Supabase" : "—", db ? undefined : "requires database"], ["Stale records", stalePrices], ["Missing prices", prices.filter((m) => m.status === "missing").length], ["Pending verification", d.restaurants.filter((r) => r.verificationStatus === "pending").length],
  ];
  return (
    <AdminFrame title="Dashboard" user={s.name}>
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{kpis.map(([k, v, note]) => <li key={k} className="rounded-[12px] border border-line bg-white p-4"><p className="text-sm text-stone">{k}</p><p className="font-serif text-3xl">{v}</p>{note && <p className="text-xs text-stone">{note}</p>}</li>)}</ul>
      <h2 className="mt-10 font-serif text-xl">Modules</h2>
      <p className="mt-1 text-sm text-stone">Editing modules write through Supabase with RLS and audit logging. Without a database they are read-only on the bundled data.</p>
      <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
        {["Restaurants ✓", "Menus & pricing ✓", "CSV import (dry-run, duplicates) ✓", "Demo data replacement ✓", "Audit logs ✓", "Chefs · Destinations · Awards", "Hotels · Experiences · Gift cards", "Users · Partners · Claims", "Subscriptions · Affiliates", "Articles · Media library · Newsletter", "Translations (needs-review flag)", "SEO overrides · Redirects (301/410)"].map((m) => <li key={m} className="rounded-[8px] border border-line bg-white px-3 py-2">{m}{!m.includes("✓") && <span className="block text-xs text-stone">Data model + RLS ready; edit UI uses Supabase Studio until built</span>}</li>)}
      </ul>
    </AdminFrame>
  );
}
