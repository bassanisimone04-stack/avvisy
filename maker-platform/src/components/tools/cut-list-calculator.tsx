"use client";

import { Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { InputError } from "@/features/tools/board-foot";
import { estimateLinearStock, summarizeCutList, type CutPart } from "@/features/tools/cut-list";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { num, NumberField } from "./number-field";

interface Row {
  id: string;
  name: string;
  quantity: string;
  length: string;
  width: string;
  thickness: string;
}

let counter = 10;
const newRow = (p: Partial<Row> = {}): Row => ({ id: `r${counter++}`, name: "", quantity: "1", length: "", width: "", thickness: "0.75", ...p });

const starter: Row[] = [
  { id: "r1", name: "Leg", quantity: "4", length: "28", width: "1.75", thickness: "1.75" },
  { id: "r2", name: "Long apron", quantity: "2", length: "40", width: "3.5", thickness: "0.75" },
  { id: "r3", name: "Short apron", quantity: "2", length: "16", width: "3.5", thickness: "0.75" },
  { id: "r4", name: "Top board", quantity: "4", length: "46", width: "5.5", thickness: "0.75" },
];

const cellInput =
  "h-10 w-full rounded-sm border border-line-strong bg-white px-2.5 text-sm nums focus:border-forest focus:outline-none focus-visible:outline-2 focus-visible:outline-clay-ink";

function RemoveButton({ disabled, index, onClick }: { disabled: boolean; index: number; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="grid size-10 place-items-center rounded-sm text-muted hover:bg-ivory hover:text-danger disabled:opacity-30"
      aria-label={`Remove part ${index + 1}`}
    >
      <Trash2 className="size-4" />
    </button>
  );
}

export function CutListCalculator() {
  const [rows, setRows] = useState<Row[]>(starter);
  const [stockLength, setStockLength] = useState("96");
  const [stockWidth, setStockWidth] = useState("6");
  const [kerf, setKerf] = useState("0.125");

  const update = (id: string, k: keyof Row, v: string) => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, [k]: v } : r)));

  const result = useMemo(() => {
    try {
      const parts: CutPart[] = rows.map((r) => ({
        id: r.id,
        name: r.name || "Unnamed part",
        quantity: num(r.quantity),
        length: num(r.length),
        width: num(r.width),
        thickness: num(r.thickness),
      }));
      return {
        ok: true as const,
        summary: summarizeCutList(parts),
        stock: estimateLinearStock(parts, { stockLength: num(stockLength), stockWidth: num(stockWidth), kerf: num(kerf) }),
      };
    } catch (e) {
      return { ok: false as const, error: e instanceof InputError ? e.message : "Check your inputs." };
    }
  }, [rows, stockLength, stockWidth, kerf]);

  return (
    <div className="space-y-6">
      <section aria-labelledby="parts-h" className="rounded-md border border-line bg-white p-5 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <h2 id="parts-h" className="text-[1.375rem]">
            1. Parts list
          </h2>
          <p className="text-xs text-muted">All dimensions in inches (finished size)</p>
        </div>
        <div className="mt-5" role="table" aria-label="Parts">
          <div role="row" className="hidden grid-cols-[2.2fr_repeat(4,minmax(0,1fr))_2.5rem] gap-2 pb-1.5 text-xs text-muted sm:grid">
            {["Part", "Qty", "Length", "Width", "Thickness"].map((h) => (
              <span key={h} role="columnheader" className="font-medium">
                {h}
              </span>
            ))}
            <span role="columnheader" className="sr-only">
              Remove
            </span>
          </div>
          <div className="space-y-3 sm:space-y-1.5">
            {rows.map((r, i) => (
              <div
                key={r.id}
                role="row"
                className="grid grid-cols-4 gap-2 rounded-sm border border-line p-3 sm:grid-cols-[2.2fr_repeat(4,minmax(0,1fr))_2.5rem] sm:border-0 sm:p-0"
              >
                <div role="cell" className="col-span-3 sm:col-span-1">
                  <span className="mb-1 block text-[0.6875rem] text-muted sm:hidden">Part</span>
                  <input aria-label={`Part ${i + 1} name`} className={cellInput} value={r.name} onChange={(e) => update(r.id, "name", e.target.value)} placeholder="e.g. Shelf" />
                </div>
                <div role="cell" className="order-last col-span-1 flex items-end justify-end sm:order-none sm:hidden">
                  <RemoveButton disabled={rows.length === 1} index={i} onClick={() => setRows((rs) => rs.filter((x) => x.id !== r.id))} />
                </div>
                {(["quantity", "length", "width", "thickness"] as const).map((k) => (
                  <div role="cell" key={k}>
                    <span className="mb-1 block text-[0.6875rem] text-muted capitalize sm:hidden">{k === "quantity" ? "Qty" : k}</span>
                    <input
                      aria-label={`Part ${i + 1} ${k}`}
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step={k === "quantity" ? 1 : "any"}
                      className={cellInput}
                      value={r[k]}
                      onChange={(e) => update(r.id, k, e.target.value)}
                    />
                  </div>
                ))}
                <div role="cell" className="hidden sm:block">
                  <RemoveButton disabled={rows.length === 1} index={i} onClick={() => setRows((rs) => rs.filter((x) => x.id !== r.id))} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setRows((rs) => [...rs, newRow()])}
          className="mt-3 inline-flex items-center gap-2 rounded-sm border border-dashed border-line-strong px-4 py-2 text-sm font-medium text-forest hover:border-forest"
        >
          <Plus className="size-4" /> Add part
        </button>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section aria-labelledby="sum-h" aria-live="polite" className="rounded-md bg-forest p-6 text-ivory sm:p-8">
          <h2 id="sum-h" className="text-[1.375rem] text-ivory">
            2. Cut list totals
          </h2>
          {result.ok ? (
            <>
              <dl className="mt-5 grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-xs text-ivory/75">Pieces</dt>
                  <dd className="nums font-display text-[2.5rem] leading-none">{result.summary.pieces}</dd>
                </div>
                <div>
                  <dt className="text-xs text-ivory/75">Board feet (net)</dt>
                  <dd className="nums font-display text-[2.5rem] leading-none">{formatNumber(result.summary.boardFeet, 2)}</dd>
                </div>
              </dl>
              <table className="mt-6 w-full text-sm">
                <caption className="sr-only">Board feet by thickness</caption>
                <thead>
                  <tr className="border-b border-ivory/15 text-left text-xs text-ivory/75">
                    <th scope="col" className="pb-2 font-medium">Thickness</th>
                    <th scope="col" className="pb-2 font-medium">Pieces</th>
                    <th scope="col" className="pb-2 text-right font-medium">Board feet</th>
                  </tr>
                </thead>
                <tbody>
                  {result.summary.byThickness.map((g) => (
                    <tr key={g.thickness} className="border-b border-ivory/10">
                      <td className="nums py-2">{formatNumber(g.thickness, 3)}″</td>
                      <td className="nums py-2">{g.pieces}</td>
                      <td className="nums py-2 text-right">{formatNumber(g.boardFeet, 2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-4 text-xs leading-relaxed text-ivory/70">Net volume of finished parts. Add 15–30% when buying rough lumber.</p>
            </>
          ) : (
            <p role="alert" className="mt-4 text-sm text-[#F2B8A6]">
              {result.error}
            </p>
          )}
        </section>

        <section aria-labelledby="stock-h" className="rounded-md border border-line bg-white p-6 sm:p-8">
          <h2 id="stock-h" className="text-[1.375rem]">
            3. Stock estimate <span className="align-middle text-xs font-sans font-semibold tracking-wider text-clay-ink uppercase">Simplified</span>
          </h2>
          <div className="mt-5 grid grid-cols-3 gap-3">
            <NumberField label="Board length" value={stockLength} onChange={setStockLength} suffix="in" />
            <NumberField label="Board width" value={stockWidth} onChange={setStockWidth} suffix="in" />
            <NumberField label="Kerf" value={kerf} onChange={setKerf} suffix="in" />
          </div>
          {result.ok ? (
            <div className="mt-6" aria-live="polite">
              <p className="text-sm text-ink">
                <strong className="nums font-display text-[1.75rem] font-normal text-forest">{result.stock.boards.length}</strong> boards of {stockLength}″ ·{" "}
                <span className="nums">{formatNumber(result.stock.yieldPercent, 0)}%</span> length yield
              </p>
              <ol className="mt-4 space-y-2">
                {result.stock.boards.map((b, i) => (
                  <li key={i}>
                    <div className="flex h-7 overflow-hidden rounded-xs border border-line-strong bg-ivory" aria-label={`Board ${i + 1}: ${b.cuts.map((c) => c.name).join(", ")}`}>
                      {b.cuts.map((c, j) => (
                        <span
                          key={j}
                          title={`${c.name} — ${c.length}″`}
                          className={cn("flex items-center truncate border-r-2 border-white px-1.5 text-[0.625rem] font-medium", j % 2 ? "bg-sage-tint text-sage-ink" : "bg-clay-tint text-clay-ink")}
                          style={{ width: `${(c.length / num(stockLength)) * 100}%` }}
                        >
                          {c.name}
                        </span>
                      ))}
                    </div>
                  </li>
                ))}
              </ol>
              {result.stock.oversize.length ? (
                <ul className="mt-4 space-y-1 text-sm text-warning">
                  {result.stock.oversize.map((o) => (
                    <li key={o.name}>
                      “{o.name}” is {o.reason}.
                    </li>
                  ))}
                </ul>
              ) : null}
              <p className="mt-5 text-xs leading-relaxed text-muted">
                First-fit decreasing on length only: one part across each board&apos;s width, no grain matching or defect avoidance. This is an estimate, not an optimized cutting layout.
              </p>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
