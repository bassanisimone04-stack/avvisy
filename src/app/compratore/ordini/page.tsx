import { PageTitle } from "@/components/dash";
import OrdersTable from "@/components/OrdersTable";
import { buyerOrders } from "@/lib/buyer-data";

export default function BuyerOrdersPage() {
  const inProgress = buyerOrders.filter(
    (o) => o.status !== "Concluso" && o.status !== "Annullato",
  );
  return (
    <>
      <PageTitle title="Ordini in corso" subtitle="Ordini in lavorazione, spedizione o consegna." />
      <OrdersTable orders={inProgress} party="buyer" />
    </>
  );
}
