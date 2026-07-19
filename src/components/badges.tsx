import { IconStar, IconVerified } from "./icons";
import type {
  LotStatus,
  OfferStatus,
  OrderStatus,
  VerificationStatus,
} from "@/lib/types";

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
        background: "var(--s-verified-soft)",
        color: "var(--s-verified)",
        fontSize: size === "xs" ? "0.6875rem" : undefined,
      }}
    >
      <IconVerified width={size === "xs" ? 12 : 14} height={size === "xs" ? 12 : 14} />
      {label}
    </span>
  );
}

const verificationStyles: Record<VerificationStatus, [string, string]> = {
  Verificata: ["var(--s-verified-soft)", "var(--s-verified)"],
  "In verifica": ["var(--s-signal-soft)", "var(--s-signal)"],
  "Non verificata": ["var(--s-surface-2)", "var(--s-muted)"],
  Sospesa: ["var(--s-danger-soft)", "var(--s-danger)"],
};

export function VerificationChip({ status }: { status: VerificationStatus }) {
  if (status === "Verificata") return <VerifiedBadge />;
  const [bg, color] = verificationStyles[status];
  return (
    <span className="chip" style={{ background: bg, color }}>
      {status}
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
      {count != null && <span className="text-sm text-muted">({count})</span>}
    </span>
  );
}

const offerStyles: Record<OfferStatus, [string, string]> = {
  Inviata: ["var(--s-steel-soft)", "var(--s-steel)"],
  Visualizzata: ["var(--s-steel-soft)", "var(--s-steel)"],
  "In valutazione": ["var(--s-signal-soft)", "var(--s-signal)"],
  Controproposta: ["#ece7f6", "#6d3bb0"],
  Accettata: ["var(--s-verified-soft)", "var(--s-verified)"],
  Rifiutata: ["var(--s-danger-soft)", "var(--s-danger)"],
  Ritirata: ["var(--s-surface-2)", "var(--s-muted)"],
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
  "In attesa di conferma": ["var(--s-signal-soft)", "var(--s-signal)"],
  Confermato: ["var(--s-steel-soft)", "var(--s-steel)"],
  "In preparazione": ["var(--s-steel-soft)", "var(--s-steel)"],
  Spedito: ["#ece7f6", "#6d3bb0"],
  Consegnato: ["var(--s-verified-soft)", "var(--s-verified)"],
  Completato: ["var(--s-verified-soft)", "var(--s-verified)"],
  Contestato: ["var(--s-danger-soft)", "var(--s-danger)"],
  Annullato: ["var(--s-surface-2)", "var(--s-muted)"],
};

export function OrderStatusPill({ status }: { status: OrderStatus }) {
  const [bg, color] = orderStyles[status];
  return (
    <span className="chip" style={{ background: bg, color }}>
      {status}
    </span>
  );
}

const lotStyles: Record<LotStatus, [string, string]> = {
  Bozza: ["var(--s-surface-2)", "var(--s-muted)"],
  "In revisione": ["var(--s-signal-soft)", "var(--s-signal)"],
  Pubblicato: ["var(--s-verified-soft)", "var(--s-verified)"],
  Riservato: ["#ece7f6", "#6d3bb0"],
  Venduto: ["var(--s-steel-soft)", "var(--s-steel)"],
  Scaduto: ["var(--s-surface-2)", "var(--s-muted)"],
  Sospeso: ["var(--s-danger-soft)", "var(--s-danger)"],
};

export function LotStatusPill({ status }: { status: LotStatus }) {
  const [bg, color] = lotStyles[status];
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
