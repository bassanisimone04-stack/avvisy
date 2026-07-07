"use client";

import Link from "next/link";
import { useActionState } from "react";
import Logo from "@/components/Logo";
import { signUp } from "./actions";

export default function RegistratiPage() {
  const [state, action, pending] = useActionState(signUp, {
    error: null,
    info: null,
  });

  const field =
    "rounded-lg border border-line bg-card px-3 py-2.5 text-base outline-none transition-colors focus:border-brand";

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-4 py-10">
      <Link href="/" className="text-2xl">
        <Logo />
      </Link>
      <h1 className="mt-6 text-2xl font-bold tracking-tight">
        Crea l&apos;account della struttura
      </h1>
      <p className="mt-1 text-sm text-muted">
        7 giorni di prova gratuita. Nessuna carta richiesta ora.
      </p>

      <form action={action} className="mt-6 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">Nome della struttura</span>
          <input
            type="text"
            name="org"
            required
            placeholder="Es. CAF Navigli"
            className={field}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">Email</span>
          <input
            type="email"
            name="email"
            autoComplete="username"
            required
            placeholder="nome@struttura.it"
            className={field}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">Password</span>
          <input
            type="password"
            name="password"
            autoComplete="new-password"
            required
            minLength={8}
            placeholder="Almeno 8 caratteri"
            className={field}
          />
        </label>

        <label className="flex items-start gap-2.5">
          <input
            type="checkbox"
            name="consent"
            className="mt-0.5 h-5 w-5 shrink-0 accent-(--color-brand)"
          />
          <span className="text-sm text-muted">
            Accetto i{" "}
            <Link
              href="/termini"
              target="_blank"
              className="font-semibold text-brand-dark hover:underline"
            >
              Termini di servizio
            </Link>{" "}
            e l&apos;{" "}
            <Link
              href="/privacy"
              target="_blank"
              className="font-semibold text-brand-dark hover:underline"
            >
              informativa privacy
            </Link>
            .
          </span>
        </label>

        {state.error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
            {state.error}
          </p>
        )}

        {state.info && (
          <p className="rounded-lg bg-brand-soft px-3 py-2 text-sm font-medium text-brand-dark">
            {state.info}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-brand px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-40"
        >
          {pending ? "Creazione…" : "Inizia la prova gratuita"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Hai già un account?{" "}
        <Link
          href="/login"
          className="font-semibold text-brand-dark hover:underline"
        >
          Accedi
        </Link>
      </p>
    </main>
  );
}
