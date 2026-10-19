import "server-only";
import { listAll } from "../store";
import { rowLabel, type Field } from "./entities";

type Row = Record<string, unknown>;

export function serializeValues(fields: Field[], row: Row | undefined, defaults: Row = {}) {
  const out: Row = {};
  for (const f of fields) {
    const v = row ? row[f.name] : defaults[f.name];
    if (f.type === "tags") out[f.name] = ((v as string[]) ?? []).join(", ");
    else if (f.type === "pairs") { const [k1, k2] = f.pairKeys!; out[f.name] = ((v as Row[]) ?? []).map((p) => `${p[k1]} | ${p[k2]}`).join("\n"); }
    else if (f.type === "datetime") out[f.name] = typeof v === "string" ? v.slice(0, 16) : "";
    else out[f.name] = v ?? (f.type === "boolean" ? false : "");
  }
  return out;
}
export async function refOptions(fields: Field[]) {
  const refs: Record<string, [string, string][]> = {};
  for (const f of fields) if ((f.type === "ref" || f.type === "refs") && f.ref) refs[f.name] = ((await listAll(f.ref)) as unknown as Row[]).map((r) => [String(r.id), rowLabel(f.ref!, r)] as [string, string]).sort((a, b) => a[1].localeCompare(b[1]));
  return refs;
}

