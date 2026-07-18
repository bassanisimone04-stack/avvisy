import type { Metadata } from "next";
import SupportForm from "@/components/SupportForm";
import { commissionRateLabel } from "@/lib/format";

export const metadata: Metadata = {
  title: "Assistenza",
  description: "Centro assistenza Scortvia: domande frequenti e contatto diretto.",
};

const faqs = [
  [
    "Come funziona la verifica delle aziende?",
    "Ogni azienda carica i documenti richiesti (partita IVA, sede, ruolo). Nel prototipo la verifica KYB è simulata e viene approvata automaticamente a scopo dimostrativo.",
  ],
  [
    "Quanto costa vendere su Scortvia?",
    `La pubblicazione è gratuita. Scortvia trattiene una commissione indicativa del ${commissionRateLabel()} solo sulle transazioni concluse.`,
  ],
  [
    "I pagamenti sono reali?",
    "No. Questo è un prototipo dimostrativo: saldi, pagamenti e depositi sono simulati. Nessun addebito reale viene effettuato.",
  ],
  [
    "Come funzionano le offerte?",
    "Sui lotti negoziabili puoi proporre prezzo e quantità. Il venditore può accettare, rifiutare o rilanciare con una controproposta. Ogni offerta ha uno stato tracciato.",
  ],
  [
    "Posso ritirare la merce di persona?",
    "Dipende dal lotto: molti venditori offrono il ritiro in sede su appuntamento, altri la spedizione su bancale tramite corriere convenzionato.",
  ],
];

export default function AssistenzaPage() {
  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="container-page py-10">
          <h1 className="text-3xl font-bold text-ink">Centro assistenza</h1>
          <p className="mt-2 max-w-2xl text-muted">
            Trova risposta alle domande più comuni o contatta il nostro team.
          </p>
        </div>
      </section>

      <section className="container-page grid gap-10 py-10 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <h2 className="text-xl font-bold text-ink">Domande frequenti</h2>
          <div className="mt-4 space-y-3">
            {faqs.map(([q, a]) => (
              <details key={q} className="card group p-4 [&_summary]:cursor-pointer">
                <summary className="flex items-center justify-between font-semibold text-ink">
                  {q}
                  <span className="text-muted transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-2 text-sm text-muted">{a}</p>
              </details>
            ))}
          </div>
        </div>

        <div>
          <div className="card card-soft p-6">
            <h2 className="text-xl font-bold text-ink">Contatta l&apos;assistenza</h2>
            <p className="mt-1 text-sm text-muted">
              Compila il modulo: ti rispondiamo entro un giorno lavorativo.
            </p>
            <div className="mt-5">
              <SupportForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
