import Link from "next/link";
import AppHeader from "@/components/AppHeader";

export const metadata = {
  title: "Termini di servizio — Avvisy",
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6">
      <h2 className="font-display text-lg font-bold">{title}</h2>
      <div className="mt-2 flex flex-col gap-2 text-base leading-relaxed text-muted">
        {children}
      </div>
    </section>
  );
}

export default function TerminiPage() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-2xl px-4 pb-20 pt-8">
        <Link
          href="/"
          className="text-sm font-medium text-muted transition-colors hover:text-ink"
        >
          ← Home
        </Link>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Termini di servizio
        </h1>
        <p className="mt-2 text-sm text-muted">
          Le condizioni d&apos;uso di Avvisy per le strutture e per chi prenota.
        </p>

        <div className="mt-4 rounded-lg bg-signal-soft p-3 text-sm text-ink">
          Nota: modello da far verificare a un legale e completare con i dati
          reali prima della messa online definitiva.
        </div>

        <Section title="1. Oggetto del servizio">
          <p>
            Avvisy è uno strumento che consente alle strutture (CAF, studi,
            uffici) di gestire appuntamenti, check-in e code, e ai cittadini di
            prenotare online.
          </p>
        </Section>

        <Section title="2. Gratuità per i cittadini">
          <p>
            Per i cittadini l&apos;uso di Avvisy è e resta{" "}
            <strong className="text-ink">gratuito</strong>: prenotare, fare il
            check-in e seguire la coda non comporta alcun costo né obbligo di
            registrazione. Il pagamento riguarda esclusivamente le strutture che
            sottoscrivono un abbonamento.
          </p>
        </Section>

        <Section title="3. Account e abbonamento della struttura">
          <p>
            Per usare l&apos;area di gestione la struttura crea un account ed
            eventualmente sottoscrive un piano a pagamento. È prevista una prova
            gratuita di 7 giorni. L&apos;abbonamento è mensile e disdicibile in
            qualsiasi momento; il servizio resta attivo fino al termine del
            periodo pagato.
          </p>
        </Section>

        <Section title="4. Uso corretto">
          <p>
            La struttura si impegna a inserire dati corretti e a usare il
            servizio nel rispetto della legge e dei diritti dei clienti. È
            vietato ogni uso illecito o che comprometta il funzionamento del
            servizio.
          </p>
        </Section>

        <Section title="5. Dati personali">
          <p>
            Il trattamento dei dati è descritto nell&apos;{" "}
            <Link
              href="/privacy"
              className="font-semibold text-brand-dark hover:underline"
            >
              informativa privacy
            </Link>
            . La struttura è titolare del trattamento dei dati dei propri
            clienti; Avvisy agisce come fornitore tecnico.
          </p>
        </Section>

        <Section title="6. Limitazione di responsabilità">
          <p>
            Avvisy è fornito &laquo;così com&apos;è&raquo;. Ci impegniamo per la
            continuità del servizio ma non garantiamo l&apos;assenza assoluta di
            interruzioni. Non rispondiamo dell&apos;organizzazione interna delle
            strutture.
          </p>
        </Section>

        <Section title="7. Modifiche">
          <p>
            Possiamo aggiornare questi termini; le modifiche rilevanti saranno
            comunicate in anticipo alle strutture.
          </p>
        </Section>

        <Section title="8. Contatti">
          <p>Per informazioni: supporto@avvisy.app.</p>
        </Section>
      </main>
    </>
  );
}
