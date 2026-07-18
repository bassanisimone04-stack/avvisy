import { PageTitle } from "@/components/dash";
import OffersManager from "@/components/OffersManager";
import { offers } from "@/lib/mock-data";

const SELLER = "co-metalfer";

export default function OfferteRicevutePage() {
  const myOffers = offers.filter((o) => o.sellerId === SELLER);
  return (
    <>
      <PageTitle
        title="Offerte ricevute"
        subtitle="Gestisci la trattativa: accetta, rifiuta o rilancia con una controproposta."
      />
      <OffersManager initial={myOffers} />
    </>
  );
}
