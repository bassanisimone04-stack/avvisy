import SubscribeButtons from "@/components/SubscribeButtons";

export default function AbbonamentoPage() {
  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">Abbonamento</h1>
      <p className="mt-1 text-sm text-muted">
        Scegli il piano per la tua struttura. Puoi disdire quando vuoi; per i
        cittadini prenotare resta sempre gratis.
      </p>
      <div className="mt-6">
        <SubscribeButtons />
      </div>
      <p className="mt-6 text-xs text-muted">
        Il pagamento avviene in modo sicuro tramite Stripe. La fattura e la
        gestione dell&apos;abbonamento arrivano via email da Stripe.
      </p>
    </>
  );
}
