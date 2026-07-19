import { PageTitle } from "@/components/dash";
import BuyerOffers from "@/components/BuyerOffers";

export default function BuyerOffersPage() {
  return (
    <>
      <PageTitle
        title="Offerte inviate"
        subtitle="Segui lo stato delle tue proposte, rispondi alle controproposte o ritira un'offerta."
      />
      <BuyerOffers />
    </>
  );
}
