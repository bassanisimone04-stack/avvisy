import AppHeader from "@/components/AppHeader";
import LandingHero from "@/components/LandingHero";
import StructuresDirectory from "@/components/StructuresDirectory";
import { organizations } from "@/lib/mock-data";

const howItWorks = [
  {
    title: "Prenoti online",
    text: "Scegli struttura, servizio e orario. Gratis, senza registrazione.",
  },
  {
    title: "Fai il check-in",
    text: "Il giorno dell'appuntamento confermi l'arrivo dal telefono e ricevi il tuo numero.",
  },
  {
    title: "Arrivi quando tocca a te",
    text: "Segui la coda in tempo reale e presentati solo quando serve.",
  },
];

export default function HomePage() {
  return (
    <>
      <AppHeader />
      <LandingHero />

      <section className="mx-auto max-w-5xl px-4 pb-14">
        <h2 className="text-2xl font-bold tracking-tight">Come funziona</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {howItWorks.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-line bg-card p-5"
            >
              <h3 className="font-display text-base font-bold">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-20">
        <div className="mb-5 flex items-baseline justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            Strutture su Avvisy
          </h2>
          <span className="text-sm text-muted">Milano</span>
        </div>
        <StructuresDirectory organizations={organizations} />
      </section>

      <footer className="border-t border-line bg-card">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-4 py-8 text-center text-sm text-muted sm:flex-row sm:justify-between">
          <p className="font-display font-bold text-ink">
            Avvisy<span className="text-brand">.</span>
          </p>
          <p>Appuntamenti, check-in e code live per piccoli uffici.</p>
        </div>
      </footer>
    </>
  );
}
