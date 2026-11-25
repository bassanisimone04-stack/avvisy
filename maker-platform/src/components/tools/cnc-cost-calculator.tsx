"use client";

import { useMemo, useState } from "react";
import { InputError } from "@/features/tools/board-foot";
import { cncProjectCost, type CncCostInput } from "@/features/tools/cnc-cost";
import { formatPrice } from "@/lib/format";
import { num, NumberField } from "./number-field";

type Fields = Record<keyof CncCostInput, string>;

const initial: Fields = {
  quantity: "4",
  sheets: "2",
  sheetPrice: "95",
  machineHours: "3",
  machineRate: "85",
  designHours: "2",
  designRate: "60",
  setupFee: "50",
  toolingCost: "20",
  finishingCost: "40",
  markupPercent: "20",
};

const money = (n: number) => formatPrice(Math.round(n * 100));

export function CncCostCalculator() {
  const [f, setF] = useState<Fields>(initial);
  const set = (k: keyof CncCostInput) => (v: string) => setF((s) => ({ ...s, [k]: v }));

  const result = useMemo(() => {
    try {
      const input = Object.fromEntries(Object.entries(f).map(([k, v]) => [k, num(v)])) as unknown as CncCostInput;
      return { ok: true as const, r: cncProjectCost(input) };
    } catch (e) {
      return { ok: false as const, error: e instanceof InputError ? e.message : "Check your inputs." };
    }
  }, [f]);

  const groups: { title: string; fields: [keyof CncCostInput, string, string, string?][] }[] = [
    { title: "Job", fields: [["quantity", "Pieces", "pcs"]] },
    { title: "Material", fields: [["sheets", "Sheets", "sheets"], ["sheetPrice", "Price per sheet", "USD"]] },
    { title: "Machine", fields: [["machineHours", "Cutting time", "hrs"], ["machineRate", "Machine rate", "USD/hr", "Shop rates vary widely — use your own"]] },
    { title: "Design & CAM", fields: [["designHours", "Design time", "hrs"], ["designRate", "Design rate", "USD/hr"]] },
    { title: "Other", fields: [["setupFee", "Setup fee", "USD"], ["toolingCost", "Tooling wear", "USD"], ["finishingCost", "Finishing", "USD"], ["markupPercent", "Markup", "%"]] },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="rounded-md border border-line bg-white p-5 sm:p-8">
        <div className="space-y-7">
          {groups.map((g) => (
            <fieldset key={g.title} className="grid gap-4 sm:grid-cols-[8rem_1fr]">
              <legend className="contents">
                <span className="eyebrow pt-2">{g.title}</span>
              </legend>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
                {g.fields.map(([k, label, suffix, hint]) => (
                  <NumberField key={k} label={label} value={f[k]} onChange={set(k)} suffix={suffix} hint={hint} step={k === "quantity" ? 1 : "any"} />
                ))}
              </div>
            </fieldset>
          ))}
        </div>
      </div>

      <aside aria-live="polite" className="h-fit rounded-md bg-forest p-6 text-ivory lg:sticky lg:top-24">
        <p className="text-[0.6875rem] font-semibold tracking-[0.14em] text-ivory/75 uppercase">Estimate</p>
        {result.ok ? (
          <>
            <p className="mt-3 text-sm text-ivory/70">Per piece</p>
            <p className="nums font-display text-[3rem] leading-none">{money(result.r.perPiece)}</p>
            <dl className="mt-6 space-y-2 border-t border-ivory/15 pt-4 text-sm">
              {result.r.lines.map((l) => (
                <div key={l.key} className="flex justify-between gap-4">
                  <dt className="text-ivory/70">{l.label}</dt>
                  <dd className="nums">{money(l.amount)}</dd>
                </div>
              ))}
              <div className="flex justify-between gap-4 border-t border-ivory/15 pt-2">
                <dt className="text-ivory/70">Subtotal</dt>
                <dd className="nums">{money(result.r.subtotal)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ivory/70">Markup</dt>
                <dd className="nums">{money(result.r.markup)}</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-ivory/15 pt-2 text-base font-semibold">
                <dt>Total ({f.quantity || 0} pcs)</dt>
                <dd className="nums">{money(result.r.total)}</dd>
              </div>
            </dl>
            <p className="mt-5 text-xs leading-relaxed text-ivory/70">A planning estimate based on your inputs — not a quote. Taxes and shipping are not included.</p>
          </>
        ) : (
          <p role="alert" className="mt-3 text-sm text-[#F2B8A6]">
            {result.error}
          </p>
        )}
      </aside>
    </div>
  );
}
