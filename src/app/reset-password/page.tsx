"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "@/components/Logo";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [status, setStatus] = useState<
    "loading" | "ready" | "invalid" | "unconfigured"
  >("loading");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setStatus("unconfigured");
      return;
    }
    const supabase = createClient();
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        setStatus(error ? "invalid" : "ready");
      });
    } else {
      // Flusso implicito: il token è già stato letto dall'URL dal client.
      supabase.auth.getSession().then(({ data }) => {
        setStatus(data.session ? "ready" : "invalid");
      });
    }
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setError("La password deve avere almeno 8 caratteri.");
      return;
    }
    setPending(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setPending(false);
    if (error) {
      setError("Non è stato possibile aggiornare la password. Riprova.");
      return;
    }
    setDone(true);
    setTimeout(() => router.push("/dashboard"), 1600);
  }

  const field =
    "rounded-lg border border-line bg-card px-3 py-2.5 text-base outline-none transition-colors focus:border-brand";

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-4 py-10">
      <Link href="/" className="text-2xl">
        <Logo />
      </Link>
      <h1 className="mt-6 text-2xl font-bold tracking-tight">
        Nuova password
      </h1>

      {status === "loading" && (
        <p className="mt-4 text-sm text-muted">Verifica del link in corso…</p>
      )}

      {status === "unconfigured" && (
        <p className="mt-4 rounded-lg bg-signal-soft p-3 text-sm text-ink">
          Il recupero password funziona sul sito online. In questa modalità
          demo non è disponibile.
        </p>
      )}

      {status === "invalid" && (
        <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          <p className="font-semibold">Link non valido o scaduto</p>
          <p className="mt-1">
            Richiedi un nuovo link dalla pagina di recupero.
          </p>
          <Link
            href="/login/recupero"
            className="mt-3 inline-block font-semibold text-brand-dark hover:underline"
          >
            Richiedi un nuovo link
          </Link>
        </div>
      )}

      {status === "ready" && !done && (
        <>
          <p className="mt-1 text-sm text-muted">
            Scegli una nuova password per il tuo account.
          </p>
          <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Nuova password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
                minLength={8}
                placeholder="Almeno 8 caratteri"
                className={field}
              />
            </label>
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={pending}
              className="rounded-full bg-brand px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-40"
            >
              {pending ? "Salvataggio…" : "Salva la nuova password"}
            </button>
          </form>
        </>
      )}

      {done && (
        <div className="mt-4 rounded-lg bg-brand-soft p-4 text-sm text-brand-dark">
          <p className="font-semibold">Password aggiornata ✓</p>
          <p className="mt-1">Ti stiamo portando alla dashboard…</p>
        </div>
      )}
    </main>
  );
}
