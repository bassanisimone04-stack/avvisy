"use client";

import { useState } from "react";
import Link from "next/link";
import { OrderStatusPill } from "./badges";
import { EmptyState } from "./dash";
import { notify } from "./Toaster";
import CheckoutModal from "./CheckoutModal";
import Modal from "./Modal";
import { IconTruck } from "./icons";
import { formatDate, formatEuro, formatNumber } from "@/lib/format";
import { companyById } from "@/lib/mock-data";
import { nextOrderStatus } from "@/lib/services";
import { useStore } from "@/lib/store";
import type { Order } from "@/lib/types";

/** Estrae il codice tracking dallo storico (nota dell'evento "Spedito"). */
function trackingOf(order: Order): string | null {
  const ev = [...order.history].reverse().find((e) => e.status === "Spedito" && e.note);
  return ev?.note ?? null;
}

export default function OrdersTable({
  orders,
  party,
}: {
  orders: Order[];
  party: "seller" | "buyer";
}) {
  const { state, dispatch } = useStore();
  const [payOrder, setPayOrder] = useState<Order | null>(null);
  const [shipOrder, setShipOrder] = useState<Order | null>(null);
  const [tracking, setTracking] = useState("");

  const companyName = (id: string) =>
    state.companies.find((c) => c.id === id)?.displayName ?? companyById(id)?.displayName ?? id;

  function advance(o: Order, next: string) {
    if (next === "Spedito") {
      setTracking("");
      setShipOrder(o);
      return;
    }
    dispatch({ type: "UPDATE_ORDER_STATUS", orderId: o.id, status: next as Order["status"] });
    notify(`Ordine ${o.code}: ${next}.`);
  }

  if (orders.length === 0) {
    return (
      <div className="card">
        <EmptyState icon={<IconTruck />} title="Nessun ordine" text="Gli ordini compariranno qui non appena una trattativa si conclude." />
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead>
            <tr className="border-b border-line bg-surface-2/60 text-left text-xs uppercase tracking-wide text-muted">
              <th className="px-4 py-3 font-semibold">Ordine</th>
              <th className="px-4 py-3 font-semibold">Lotto</th>
              <th className="px-4 py-3 font-semibold">{party === "seller" ? "Compratore" : "Venditore"}</th>
              <th className="px-4 py-3 text-right font-semibold">Q.tà</th>
              <th className="px-4 py-3 text-right font-semibold">Totale</th>
              <th className="px-4 py-3 font-semibold">Consegna</th>
              <th className="px-4 py-3 font-semibold">Stato</th>
              <th className="px-4 py-3 font-semibold">Pagamento</th>
              {party === "seller" && <th className="px-4 py-3" />}
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => {
              const counterparty = party === "seller" ? o.buyerId : o.sellerId;
              const next = nextOrderStatus(o.status);
              return (
                <tr key={o.id} className="border-b border-line last:border-0 hover:bg-surface-2/40">
                  <td className="px-4 py-3">
                    <p className="font-mono text-xs font-semibold text-ink">{o.code}</p>
                    <p className="text-xs text-muted">{formatDate(o.date)}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/lotto/${o.lotId}`} className="text-ink hover:text-brand-dark">{o.lotTitle}</Link>
                  </td>
                  <td className="px-4 py-3 text-ink">{companyName(counterparty)}</td>
                  <td className="px-4 py-3 text-right text-ink">{formatNumber(o.quantity)}</td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-semibold text-ink">{formatEuro(o.total, true)}</span>
                    <span className="block text-xs text-muted">
                      {party === "seller" ? `−${formatEuro(o.commission)} comm.` : `incl. ${formatEuro(o.commission)} comm.`}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">{o.delivery}</td>
                  <td className="px-4 py-3">
                    <OrderStatusPill status={o.status} />
                    {trackingOf(o) && (
                      <span className="mt-1 flex items-center gap-1 text-xs text-muted">
                        <IconTruck width={13} height={13} /> {trackingOf(o)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {o.paid ? (
                      <span className="chip bg-verified-soft text-verified">Pagato</span>
                    ) : party === "buyer" ? (
                      <button onClick={() => setPayOrder(o)} className="btn btn-primary btn-sm whitespace-nowrap">Paga ora</button>
                    ) : (
                      <span className="chip bg-signal-soft text-signal">Da pagare</span>
                    )}
                  </td>
                  {party === "seller" && (
                    <td className="px-4 py-3 text-right">
                      {next ? (
                        <button
                          onClick={() => advance(o, next)}
                          className="btn btn-outline btn-sm whitespace-nowrap"
                        >
                          → {next}
                        </button>
                      ) : (
                        <span className="text-xs text-muted">—</span>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <CheckoutModal
        ctx={payOrder ? { mode: "order", order: payOrder } : null}
        open={!!payOrder}
        onClose={() => setPayOrder(null)}
      />

      <Modal
        open={!!shipOrder}
        onClose={() => setShipOrder(null)}
        title="Segna come spedito"
        footer={
          <div className="flex gap-2">
            <button onClick={() => setShipOrder(null)} className="btn btn-outline flex-1">Annulla</button>
            <button
              onClick={() => {
                if (shipOrder) {
                  const code = tracking.trim();
                  dispatch({
                    type: "UPDATE_ORDER_STATUS",
                    orderId: shipOrder.id,
                    status: "Spedito",
                    note: code ? `Tracking: ${code}` : undefined,
                  });
                  notify(`Ordine ${shipOrder.code}: spedito.`);
                }
                setShipOrder(null);
              }}
              className="btn btn-primary flex-1"
            >
              Conferma spedizione
            </button>
          </div>
        }
      >
        {shipOrder && (
          <div className="space-y-3">
            <p className="text-sm text-muted">
              Stai spedendo l&apos;ordine <strong>{shipOrder.code}</strong> ({shipOrder.lotTitle}).
            </p>
            <div>
              <label className="field-label">Numero di tracking (facoltativo)</label>
              <input
                value={tracking}
                onChange={(e) => setTracking(e.target.value)}
                placeholder="Es. BRT-0192837465"
                className="field"
              />
              <p className="mt-1 text-xs text-muted">Il compratore vedrà il codice per seguire la spedizione.</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
