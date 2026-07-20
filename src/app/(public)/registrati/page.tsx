import type { Metadata } from "next";
import RegistrationWizard from "@/components/RegistrationWizard";

export const metadata: Metadata = {
  title: "Registra la tua azienda",
  description:
    "Registrazione aziendale in più passaggi con verifica KYB simulata su Scortvia.",
};

export default async function RegistratiPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;
  return (
    <div className="container-page py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-ink">Registra la tua azienda</h1>
          <p className="mt-2 text-muted">
            Completa i passaggi per entrare nel marketplace B2B di Scortvia.
          </p>
        </div>
        <RegistrationWizard error={sp.error} />
      </div>
    </div>
  );
}
