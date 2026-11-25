"use client";

import { useMemo, useState } from "react";
import { boardFeet, InputError, quarterSawnSizes, type LengthUnit } from "@/features/tools/board-foot";
import { formatNumber, formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { num, NumberField, UnitToggle } from "./number-field";

type System = "imperial" | "metric";

export function BoardFootCalculator({ variant = "full" }: { variant?: "full" | "compact" }) {
  const [system, setSystem] = useState<System>("imperial");
  const [t, setT] = useState("2");
  const [w, setW] = useState("6");
  const [l, setL] = useState("8");
  const [qty, setQty] = useState("1");
  const [price, setPrice] = useState(variant === "full" ? "12.50" : "");
  const [waste, setWaste] = useState(variant === "full" ? "15" : "0");

  const units: { t: LengthUnit; w: LengthUnit; l: LengthUnit } =
    system === "imperial" ? { t: "in", w: "in", l: "ft" } : { t: "mm", w: "mm", l: "m" };

  const result = useMemo(() => {
    try {
      return {
        ok: true as const,
        r: boardFeet(
          { thickness: num(t), thicknessUnit: units.t, width: num(w), widthUnit: units.w, length: num(l), lengthUnit: units.l, quantity: num(qty) },
          { pricePerBF: price.trim() === "" ? null : num(price), wastePercent: waste.trim() === "" ? 0 : num(waste) },
        ),
      };
    } catch (e) {
      return { ok: false as const, error: e instanceof InputError ? e.message : "Check your inputs." };
    }
  }, [t, w, l, qty, price, waste, units.t, units.w, units.l]);

  const switchSystem = (s: System) => {
    if (s === system) return;
    const conv = (v: string, f: number, d = 2) => (v.trim() === "" || Number.isNaN(Number(v)) ? v : String(Number((Number(v) * f).toFixed(d))));
    if (s === "metric") {
      setT(conv(t, 25.4, 1));
      setW(conv(w, 25.4, 1));
      setL(conv(l, 0.3048, 3));
    } else {
      setT(conv(t, 1 / 25.4));
      setW(conv(w, 1 / 25.4));
      setL(conv(l, 1 / 0.3048));
    }
    setSystem(s);
  };

  const compact = variant === "compact";

  return (
    <div className={cn("rounded-md bg-ivory text-ink", compact ? "p-5 sm:p-6" : "border border-line bg-white p-5 sm:p-8")}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="eyebrow">{compact ? "Try it — Board feet" : "Board dimensions"}</p>
        <UnitToggle
          label="Unit system"
          value={system}
          onChange={switchSystem}
          options={[
            { value: "imperial", label: "Imperial" },
            { value: "metric", label: "Metric" },
          ]}
        />
      </div>

      <div className={cn("mt-5 grid gap-4", compact ? "grid-cols-3" : "grid-cols-2 sm:grid-cols-4")}>
        <NumberField label="Thickness" value={t} onChange={setT} suffix={units.t} hint={!compact && system === "imperial" ? "Rough: 4/4 = 1″" : undefined} />
        <NumberField label="Width" value={w} onChange={setW} suffix={units.w} />
        <NumberField label="Length" value={l} onChange={setL} suffix={units.l} />
        {!compact ? <NumberField label="Quantity" value={qty} onChange={setQty} suffix="pcs" step={1} min={1} /> : null}
      </div>

      {!compact && system === "imperial" ? (
        <div className="mt-3 flex flex-wrap items-center gap-1.5" aria-label="Common thicknesses">
          <span className="mr-1 text-xs text-muted">Quick thickness:</span>
          {quarterSawnSizes.map((q) => (
            <button
              key={q.label}
              type="button"
              onClick={() => setT(String(q.inches))}
              className={cn(
                "rounded-xs border px-2 py-1 text-xs transition-colors",
                Number(t) === q.inches ? "border-forest bg-forest text-ivory" : "border-line-strong text-muted hover:border-forest hover:text-forest",
              )}
            >
              {q.label}
            </button>
          ))}
        </div>
      ) : null}

      {!compact ? (
        <div className="mt-5 grid grid-cols-2 gap-4 sm:max-w-md">
          <NumberField label="Price per board foot" value={price} onChange={setPrice} suffix="USD" hint="Optional" />
          <NumberField label="Waste allowance" value={waste} onChange={setWaste} suffix="%" hint="Typical: 15–30%" />
        </div>
      ) : null}

      <div aria-live="polite" className={cn("mt-6 border-t border-line pt-5", compact && "mt-5")}>
        {result.ok ? (
          <dl className={cn("grid gap-x-6 gap-y-4", compact ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-4")}>
            <div className="col-span-2 sm:col-span-1">
              <dt className="text-xs text-muted">{num(qty) > 1 ? "Board feet (total)" : "Board feet"}</dt>
              <dd className="nums font-display text-[2.5rem] leading-none text-forest">{formatNumber(result.r.boardFeetTotal, 2)}</dd>
            </div>
            {!compact ? (
              <>
                <div>
                  <dt className="text-xs text-muted">With waste</dt>
                  <dd className="nums mt-1 text-xl text-forest">{formatNumber(result.r.boardFeetWithWaste, 2)} BF</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Volume</dt>
                  <dd className="nums mt-1 text-xl text-forest">{formatNumber(result.r.cubicMetersTotal, 4)} m³</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Estimated cost</dt>
                  <dd className="nums mt-1 text-xl text-forest">{result.r.cost === null ? "—" : formatPrice(Math.round(result.r.cost * 100))}</dd>
                </div>
              </>
            ) : (
              <div>
                <dt className="text-xs text-muted">Volume</dt>
                <dd className="nums mt-2 text-lg text-forest">{formatNumber(result.r.cubicMetersTotal, 4)} m³</dd>
              </div>
            )}
          </dl>
        ) : (
          <p role="alert" className="text-sm text-danger">
            {result.error}
          </p>
        )}
      </div>
    </div>
  );
}
