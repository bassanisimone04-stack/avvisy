"use client";

import { PageTitle } from "@/components/dash";
import OrdersTable from "@/components/OrdersTable";
import { useStore } from "@/lib/store";

export default function BuyerPurchasesPage() {
  const { state, currentBuyerId } = useStore();
  const concluded = state.orders.filter((o) => o.buyerId === currentBuyerId && o.status === "Completato");
  return (
    <>
      <PageTitle title="Acquisti conclusi" subtitle="Storico degli acquisti completati sul marketplace." />
      <OrdersTable orders={concluded} party="buyer" />
    </>
  );
}
