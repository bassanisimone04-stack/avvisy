import { PageTitle } from "@/components/dash";
import BuyerOffers from "@/components/BuyerOffers";
import { buyerOffers } from "@/lib/buyer-data";

export default function BuyerOffersPage() {
  return (
    <>
      <PageTitle
        title="Offerte inviate"
        subtitle="Segui lo stato delle tue proposte e rispondi alle controproposte."
      />
      <BuyerOffers initial={buyerOffers} />
    </>
  );
}
