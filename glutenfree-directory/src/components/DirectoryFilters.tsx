"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { RotateCcw } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import { REGIONS } from "@/lib/regions";
import type { PriceRange } from "@/lib/types";

const PRICES: PriceRange[] = ["€", "€€", "€€€"];
const RATINGS = [4.5, 4, 3.5];

export default function DirectoryFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function update(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || value === "") params.delete(key);
    else params.set(key, value);
    if (key !== "page") params.delete("page");
    router.push(`/directory?${params.toString()}`, { scroll: false });
  }

  function toggle(key: string) {
    update(key, searchParams.get(key) === "1" ? null : "1");
  }

  function togglePrice(p: PriceRange) {
    const current = searchParams.get("prezzo")?.split(",").filter(Boolean) ?? [];
    const next = current.includes(p) ? current.filter((x) => x !== p) : [...current, p];
    update("prezzo", next.length ? next.join(",") : null);
  }

  const selectedPrices = searchParams.get("prezzo")?.split(",").filter(Boolean) ?? [];
  const regione = searchParams.get("regione") ?? "";
  const categoria = searchParams.get("categoria") ?? "";
  const valutazione = searchParams.get("valutazione") ?? "";
  const activeCount = Array.from(searchParams.keys()).filter((k) => k !== "q").length;

  const provinces = REGIONS.find((r) => r.slug === regione)?.provinces ?? [];

  return (
    <aside className="card card-soft flex h-fit flex-col gap-6 p-5 lg:sticky lg:top-24">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-ink">Filtri</h2>
        {activeCount > 0 && (
          <button type="button" onClick={() => router.push("/directory")} className="flex items-center gap-1 text-xs font-medium text-brand-dark">
            <RotateCcw size={12} /> Reimposta
          </button>
        )}
      </div>

      <div>
        <label className="field-label" htmlFor="f-regione">Regione</label>
        <select id="f-regione" className="field" value={regione} onChange={(e) => { update("regione", e.target.value || null); update("provincia", null); }}>
          <option value="">Tutte le regioni</option>
          {REGIONS.map((r) => <option key={r.slug} value={r.slug}>{r.name}</option>)}
        </select>
      </div>

      <div>
        <label className="field-label" htmlFor="f-provincia">Provincia</label>
        <select id="f-provincia" className="field" value={searchParams.get("provincia") ?? ""} onChange={(e) => update("provincia", e.target.value || null)} disabled={!regione}>
          <option value="">{regione ? "Tutte le province" : "Seleziona prima la regione"}</option>
          {provinces.map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}
        </select>
      </div>

      <div>
        <label className="field-label" htmlFor="f-comune">Comune</label>
        <input
          id="f-comune"
          className="field"
          placeholder="Es. Milano"
          defaultValue={searchParams.get("comune") ?? ""}
          onBlur={(e) => update("comune", e.target.value || null)}
          onKeyDown={(e) => e.key === "Enter" && update("comune", (e.target as HTMLInputElement).value || null)}
        />
      </div>

      <div>
        <p className="field-label">Categoria</p>
        <div className="flex flex-col gap-1.5">
          {CATEGORIES.map((c) => (
            <label key={c.slug} className="flex cursor-pointer items-center gap-2 text-sm text-ink-soft">
              <input
                type="radio"
                name="categoria"
                checked={categoria === c.slug}
                onChange={() => update("categoria", c.slug)}
                className="accent-[var(--gf-brand)]"
              />
              {c.labelPlural}
            </label>
          ))}
          {categoria && (
            <button type="button" onClick={() => update("categoria", null)} className="mt-1 text-left text-xs text-brand-dark">Rimuovi filtro categoria</button>
          )}
        </div>
      </div>

      <div>
        <p className="field-label">Fascia di prezzo</p>
        <div className="flex gap-2">
          {PRICES.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => togglePrice(p)}
              className={`chip ${selectedPrices.includes(p) ? "chip-brand" : "chip-neutral"}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="field-label">Valutazione minima</p>
        <div className="flex flex-col gap-1.5">
          {RATINGS.map((r) => (
            <label key={r} className="flex cursor-pointer items-center gap-2 text-sm text-ink-soft">
              <input type="radio" name="valutazione" checked={valutazione === String(r)} onChange={() => update("valutazione", String(r))} className="accent-[var(--gf-brand)]" />
              {r}+ stelle
            </label>
          ))}
          {valutazione && (
            <button type="button" onClick={() => update("valutazione", null)} className="mt-1 text-left text-xs text-brand-dark">Rimuovi filtro valutazione</button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2.5 border-t border-line pt-4">
        {[
          { key: "apertoOra", label: "Aperto ora" },
          { key: "consegna", label: "Consegna a domicilio" },
          { key: "takeaway", label: "Take away" },
          { key: "certificato", label: "Certificato AIC" },
        ].map((item) => (
          <label key={item.key} className="flex cursor-pointer items-center justify-between text-sm text-ink-soft">
            {item.label}
            <input
              type="checkbox"
              checked={searchParams.get(item.key) === "1"}
              onChange={() => toggle(item.key)}
              className="h-4 w-4 accent-[var(--gf-brand)]"
            />
          </label>
        ))}
      </div>
    </aside>
  );
}
