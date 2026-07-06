import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import Logo from "@/components/Logo";
import LandingHero from "@/components/LandingHero";
import StructuresDirectory from "@/components/StructuresDirectory";
import { organizations } from "@/lib/mock-data";

const reassurance = [
  { icon: "🆓", text: "Gratis per i cittadini" },
  { icon: "⚡", text: "Nessuna registrazione" },
  { icon: "🔔", text: "Avvisi sul telefono" },
  { icon: "📱", text: "Si installa come app" },
];

const howItWorks = [
  {
    step: "1",
    title: "Prenoti online",
    text: "Scegli struttura, servizio e orario. Gratis, senza registrazione.",
  },
  {
    step: "2",
    title: "Fai il check-in",
    text: "Il giorno dell'appuntamento confermi l'arrivo dal telefono e ricevi il tuo numero.",
  },
  {
    step: "3",
    title: "Arrivi quando tocca a te",
    text: "Segui la coda in tempo reale e presentati solo quando serve.",
  },
];

const ownerBenefits = [
  {
    icon: "🙂",
    title: "Meno fila allo sportello",
    text: "I clienti prenotano e arrivano al momento giusto: sala d'attesa più vuota.",
  },
  {
    icon: "📵",
    title: "Meno telefonate",
    text: "Le prenotazioni arrivano online, il telefono squilla di meno.",
  },
  {
    icon: "🔔",
    title: "Avvisi automatici",
    text: "I clienti vengono avvisati sul telefono: meno mancate presentazioni.",
  },
  {
    icon: "🗂️",
    title: "Tutto in un posto",
    text: "Appuntamenti, coda live e servizi gestiti da un'unica dashboard.",
  },
  {
    icon: "📈",
    title: "Capisci l'andamento",
    text: "Report e statistiche su appuntamenti, completati e giornate più piene.",
  },
  {
    icon: "🖥️",
    title: "Schermo sala d'attesa",
    text: "Chiama i numeri a voce su un monitor, come un vero eliminacode.",
  },
];

export default function HomePage() {
  return (
    <>
      <AppHeader />
      <LandingHero />

      {/* Striscia di rassicurazioni */}
      <section className="mx-auto max-w-5xl px-4 pb-14">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {reassurance.map((r) => (
            <div
              key={r.text}
              className="flex items-center gap-2.5 rounded-2xl border border-line bg-card px-4 py-3 shadow-soft"
            >
              <span aria-hidden className="text-xl">
                {r.icon}
              </span>
              <span className="text-sm font-semibold">{r.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Come funziona (cittadini) */}
      <section className="mx-auto max-w-5xl px-4 pb-14">
        <h2 className="text-2xl font-bold tracking-tight">
          Come funziona, in 3 passi
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {howItWorks.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-line bg-card p-5 shadow-soft"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand font-mono text-sm font-bold text-white">
                {item.step}
              </span>
              <h3 className="mt-3 font-display text-base font-bold">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Directory strutture */}
      <section className="mx-auto max-w-5xl px-4 pb-16">
        <div className="mb-5 flex items-baseline justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            Strutture su Avvisy
          </h2>
          <span className="text-sm text-muted">Milano</span>
        </div>
        <StructuresDirectory organizations={organizations} />
      </section>

      {/* Sezione gestori — conversione alla vendita */}
      <section className="mx-auto max-w-5xl px-4 pb-16">
        <div className="overflow-hidden rounded-3xl border border-brand/20 bg-brand-soft p-6 shadow-lift sm:p-10">
          <p className="inline-flex items-center gap-2 rounded-full bg-card px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-dark shadow-soft">
            Per le strutture
          </p>
          <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
            Meno fila, meno telefonate, clienti più contenti.
          </h2>
          <p className="mt-3 max-w-xl text-lg text-brand-dark">
            Avvisy porta le prenotazioni online e organizza la coda al posto
            tuo. Provalo <strong>7 giorni gratis</strong>, senza carta di
            credito.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ownerBenefits.map((b) => (
              <div
                key={b.title}
                className="rounded-2xl border border-line bg-card p-5 shadow-soft"
              >
                <span aria-hidden className="text-2xl">
                  {b.icon}
                </span>
                <h3 className="mt-2 font-display text-base font-bold">
                  {b.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  {b.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Link
              href="/registrati"
              className="rounded-full bg-brand px-7 py-3.5 text-center text-base font-semibold text-white shadow-soft transition-all hover:bg-brand-dark active:scale-[.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Prova gratis 7 giorni
            </Link>
            <Link
              href="/prezzi"
              className="rounded-full border border-line bg-card px-7 py-3.5 text-center text-base font-semibold text-ink transition-all hover:border-ink active:scale-[.98]"
            >
              Vedi i prezzi
            </Link>
            <p className="text-sm text-brand-dark/80">
              Poi da 79 €/mese · disdici quando vuoi
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-line bg-card">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-4 py-8 text-center text-sm text-muted sm:flex-row sm:justify-between">
          <Logo />
          <p>Appuntamenti, check-in e code live per piccoli uffici.</p>
          <span className="flex gap-4">
            <Link
              href="/prezzi"
              className="font-medium text-brand-dark hover:underline"
            >
              Prezzi
            </Link>
            <Link
              href="/aiuto"
              className="font-medium text-brand-dark hover:underline"
            >
              Aiuto
            </Link>
            <Link
              href="/termini"
              className="font-medium text-brand-dark hover:underline"
            >
              Termini
            </Link>
            <Link
              href="/privacy"
              className="font-medium text-brand-dark hover:underline"
            >
              Privacy
            </Link>
          </span>
        </div>
      </footer>
    </>
  );
}
