"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { COOKIE } from "@/lib/auth";
import { requireAdmin } from "@/lib/auth-server";
import { getCatalog, buildCatalog } from "@/lib/catalog";
import { listAll, upsert, upsertMany } from "@/lib/store";
import { deleteEntity, findEntity, saveEntity } from "@/lib/admin/save";
import { aiConfigured, generateDraft } from "@/lib/ai";
import { applyLink, buildFacts, suggestMeta } from "@/lib/editorial";
import { clusterKeywords, keywordsFromCsv } from "@/lib/keywords";
import { keywordCandidates } from "@/lib/keyword-candidates";
import { slugify } from "@/lib/format";
import type { Article } from "@/lib/types";

export interface FormState { error: string }
const refresh = () => revalidatePath("/", "layout");

export async function logoutAction() {
  (await cookies()).set(COOKIE, "", { path: "/admin", maxAge: 0 });
  redirect("/admin/login");
}

export async function saveEntityAction(entity: string, id: string | null, _: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const cfg = findEntity(entity);
  if (!cfg) return { error: "Entità sconosciuta." };
  let res;
  try { res = await saveEntity(cfg, id, form); } catch (e) { return { error: (e as Error).message }; }
  if (!res.ok) return { error: res.error };
  refresh();
  redirect(entity === "articles" ? `/admin/articles/${res.id}?saved=1` : `/admin/${entity}?saved=1`);
}

export async function deleteEntityAction(entity: string, id: string) {
  await requireAdmin();
  const cfg = findEntity(entity);
  if (!cfg) redirect("/admin");
  let err: string | null = null;
  try { err = await deleteEntity(cfg, id); } catch (e) { err = (e as Error).message; }
  refresh();
  redirect(`/admin/${entity}?${err ? "error=" + encodeURIComponent(err) : "deleted=1"}`);
}

/* ---------- Article assistant ---------- */
async function loadArticle(id: string) {
  const a = (await listAll("articles")).find((x) => x.id === id);
  if (!a) redirect("/admin/articles");
  return a;
}
const back = (id: string, q: string) => redirect(`/admin/articles/${id}?${q}`);

export async function generateDraftAction(id: string) {
  await requireAdmin();
  const a = await loadArticle(id);
  if (!aiConfigured()) back(id, "error=" + encodeURIComponent("API AI non configurata: imposta AI_API_KEY nelle variabili d'ambiente."));
  const c = await getCatalog();
  const live = a.status === "published" || a.status === "scheduled";
  let msg = "";
  try {
    const d = await generateDraft({ title: a.title, keyword: a.targetKeyword, intent: a.searchIntent, facts: buildFacts(c, a), existingBody: a.status !== "brief" && a.body.length > 200 ? a.body : undefined });
    const target: Article = live
      ? { ...a, id: `${a.id}-refresh-${new Date().toISOString().slice(0, 10)}`, slug: `${a.slug}-refresh-${new Date().toISOString().slice(0, 10)}`, status: "draft", publishAt: null }
      : { ...a, status: "draft" };
    await upsert("articles", { ...target, answer: d.answer || target.answer, excerpt: d.excerpt || target.excerpt, body: d.body || target.body, faq: d.faq.length ? d.faq : target.faq,
      metaTitle: d.metaTitle || target.metaTitle, metaDescription: d.metaDescription || target.metaDescription, aiGenerated: true, reviewed: false, updatedAt: new Date().toISOString().slice(0, 10) });
    refresh();
    msg = live ? `ok=${encodeURIComponent("Aggiornamento generato come NUOVA bozza («" + target.slug + "»): l'articolo pubblicato non è stato modificato.")}` : `ok=${encodeURIComponent("Bozza generata. Rivedi, controlla le affermazioni segnalate e spunta la revisione prima di pubblicare.")}`;
    if (live) redirect(`/admin/articles/${target.id}?${msg}`);
  } catch (e) {
    if ((e as { digest?: string }).digest?.startsWith("NEXT_REDIRECT")) throw e;
    msg = "error=" + encodeURIComponent((e as Error).message);
  }
  back(id, msg);
}

export async function applyMetaAction(id: string, form: FormData) {
  await requireAdmin();
  const a = await loadArticle(id);
  const s = suggestMeta(a);
  const t = Number(form.get("title")), d = Number(form.get("desc"));
  await upsert("articles", { ...a, ...(Number.isInteger(t) && s.titles[t] ? { metaTitle: s.titles[t] } : {}), ...(Number.isInteger(d) && s.descriptions[d] ? { metaDescription: s.descriptions[d] } : {}), reviewed: false });
  refresh(); back(id, "ok=" + encodeURIComponent("Meta applicati. La revisione è stata azzerata: ricontrolla prima di pubblicare."));
}

export async function applyLinkAction(id: string, name: string, href: string) {
  await requireAdmin();
  const a = await loadArticle(id);
  if (!href.startsWith("/") || href.startsWith("//")) back(id, "error=Link non valido");
  await upsert("articles", { ...a, body: applyLink(a.body, name, href), reviewed: false });
  refresh(); back(id, "ok=" + encodeURIComponent(`Link a «${name}» inserito.`));
}

export async function applyModelsAction(id: string, form: FormData) {
  await requireAdmin();
  const a = await loadArticle(id);
  const add = form.getAll("model").map(String);
  const known = new Set((await listAll("models")).map((m) => m.id));
  await upsert("articles", { ...a, modelIds: [...new Set([...a.modelIds, ...add.filter((m) => known.has(m))])] });
  refresh(); back(id, "ok=" + encodeURIComponent("Prodotti collegati."));
}

export async function markForUpdateAction(id: string) {
  await requireAdmin();
  const a = await loadArticle(id);
  await upsert("articles", { ...a, status: "in_review", reviewed: false });
  refresh(); back(id, "ok=" + encodeURIComponent("Articolo spostato «In revisione» (non più visibile sul sito finché non lo ripubblichi)."));
}

/* ---------- Keywords ---------- */
export async function importKeywordsAction(_: { msg: string; error: boolean }, form: FormData) {
  await requireAdmin();
  const file = form.get("file");
  let text = String(form.get("csv") ?? "");
  if (file instanceof File && file.size > 0) { if (file.size > 2_000_000) return { msg: "File troppo grande (max 2 MB).", error: true }; text = await file.text(); }
  if (!text.trim()) return { msg: "Incolla un CSV o carica un file.", error: true };
  const source = String(form.get("source") || "import CSV").slice(0, 80);
  const { items, skipped } = keywordsFromCsv(text, source);
  if (!items.length) return { msg: "Nessuna keyword valida trovata (serve una colonna «Keyword»).", error: true };
  const existing = new Map((await listAll("keywords")).map((k) => [k.id, k]));
  await upsertMany("keywords", items.map((k) => ({ ...k, cluster: existing.get(k.id)?.cluster ?? "", articleId: existing.get(k.id)?.articleId })));
  refresh();
  return { msg: `Importate ${items.length} keyword${skipped ? ` (${skipped} righe scartate)` : ""}. Ora esegui il raggruppamento.`, error: false };
}

export async function clusterAction() {
  await requireAdmin();
  const kws = await listAll("keywords");
  const clusters = clusterKeywords(kws);
  const updated = [...clusters].flatMap(([label, items]) => items.map((k) => ({ ...k, cluster: label })));
  await upsertMany("keywords", updated);
  refresh();
  redirect(`/admin/keywords?ok=${encodeURIComponent(`${clusters.size} cluster creati da ${kws.length} keyword.`)}`);
}

export async function createBriefAction(cluster: string) {
  await requireAdmin();
  const kws = (await listAll("keywords")).filter((k) => k.cluster === cluster);
  if (!kws.length) redirect("/admin/keywords?error=Cluster+vuoto");
  const main = [...kws].sort((a, b) => (b.volume ?? -1) - (a.volume ?? -1))[0];
  const id = slugify(main.term);
  const existing = (await listAll("articles")).find((a) => a.id === id);
  if (!existing) {
    const today = new Date().toISOString().slice(0, 10);
    await upsert("articles", {
      id, slug: id, title: main.term.replace(/\b\w/g, (c) => c.toUpperCase()), metaTitle: "", metaDescription: "", excerpt: "", answer: "", faq: [], sources: [], modelIds: [], movieIds: [],
      category: "Guides", targetKeyword: main.term, searchIntent: main.intent || "Da verificare nella SERP", status: "brief", publishAt: null, createdAt: today, updatedAt: today, reviewed: false, aiGenerated: false,
      body: `## SEO brief\n\n**Keyword principale:** ${main.term}\n\n**Keyword correlate:**\n${kws.filter((k) => k.id !== main.id).map((k) => `- ${k.term}${k.volume != null ? ` (vol. ${k.volume})` : ""}`).join("\n") || "- —"}\n\n**Prima di scrivere:** verifica volumi e SERP; raccogli fonti per ogni affermazione; collega modelli e film nel pannello.`,
    });
  }
  await upsertMany("keywords", kws.map((k) => ({ ...k, articleId: id })));
  refresh();
  redirect(`/admin/articles/${id}?ok=${encodeURIComponent("Brief creato dal cluster.")}`);
}



export async function generateCandidatesAction() {
  await requireAdmin();
  const c = await getCatalog();
  const existing = await listAll("keywords");
  const byTerm = new Map(existing.map((k) => [k.term.toLowerCase().trim(), k]));
  const cands = keywordCandidates(c);
  // never overwrite keywords that already carry data; only add new terms and fill a missing target page
  const fresh = cands.filter((k) => !byTerm.has(k.term));
  const patch = cands.filter((k) => byTerm.get(k.term) && !byTerm.get(k.term)!.targetUrl).map((k) => ({ ...byTerm.get(k.term)!, targetUrl: k.targetUrl }));
  await upsertMany("keywords", [...fresh, ...patch]);
  refresh();
  redirect(`/admin/keywords?ok=${encodeURIComponent(`${fresh.length} keyword candidate aggiunte (senza volume) e ${patch.length} mappate a una pagina. Esporta il CSV e verifica i volumi prima di usarle.`)}`);
}

export interface OfferImportState { done: boolean; saved: number; rows: number; errors: { line: number; message: string }[]; dryRun: boolean }

export async function importOffersAction(_: OfferImportState, form: FormData): Promise<OfferImportState> {
  await requireAdmin();
  const { offersFromCsv } = await import("@/lib/offers-import");
  const file = form.get("file");
  let text = String(form.get("csv") ?? "");
  if (file instanceof File && file.size > 0) {
    if (file.size > 2_000_000) return { done: true, saved: 0, rows: 0, dryRun: false, errors: [{ line: 0, message: "File troppo grande (max 2 MB)." }] };
    text = await file.text();
  }
  const dryRun = form.get("dry") === "on";
  const [models, merchants] = await Promise.all([listAll("models"), listAll("merchants")]);
  const res = offersFromCsv(text, models, merchants);
  // all-or-nothing: a file with any error is not imported, so a feed never half-applies
  if (res.errors.length || dryRun || res.offers.length === 0) return { done: true, saved: 0, rows: res.rows, errors: res.errors, dryRun };
  await upsertMany("offers", res.offers);
  refresh();
  return { done: true, saved: res.offers.length, rows: res.rows, errors: [], dryRun: false };
}
