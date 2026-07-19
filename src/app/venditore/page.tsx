"use client";

import Link from "next/link";
import { PageTitle, SectionCard, StatCard } from "@/components/dash";
import { OfferStatusPill, OrderStatusPill, LotStatusPill } from "@/components/badges";
import { IconBox, IconPlus, IconTag, IconTruck, IconWallet } from "@/components/icons";
import { companyById } from "@/lib/mock-data";
import { commission, daysUntil, formatEuro, formatNumber, timeAgo } from "@/lib/format";
import { lotTotal } from "@/lib/types";
import { useStore } from "@/lib/store";

export default function SellerDashboard() {
  const { state, currentSellerId } = useStore();
  const seller = companyById(currentSellerId)!;

  const myLots = state.lots.filter((l) => l.sellerId === currentSellerId);
  const activeLots = myLots.filter((l) => l.status === "Pubblicato" || l.status === "Riservato");
  const myOffers = state.offers.filter((o) => o.sellerId === currentSellerId);
  const myOrders = state.orders.filter((o) => o.sellerId === currentSellerId);
  const notifications = state.notifications.filter(
    (n) => n.audience === "seller" || n.audience === "both",
  );

  const stockValue = activeLots.reduce((s, l) => s + lotTotal(l), 0);
  const concluded = myOrders.filter((o) => o.status === "Completato" || o.status === "Consegnato");
  const avgOrder = myOrders.length
    ? myOrders.reduce((s, o) => s + o.subtotal, 0) / myOrders.length
    : 0;
  const pendingOffers = myOffers.filter((o) =>
    ["Inviata", "Visualizzata", "In valutazione"].includes(o.status),
  );
  const expiring = myLots
    .filter((l) => l.status === "Pubblicato" && daysUntil(l.expiresAt) <= 12)
    .sort((a, b) => daysUntil(a.expiresAt) - daysUntil(b.expiresAt));

  return (
    <>
      <PageTitle
        title="Dashboard venditore"
        subtitle="Panoramica dei tuoi stock, offerte e vendite."
        action={
          <Link href="/venditore/pubblica" className="btn btn-primary btn-sm">
            <IconPlus width={16} height={16} /> Pubblica lotto
          </Link>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Valore lotti attivi" value={formatEuro(stockValue, true)} sub={`${activeLots.length} lotti a catalogo`} icon={<IconBox width={18} height={18} />} />
        <StatCard label="Vendite concluse" value={String(concluded.length)} sub={`${seller.salesCount} totali storiche`} icon={<IconTruck width={18} height={18} />} accent="steel" />
        <StatCard label="Offerte ricevute" value={String(myOffers.length)} sub={`${pendingOffers.length} da valutare`} icon={<IconTag width={18} height={18} />} accent="signal" />
        <StatCard label="Valore medio ordine" value={formatEuro(avgOrder, true)} sub={`${myOrders.length} ordini totali`} icon={<IconWallet width={18} height={18} />} />
        <StatCard label="Lotti in scadenza" value={String(expiring.length)} sub="Entro 12 giorni" icon={<IconBox width={18} height={18} />} accent="signal" />
        <div className="card p-4">
          <p className="text-sm text-muted">Saldo simulato</p>
          <p className="mt-2 text-2xl font-bold text-ink">{formatEuro(seller.walletBalance)}</p>
          <p className="mt-0.5 text-xs text-muted">Netto commissioni Scortvia</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="Offerte da gestire"
          action={<Link href="/venditore/offerte" className="text-sm font-semibold text-brand-dark hover:underline">Vedi tutte</Link>}
        >
          {myOffers.length === 0 ? (
            <p className="text-sm text-muted">Nessuna offerta ricevuta.</p>
          ) : (
            <div className="space-y-3">
              {myOffers.slice(0, 4).map((o) => {
                const lot = state.lots.find((l) => l.id === o.lotId);
                return (
                  <div key={o.id} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink">{companyById(o.buyerId)?.displayName}</p>
                      <p className="truncate text-xs text-muted">{lot?.title}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-ink">{formatEuro(o.unitPrice)} × {formatNumber(o.quantity)}</p>
                      <OfferStatusPill status={o.status} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Ordini recenti"
          action={<Link href="/venditore/ordini" className="text-sm font-semibold text-brand-dark hover:underline">Vedi tutti</Link>}
        >
          {myOrders.length === 0 ? (
            <p className="text-sm text-muted">Nessun ordine.</p>
          ) : (
            <div className="space-y-3">
              {myOrders.slice(0, 4).map((o) => (
                <div key={o.id} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">{o.lotTitle}</p>
                    <p className="truncate text-xs text-muted">{companyById(o.buyerId)?.displayName} · {o.code}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-ink">{formatEuro(o.subtotal, true)}</p>
                    <OrderStatusPill status={o.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Lotti in scadenza">
          {expiring.length === 0 ? (
            <p className="text-sm text-muted">Nessun lotto in scadenza a breve.</p>
          ) : (
            <div className="space-y-3">
              {expiring.slice(0, 4).map((l) => (
                <div key={l.id} className="flex items-center justify-between gap-3">
                  <Link href={`/lotto/${l.id}`} className="min-w-0 truncate text-sm font-medium text-ink hover:text-brand-dark">
                    {l.title}
                  </Link>
                  <span className="chip bg-signal-soft text-signal">{daysUntil(l.expiresAt)} gg</span>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Attività recente"
          action={<Link href="/venditore/notifiche" className="text-sm font-semibold text-brand-dark hover:underline">Notifiche</Link>}
        >
          <div className="space-y-3">
            {notifications.slice(0, 5).map((n) => (
              <div key={n.id} className="flex items-start gap-3">
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.read ? "bg-line-strong" : "bg-signal"}`} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink">{n.title}</p>
                  <p className="truncate text-xs text-muted">{n.detail}</p>
                </div>
                <span className="shrink-0 text-xs text-muted">{timeAgo(n.date)}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="mt-6">
        <SectionCard title="I miei lotti" action={<Link href="/venditore/lotti" className="text-sm font-semibold text-brand-dark hover:underline">Gestisci</Link>}>
          <div className="space-y-2">
            {myLots.slice(0, 5).map((l) => (
              <div key={l.id} className="flex items-center justify-between gap-3 rounded-lg bg-surface-2/50 px-3 py-2 text-sm">
                <Link href={`/lotto/${l.id}`} className="min-w-0 flex-1 truncate font-medium text-ink hover:text-brand-dark">{l.title}</Link>
                <span className="hidden text-muted sm:block">{formatEuro(lotTotal(l), true)}</span>
                <span className="hidden text-muted sm:block">{l.offersCount} offerte</span>
                <LotStatusPill status={l.status} />
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </>
  );
}
