import { PageTitle } from "@/components/dash";
import PublishLotForm from "@/components/PublishLotForm";

export default function PubblicaPage() {
  return (
    <>
      <PageTitle
        title="Pubblica nuovo lotto"
        subtitle="Inserisci i dettagli del lotto. I campi con documentazione tecnica aumentano la fiducia dei compratori."
      />
      <PublishLotForm />
    </>
  );
}
