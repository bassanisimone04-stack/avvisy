"use client";

import { useRef, useState } from "react";
import { Upload, Download, Pencil, Trash2, Plus, BadgeCheck } from "lucide-react";
import AdminShell from "@/components/AdminShell";
import { BUSINESSES } from "@/lib/mock-businesses";
import { CATEGORIES, getCategoryInfo } from "@/lib/categories";
import { slugify } from "@/lib/format";
import type { Category, PriceRange } from "@/lib/types";

type Row = (typeof BUSINESSES)[number] & { status: "Pubblicata" | "In revisione" };

const CSV_COLUMNS = ["Nome", "Categoria", "Città", "Provincia", "Regione", "Voto", "Recensioni", "Fascia prezzo", "Certificato AIC", "Stato"];

function toCsv(rows: Row[]): string {
  const lines = rows.map((b) => [
    b.name,
    getCategoryInfo(b.category)?.label ?? b.category,
    b.city,
    b.province,
    b.region,
    b.rating,
    b.reviewCount,
    b.priceRange,
    b.aicCertified ? "Sì" : "No",
    b.status,
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

function resolveCategory(label: string): Category {
  const found = CATEGORIES.find(
    (c) => c.slug === label.toLowerCase() || c.label.toLowerCase() === label.toLowerCase()
  );
  return found?.slug ?? "ristorante";
}

function makeRowFromCsv(cells: string[]): Row {
  const [name, categoryLabel, city, province, region, ratingRaw] = cells;
  const category = resolveCategory(categoryLabel ?? "");
  const id = `imp-${Date.now()}-${Math.round(Math.random() * 1e5)}`;
  return {
    id,
    slug: slugify(name || id),
    name: name || "Nuova attività",
    category,
    region: region || "",
    province: province || "",
    provinceCode: (province || "").slice(0, 2).toUpperCase(),
    city: city || "",
    address: "",
    postalCode: "",
    lat: 0,
    lng: 0,
    phone: "",
    website: "",
    description: "",
    shortDescription: "",
    priceRange: "€€" as PriceRange,
    rating: Number(ratingRaw) || 4.5,
    reviewCount: 0,
    aicCertified: false,
    delivery: false,
    takeaway: false,
    openNow: false,
    hours: [],
    services: [],
    glutenFreeMenu: [],
    gallerySeeds: [1],
    reviews: [],
    faqs: [],
    createdAt: new Date().toISOString(),
    status: "In revisione",
  };
}

export default function AdminBusinesses() {
  const [rows, setRows] = useState<Row[]>(BUSINESSES.map((b) => ({ ...b, status: "Pubblicata" as const })));
  const [query, setQuery] = useState("");
  const [importMsg, setImportMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = rows.filter((b) => b.name.toLowerCase().includes(query.toLowerCase()) || b.city.toLowerCase().includes(query.toLowerCase()));

  function remove(id: string) {
    setRows((r) => r.filter((b) => b.id !== id));
  }

  function toggleStatus(id: string) {
    setRows((r) => r.map((b) => (b.id === id ? { ...b, status: b.status === "Pubblicata" ? "In revisione" : "Pubblicata" } : b)));
  }

  function exportCsv() {
    const csv = toCsv(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `glutenfree-directory-attivita-${new Date().toISOString().slice(0, 10)}.csv`;
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
      const dataLines = lines.slice(1);
      const imported = dataLines.map((l) => makeRowFromCsv(parseCsvLine(l))).filter((r) => r.name !== "Nuova attività" || r.city);
      setRows((r) => [...imported, ...r]);
      setImportMsg(`Importate ${imported.length} attività (in stato "In revisione").`);
    };
    reader.readAsText(file);
  }

  return (
    <AdminShell>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Gestione attività</h1>
          <p className="mt-1 text-ink-soft">{rows.length} attività nella directory</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input ref={fileInputRef} type="file" accept=".csv,text/csv" onChange={handleImportFile} className="hidden" />
          <button type="button" onClick={() => fileInputRef.current?.click()} className="btn btn-outline btn-sm"><Upload size={14} /> Import CSV</button>
          <button type="button" onClick={exportCsv} className="btn btn-outline btn-sm"><Download size={14} /> Esporta dati</button>
          <button type="button" className="btn btn-primary btn-sm"><Plus size={14} /> Nuova attività</button>
        </div>
      </div>

      {importMsg && (
        <div className="card card-soft mt-4 flex items-center justify-between gap-3 border border-brand/30 bg-brand-soft px-4 py-2.5 text-sm text-brand-dark">
          <span>{importMsg}</span>
          <button type="button" onClick={() => setImportMsg(null)} className="text-xs font-semibold underline">Chiudi</button>
        </div>
      )}

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cerca per nome o città…"
        className="field mt-5 max-w-sm"
      />

      <div className="card card-soft mt-4 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Categoria</th>
              <th className="px-4 py-3">Città</th>
              <th className="px-4 py-3">Voto</th>
              <th className="px-4 py-3">Stato</th>
              <th className="px-4 py-3 text-right">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {filtered.map((b) => (
              <tr key={b.id}>
                <td className="px-4 py-3 font-medium text-ink">
                  <span className="flex items-center gap-1.5">{b.name} {b.aicCertified && <BadgeCheck size={13} className="text-brand" />}</span>
                </td>
                <td className="px-4 py-3 text-ink-soft">{getCategoryInfo(b.category)?.label}</td>
                <td className="px-4 py-3 text-ink-soft">{b.city}</td>
                <td className="px-4 py-3 text-ink-soft">{b.rating}</td>
                <td className="px-4 py-3">
                  <button type="button" onClick={() => toggleStatus(b.id)} className={`chip ${b.status === "Pubblicata" ? "chip-brand" : "chip-gold"}`}>{b.status}</button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1.5">
                    <button type="button" aria-label="Modifica" className="btn btn-ghost btn-sm !px-2"><Pencil size={14} /></button>
                    <button type="button" aria-label="Elimina" onClick={() => remove(b.id)} className="btn btn-ghost btn-sm !px-2 text-danger"><Trash2 size={14} /></button>
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
