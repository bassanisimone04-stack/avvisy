import Link from "next/link";

export default function LandingHero() {
  return (
    <section className="mx-auto grid max-w-5xl items-center gap-10 px-4 pb-14 pt-12 sm:pt-16 md:grid-cols-[1.1fr_0.9fr]">
      <div className="rise">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-card px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-dark shadow-soft">
          <span className="h-1.5 w-1.5 rounded-full bg-brand" />
          Appuntamenti · Check-in · Code live
        </p>
        <h1 className="text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
          Prenota e{" "}
          <span className="text-brand">salta la fila.</span>
        </h1>
        <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">
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
      <div className="rise-2 relative mx-auto w-full max-w-xs">
        <div
          aria-hidden
          className="absolute -inset-6 -z-10 rounded-full opacity-70 blur-2xl"
          style={{
            background:
              "radial-gradient(circle at 50% 40%, rgba(14,122,104,0.20), rgba(201,118,10,0.14) 55%, transparent 75%)",
          }}
        />
        <div className="ticket rotate-1 p-6 transition-transform duration-300 hover:rotate-0">
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
      </div>
    </section>
  );
}
