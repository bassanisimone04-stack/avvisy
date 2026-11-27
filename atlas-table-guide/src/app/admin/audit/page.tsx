import { requireAdmin } from "@/features/admin/auth";
import { AdminFrame } from "@/features/admin/AdminFrame";
import { supabaseService } from "@/db/supabase";

export const dynamic = "force-dynamic";
export default async function AdminAudit() {
  const s = await requireAdmin("audit:read");
  const sb = supabaseService();
  const rows = sb ? (await sb.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(100)).data ?? [] : null;
  return (
    <AdminFrame title="Audit log" user={s.name}>
      {!rows ? <p className="text-sm text-stone">Audit logs are stored in the append-only <code>audit_logs</code> table. Database not configured on this deployment.</p> : (
        <table className="w-full rounded-[12px] border border-line bg-white text-sm"><thead><tr className="text-left text-stone"><th scope="col" className="p-3">When</th><th scope="col">Actor</th><th scope="col">Action</th><th scope="col">Entity</th></tr></thead>
          <tbody>{rows.map((r: { id: number; created_at: string; actor_role: string; action: string; entity_type: string; entity_id: string | null }) => <tr key={r.id} className="border-t border-line"><td className="p-3">{r.created_at}</td><td>{r.actor_role}</td><td>{r.action}</td><td>{r.entity_type} {r.entity_id}</td></tr>)}</tbody></table>
      )}
    </AdminFrame>
  );
}
