import Link from "next/link";
import { PageTitle, SectionCard, StatCard } from "@/components/dash";
import { OfferStatusPill, OrderStatusPill, VerifiedBadge } from "@/components/badges";
import {
  IconBox,
  IconPlus,
  IconTag,
  IconTruck,
  IconWallet,
} from "@/components/icons";
import {
  companyById,
  lotById,
  lots,
  lotTotal,
  offers,
  orders,
} from "@/lib/mock-data";
import { commission, formatEuro, formatNumber } from "@/lib/format";

const SELLER = "co-metalfer";

export default function SellerDashboard() {
  const seller = companyById(SELLER)!;
  const myLots = lots.filter((l) => l.sellerId === SELLER);
  const myOffers = offers.filter((o) => o.sellerId === SELLER);
  const myOrders = orders.filter((o) => o.sellerId === SELLER);

  const stockValue = myLots.reduce((s, l) => s + lotTotal(l), 0);
  const concluded = myOrders.filter((o) => o.status === "Concluso");
  const monthRevenue = concluded.reduce(
    (s, o) => s + o.quantity * o.unitPrice - commission(o.quantity * o.unitPrice),
    0,
  );

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
        <StatCard
          label="Valore stock pubblicati"
          value={formatEuro(stockValue, true)}
          sub={`${myLots.length} lotti a catalogo`}
          icon={<IconBox width={18} height={18} />}
        />
        <StatCard
          label="Lotti attivi"
          value={String(myLots.length)}
          sub="Tutti visibili nel marketplace"
          icon={<IconBox width={18} height={18} />}
          accent="steel"
        />
        <StatCard
          label="Offerte ricevute"
          value={String(myOffers.length)}
          sub={`${myOffers.filter((o) => o.status === "Inviata" || o.status === "In valutazione").length} da valutare`}
          icon={<IconTag width={18} height={18} />}
          accent="signal"
        />
        <StatCard
          label="Vendite concluse"
          value={String(concluded.length)}
          sub={`${seller.salesCount} totali storiche`}
          icon={<IconTruck width={18} height={18} />}
        />
        <StatCard
          label="Ricavi del mese"
          value={formatEuro(monthRevenue, true)}
          sub="Netto commissione Scortvia"
          icon={<IconWallet width={18} height={18} />}
        />
        <div className="card p-4">
          <p className="text-sm text-muted">Stato verifica azienda</p>
          <div className="mt-3">
            <VerifiedBadge />
          </div>
          <p className="mt-2 text-xs text-muted">
            Saldo simulato: {formatEuro(seller.walletBalance)}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="Ultime offerte ricevute"
          action={
            <Link href="/venditore/offerte" className="text-sm font-semibold text-brand-dark hover:underline">
              Vedi tutte
            </Link>
          }
        >
          <div className="space-y-3">
            {myOffers.slice(0, 4).map((o) => {
              const lot = lotById(o.lotId);
              return (
                <div key={o.id} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">
                      {o.buyerCompany}
                    </p>
                    <p className="truncate text-xs text-muted">{lot?.title}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-ink">
                      {formatEuro(o.proposedUnitPrice)} × {formatNumber(o.quantity)}
                    </p>
                    <OfferStatusPill status={o.status} />
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard
          title="Ordini recenti"
          action={
            <Link href="/venditore/ordini" className="text-sm font-semibold text-brand-dark hover:underline">
              Vedi tutti
            </Link>
          }
        >
          <div className="space-y-3">
            {myOrders.slice(0, 4).map((o) => (
              <div key={o.id} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">{o.lotTitle}</p>
                  <p className="truncate text-xs text-muted">
                    {o.buyerCompany} · {o.id}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-ink">
                    {formatEuro(o.quantity * o.unitPrice, true)}
                  </p>
                  <OrderStatusPill status={o.status} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </>
  );
}
