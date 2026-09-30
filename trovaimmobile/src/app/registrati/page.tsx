import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/AuthForms";

export const metadata: Metadata = { title: "Registrati" };

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ next?: string; ruolo?: string }> }) {
  const { next, ruolo } = await searchParams;
  return (
    <div className="container section" style={{ maxWidth: 520 }}>
      <div className="card card-pad stack">
        <h1>Crea un account</h1>
        <RegisterForm next={next} defaultRole={ruolo === "private" || ruolo === "agency" ? ruolo : undefined} />
        <p className="small" style={{ margin: 0 }}>
          Hai già un account? <Link href="/accedi">Accedi</Link>
        </p>
      </div>
    </div>
  );
}
