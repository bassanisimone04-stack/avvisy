"use client";

import { useActionState } from "react";
import { login, loginSupabase } from "@/features/admin/actions";

const input = "mt-1 min-h-11 w-full rounded-[8px] border border-line px-3";
const hasSupabase = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function AdminLogin() {
  const [sb, sbAction, sbPending] = useActionState(loginSupabase, {});
  const [dev, devAction, devPending] = useActionState(login, {});
  return (
    <main id="main" className="grid min-h-screen place-items-center p-6">
      <div className="w-full max-w-sm space-y-6 rounded-[12px] border border-line bg-white p-6 shadow-card">
        <h1 className="text-2xl">Admin sign-in</h1>
        {hasSupabase ? (
          <form action={sbAction}>
            <p className="text-sm text-stone">Sign in with your staff account. Your role (admin, editor, data-verifier…) is read from the database.</p>
            <label htmlFor="em" className="mt-4 block text-sm font-semibold">Email</label>
            <input id="em" name="email" type="email" required autoComplete="username" className={input} />
            <label htmlFor="pw" className="mt-3 block text-sm font-semibold">Password</label>
            <input id="pw" name="password" type="password" required autoComplete="current-password" className={input} />
            {sb.error && <p role="alert" className="mt-2 text-sm text-carmine">{sb.error}</p>}
            <button type="submit" disabled={sbPending} className="mt-4 min-h-11 w-full rounded-[8px] bg-carmine text-sm font-semibold text-white">Sign in</button>
          </form>
        ) : null}
        {process.env.NODE_ENV !== "production" && (
          <form action={devAction}>
            <p className="text-sm text-stone">Development only: use the development admin token (see .env.example).</p>
            <label htmlFor="tok" className="mt-3 block text-sm font-semibold">Token</label>
            <input id="tok" name="token" type="password" required autoComplete="off" className={input} />
            {dev.error && <p role="alert" className="mt-2 text-sm text-carmine">{dev.error}</p>}
            <button type="submit" disabled={devPending} className="mt-4 min-h-11 w-full rounded-[8px] border border-carmine text-sm font-semibold text-carmine">Sign in (development)</button>
          </form>
        )}
        {!hasSupabase && process.env.NODE_ENV === "production" && <p className="text-sm text-stone">Admin sign-in requires Supabase Auth, which is not configured.</p>}
      </div>
    </main>
  );
}
