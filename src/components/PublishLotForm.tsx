"use client";

import Link from "next/link";
import { useState } from "react";
import { notify } from "./Toaster";
import { IconCheck, IconDoc, IconPlus } from "./icons";
import { categories } from "@/lib/mock-data";
import { commission, commissionRateLabel, formatEuro } from "@/lib/format";

const conditions = [
  "Nuovo",
  "Come nuovo",
  "Usato - buono",
  "Usato - funzionante",
  "Ricondizionato",
  "Fine serie",
];
const units = ["pz", "kg", "bancali", "bobine", "kit", "mq", "campate", "litri"];

export default function PublishLotForm() {
  const [qty, setQty] = useState(100);
  const [price, setPrice] = useState(10);
  const [published, setPublished] = useState(false);

  const total = qty * price;
  const fee = commission(total);

  if (published) {
    return (
      <div className="card card-soft p-8 text-center">
        <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft text-brand-dark">
          <IconCheck width={32} height={32} />
        </span>
        <h2 className="mt-4 text-2xl font-bold text-ink">Lotto pubblicato</h2>
        <p className="mx-auto mt-2 max-w-md text-muted">
          Il tuo lotto è ora visibile nel marketplace. Riceverai una notifica
          alla prima offerta o richiesta di informazioni.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/venditore/lotti" className="btn btn-primary">
            Vai a I miei lotti
          </Link>
          <button
            onClick={() => setPublished(false)}
            className="btn btn-outline"
          >
            Pubblica un altro lotto
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setPublished(true);
        notify("Lotto pubblicato nel marketplace.");
      }}
      className="grid gap-6 lg:grid-cols-[1fr_320px]"
    >
      <div className="space-y-6">
        <Card title="Informazioni principali">
          <div>
            <label className="field-label">Titolo del lotto</label>
            <input required className="field" placeholder="Es. Cuscinetti a sfera SKF — stock nuovo" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label">Categoria</label>
              <select className="field" required>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label">Condizione</label>
              <select className="field" required>
                {conditions.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="field-label">Descrizione tecnica</label>
            <textarea
              required
              rows={4}
              className="field resize-none"
              placeholder="Specifiche, provenienza, motivo della vendita, documentazione…"
            />
          </div>
        </Card>

        <Card title="Quantità e prezzo">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="field-label">Quantità disponibile</label>
              <input
                type="number"
                min={1}
                value={qty}
                onChange={(e) => setQty(Number(e.target.value) || 0)}
                className="field"
              />
            </div>
            <div>
              <label className="field-label">Unità di misura</label>
              <select className="field">
                {units.map((u) => (
                  <option key={u}>{u}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label">Quantità minima</label>
              <input type="number" min={1} defaultValue={10} className="field" />
            </div>
            <div>
              <label className="field-label">Prezzo unitario (€)</label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value) || 0)}
                className="field"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="field-label">Prezzo totale del lotto</label>
              <input readOnly value={formatEuro(total)} className="field bg-surface-2" />
            </div>
          </div>
        </Card>

        <Card title="Località e logistica">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label">Città</label>
              <input className="field" placeholder="Brescia" />
            </div>
            <div>
              <label className="field-label">Regione</label>
              <select className="field">
                {["Lombardia","Veneto","Emilia-Romagna","Piemonte","Toscana","Abruzzo","Campania"].map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm text-ink-soft">
              <input type="checkbox" defaultChecked className="h-4 w-4 accent-[var(--s-brand)]" /> Spedizione disponibile
            </label>
            <label className="flex items-center gap-2 text-sm text-ink-soft">
              <input type="checkbox" defaultChecked className="h-4 w-4 accent-[var(--s-brand)]" /> Ritiro in sede
            </label>
          </div>
          <div>
            <label className="field-label">Modalità di vendita</label>
            <div className="grid gap-2 sm:grid-cols-3">
              {["Acquisto immediato", "Solo negoziabile", "Immediato o offerta"].map((m, i) => (
                <label key={m} className="flex cursor-pointer items-center gap-2 rounded-lg border border-line p-2.5 text-sm hover:bg-surface-2">
                  <input type="radio" name="mode" defaultChecked={i === 2} className="h-4 w-4 accent-[var(--s-brand)]" />
                  {m}
                </label>
              ))}
            </div>
          </div>
        </Card>

        <Card title="Immagini e documenti">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-line-strong p-6 text-center">
              <IconPlus className="text-muted" />
              <p className="mt-2 text-sm font-medium text-ink">Carica immagini</p>
              <p className="text-xs text-muted">JPG o PNG (simulato)</p>
            </div>
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-line-strong p-6 text-center">
              <IconDoc className="text-muted" />
              <p className="mt-2 text-sm font-medium text-ink">Carica documenti</p>
              <p className="text-xs text-muted">Schede tecniche, certificati (simulato)</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Riepilogo laterale */}
      <aside className="lg:sticky lg:top-20 lg:self-start">
        <div className="card card-soft p-5">
          <h3 className="text-sm font-bold text-ink">Riepilogo pubblicazione</h3>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Valore del lotto</dt>
              <dd className="font-semibold text-ink">{formatEuro(total)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Commissione stimata ({commissionRateLabel()})</dt>
              <dd className="font-semibold text-ink">{formatEuro(fee)}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-2">
              <dt className="font-semibold text-ink">Incasso netto stimato</dt>
              <dd className="text-base font-bold text-brand-dark">
                {formatEuro(total - fee)}
              </dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-muted">
            La commissione viene trattenuta solo a vendita conclusa. La
            pubblicazione è gratuita.
          </p>
          <button type="submit" className="btn btn-primary btn-block mt-5">
            Pubblica lotto
          </button>
        </div>
      </aside>
    </form>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card">
      <div className="border-b border-line px-5 py-3.5">
        <h2 className="text-sm font-bold text-ink">{title}</h2>
      </div>
      <div className="space-y-4 p-5">{children}</div>
    </section>
  );
}
