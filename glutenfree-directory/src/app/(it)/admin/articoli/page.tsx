"use client";

import { useRef, useState } from "react";
import { Plus, Pencil, Trash2, Sparkles, Upload, Download } from "lucide-react";
import AdminShell from "@/components/AdminShell";
import { ARTICLES, BLOG_CATEGORIES } from "@/lib/mock-articles";
import { formatDateIt, slugify } from "@/lib/format";
import type { Article, BlogCategory } from "@/lib/types";

const AI_SUGGESTIONS = [
  "10 domande da fare al ristorante quando sei celiaco",
  "Farina di grano saraceno vs farina di riso: quale scegliere",
  "Celiachia e gravidanza: cosa sapere",
  "I migliori mercatini gluten free d'Italia nel 2026",
];

const CSV_COLUMNS = ["Titolo", "Categoria", "Autore", "Pubblicato il", "Tag"];

function toCsv(rows: Article[]): string {
  const lines = rows.map((a) => [
    a.title,
    a.category,
    a.author,
    a.publishedAt,
    a.tags.join(" "),
  ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","));
  return [CSV_COLUMNS.join(","), ...lines].join("\n");
}

function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (ch === '"') inQuotes = false;
      else cur += ch;
    } else if (ch === '"') inQuotes = true;
    else if (ch === ",") { cells.push(cur); cur = ""; }
    else cur += ch;
  }
  cells.push(cur);
  return cells.map((c) => c.trim());
}

function resolveCategory(label: string): BlogCategory {
  const found = BLOG_CATEGORIES.find((c) => c.toLowerCase() === label.toLowerCase());
  return found ?? "News";
}

function makeArticleFromCsv(cells: string[]): Article {
  const [title, categoryLabel, author, publishedAt, tagsRaw] = cells;
  const id = `imp-${Date.now()}-${Math.round(Math.random() * 1e5)}`;
  const safeTitle = title || "Nuovo articolo";
  return {
    id,
    slug: slugify(safeTitle || id),
    title: safeTitle,
    metaTitle: safeTitle,
    metaDescription: "",
    category: resolveCategory(categoryLabel ?? ""),
    excerpt: "",
    coverSeed: Math.floor(Math.random() * 900) + 100,
    author: author || "Redazione",
    authorRole: "",
    authorAvatarSeed: 300,
    publishedAt: publishedAt || new Date().toISOString().slice(0, 10),
    updatedAt: publishedAt || new Date().toISOString().slice(0, 10),
    readingTime: 2,
    headings: [],
    contentHtml: "",
    keyTakeaways: [],
    faqs: [],
    tags: (tagsRaw || "").split(/\s+/).filter(Boolean),
    comments: [],
  };
}

export default function AdminArticles() {
  const [rows, setRows] = useState(ARTICLES);
  const [importMsg, setImportMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function remove(id: string) {
    setRows((r) => r.filter((a) => a.id !== id));
  }

  function exportCsv() {
    const csv = toCsv(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `glutenfree-directory-articoli-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "");
      const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
      if (lines.length <= 1) {
        setImportMsg("Nessuna riga da importare trovata nel file.");
        return;
      }
      const imported = lines.slice(1).map((l) => makeArticleFromCsv(parseCsvLine(l)));
      setRows((r) => [...imported, ...r]);
      setImportMsg(`Importati ${imported.length} articoli come bozza.`);
    };
    reader.readAsText(file);
  }

  return (
    <AdminShell>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Gestione articoli</h1>
          <p className="mt-1 text-ink-soft">{rows.length} articoli pubblicati</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input ref={fileInputRef} type="file" accept=".csv,text/csv" onChange={handleImportFile} className="hidden" />
          <button type="button" onClick={() => fileInputRef.current?.click()} className="btn btn-outline btn-sm"><Upload size={14} /> Import CSV</button>
          <button type="button" onClick={exportCsv} className="btn btn-outline btn-sm"><Download size={14} /> Esporta dati</button>
          <button type="button" className="btn btn-primary btn-sm"><Plus size={14} /> Nuovo articolo</button>
        </div>
      </div>

      {importMsg && (
        <div className="card card-soft mt-4 flex items-center justify-between gap-3 border border-brand/30 bg-brand-soft px-4 py-2.5 text-sm text-brand-dark">
          <span>{importMsg}</span>
          <button type="button" onClick={() => setImportMsg(null)} className="text-xs font-semibold underline">Chiudi</button>
        </div>
      )}

      <div className="card card-soft mt-5 p-5">
        <h2 className="mb-3 flex items-center gap-2 font-semibold text-ink"><Sparkles size={16} className="text-brand" /> Suggerimenti AI per nuovi articoli</h2>
        <div className="flex flex-wrap gap-2">
          {AI_SUGGESTIONS.map((s) => <span key={s} className="chip chip-brand">{s}</span>)}
        </div>
      </div>

      <div className="card card-soft mt-5 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Titolo</th>
              <th className="px-4 py-3">Categoria</th>
              <th className="px-4 py-3">Autore</th>
              <th className="px-4 py-3">Pubblicato</th>
              <th className="px-4 py-3 text-right">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((a) => (
              <tr key={a.id}>
                <td className="max-w-xs truncate px-4 py-3 font-medium text-ink">{a.title}</td>
                <td className="px-4 py-3"><span className="chip chip-neutral">{a.category}</span></td>
                <td className="px-4 py-3 text-ink-soft">{a.author}</td>
                <td className="px-4 py-3 text-ink-soft">{formatDateIt(a.publishedAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1.5">
                    <button type="button" aria-label="Modifica" className="btn btn-ghost btn-sm !px-2"><Pencil size={14} /></button>
                    <button type="button" aria-label="Elimina" onClick={() => remove(a.id)} className="btn btn-ghost btn-sm !px-2 text-danger"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
