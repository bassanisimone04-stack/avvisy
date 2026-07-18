import { PageTitle } from "@/components/dash";
import OrdersTable from "@/components/OrdersTable";
import { orders } from "@/lib/mock-data";

const SELLER = "co-metalfer";

export default function OrdiniVenditorePage() {
  const myOrders = orders.filter((o) => o.sellerId === SELLER);
  return (
    <>
      <PageTitle
        title="Ordini"
        subtitle="Ordini generati da acquisti immediati e offerte accettate."
      />
      <OrdersTable orders={myOrders} party="seller" />
    </>
  );
}
