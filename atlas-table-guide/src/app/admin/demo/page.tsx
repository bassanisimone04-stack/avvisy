import { requireAdmin } from "@/features/admin/auth";
import { AdminFrame } from "@/features/admin/AdminFrame";
import { archiveDemo } from "@/features/admin/actions";
import { getDataset } from "@/db/repository";

export const dynamic = "force-dynamic";
export default async function AdminDemo() {
  const s = await requireAdmin("restaurant:publish");
  const d = await getDataset();
  const n = d.restaurants.filter((r) => r.isDemo).length + d.hotels.filter((h) => h.isDemo).length + d.experiences.filter((x) => x.isDemo).length + d.articles.filter((a) => a.isDemo).length;
  return (
    <AdminFrame title="Replace demo data" user={s.name}>
      <p className="max-w-2xl text-sm">{n} demo records are currently visible. Demo rows are flagged <code>is_demo=true</code>. Steps: (1) archive demo rows in the database, (2) set <code>ALLOW_DEMO_DATA=false</code> to hide the bundled seed, (3) import real data via CSV.</p>
      <form action={async () => { "use server"; await archiveDemo(); }} className="mt-4"><button type="submit" className="min-h-11 rounded-[8px] bg-carmine px-4 text-sm font-semibold text-white">Archive all demo rows in the database</button></form>
    </AdminFrame>
  );
}
