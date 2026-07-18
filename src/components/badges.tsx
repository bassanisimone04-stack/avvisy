import { IconStar, IconVerified } from "./icons";
import type { OfferStatus, OrderStatus, VerificationStatus } from "@/lib/types";

export function VerifiedBadge({
  size = "sm",
  label = "Azienda verificata",
}: {
  size?: "sm" | "xs";
  label?: string;
}) {
  return (
    <span
      className="chip"
      style={{
        background: "var(--s-brand-soft)",
        color: "var(--s-brand-dark)",
        fontSize: size === "xs" ? "0.6875rem" : undefined,
      }}
    >
      <IconVerified width={size === "xs" ? 12 : 14} height={size === "xs" ? 12 : 14} />
      {label}
    </span>
  );
}

export function VerificationChip({ status }: { status: VerificationStatus }) {
  if (status === "verificata")
    return <VerifiedBadge />;
  const map: Record<Exclude<VerificationStatus, "verificata">, [string, string, string]> = {
    in_verifica: ["In verifica", "var(--s-signal-soft)", "var(--s-signal)"],
    sospesa: ["Sospesa", "var(--s-danger-soft)", "var(--s-danger)"],
  };
  const [text, bg, color] = map[status];
  return (
    <span className="chip" style={{ background: bg, color }}>
      {text}
    </span>
  );
}

export function RatingStars({
  value,
  count,
  className = "",
}: {
  value: number;
  count?: number;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <span className="inline-flex" style={{ color: "var(--s-signal)" }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <IconStar
            key={i}
            width={14}
            height={14}
            style={{ opacity: i < Math.round(value) ? 1 : 0.25 }}
          />
        ))}
      </span>
      <span className="text-sm font-semibold text-ink">{value.toFixed(1)}</span>
      {count != null && (
        <span className="text-sm text-muted">({count})</span>
      )}
    </span>
  );
}

const offerStyles: Record<OfferStatus, [string, string]> = {
  Inviata: ["var(--s-steel-soft)", "var(--s-steel)"],
  "In valutazione": ["var(--s-signal-soft)", "var(--s-signal)"],
  Controproposta: ["#ede9fe", "#6d28d9"],
  Accettata: ["var(--s-brand-soft)", "var(--s-brand-dark)"],
  Rifiutata: ["var(--s-danger-soft)", "var(--s-danger)"],
  Scaduta: ["var(--s-surface-2)", "var(--s-muted)"],
};

export function OfferStatusPill({ status }: { status: OfferStatus }) {
  const [bg, color] = offerStyles[status];
  return (
    <span className="chip" style={{ background: bg, color }}>
      {status}
    </span>
  );
}

const orderStyles: Record<OrderStatus, [string, string]> = {
  "In lavorazione": ["var(--s-signal-soft)", "var(--s-signal)"],
  "In spedizione": ["var(--s-steel-soft)", "var(--s-steel)"],
  Consegnato: ["var(--s-brand-soft)", "var(--s-brand-dark)"],
  Concluso: ["var(--s-brand-soft)", "var(--s-brand-dark)"],
  Annullato: ["var(--s-danger-soft)", "var(--s-danger)"],
};

export function OrderStatusPill({ status }: { status: OrderStatus }) {
  const [bg, color] = orderStyles[status];
  return (
    <span className="chip" style={{ background: bg, color }}>
      {status}
    </span>
  );
}

export function ConditionChip({ condition }: { condition: string }) {
  return (
    <span
      className="chip"
      style={{ background: "var(--s-surface-2)", color: "var(--s-ink-soft)" }}
    >
      {condition}
    </span>
  );
}
