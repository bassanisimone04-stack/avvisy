import { PageTitle } from "@/components/dash";
import OffersManager from "@/components/OffersManager";

export default function OfferteRicevutePage() {
  return (
    <>
      <PageTitle
        title="Offerte ricevute"
        subtitle="Gestisci la trattativa: accetta, rifiuta o rilancia con una controproposta."
      />
      <OffersManager />
    </>
  );
}
