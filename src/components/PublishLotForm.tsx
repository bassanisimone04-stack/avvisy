"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { notify } from "./Toaster";
import LotImage from "./LotImage";
import { IconCheck, IconDoc, IconPlus } from "./icons";
import { categories } from "@/lib/mock-data";
import { commission, commissionRateLabel, formatEuro } from "@/lib/format";
import { useStore } from "@/lib/store";
import { createLot, type NewLotInput } from "@/lib/services";
import { uploadLotImages } from "@/lib/supabase/storage";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { DeliveryMode, MerchandiseCondition } from "@/lib/types";

const conditions: MerchandiseCondition[] = [
  "Nuovo", "Come nuovo", "Usato - buono", "Usato - funzionante", "Ricondizionato", "Fine serie",
];
const units = ["pz", "kg", "bancali", "bobine", "kit", "mq", "m", "campate", "litri"];
const regions = ["Lombardia", "Veneto", "Emilia-Romagna", "Piemonte", "Toscana", "Abruzzo", "Campania"];
const deliveries: DeliveryMode[] = ["Spedizione e ritiro", "Spedizione", "Ritiro in sede"];

const steps = [
  "Categoria e titolo",
  "Descrizione",
  "Quantità e prezzo",
  "Consegna e località",
  "Revisione",
];

type Form = {
  title: string;
  category: string;
  subcategory: string;
  condition: MerchandiseCondition;
  shortDescription: string;
  description: string;
  certifications: string;
  quantity: string;
  unit: string;
  minQuantity: string;
  unitPrice: string;
  negotiable: boolean;
  delivery: DeliveryMode;
  region: string;
  province: string;
};

const initialForm: Form = {
  title: "",
  category: categories[0].slug,
  subcategory: categories[0].subcategories[0],
  condition: "Nuovo",
  shortDescription: "",
  description: "",
  certifications: "",
  quantity: "",
  unit: "pz",
  minQuantity: "",
  unitPrice: "",
  negotiable: true,
  delivery: "Spedizione e ritiro",
  region: "Lombardia",
  province: "",
};

export default function PublishLotForm() {
  const { dispatch, currentSellerId } = useStore();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>(initialForm);
  const [errors, setErrors] = useState<string[]>([]);
  const [published, setPublished] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const dirty = useRef(false);

  function set<K extends keyof Form>(key: K, value: Form[K]) {
    dirty.current = true;
    setForm((f) => ({ ...f, [key]: value }));
  }

  // Salvataggio automatico simulato.
  useEffect(() => {
    if (!dirty.current) return;
    const t = setTimeout(() => {
      setSavedAt(new Date().toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" }));
      dirty.current = false;
    }, 1500);
    return () => clearTimeout(t);
  }, [form]);

  function validateStep(s: number): string[] {
    const e: string[] = [];
    if (s === 0) {
      if (!form.title.trim()) e.push("Inserisci un titolo per il lotto.");
      if (!form.category) e.push("Seleziona una categoria.");
    }
    if (s === 1) {
      if (!form.shortDescription.trim()) e.push("Inserisci una descrizione breve.");
      if (!form.description.trim()) e.push("Inserisci la descrizione completa.");
    }
    if (s === 2) {
      const q = Number(form.quantity);
      const mq = Number(form.minQuantity);
      const p = Number(form.unitPrice);
      if (!q || q <= 0) e.push("Inserisci una quantità disponibile valida.");
      if (!mq || mq <= 0) e.push("Inserisci una quantità minima valida.");
      if (mq > q) e.push("La quantità minima non può superare la disponibilità.");
      if (!p || p <= 0) e.push("Inserisci un prezzo unitario maggiore di zero.");
    }
    if (s === 3) {
      if (!form.province.trim()) e.push("Inserisci la provincia.");
    }
    return e;
  }

  function next() {
    const e = validateStep(step);
    if (e.length) {
      setErrors(e);
      return;
    }
    setErrors([]);
    setStep((s) => Math.min(steps.length - 1, s + 1));
  }
  function back() {
    setErrors([]);
    setStep((s) => Math.max(0, s - 1));
  }

  async function publish() {
    // Rivalida tutti gli step.
    for (let s = 0; s <= 3; s++) {
      const e = validateStep(s);
      if (e.length) {
        setErrors(e);
        setStep(s);
        return;
      }
    }
    // Carica le foto reali su Storage (se presenti e se collegato).
    let imageUrls: string[] = [];
    if (files.length && isSupabaseConfigured) {
      setUploading(true);
      try {
        imageUrls = await uploadLotImages(files);
      } catch {
        /* fallback: resta l'illustrazione */
      }
      setUploading(false);
    }
    const input: NewLotInput = {
      imageUrls,
      title: form.title.trim(),
      category: form.category,
      subcategory: form.subcategory,
      shortDescription: form.shortDescription.trim(),
      description: form.description.trim(),
      quantity: Number(form.quantity),
      unit: form.unit,
      minQuantity: Number(form.minQuantity),
      unitPrice: Number(form.unitPrice),
      negotiable: form.negotiable,
      condition: form.condition,
      region: form.region,
      province: form.province.trim(),
      delivery: form.delivery,
      documents: ["Scheda tecnica"],
      certifications: form.certifications
        ? form.certifications.split(",").map((c) => c.trim()).filter(Boolean)
        : [],
      sellerId: currentSellerId,
    };
    dispatch({ type: "PUBLISH_LOT", lot: createLot(input) });
    notify("Lotto inviato: ora è in revisione.");
    setPublished(true);
  }

  if (published) {
    return (
      <div className="card card-soft p-8 text-center">
        <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-signal-soft text-signal">
          <IconCheck width={32} height={32} />
        </span>
        <h2 className="mt-4 text-2xl font-bold text-ink">Lotto inviato in revisione</h2>
        <p className="mx-auto mt-2 max-w-md text-muted">
          Il lotto <strong>{form.title}</strong> è stato creato con stato <strong>“In revisione”</strong>.
          Dopo l&apos;approvazione (simulata) sarà visibile nel marketplace.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/venditore/lotti" className="btn btn-primary">Vai a I miei lotti</Link>
          <button
            onClick={() => { setForm(initialForm); setStep(0); setPublished(false); }}
            className="btn btn-outline"
          >
            Pubblica un altro lotto
          </button>
        </div>
      </div>
    );
  }

  const pct = Math.round(((step + 1) / steps.length) * 100);
  const priceTotal = Number(form.quantity || 0) * Number(form.unitPrice || 0);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div>
        {/* Barra avanzamento */}
        <div className="mb-5">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-semibold text-ink">Passo {step + 1} di {steps.length}: {steps[step]}</span>
            <span className="text-muted">{pct}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-surface-2">
            <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${pct}%` }} />
          </div>
          <ol className="mt-3 hidden flex-wrap gap-2 sm:flex">
            {steps.map((s, i) => (
              <li
                key={s}
                className={`chip ${i === step ? "bg-brand-soft text-brand-dark" : i < step ? "bg-surface text-brand-dark" : "bg-surface-2 text-muted"}`}
              >
                {i < step ? "✓ " : `${i + 1}. `}{s}
              </li>
            ))}
          </ol>
        </div>

        <div className="card p-6">
          {errors.length > 0 && (
            <ul className="mb-4 space-y-1 rounded-lg bg-danger-soft p-3 text-sm text-danger" role="alert">
              {errors.map((e) => <li key={e}>• {e}</li>)}
            </ul>
          )}

          {step === 0 && (
            <div className="space-y-4">
              <div>
                <label className="field-label">Titolo del lotto *</label>
                <input value={form.title} onChange={(e) => set("title", e.target.value)} className="field" placeholder="Es. Cuscinetti a sfera SKF — stock nuovo" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="field-label">Categoria *</label>
                  <select
                    value={form.category}
                    onChange={(e) => {
                      const cat = categories.find((c) => c.slug === e.target.value)!;
                      set("category", e.target.value);
                      set("subcategory", cat.subcategories[0]);
                    }}
                    className="field"
                  >
                    {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="field-label">Sottocategoria</label>
                  <select value={form.subcategory} onChange={(e) => set("subcategory", e.target.value)} className="field">
                    {categories.find((c) => c.slug === form.category)?.subcategories.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="field-label">Condizione</label>
                <select value={form.condition} onChange={(e) => set("condition", e.target.value as MerchandiseCondition)} className="field">
                  {conditions.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="field-label">Descrizione breve *</label>
                <input value={form.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} className="field" placeholder="Una riga di sintesi mostrata nelle card" maxLength={90} />
              </div>
              <div>
                <label className="field-label">Descrizione completa *</label>
                <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={5} className="field resize-none" placeholder="Specifiche, provenienza, motivo della vendita, documentazione…" />
              </div>
              <div>
                <label className="field-label">Certificazioni (separate da virgola)</label>
                <input value={form.certifications} onChange={(e) => set("certifications", e.target.value)} className="field" placeholder="CE, ISO 9001, RoHS" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="field-label">Quantità disponibile *</label>
                <input type="number" min={1} value={form.quantity} onChange={(e) => set("quantity", e.target.value)} className="field" />
              </div>
              <div>
                <label className="field-label">Unità di misura</label>
                <select value={form.unit} onChange={(e) => set("unit", e.target.value)} className="field">
                  {units.map((u) => <option key={u}>{u}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label">Quantità minima *</label>
                <input type="number" min={1} value={form.minQuantity} onChange={(e) => set("minQuantity", e.target.value)} className="field" />
              </div>
              <div>
                <label className="field-label">Prezzo unitario (€) *</label>
                <input type="number" min={0} step="0.01" value={form.unitPrice} onChange={(e) => set("unitPrice", e.target.value)} className="field" />
              </div>
              <div className="sm:col-span-2">
                <label className="field-label">Prezzo totale del lotto</label>
                <input readOnly value={formatEuro(priceTotal)} className="field bg-surface-2" />
              </div>
              <label className="flex items-center gap-2 text-sm text-ink-soft sm:col-span-3">
                <input type="checkbox" checked={form.negotiable} onChange={(e) => set("negotiable", e.target.checked)} className="h-4 w-4 accent-[var(--s-brand)]" />
                Accetta offerte (prezzo negoziabile)
              </label>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="field-label">Modalità di consegna</label>
                <div className="grid gap-2 sm:grid-cols-3">
                  {deliveries.map((d) => (
                    <label key={d} className={`flex cursor-pointer items-center gap-2 rounded-lg border p-2.5 text-sm ${form.delivery === d ? "border-brand bg-brand-soft/50" : "border-line hover:bg-surface-2"}`}>
                      <input type="radio" name="delivery" checked={form.delivery === d} onChange={() => set("delivery", d)} className="h-4 w-4 accent-[var(--s-brand)]" />
                      {d}
                    </label>
                  ))}
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="field-label">Regione</label>
                  <select value={form.region} onChange={(e) => set("region", e.target.value)} className="field">
                    {regions.map((r) => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="field-label">Provincia *</label>
                  <input value={form.province} onChange={(e) => set("province", e.target.value)} className="field" placeholder="Brescia" />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-line-strong p-6 text-center transition-colors hover:border-brand hover:bg-brand-soft/20">
                    <IconPlus className="text-muted" />
                    <p className="mt-2 text-sm font-medium text-ink">Carica immagini</p>
                    <p className="text-xs text-muted">JPG o PNG {isSupabaseConfigured ? "(caricamento reale)" : "(simulato in demo)"}</p>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => setFiles(Array.from(e.target.files ?? []).slice(0, 4))}
                    />
                  </label>
                  {files.length > 0 && (
                    <div className="mt-2 grid grid-cols-4 gap-2">
                      {files.map((f, i) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img key={i} src={URL.createObjectURL(f)} alt="" className="aspect-square w-full rounded-md object-cover" />
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-line-strong p-6 text-center">
                  <IconDoc className="text-muted" />
                  <p className="mt-2 text-sm font-medium text-ink">Carica documenti</p>
                  <p className="text-xs text-muted">Schede tecniche, certificati (simulato)</p>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <p className="text-sm text-muted">Controlla l&apos;anteprima e conferma la pubblicazione.</p>
              <dl className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
                {[
                  ["Titolo", form.title || "—"],
                  ["Categoria", categories.find((c) => c.slug === form.category)?.name ?? "—"],
                  ["Condizione", form.condition],
                  ["Quantità", `${form.quantity || 0} ${form.unit} (min ${form.minQuantity || 0})`],
                  ["Prezzo unitario", formatEuro(Number(form.unitPrice || 0))],
                  ["Valore totale", formatEuro(priceTotal)],
                  ["Consegna", form.delivery],
                  ["Località", `${form.province || "—"}, ${form.region}`],
                ].map(([k, v]) => (
                  <div key={k} className="bg-surface px-4 py-2.5">
                    <dt className="text-xs text-muted">{k}</dt>
                    <dd className="font-semibold text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="rounded-lg bg-signal-soft p-3 text-sm text-signal">
                Alla conferma il lotto sarà impostato su <strong>“In revisione”</strong> prima della pubblicazione.
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
            <button onClick={back} disabled={step === 0} className="btn btn-ghost btn-sm disabled:opacity-40">
              Indietro
            </button>
            {step < steps.length - 1 ? (
              <button onClick={next} className="btn btn-primary btn-sm">Continua</button>
            ) : (
              <button onClick={publish} disabled={uploading} className="btn btn-primary btn-sm disabled:opacity-60">
                {uploading ? "Caricamento foto…" : "Pubblica lotto"}
              </button>
            )}
          </div>
        </div>

        <p className="mt-3 text-center text-xs text-muted">
          {savedAt ? `Bozza salvata automaticamente alle ${savedAt}` : "Salvataggio automatico attivo (simulato)"}
        </p>
      </div>

      {/* Anteprima */}
      <aside className="lg:sticky lg:top-20 lg:self-start">
        <p className="mb-2 text-sm font-semibold text-ink">Anteprima annuncio</p>
        <div className="card card-soft overflow-hidden">
          {files.length > 0 ? (
            <div className="aspect-[4/3] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={URL.createObjectURL(files[0])} alt="" className="h-full w-full object-cover" />
            </div>
          ) : (
            <LotImage category={form.category} seed={3} />
          )}
          <div className="p-4">
            <span className="chip bg-surface-2 text-ink-soft">{categories.find((c) => c.slug === form.category)?.name}</span>
            <h3 className="mt-2 text-sm font-semibold text-ink">{form.title || "Titolo del lotto"}</h3>
            <p className="mt-1 text-xs text-muted">{form.province || "Località"}, {form.region}</p>
            <div className="mt-3 flex items-end justify-between">
              <div>
                <p className="text-xs text-muted">Prezzo unitario</p>
                <p className="font-bold text-ink">{formatEuro(Number(form.unitPrice || 0))}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted">Totale</p>
                <p className="font-bold text-brand-dark">{formatEuro(priceTotal, true)}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="card mt-3 p-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">Commissione stimata ({commissionRateLabel()})</span>
            <span className="font-semibold text-ink">{formatEuro(commission(priceTotal))}</span>
          </div>
          <div className="mt-1 flex justify-between">
            <span className="font-semibold text-ink">Incasso netto</span>
            <span className="font-bold text-brand-dark">{formatEuro(priceTotal - commission(priceTotal))}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
