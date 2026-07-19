"use client";

import { PageTitle } from "@/components/dash";
import OrdersTable from "@/components/OrdersTable";
import { useStore } from "@/lib/store";

export default function BuyerOrdersPage() {
  const { state, currentBuyerId } = useStore();
  const inProgress = state.orders.filter(
    (o) => o.buyerId === currentBuyerId && o.status !== "Completato" && o.status !== "Annullato",
  );
  return (
    <>
      <PageTitle title="Ordini in corso" subtitle="Ordini in lavorazione, spedizione o consegna." />
      <OrdersTable orders={inProgress} party="buyer" />
    </>
  );
}
