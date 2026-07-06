import Link from "next/link";
import AppHeader from "@/components/AppHeader";

export const metadata = {
  title: "Aiuto — Avvisy",
};

const faqs = [
  {
    q: "Come prenoto un appuntamento?",
    a: "Apri la pagina della struttura, scegli il servizio, poi la data e l'ora, e inserisci nome e telefono. Bastano tre passaggi e non serve registrarsi.",
  },
  {
    q: "Devo registrarmi o scaricare qualcosa?",
    a: "No. Prenotare è gratis e non richiede né registrazione né app. Se vuoi, puoi comunque installare Avvisy sul telefono come un'app.",
  },
  {
    q: "Cos'è il check-in?",
    a: "Il giorno dell'appuntamento, conferma la tua presenza dal telefono: ricevi un numero ed entri nella coda. Così eviti di aspettare in fila.",
  },
  {
    q: "Come seguo il mio turno?",
    a: "Dopo il check-in vedi il tuo numero e quello in servizio in tempo reale. Ti avvisiamo con una notifica push quando sta per arrivare il tuo turno: nel frattempo puoi anche allontanarti.",
  },
  {
    q: "Posso annullare o spostare la prenotazione?",
    a: "Sì. Contatta la struttura con il pulsante “Chiama” sulla sua pagina; il gestore può annullare o spostare l'appuntamento.",
  },
  {
    q: "I miei dati sono al sicuro?",
    a: "Raccogliamo solo nome e telefono, per gestire la prenotazione. Trovi tutti i dettagli nell'informativa privacy.",
  },
  {
    q: "Gestisco una struttura: come inizio?",
    a: "Dall'area gestori puoi creare i tuoi servizi, ricevere prenotazioni e gestire la coda live. Accedi dalla pagina di login.",
  },
];

export default function AiutoPage() {
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
          Domande frequenti
        </h1>
        <p className="mt-2 text-base text-muted">
          Le risposte alle domande più comuni su Avvisy.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="group rounded-2xl border border-line bg-card p-4 shadow-soft"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-base font-semibold">
                {f.q}
                <span
                  aria-hidden
                  className="text-muted transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-base leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-line bg-card p-5 text-center">
          <p className="text-base font-semibold">Non hai trovato la risposta?</p>
          <p className="mt-1 text-sm text-muted">
            Contatta direttamente la struttura presso cui vuoi prenotare, dalla
            sua pagina su Avvisy.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block rounded-full bg-brand px-6 py-2.5 text-base font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            Trova una struttura
          </Link>
        </div>
      </main>
    </>
  );
}
