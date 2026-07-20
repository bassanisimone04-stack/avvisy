import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "@/components/LoginForm";
import Logo from "@/components/Logo";
import { IconShield } from "@/components/icons";

export const metadata: Metadata = {
  title: "Accedi",
  description: "Accedi alla tua area aziendale su Scortvia.",
};

export default async function AccediPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; registrato?: string }>;
}) {
  const sp = await searchParams;
  return (
    <div className="container-page grid min-h-[70vh] items-center py-10">
      <div className="mx-auto w-full max-w-md">
        <div className="card card-soft p-7">
          <div className="flex flex-col items-center text-center">
            <Logo />
            <h1 className="mt-5 text-2xl font-bold text-ink">Accedi</h1>
            <p className="mt-1 text-sm text-muted">
              Entra nell&apos;area aziendale del marketplace.
            </p>
          </div>
          {sp.registrato && (
            <p className="mt-4 rounded-lg bg-verified-soft p-3 text-center text-sm text-verified">
              Registrazione completata. Ora puoi accedere.
            </p>
          )}
          <div className="mt-6">
            <LoginForm error={sp.error} />
          </div>
          <p className="mt-5 text-center text-sm text-muted">
            Non hai un account?{" "}
            <Link href="/registrati" className="font-semibold text-brand-dark hover:underline">
              Registra la tua azienda
            </Link>
          </p>
        </div>
        <p className="mt-4 flex items-center justify-center gap-2 text-xs text-muted">
          <IconShield width={14} height={14} /> Accesso simulato · nessuna
          credenziale reale richiesta
        </p>
      </div>
    </div>
  );
}
