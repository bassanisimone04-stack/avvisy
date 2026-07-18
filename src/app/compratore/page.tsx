import Link from "next/link";
import { PageTitle, SectionCard, StatCard } from "@/components/dash";
import { OfferStatusPill, OrderStatusPill } from "@/components/badges";
import {
  IconBox,
  IconSearch,
  IconTag,
  IconTruck,
} from "@/components/icons";
import {
  buyerOffers,
  buyerOrders,
  savedLotIds,
  savedSearches,
} from "@/lib/buyer-data";
import { lotById } from "@/lib/mock-data";
import { formatEuro, formatNumber } from "@/lib/format";

export default function BuyerDashboard() {
  const inProgress = buyerOrders.filter((o) => o.status !== "Concluso" && o.status !== "Annullato");
  const concluded = buyerOrders.filter((o) => o.status === "Concluso");
  const spent = concluded.reduce((s, o) => s + o.quantity * o.unitPrice, 0);
  const openOffers = buyerOffers.filter((o) =>
    ["Inviata", "In valutazione", "Controproposta"].includes(o.status),
  );

  return (
    <>
      <PageTitle
        title="Dashboard compratore"
        subtitle="Le tue trattative, ordini e ricerche in un colpo d'occhio."
        action={
          <Link href="/marketplace" className="btn btn-primary btn-sm">
            <IconSearch width={16} height={16} /> Cerca lotti
          </Link>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Offerte inviate" value={String(buyerOffers.length)} sub={`${openOffers.length} in trattativa`} icon={<IconTag width={18} height={18} />} accent="steel" />
        <StatCard label="Ordini in corso" value={String(inProgress.length)} sub="In lavorazione o spedizione" icon={<IconTruck width={18} height={18} />} accent="signal" />
        <StatCard label="Acquisti conclusi" value={String(concluded.length)} sub={`${formatEuro(spent, true)} di spesa`} icon={<IconBox width={18} height={18} />} />
        <StatCard label="Lotti salvati" value={String(savedLotIds.length)} sub={`${savedSearches.length} ricerche salvate`} icon={<IconSearch width={18} height={18} />} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="Offerte in trattativa"
          action={<Link href="/compratore/offerte" className="text-sm font-semibold text-brand-dark hover:underline">Vedi tutte</Link>}
        >
          <div className="space-y-3">
            {openOffers.map((o) => {
              const lot = lotById(o.lotId);
              return (
                <div key={o.id} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">{lot?.title}</p>
                    <p className="text-xs text-muted">
                      {formatEuro(o.proposedUnitPrice)} × {formatNumber(o.quantity)} {lot?.unit}
                    </p>
                  </div>
                  <OfferStatusPill status={o.status} />
                </div>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard
          title="Ordini in corso"
          action={<Link href="/compratore/ordini" className="text-sm font-semibold text-brand-dark hover:underline">Vedi tutti</Link>}
        >
          <div className="space-y-3">
            {inProgress.map((o) => (
              <div key={o.id} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">{o.lotTitle}</p>
                  <p className="text-xs text-muted">{o.id} · {o.fulfilment}</p>
                </div>
                <OrderStatusPill status={o.status} />
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </>
  );
}
