import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import clsx from "clsx";
import { AlertIcon, CheckIcon, InfoIcon } from "./icons";

export const btn = {
  base: "inline-flex items-center justify-center gap-2 rounded-[8px] px-5 min-h-11 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
  primary: "bg-carmine text-white hover:bg-red-700 active:bg-red-700",
  secondary: "bg-white text-carmine border border-carmine hover:bg-blush",
  ghostLight: "border border-ivory/80 text-ivory hover:bg-ivory hover:text-carmine",
  garnet: "bg-garnet text-white hover:bg-red-700",
  tertiary: "px-0 min-h-11 text-carmine underline-offset-4 hover:underline",
};
type V = keyof typeof btn;

export function Button({ variant = "primary", className, ...p }: ComponentProps<"button"> & { variant?: Exclude<V, "base"> }) {
  return <button className={clsx(btn.base, btn[variant], className)} {...p} />;
}
export function LinkButton({ variant = "primary", className, ...p }: ComponentProps<typeof Link> & { variant?: Exclude<V, "base"> }) {
  return <Link className={clsx(btn.base, btn[variant], className)} {...p} />;
}

export function SectionHeader({ eyebrow, title, sub, as: As = "h2", id, action }: { eyebrow?: string; title: string; sub?: string; as?: "h1" | "h2"; id?: string; action?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow mb-1.5">{eyebrow}</p>}
        <As id={id} className={clsx("text-ink", As === "h1" ? "text-2xl md:text-3xl" : "text-[17px] md:text-2xl")}>{title}</As>
        {sub && <p className="mt-1 text-sm text-stone">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatusPill({ status, label }: { status: "verified" | "estimated" | "missing" | "stale" | "pending" | "unverified" | "rejected"; label: string }) {
  const cls = {
    verified: "bg-[#E7F3EC] text-success border-success/30",
    estimated: "bg-[#FBF1E2] text-warning border-warning/30",
    missing: "bg-sand text-stone border-line",
    stale: "bg-[#FBF1E2] text-warning border-warning/30",
    pending: "bg-sand text-stone border-line",
    unverified: "bg-sand text-stone border-line",
    rejected: "bg-blush text-carmine border-carmine/30",
  }[status];
  const Icon = status === "verified" ? CheckIcon : status === "missing" || status === "pending" || status === "unverified" ? InfoIcon : AlertIcon;
  return (
    <span className={clsx("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold", cls)}>
      <Icon size={12} /> {label}
    </span>
  );
}

export function DemoBadge({ label, className }: { label: string; className?: string }) {
  return <span className={clsx("inline-flex items-center rounded-[4px] bg-ink/85 px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white", className)}>{label}</span>;
}

export function Notice({ tone = "info", children, title }: { tone?: "info" | "warning" | "success" | "error"; children: ReactNode; title?: string }) {
  const cls = { info: "border-info/30 bg-[#EAF1FA] text-ink", warning: "border-warning/30 bg-[#FBF1E2] text-ink", success: "border-success/30 bg-[#E7F3EC] text-ink", error: "border-carmine/30 bg-blush text-ink" }[tone];
  const Icon = tone === "success" ? CheckIcon : tone === "info" ? InfoIcon : AlertIcon;
  const iconCls = { info: "text-info", warning: "text-warning", success: "text-success", error: "text-carmine" }[tone];
  return (
    <div className={clsx("flex gap-3 rounded-[10px] border p-4 text-sm", cls)} role={tone === "error" ? "alert" : "status"}>
      <Icon className={clsx("mt-0.5 shrink-0", iconCls)} />
      <div>{title && <p className="font-semibold">{title}</p>}<div>{children}</div></div>
    </div>
  );
}

export function EmptyState({ title, body, children }: { title: string; body?: string; children?: ReactNode }) {
  return (
    <div className="rounded-[12px] border border-dashed border-line bg-white p-8 text-center">
      <p className="font-serif text-xl">{title}</p>
      {body && <p className="mx-auto mt-2 max-w-md text-stone">{body}</p>}
      {children && <div className="mt-5 flex flex-wrap justify-center gap-2">{children}</div>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={clsx("animate-pulse rounded-[8px] bg-sand", className)} aria-hidden="true" />;
}

export function Chip({ active, className, ...p }: ComponentProps<typeof Link> & { active?: boolean }) {
  return <Link className={clsx("inline-flex min-h-9 items-center gap-1 rounded-full border px-3 text-sm transition-colors", active ? "border-carmine bg-blush text-carmine" : "border-line bg-white text-ink hover:border-carmine", className)} {...p} />;
}

export function Divider() {
  return <hr className="border-0 border-t border-line" />;
}
