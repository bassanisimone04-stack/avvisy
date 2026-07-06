import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Prezzi — Avvisy",
  description:
    "Piani di abbonamento per le strutture. Per i cittadini prenotare è sempre gratis.",
};

type Plan = {
  name: string;
  price: string;
  period?: string;
  tagline: string;
  features: string[];
  cta: string;
  highlight?: boolean;
};

const plans: Plan[] = [
  {
    name: "Base",
    price: "0 €",
    period: "per sempre",
    tagline: "Per iniziare e provare Avvisy.",
    features: [
      "Prenotazioni online illimitate",
      "Pagina pubblica della struttura",
      "Coda live e check-in",
      "1 sportello",
    ],
    cta: "Inizia gratis",
  },
  {
    name: "Pro",
    price: "29 €",
    period: "/ mese",
    tagline: "Per la maggior parte delle strutture.",
    features: [
      "Tutto di Base, più:",
      "Promemoria SMS automatici",
      "Report e statistiche",
      "Schermo per la sala d'attesa",
      "Esporta appuntamenti (CSV)",
      "Servizi illimitati",
    ],
    cta: "Prova Pro",
    highlight: true,
  },
  {
    name: "Multi-sede",
    price: "79 €",
    period: "/ mese",
    tagline: "Per chi ha più sedi o sportelli.",
    features: [
      "Tutto di Pro, più:",
      "Più sedi e sportelli",
      "Più operatori",
      "Supporto prioritario",
    ],
    cta: "Contattaci",
  },
];

export default function PrezziPage() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-5xl px-4 pb-20 pt-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Prezzi semplici per la tua struttura
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
            Paghi solo se gestisci una struttura. Nessun costo nascosto,
            disdici quando vuoi.
          </p>
        </div>

        {/* Gratis per i cittadini */}
        <div className="mx-auto mt-6 max-w-xl rounded-xl border border-brand-soft bg-brand-soft px-5 py-4 text-center">
          <p className="text-base font-semibold text-brand-dark">
            Per i cittadini Avvisy è e resta gratuito.
          </p>
          <p className="mt-1 text-sm text-brand-dark/80">
            Prenotare, fare il check-in e seguire la coda non costa nulla e non
            richiede registrazione.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "flex flex-col rounded-2xl border bg-card p-6",
                plan.highlight
                  ? "border-brand shadow-md ring-1 ring-brand"
                  : "border-line"
              )}
            >
              {plan.highlight && (
                <span className="mb-3 self-start rounded-full bg-brand px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                  Consigliato
                </span>
              )}
              <h2 className="font-display text-xl font-bold">{plan.name}</h2>
              <p className="mt-1 text-sm text-muted">{plan.tagline}</p>
              <p className="mt-4">
                <span className="font-display text-4xl font-bold">
                  {plan.price}
                </span>{" "}
                <span className="text-sm text-muted">{plan.period}</span>
              </p>

              <ul className="mt-5 flex flex-1 flex-col gap-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <span
                      aria-hidden
                      className="mt-0.5 font-bold text-brand-dark"
                    >
                      ✓
                    </span>
                    <span
                      className={cn(
                        f.endsWith("più:") ? "font-semibold text-ink" : "text-muted"
                      )}
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/login"
                className={cn(
                  "mt-6 rounded-full px-5 py-3 text-center text-base font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                  plan.highlight
                    ? "bg-brand text-white hover:bg-brand-dark"
                    : "border border-line text-ink hover:border-ink"
                )}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted">
          Prezzi di esempio, IVA esclusa. Il pagamento (Stripe) sarà attivato
          con l&apos;area gestori.
        </p>
      </main>
    </>
  );
}
