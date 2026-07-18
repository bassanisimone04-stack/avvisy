import { PageTitle } from "@/components/dash";
import OrdersTable from "@/components/OrdersTable";
import { buyerOrders } from "@/lib/buyer-data";

export default function BuyerPurchasesPage() {
  const concluded = buyerOrders.filter((o) => o.status === "Concluso");
  return (
    <>
      <PageTitle title="Acquisti conclusi" subtitle="Storico degli acquisti completati sul marketplace." />
      <OrdersTable orders={concluded} party="buyer" />
    </>
  );
}
