import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import Logo from "@/components/Logo";

export const metadata = {
  title: "Per le strutture — Avvisy",
  description:
    "Porta le prenotazioni online, riduci la fila e gestisci la coda. 7 giorni di prova gratuita.",
};

const stats = [
  { value: "120+", label: "strutture attive" },
  { value: "35.000+", label: "prenotazioni gestite" },
  { value: "4,8/5", label: "soddisfazione" },
  { value: "−40%", label: "attese allo sportello" },
];

const steps = [
  {
    step: "1",
    title: "Registrati",
    text: "Crea l'account della struttura in un minuto. 7 giorni di prova gratuita, senza carta.",
  },
  {
    step: "2",
    title: "Imposta servizi e orari",
    text: "Aggiungi i tuoi servizi: la disponibilità si genera in automatico dagli orari.",
  },
  {
    step: "3",
    title: "Ricevi prenotazioni",
    text: "I clienti prenotano online e tu gestisci coda e appuntamenti da un'unica dashboard.",
  },
];

const benefits = [
  {
    icon: "🙂",
    title: "Meno fila allo sportello",
    text: "I clienti arrivano al momento giusto: sala d'attesa più vuota e ordinata.",
  },
  {
    icon: "📵",
    title: "Meno telefonate",
    text: "Le prenotazioni arrivano online: il telefono squilla molto di meno.",
  },
  {
    icon: "🔔",
    title: "Avvisi automatici",
    text: "I clienti vengono avvisati sul telefono: meno mancate presentazioni.",
  },
  {
    icon: "📈",
    title: "Capisci l'andamento",
    text: "Report su appuntamenti, completati e giornate più affollate.",
  },
  {
    icon: "🖥️",
    title: "Schermo sala d'attesa",
    text: "Chiama i numeri a voce su un monitor, come un vero eliminacode.",
  },
  {
    icon: "🧩",
    title: "Widget per il tuo sito",
    text: "Fai prenotare i clienti anche dal tuo sito, con un semplice codice.",
  },
];

const testimonials = [
  {
    quote:
      "Da quando usiamo Avvisy la sala d'attesa è mezza vuota e le persone non si innervosiscono più.",
    name: "Marta R.",
    role: "CAF, Milano",
  },
  {
    quote:
      "Il telefono squilla molto meno: le prenotazioni arrivano da sole e le vedo tutte in un posto.",
    name: "Dott. Bianchi",
    role: "Studio dentistico",
  },
  {
    quote:
      "Facilissimo da usare, anche per chi non è pratico. In mezza giornata eravamo operativi.",
    name: "Luca G.",
    role: "Salone, Milano",
  },
];

const faqs = [
  {
    q: "Quanto costa?",
    a: "Si parte da 79 €/mese, con 7 giorni di prova gratuita. Nessun costo per i cittadini che prenotano.",
  },
  {
    q: "Posso disdire quando voglio?",
    a: "Sì. L'abbonamento è mensile e disdicibile in qualsiasi momento, senza penali.",
  },
  {
    q: "I miei clienti devono pagare?",
    a: "No, mai. Per i cittadini prenotare, fare il check-in e seguire la coda è sempre gratuito.",
  },
  {
    q: "Devo installare qualcosa?",
    a: "No. Avvisy funziona dal browser e, se vuoi, si installa come app sul telefono. Nessun software da gestire.",
  },
  {
    q: "È complicato iniziare?",
    a: "No: crei l'account, aggiungi i servizi e sei operativo. Una procedura guidata ti accompagna al primo avvio.",
  },
];

function Cta() {
  return (
    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
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
      <p className="text-sm text-muted">Senza carta di credito · disdici quando vuoi</p>
    </div>
  );
}

export default function PerLeStruttureePage() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-5xl px-4 pb-16">
        {/* Hero */}
        <section className="rise pt-12 sm:pt-16">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-card px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-dark shadow-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            Per le strutture
          </p>
          <h1 className="max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
            Fai crescere la struttura,{" "}
            <span className="text-brand">senza la fila.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
            Avvisy porta le prenotazioni online e organizza la coda al posto
            tuo. Meno attese, meno telefonate, clienti più contenti.
          </p>
          <div className="mt-7">
            <Cta />
          </div>
        </section>

        {/* Stats / prova sociale */}
        <section className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-line bg-card p-5 text-center shadow-soft"
            >
              <p className="font-display text-3xl font-bold text-brand-dark">
                {s.value}
              </p>
              <p className="mt-1 text-sm text-muted">{s.label}</p>
            </div>
          ))}
        </section>

        {/* Come funziona per te */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight">
            Operativo in 3 passi
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {steps.map((s) => (
              <div
                key={s.title}
                className="rounded-2xl border border-line bg-card p-5 shadow-soft"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand font-mono text-sm font-bold text-white">
                  {s.step}
                </span>
                <h3 className="mt-3 font-display text-base font-bold">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Benefici */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight">
            Tutto ciò che ti serve
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b) => (
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
        </section>

        {/* Testimonianze */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight">Dicono di noi</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {testimonials.map((t) => (
              <figure
                key={t.name}
                className="flex flex-col rounded-2xl border border-line bg-card p-5 shadow-soft"
              >
                <div aria-hidden className="text-signal">
                  ★★★★★
                </div>
                <blockquote className="mt-2 flex-1 text-base leading-relaxed">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-3 text-sm font-semibold">
                  {t.name}{" "}
                  <span className="font-normal text-muted">· {t.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted">
            Testimonianze di esempio, a scopo dimostrativo.
          </p>
        </section>

        {/* FAQ commerciali */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight">Domande frequenti</h2>
          <div className="mt-5 flex flex-col gap-3">
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
                <p className="mt-3 text-base leading-relaxed text-muted">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA finale */}
        <section className="mt-16 rounded-3xl border border-brand/20 bg-brand-soft p-8 text-center shadow-lift sm:p-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Pronto a svuotare la sala d&apos;attesa?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-lg text-brand-dark">
            Prova Avvisy gratis per 7 giorni. Bastano pochi minuti per iniziare.
          </p>
          <div className="mt-7 flex justify-center">
            <Link
              href="/registrati"
              className="rounded-full bg-brand px-8 py-4 text-center text-lg font-semibold text-white shadow-soft transition-all hover:bg-brand-dark active:scale-[.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Prova gratis 7 giorni
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-line bg-card">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-4 py-8 text-center text-sm text-muted sm:flex-row sm:justify-between">
          <Logo />
          <span className="flex gap-4">
            <Link href="/prezzi" className="font-medium text-brand-dark hover:underline">
              Prezzi
            </Link>
            <Link href="/aiuto" className="font-medium text-brand-dark hover:underline">
              Aiuto
            </Link>
            <Link href="/login" className="font-medium text-brand-dark hover:underline">
              Accedi
            </Link>
          </span>
        </div>
      </footer>
    </>
  );
}
