import Link from "next/link";
import { requireAdmin } from "@/features/admin/auth";
import { AdminFrame } from "@/features/admin/AdminFrame";
import { getDataset } from "@/db/repository";
import { effectiveVerification } from "@/db/queries";
import { completeness } from "@/lib/completeness";
import { StatusPill } from "@/components/ui/ui";

export const dynamic = "force-dynamic";
export default async function AdminRestaurants({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const s = await requireAdmin();
  const d = await getDataset();
  const sp = await searchParams;
  const rows = d.restaurants.map((r) => ({ r, v: effectiveVerification(r), c: completeness(r) })).filter((x) => !sp.status || x.v === sp.status);
  return (
    <AdminFrame title="Restaurants" user={s.name}>
      <nav className="mb-4 flex gap-2 text-sm">{["", "verified", "stale", "pending"].map((st) => <Link key={st} href={`/admin/restaurants/${st ? `?status=${st}` : ""}`} className={`rounded-full border px-3 py-1 ${sp.status === st || (!sp.status && !st) ? "border-carmine bg-blush" : "border-line bg-white"}`}>{st || "all"}</Link>)}</nav>
      <div className="overflow-x-auto rounded-[12px] border border-line bg-white">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-line text-left text-stone"><th scope="col" className="p-3">Name</th><th scope="col">City</th><th scope="col">Workflow</th><th scope="col">Verification</th><th scope="col">Completeness</th><th scope="col">Demo</th></tr></thead>
          <tbody>{rows.map(({ r, v, c }) => (
            <tr key={r.slug} className="border-b border-line last:border-0">
              <th scope="row" className="p-3 text-left font-medium"><Link href={`/en/restaurant/${r.slug}/`} className="hover:underline">{r.name}</Link></th>
              <td>{r.citySlug}</td><td>{r.publicationStatus}</td>
              <td><StatusPill status={v as "verified"} label={`${v}${r.lastVerifiedAt ? ` · ${r.lastVerifiedAt}` : ""}`} /></td>
              <td title={c.missing.join(", ")}><span className="tabular-nums">{c.score}%</span> <span className="text-xs text-stone">{c.missing.slice(0, 2).join(", ")}{c.missing.length > 2 ? "…" : ""}</span></td>
              <td>{r.isDemo ? "yes" : "no"}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </AdminFrame>
  );
}
