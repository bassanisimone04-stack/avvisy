import Link from "next/link";
import AppHeader from "@/components/AppHeader";

export default function NotFound() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 text-center">
        <p className="font-mono text-6xl font-bold text-signal">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">
          Pagina non trovata
        </h1>
        <p className="mt-2 text-base text-muted">
          L&apos;indirizzo non esiste o è stato spostato. Torna alla home o
          cerca la struttura presso cui prenotare.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="rounded-full bg-brand px-6 py-3 text-center text-base font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            Torna alla home
          </Link>
          <Link
            href="/assistente"
            className="rounded-full border border-line bg-card px-6 py-3 text-center text-base font-semibold text-ink transition-colors hover:border-ink"
          >
            Trova un servizio
          </Link>
        </div>
      </main>
    </>
  );
}
