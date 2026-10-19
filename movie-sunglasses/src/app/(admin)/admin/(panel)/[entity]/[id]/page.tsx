import Link from "next/link";
import { notFound } from "next/navigation";
import { listAll } from "@/lib/store";
import { entityByKey, rowLabel } from "@/lib/admin/entities";
import { serializeValues, refOptions } from "@/lib/admin/form-helpers";
import { EntityForm } from "@/components/admin/entity-form";
import { saveEntityAction } from "../../actions";
import { redirect } from "next/navigation";

type Row = Record<string, unknown>;

const DEFAULTS: Record<string, Row> = {
  evidence: { stance: "supports", checkedAt: new Date().toISOString().slice(0, 10) }, offers: { currency: "USD", availability: "unknown", lastChecked: new Date().toISOString().slice(0, 10) },
  merchants: { active: true }, redirects: { permanent: true }, revenue: { kind: "reported" }, models: { status: "unknown" }, movies: { kind: "film" }, keywords: {},
};

export default async function EditEntity({ params }: { params: Promise<{ entity: string; id: string }> }) {
  const { entity, id } = await params;
  if (entity === "articles") redirect(`/admin/articles/${id}`);
  const cfg = entityByKey(entity);
  if (!cfg) notFound();
  const isNew = id === "new";
  const row = isNew ? undefined : ((await listAll(cfg.key)) as unknown as Row[]).find((r) => r.id === id);
  if (!isNew && !row) notFound();
  if (isNew && cfg.noCreate) notFound();
  return (
    <div className="max-w-3xl">
      <p className="text-sm"><Link className="underline" href={`/admin/${cfg.key}`}>← {cfg.label}</Link></p>
      <h1 className="mt-2 font-display text-4xl font-semibold">{isNew ? `Nuovo: ${cfg.singular}` : rowLabel(cfg.key, row!)}</h1>
      {cfg.help && <p className="mt-2 text-sm text-slate">{cfg.help}</p>}
      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
        <EntityForm fields={cfg.fields} values={serializeValues(cfg.fields, row, DEFAULTS[cfg.key] ?? {})} refs={await refOptions(cfg.fields)} action={saveEntityAction.bind(null, cfg.key, isNew ? null : id)} submitLabel={isNew ? "Crea" : "Salva modifiche"} />
      </div>
    </div>
  );
}
