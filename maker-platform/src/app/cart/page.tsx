import { CartView } from "@/components/account/cart-view";
import { SimplePage } from "@/components/layout/simple-page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Cart", description: "Your cart.", path: "/cart", index: false });

export default function CartPage() {
  return (
    <SimplePage title="Your cart" path="/cart" label="Cart">
      <CartView />
    </SimplePage>
  );
}
