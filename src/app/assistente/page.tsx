import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import ServiceAssistant from "@/components/ServiceAssistant";
import { organizations, services } from "@/lib/mock-data";

export const metadata = {
  title: "Assistente — Avvisy",
};

export default function AssistentePage() {
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
          Che cosa ti serve?
        </h1>
        <p className="mt-2 text-base text-muted">
          Dicci di cosa hai bisogno e ti indirizziamo al servizio e alla
          struttura giusti, senza cercare tra le pagine.
        </p>
        <div className="mt-6">
          <ServiceAssistant services={services} organizations={organizations} />
        </div>
      </main>
    </>
  );
}
