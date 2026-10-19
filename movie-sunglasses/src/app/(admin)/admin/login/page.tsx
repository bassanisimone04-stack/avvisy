import { redirect } from "next/navigation";
import { authConfigError, getAdmin } from "@/lib/auth-server";
import { LoginForm } from "./form";

export const metadata = { title: "Accesso amministratore", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await getAdmin()) redirect("/admin");
  const cfgError = authConfigError();
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-5">
      <div className="w-full max-w-sm rounded-3xl bg-paper p-8">
        <p className="font-display text-3xl font-semibold">Screen<span className="text-champagne-text">shade</span></p>
        <p className="mb-6 mt-1 text-sm text-slate">Pannello amministrativo</p>
        {cfgError ? <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800"><strong>Configurazione mancante.</strong> {cfgError} Vedi <code>.env.example</code>.</p> : <LoginForm />}
      </div>
    </div>
  );
}
