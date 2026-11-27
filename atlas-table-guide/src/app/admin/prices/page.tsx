import { requireAdmin } from "@/features/admin/auth";
import { AdminFrame } from "@/features/admin/AdminFrame";
import { getDataset } from "@/db/repository";
import { daysSince } from "@/lib/format";
import { SITE } from "@/config/site";
import { StatusPill } from "@/components/ui/ui";

export const dynamic = "force-dynamic";
export default async function AdminPrices() {
  const s = await requireAdmin("price:update");
  const d = await getDataset();
  const rows = d.restaurants.flatMap((r) => r.menus.map((m) => ({ r, m, age: daysSince(m.collectedAt) }))).filter((x) => x.m.status !== "verified" || (x.age ?? 9999) > SITE.staleAfterDays).sort((a, b) => (b.age ?? 9999) - (a.age ?? 9999));
  return (
    <AdminFrame title="Menus & pricing — needs attention" user={s.name}>
      <p className="mb-4 text-sm text-stone">Prices that are missing, estimated or older than {SITE.staleAfterDays} days. Updates append to price_history (never overwrite).</p>
      <div className="overflow-x-auto rounded-[12px] border border-line bg-white">
        <table className="w-full text-sm"><thead><tr className="border-b border-line text-left text-stone"><th scope="col" className="p-3">Restaurant</th><th scope="col">Menu</th><th scope="col">Amount</th><th scope="col">Status</th><th scope="col">Collected</th></tr></thead>
          <tbody>{rows.map(({ r, m, age }) => <tr key={m.id} className="border-b border-line last:border-0"><th scope="row" className="p-3 text-left font-medium">{r.name}</th><td>{m.name.en}</td><td>{m.amount != null ? `${m.amount} ${m.currency}` : "—"}</td><td><StatusPill status={m.status} label={m.status} /></td><td>{m.collectedAt ?? "—"}{age != null ? ` (${age} d)` : ""}</td></tr>)}</tbody></table>
      </div>
    </AdminFrame>
  );
}
