import "server-only";
import { listAll, upsert, remove } from "../store";
import { slugify } from "../format";
import type { CollectionName, Collections } from "../types";
import { ENTITIES, type EntityConfig, type Field } from "./entities";
import { validatePhoto } from "../photos";

type Row = Record<string, unknown>;
export type SaveResult = { ok: true; id: string } | { ok: false; error: string };

const rand = () => Math.random().toString(36).slice(2, 7);
const isHttps = (u: string) => { try { return new URL(u).protocol === "https:"; } catch { return false; } };
const isHttp = (u: string) => { try { return /^https?:$/.test(new URL(u).protocol); } catch { return false; } };

async function parseField(f: Field, form: FormData): Promise<{ value?: unknown; error?: string }> {
  const raw = f.type === "refs" ? form.getAll(f.name).map(String) : String(form.get(f.name) ?? "").trim();
  const empty = Array.isArray(raw) ? raw.length === 0 : raw === "";
  if (f.type === "boolean") return { value: form.has(f.name) };
  if (empty && f.required && f.type !== "refs") return { error: `«${f.label}» è obbligatorio.` };
  switch (f.type) {
    case "text": case "textarea": return { value: empty ? "" : raw };
    case "url": {
      if (empty) return { value: undefined };
      const s = raw as string;
      if (!isHttp(s.replace("{q}", "x"))) return { error: `«${f.label}» deve essere un URL valido (https://…).` };
      return { value: s };
    }
    case "number": {
      if (empty) return { value: f.nullable ? null : undefined };
      const n = Number(String(raw).replace(",", "."));
      if (!Number.isFinite(n)) return { error: `«${f.label}» deve essere un numero.` };
      return { value: n };
    }
    case "date": {
      if (empty) return { value: f.nullable ? null : undefined };
      if (!/^\d{4}-\d{2}-\d{2}$/.test(raw as string)) return { error: `«${f.label}» deve essere una data (AAAA-MM-GG).` };
      return { value: raw };
    }
    case "datetime": {
      if (empty) return { value: null };
      const d = new Date((raw as string) + (String(raw).length === 16 ? ":00Z" : ""));
      if (isNaN(d.getTime())) return { error: `«${f.label}» non è una data valida.` };
      return { value: d.toISOString() };
    }
    case "select": {
      if (empty) return { value: undefined };
      if (!f.options!.some(([v]) => v === raw)) return { error: `Valore non valido per «${f.label}».` };
      return { value: raw };
    }
    case "tags": return { value: empty ? [] : (raw as string).split(/[,\n]/).map((s) => s.trim().toLowerCase()).filter(Boolean) };
    case "pairs": {
      const [k1, k2] = f.pairKeys!;
      const out: Row[] = [];
      for (const line of (raw as string).split(/\r?\n/).map((l) => l.trim()).filter(Boolean)) {
        const i = line.indexOf("|");
        if (i < 0) return { error: `«${f.label}»: ogni riga deve avere il formato «A | B» (manca «|» in: ${line.slice(0, 40)}).` };
        out.push({ [k1]: line.slice(0, i).trim(), [k2]: line.slice(i + 1).trim() });
      }
      return { value: out };
    }
    case "ref": {
      if (empty) return { value: undefined };
      const rows = await listAll(f.ref!);
      if (!rows.some((r) => (r as { id: string }).id === raw)) return { error: `«${f.label}»: elemento inesistente.` };
      return { value: raw };
    }
    case "refs": {
      const ids = raw as string[];
      const rows = new Set((await listAll(f.ref!)).map((r) => (r as { id: string }).id));
      if (ids.some((i) => !rows.has(i))) return { error: `«${f.label}»: elemento inesistente.` };
      return { value: ids };
    }
  }
}

export async function saveEntity(cfg: EntityConfig, id: string | null, form: FormData): Promise<SaveResult> {
  const existing = id ? ((await listAll(cfg.key)).find((r) => (r as { id: string }).id === id) as Row | undefined) : undefined;
  if (id && !existing) return { ok: false, error: "Elemento non trovato." };
  const data: Row = {};
  for (const f of cfg.fields) {
    const r = await parseField(f, form);
    if (r.error) return { ok: false, error: r.error };
    if (r.value !== undefined) data[f.name] = r.value;
    else if (f.type !== "boolean") data[f.name] = undefined;
  }
  const merged: Row = { ...(existing ?? {}), ...Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined)) };
  for (const f of cfg.fields) if (data[f.name] === undefined && f.type !== "boolean" && !f.nullable) delete merged[f.name];
  const err = await validateAndFinalize(cfg, merged, existing);
  if (err) return { ok: false, error: err };

  const rowId = String(merged.id);
  // slug change -> automatic 301 redirect
  if (existing && cfg.publicPath && existing.slug && existing.slug !== merged.slug) {
    const from = cfg.publicPath(existing), to = cfg.publicPath(merged);
    await upsert("redirects", { id: `rd_${slugify(from)}`, from, to, permanent: true });
    const loops = (await listAll("redirects")).filter((r) => r.from === to);
    for (const l of loops) await remove("redirects", l.id);
  }
  await upsert(cfg.key, merged as unknown as Collections[typeof cfg.key]);
  return { ok: true, id: rowId };
}

async function validateAndFinalize(cfg: EntityConfig, d: Row, existing?: Row): Promise<string | null> {
  const k = cfg.key;
  const today = new Date().toISOString().slice(0, 10);
  if (cfg.fields.some((f) => f.name === "slug")) {
    const base = String(d.slug || d.title || d.name || "");
    d.slug = slugify(base);
    if (!d.slug) return "Impossibile generare lo slug.";
    const clash = (await listAll(k)).find((r) => (r as unknown as Row).slug === d.slug && (r as { id: string }).id !== existing?.id);
    if (clash) return `Lo slug «${d.slug}» è già usato.`;
    d.id = existing?.id ?? d.slug;
  } else if (!existing) {
    d.id = k === "keywords" ? `kw-${slugify(String(d.term))}` : k === "redirects" ? `rd_${slugify(String(d.from))}` : `${k.slice(0, 3)}_${Date.now().toString(36)}${rand()}`;
    if ((await listAll(k)).some((r) => (r as { id: string }).id === d.id)) return "Esiste già un elemento identico.";
  }
  switch (k) {
    case "movies": if (Number(d.year) < 1880 || Number(d.year) > 2100) return "Anno non valido."; break;
    case "models": d.styleTags = ((d.styleTags as string[]) ?? []); d.specs = d.specs ?? []; break;
    case "appearances": {
      const ch = (await listAll("characters")).find((c) => c.id === d.characterId);
      if (!ch || ch.movieId !== d.movieId || ch.actorId !== d.actorId) return "Il personaggio scelto non appartiene a quel film e a quell'attore (crealo prima in «Personaggi»).";
      break;
    }
    case "alternatives": if (d.originalModelId === d.alternativeModelId) return "L'alternativa deve essere un modello diverso dall'originale."; break;
    case "offers": {
      if (!isHttps(String(d.url))) return "L'URL dell'offerta deve iniziare con https://";
      if (d.price != null && Number(d.price) < 0) return "Il prezzo non può essere negativo.";
      if (d.price == null && d.availability !== "unknown") d.availability = "unknown";
      break;
    }
    case "photos": { const err = validatePhoto(d as never); if (err) return err; break; }
    case "evidence": d.checkedAt = d.checkedAt ?? today; d.stance = d.stance ?? "supports"; break;
    case "merchants":
      if (d.affiliateParams && !/^[A-Za-z0-9_.=&%~-]*$/.test(String(d.affiliateParams))) return "I parametri affiliato contengono caratteri non ammessi.";
      if (d.searchUrlTemplate && !isHttps(String(d.searchUrlTemplate).replace("{q}", "x"))) return "Il template di ricerca deve essere https.";
      break;
    case "redirects": {
      const f = String(d.from), t = String(d.to);
      if (!f.startsWith("/") || !t.startsWith("/") || f.startsWith("//") || t.startsWith("//")) return "I percorsi devono iniziare con un solo «/».";
      if (f === t) return "Origine e destinazione sono uguali.";
      if (f.startsWith("/admin")) return "Non si può creare un redirect da /admin.";
      break;
    }
    case "revenue": if (Number(d.amount) < 0) return "Importo negativo non ammesso."; if (String(d.periodEnd) < String(d.periodStart)) return "La data finale precede quella iniziale."; break;
    case "keywords": d.term = String(d.term).toLowerCase(); break;
    case "articles": {
      d.updatedAt = new Date().toISOString().slice(0, 10);
      d.createdAt = existing?.createdAt ?? d.updatedAt;
      d.aiGenerated = existing?.aiGenerated ?? false;
      d.faq = d.faq ?? []; d.sources = d.sources ?? []; d.modelIds = d.modelIds ?? []; d.movieIds = d.movieIds ?? [];
      d.metaTitle = d.metaTitle ?? ""; d.metaDescription = d.metaDescription ?? ""; d.excerpt = d.excerpt ?? ""; d.answer = d.answer ?? ""; d.body = d.body ?? ""; d.targetKeyword = d.targetKeyword ?? ""; d.searchIntent = d.searchIntent ?? "";
      for (const s of d.sources as { url: string }[]) if (!isHttp(s.url)) return `Fonte con URL non valido: ${s.url}`;
      if (d.status === "published" || d.status === "scheduled") {
        const problems: string[] = [];
        if (!d.reviewed) problems.push("manca la revisione umana (spunta «Revisione umana completata»)");
        if (!String(d.answer).trim()) problems.push("manca la risposta immediata");
        if (!String(d.body).trim()) problems.push("manca il corpo");
        if (!String(d.metaTitle).trim() || String(d.metaTitle).length > 70) problems.push("meta title mancante o oltre 70 caratteri");
        if (!String(d.metaDescription).trim() || String(d.metaDescription).length > 170) problems.push("meta description mancante o oltre 170 caratteri");
        if ((d.sources as unknown[]).length === 0) problems.push("serve almeno una fonte");
        if (d.status === "scheduled" && !d.publishAt) problems.push("manca la data di pubblicazione programmata");
        if (problems.length) return "Non si può pubblicare: " + problems.join("; ") + ".";
      }
      if (d.status !== "scheduled") d.publishAt = d.status === "published" ? (existing?.publishAt ?? null) : null;
      break;
    }
  }
  return null;
}

export async function deleteEntity(cfg: EntityConfig, id: string): Promise<string | null> {
  for (const [coll, field, isArray] of cfg.uses ?? []) {
    const n = (await listAll(coll)).filter((r) => { const v = (r as unknown as Row)[field]; return isArray ? Array.isArray(v) && v.includes(id) : v === id; }).length;
    if (n) return `Non eliminabile: è usato da ${n} elementi in «${ENTITIES.find((e) => e.key === coll)?.label ?? coll}». Rimuovi prima quei collegamenti.`;
  }
  await remove(cfg.key, id);
  return null;
}

export const findEntity = (key: string): EntityConfig | undefined => ENTITIES.find((e) => e.key === (key as CollectionName));
