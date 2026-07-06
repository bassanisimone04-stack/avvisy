import Link from "next/link";

export default function LandingHero() {
  return (
    <section className="mx-auto grid max-w-5xl items-center gap-10 px-4 pb-14 pt-12 sm:pt-16 md:grid-cols-[1.1fr_0.9fr]">
      <div>
        <p className="mb-3 inline-block rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-dark">
          Appuntamenti · Check-in · Code live
        </p>
        <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          Prenota e salta la fila.
        </h1>
        <p className="mt-4 max-w-md text-lg leading-relaxed text-muted">
          Avvisy aiuta CAF, studi e piccoli uffici a gestire appuntamenti e
          code. Chi prenota sceglie l&apos;orario, fa il check-in dal telefono
          e vede in tempo reale quando tocca a lui. Prenotare è gratis.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/s/demo-caf"
            className="rounded-full bg-brand px-7 py-3.5 text-center text-base font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            Trova una struttura
          </Link>
          <Link
            href="/dashboard"
            className="rounded-full border border-line bg-card px-7 py-3.5 text-center text-base font-semibold text-ink transition-colors hover:border-ink"
          >
            Gestisci la tua struttura
          </Link>
        </div>
      </div>

      {/* Il biglietto: elemento firma di Avvisy */}
      <div className="ticket mx-auto w-full max-w-xs p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted">
          CAF Navigli · Milano
        </p>
        <p className="mt-4 text-xs text-muted">Ora in servizio</p>
        <p className="font-mono text-6xl font-bold tracking-tight text-signal">
          A-041
        </p>
        <div className="ticket-divider my-5" />
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-xs text-muted">Il tuo numero</p>
            <p className="font-mono text-2xl font-bold">A-044</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted">Attesa stimata</p>
            <p className="font-mono text-2xl font-bold">~25&apos;</p>
          </div>
        </div>
      </div>
    </section>
  );
}
