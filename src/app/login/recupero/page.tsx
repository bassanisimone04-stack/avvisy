"use client";

import Link from "next/link";
import { useState } from "react";
import Logo from "@/components/Logo";
import { requestPasswordReset } from "@/app/login/actions";

/** Validazione email semplice per il campo di recupero. */
function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function RecuperoPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);

  const field =
    "rounded-lg border border-line bg-card px-3 py-2.5 text-base outline-none transition-colors focus:border-brand";

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-4 py-10">
      <Link href="/" className="text-2xl">
        <Logo />
      </Link>
      <h1 className="mt-6 text-2xl font-bold tracking-tight">
        Recupera l&apos;accesso
      </h1>
      <p className="mt-1 text-sm text-muted">
        Inserisci l&apos;email del tuo account: ti invieremo un link per
        reimpostare la password.
      </p>

      {sent ? (
        <div className="mt-6 rounded-lg bg-brand-soft p-4 text-sm text-ink">
          <p className="font-semibold">Controlla la posta</p>
          <p className="mt-1">
            Se <span className="font-mono">{email.trim()}</span> è associata a un
            account, ti abbiamo inviato un link per reimpostare la password.
            Controlla anche lo spam.
          </p>
        </div>
      ) : (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!isValidEmail(email)) return;
            setPending(true);
            await requestPasswordReset(email);
            setPending(false);
            setSent(true);
          }}
          className="mt-6 flex flex-col gap-4"
        >
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
              placeholder="nome@struttura.it"
              aria-invalid={email !== "" && !isValidEmail(email)}
              className={`${field} aria-[invalid=true]:border-red-500`}
            />
            {email !== "" && !isValidEmail(email) && (
              <span className="text-xs font-medium text-red-600">
                Inserisci un&apos;email valida.
              </span>
            )}
          </label>
          <button
            type="submit"
            disabled={!isValidEmail(email) || pending}
            className="rounded-full bg-brand px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-40"
          >
            {pending ? "Invio…" : "Invia il link di recupero"}
          </button>
        </form>
      )}

      <div className="mt-6 flex items-center justify-between text-sm">
        <Link
          href="/login"
          className="font-semibold text-brand-dark hover:underline"
        >
          ← Torna al login
        </Link>
      </div>
    </main>
  );
}
