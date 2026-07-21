"use client";

import Link from "next/link";
import { PageTitle, SectionCard, StatCard } from "@/components/dash";
import { OfferStatusPill, OrderStatusPill } from "@/components/badges";
import { IconBox, IconSearch, IconTag, IconTruck } from "@/components/icons";
import { companyById } from "@/lib/mock-data";
import { companyDisplayName } from "@/lib/services";
import { formatEuro, formatNumber, timeAgo } from "@/lib/format";
import { useStore } from "@/lib/store";

export default function BuyerDashboard() {
  const { state, currentBuyerId } = useStore();

  const myOffers = state.offers.filter((o) => o.buyerId === currentBuyerId);
  const myOrders = state.orders.filter((o) => o.buyerId === currentBuyerId);
  const notifications = state.notifications.filter((n) => n.audience === "buyer" || n.audience === "both");

  const openOffers = myOffers.filter((o) => ["Inviata", "Visualizzata", "In valutazione", "Controproposta"].includes(o.status));
  const inProgress = myOrders.filter((o) => o.status !== "Completato" && o.status !== "Annullato");
  const concluded = myOrders.filter((o) => o.status === "Completato");
  const spent = concluded.reduce((s, o) => s + o.total, 0);

  return (
    <>
      <PageTitle
        title="Dashboard compratore"
        subtitle="Le tue trattative, ordini e ricerche in un colpo d'occhio."
        action={<Link href="/marketplace" className="btn btn-primary btn-sm"><IconSearch width={16} height={16} /> Cerca lotti</Link>}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Offerte inviate" value={String(myOffers.length)} sub={`${openOffers.length} in trattativa`} icon={<IconTag width={18} height={18} />} accent="steel" />
        <StatCard label="Ordini in corso" value={String(inProgress.length)} sub="In lavorazione o spedizione" icon={<IconTruck width={18} height={18} />} accent="signal" />
        <StatCard label="Acquisti conclusi" value={String(concluded.length)} sub={`${formatEuro(spent, true)} di spesa`} icon={<IconBox width={18} height={18} />} />
        <StatCard label="Lotti salvati" value={String(state.favorites.length)} sub={`${state.savedSearches.length} ricerche salvate`} icon={<IconSearch width={18} height={18} />} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <SectionCard title="Offerte in trattativa" action={<Link href="/compratore/offerte" className="text-sm font-semibold text-brand-dark hover:underline">Vedi tutte</Link>}>
          {openOffers.length === 0 ? (
            <p className="text-sm text-muted">Nessuna offerta in trattativa.</p>
          ) : (
            <div className="space-y-3">
              {openOffers.map((o) => {
                const lot = state.lots.find((l) => l.id === o.lotId);
                return (
                  <div key={o.id} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink">{lot?.title}</p>
                      <p className="text-xs text-muted">{formatEuro(o.unitPrice)} × {formatNumber(o.quantity)} {lot?.unit}</p>
                    </div>
                    <OfferStatusPill status={o.status} />
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Ordini in corso" action={<Link href="/compratore/ordini" className="text-sm font-semibold text-brand-dark hover:underline">Vedi tutti</Link>}>
          {inProgress.length === 0 ? (
            <p className="text-sm text-muted">Nessun ordine in corso.</p>
          ) : (
            <div className="space-y-3">
              {inProgress.map((o) => (
                <div key={o.id} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">{o.lotTitle}</p>
                    <p className="text-xs text-muted">{companyDisplayName(state.companies, o.sellerId)} · {o.code}</p>
                  </div>
                  <OrderStatusPill status={o.status} />
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      <div className="mt-6">
        <SectionCard title="Attività recente" action={<Link href="/compratore/notifiche" className="text-sm font-semibold text-brand-dark hover:underline">Notifiche</Link>}>
          <div className="space-y-3">
            {notifications.slice(0, 5).map((n) => (
              <div key={n.id} className="flex items-start gap-3">
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.read ? "bg-line-strong" : "bg-signal"}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink">{n.title}</p>
                  <p className="truncate text-xs text-muted">{n.detail}</p>
                </div>
                <span className="shrink-0 text-xs text-muted">{timeAgo(n.date)}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </>
  );
}
