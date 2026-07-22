import type { ReactNode } from "react";

export function StatCard({
  label,
  value,
  sub,
  icon,
  accent = "brand",
}: {
  label: string;
  value: string;
  sub?: string;
  icon?: ReactNode;
  accent?: "brand" | "steel" | "signal";
}) {
  const bg =
    accent === "steel"
      ? "bg-steel-soft text-steel"
      : accent === "signal"
        ? "bg-signal-soft text-signal"
        : "bg-brand-soft text-brand-dark";
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between">
        <p className="text-sm text-muted">{label}</p>
        {icon && (
          <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${bg}`}>
            {icon}
          </span>
        )}
      </div>
      <p className="mt-2 text-2xl font-bold text-ink">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-muted">{sub}</p>}
    </div>
  );
}

export function PageTitle({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-ink">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function SectionCard({
  title,
  action,
  children,
  className = "",
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`card min-w-0 ${className}`}>
      {title && (
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
          <h2 className="min-w-0 truncate text-sm font-bold text-ink">{title}</h2>
          {action}
        </div>
      )}
      <div className="min-w-0 p-5">{children}</div>
    </section>
  );
}

export function EmptyState({
  icon,
  title,
  text,
  action,
}: {
  icon?: ReactNode;
  title: string;
  text?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-center">
      {icon && (
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-surface-2 text-muted">
          {icon}
        </span>
      )}
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      {text && <p className="max-w-sm text-sm text-muted">{text}</p>}
      {action}
    </div>
  );
}
