"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

export function NumberField({
  label,
  value,
  onChange,
  suffix,
  hint,
  invalid,
  className,
  min = 0,
  step = "any",
  dark,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  suffix?: React.ReactNode;
  hint?: string;
  invalid?: boolean;
  className?: string;
  min?: number;
  step?: string | number;
  dark?: boolean;
}) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className={cn("mb-1.5 block text-[0.8125rem] font-medium", dark ? "text-ivory/80" : "text-forest")}>
        {label}
      </label>
      <div
        className={cn(
          "flex h-11 items-stretch overflow-hidden rounded-sm border bg-white transition-colors focus-within:border-forest focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-clay-ink",
          invalid ? "border-danger" : "border-line-strong",
        )}
      >
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          step={step}
          value={value}
          aria-invalid={invalid || undefined}
          aria-describedby={hint ? `${id}-hint` : undefined}
          onChange={(e) => onChange(e.target.value)}
          className="nums w-full min-w-0 bg-transparent px-3 text-[0.9375rem] text-ink focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
        />
        {suffix ? <span className="flex shrink-0 items-center border-l border-line bg-ivory px-2.5 text-[0.8125rem] text-muted">{suffix}</span> : null}
      </div>
      {hint ? (
        <p id={`${id}-hint`} className={cn("mt-1 text-xs", dark ? "text-ivory/70" : "text-muted")}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function UnitToggle<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-sm border border-line-strong bg-white p-0.5 text-[0.8125rem]">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn("rounded-[4px] px-3 py-1.5 font-medium transition-colors", value === o.value ? "bg-forest text-ivory" : "text-muted hover:text-forest")}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function num(v: string): number {
  return v.trim() === "" ? Number.NaN : Number(v);
}
