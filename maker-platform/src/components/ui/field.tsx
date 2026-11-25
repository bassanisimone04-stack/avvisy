import * as React from "react";
import { cn } from "@/lib/utils";

export const inputClass =
  "h-11 w-full rounded-sm border border-line-strong bg-white px-3 text-[0.9375rem] text-ink placeholder:text-subtle transition-colors focus:border-forest focus:outline-none focus-visible:outline-2 focus-visible:outline-clay-ink aria-[invalid=true]:border-danger";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(inputClass, className)} {...props} />;
}

export function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        inputClass,
        "ui-select appearance-none pr-9",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("mb-1.5 block text-[0.8125rem] font-medium text-forest", className)} {...props} />;
}

export function Checkbox({ label, className, tone = "light", ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: React.ReactNode; tone?: "light" | "dark" }) {
  return (
    <label className={cn("group flex cursor-pointer items-center gap-2.5 py-1.5 text-sm", tone === "dark" ? "text-ivory/90" : "text-ink", className)}>
      <input type="checkbox" className={cn("peer size-4 shrink-0 cursor-pointer appearance-none rounded-xs border ui-checkbox focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay-ink", tone === "dark" ? "border-ivory/60 bg-transparent checked:border-ivory checked:bg-ivory ui-checkbox-dark focus-visible:outline-ivory" : "border-line-strong bg-white checked:border-forest checked:bg-forest")} {...props} />
      <span className={tone === "dark" ? "group-hover:text-white" : "group-hover:text-forest"}>{label}</span>
    </label>
  );
}
