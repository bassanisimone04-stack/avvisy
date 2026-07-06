import Link from "next/link";
import AppHeader from "@/components/AppHeader";

export const metadata = {
  title: "Informativa privacy — Avvisy",
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

export default function PrivacyPage() {
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
          Informativa sulla privacy
        </h1>
        <p className="mt-2 text-sm text-muted">
          Come Avvisy tratta i dati personali di chi prenota e delle strutture.
          Ai sensi del Regolamento UE 2016/679 (GDPR).
        </p>

        <div className="mt-4 rounded-lg bg-signal-soft p-3 text-sm text-ink">
          Nota: questo è un modello da completare con i dati reali del titolare
          prima della messa online definitiva.
        </div>

        <Section title="1. Titolare del trattamento">
          <p>
            Il titolare del trattamento è la struttura presso cui prenoti (es.
            il CAF o lo studio), che raccoglie i tuoi dati tramite Avvisy.
            Avvisy agisce come fornitore tecnico (responsabile del trattamento).
          </p>
        </Section>

        <Section title="2. Quali dati raccogliamo">
          <p>
            Per gestire una prenotazione raccogliamo solo i dati necessari:{" "}
            <strong className="text-ink">nome</strong> e{" "}
            <strong className="text-ink">numero di telefono</strong>. Per i
            gestori raccogliamo l&apos;<strong className="text-ink">email</strong>{" "}
            di accesso. Non raccogliamo dati non indispensabili al servizio
            (minimizzazione dei dati).
          </p>
        </Section>

        <Section title="3. Perché li usiamo">
          <p>
            I dati servono esclusivamente a gestire l&apos;appuntamento e la
            coda: confermare la prenotazione, inviarti eventuali avvisi (notifiche)
            e assegnarti il numero al check-in. Non vendiamo né cediamo i tuoi
            dati a terzi per finalità di marketing.
          </p>
        </Section>

        <Section title="4. Base giuridica">
          <p>
            Il trattamento si basa sul tuo consenso e sull&apos;esecuzione del
            servizio che richiedi (art. 6 GDPR). Il consenso è facoltativo ma
            necessario per completare la prenotazione.
          </p>
        </Section>

        <Section title="5. Per quanto tempo li conserviamo">
          <p>
            Conserviamo i dati per il tempo necessario a erogare il servizio e
            adempiere agli obblighi di legge, poi vengono cancellati o resi
            anonimi.
          </p>
        </Section>

        <Section title="6. I tuoi diritti">
          <p>
            Puoi in ogni momento chiedere di accedere ai tuoi dati, correggerli,
            cancellarli, limitarne il trattamento od opporti (art. 15–22 GDPR).
            Per esercitare questi diritti contatta la struttura presso cui hai
            prenotato.
          </p>
        </Section>

        <Section title="7. Sicurezza">
          <p>
            I dati viaggiano cifrati (HTTPS) e sono conservati con misure di
            protezione adeguate. L&apos;accesso all&apos;area di gestione è
            protetto da autenticazione e ogni struttura può vedere solo i propri
            dati.
          </p>
        </Section>

        <Section title="8. Contatti">
          <p>
            Per qualsiasi richiesta sui tuoi dati, contatta la struttura presso
            cui hai prenotato o scrivi a privacy@avvisy.app.
          </p>
        </Section>
      </main>
    </>
  );
}
