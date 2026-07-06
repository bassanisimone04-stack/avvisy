"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signIn } from "./actions";

export default function LoginPage() {
  const [state, action, pending] = useActionState(signIn, { error: null });

  const field =
    "rounded-lg border border-line bg-card px-3 py-2.5 text-base outline-none transition-colors focus:border-brand";

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-4 py-10">
      <Link href="/" className="font-display text-2xl font-bold tracking-tight">
        Avvisy<span className="text-brand">.</span>
      </Link>
      <h1 className="mt-6 text-2xl font-bold tracking-tight">
        Accedi alla dashboard
      </h1>
      <p className="mt-1 text-sm text-muted">
        Area riservata ai gestori delle strutture.
      </p>

      <form action={action} className="mt-6 flex flex-col gap-4">
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
            autoComplete="current-password"
            required
            placeholder="••••••••"
            className={field}
          />
        </label>

        {state.error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-brand px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-40"
        >
          {pending ? "Accesso…" : "Accedi"}
        </button>

        <Link
          href="/login/recupero"
          className="text-center text-sm font-semibold text-brand-dark hover:underline"
        >
          Password dimenticata?
        </Link>
      </form>

      <div className="mt-6 rounded-lg bg-signal-soft p-3 text-sm text-ink">
        <p className="font-semibold">Accesso demo</p>
        <p className="mt-1">
          Email <span className="font-mono">demo@avvisy.app</span> · password{" "}
          <span className="font-mono">avvisy</span>. Impianto provvisorio: la
          verifica sicura arriverà con Supabase.
        </p>
      </div>
    </main>
  );
}
