import { requireAdmin } from "@/features/admin/auth";
import { AdminFrame } from "@/features/admin/AdminFrame";
import { Importer } from "@/features/admin/Importer";
import { integrations } from "@/config/site";

export const dynamic = "force-dynamic";
export default async function AdminImport() {
  const s = await requireAdmin("import:run");
  return <AdminFrame title="CSV import" user={s.name}><Importer dbConfigured={integrations().supabaseService} /></AdminFrame>;
}
