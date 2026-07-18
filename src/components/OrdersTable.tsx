import Link from "next/link";
import { OrderStatusPill } from "./badges";
import { commission, formatDate, formatEuro, formatNumber } from "@/lib/format";
import type { Order } from "@/lib/types";

export default function OrdersTable({
  orders,
  party,
}: {
  orders: Order[];
  party: "seller" | "buyer";
}) {
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-line bg-surface-2/60 text-left text-xs uppercase tracking-wide text-muted">
              <th className="px-4 py-3 font-semibold">Ordine</th>
              <th className="px-4 py-3 font-semibold">Lotto</th>
              <th className="px-4 py-3 font-semibold">
                {party === "seller" ? "Compratore" : "Venditore"}
              </th>
              <th className="px-4 py-3 text-right font-semibold">Quantità</th>
              <th className="px-4 py-3 text-right font-semibold">Totale</th>
              <th className="px-4 py-3 font-semibold">Consegna</th>
              <th className="px-4 py-3 font-semibold">Stato</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => {
              const total = o.quantity * o.unitPrice;
              return (
                <tr key={o.id} className="border-b border-line last:border-0 hover:bg-surface-2/40">
                  <td className="px-4 py-3">
                    <p className="font-mono text-xs font-semibold text-ink">{o.id}</p>
                    <p className="text-xs text-muted">{formatDate(o.date)}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/lotto/${o.lotId}`} className="text-ink hover:text-brand-dark">
                      {o.lotTitle}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-ink">{o.buyerCompany}</td>
                  <td className="px-4 py-3 text-right text-ink">{formatNumber(o.quantity)}</td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-semibold text-ink">{formatEuro(total, true)}</span>
                    {party === "seller" && (
                      <span className="block text-xs text-muted">
                        −{formatEuro(commission(total))} comm.
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted">{o.fulfilment}</td>
                  <td className="px-4 py-3"><OrderStatusPill status={o.status} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
