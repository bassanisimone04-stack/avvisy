import { requireAdmin } from "@/lib/auth-server";
import { listAll } from "@/lib/store";

const q = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
export const dynamic = "force-dynamic";

/** CSV for bulk analysis in Semrush/Ahrefs: re-import with the Volume/KD columns filled. */
export async function GET() {
  await requireAdmin();
  const rows = await listAll("keywords");
  const csv = ["Keyword,Volume,KD,Intent,Target URL,Cluster", ...rows.map((k) => [q(k.term), k.volume ?? "", k.difficulty ?? "", q(k.intent), q(k.targetUrl), q(k.cluster)].join(","))].join("\n");
  return new Response(csv, { headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": 'attachment; filename="screenshade-keywords.csv"', "cache-control": "no-store" } });
}
