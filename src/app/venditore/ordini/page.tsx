"use client";

import { PageTitle } from "@/components/dash";
import OrdersTable from "@/components/OrdersTable";
import { useStore } from "@/lib/store";

export default function OrdiniVenditorePage() {
  const { state, currentSellerId } = useStore();
  const myOrders = state.orders.filter((o) => o.sellerId === currentSellerId);
  return (
    <>
      <PageTitle
        title="Ordini"
        subtitle="Ordini generati da acquisti immediati e offerte accettate. Avanza lo stato per aggiornare il compratore."
      />
      <OrdersTable orders={myOrders} party="seller" />
    </>
  );
}
