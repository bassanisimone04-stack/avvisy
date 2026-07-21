"use client";

import { PageTitle, StatCard } from "@/components/dash";
import { OrderStatusPill } from "@/components/badges";
import { IconWallet } from "@/components/icons";
import { companyById } from "@/lib/mock-data";
import { companyDisplayName } from "@/lib/services";
import { commissionRateLabel, formatDate, formatEuro } from "@/lib/format";
import { useStore } from "@/lib/store";

export default function AdminTransactionsPage() {
  const { state } = useStore();
  const orders = state.orders;
  const gmv = orders.reduce((s, o) => s + o.subtotal, 0);
  const fees = orders.reduce((s, o) => s + o.commission, 0);

  return (
    <>
      <PageTitle title="Transazioni e commissioni" subtitle="Registro delle transazioni simulate e delle commissioni maturate." />

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <StatCard label="Volume transato" value={formatEuro(gmv)} icon={<IconWallet width={18} height={18} />} accent="steel" />
        <StatCard label={`Commissioni (${commissionRateLabel()})`} value={formatEuro(fees)} icon={<IconWallet width={18} height={18} />} />
        <StatCard label="Transazioni" value={String(orders.length)} icon={<IconWallet width={18} height={18} />} accent="signal" />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="border-b border-line bg-surface-2/60 text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-4 py-3 font-semibold">Transazione</th>
                <th className="px-4 py-3 font-semibold">Venditore</th>
                <th className="px-4 py-3 font-semibold">Compratore</th>
                <th className="px-4 py-3 text-right font-semibold">Importo</th>
                <th className="px-4 py-3 text-right font-semibold">Commissione</th>
                <th className="px-4 py-3 font-semibold">Stato</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-line last:border-0 hover:bg-surface-2/40">
                  <td className="px-4 py-3">
                    <p className="font-mono text-xs font-semibold text-ink">{o.code}</p>
                    <p className="text-xs text-muted">{formatDate(o.date)}</p>
                  </td>
                  <td className="px-4 py-3 text-ink">{companyDisplayName(state.companies, o.sellerId)}</td>
                  <td className="px-4 py-3 text-muted">{companyDisplayName(state.companies, o.buyerId)}</td>
                  <td className="px-4 py-3 text-right font-semibold text-ink">{formatEuro(o.subtotal)}</td>
                  <td className="px-4 py-3 text-right font-semibold text-brand-dark">{formatEuro(o.commission)}</td>
                  <td className="px-4 py-3"><OrderStatusPill status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
