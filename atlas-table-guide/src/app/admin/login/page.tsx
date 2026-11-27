"use client";

import { useActionState } from "react";
import { login } from "@/features/admin/actions";

export default function AdminLogin() {
  const [state, action, pending] = useActionState(login, {});
  return (
    <main id="main" className="grid min-h-screen place-items-center p-6">
      <form action={action} className="w-full max-w-sm rounded-[12px] border border-line bg-white p-6 shadow-card">
        <h1 className="font-serif text-2xl">Admin sign-in</h1>
        <p className="mt-1 text-sm text-stone">Production uses Supabase Auth with role-based access. In development, use the development admin token (see .env.example).</p>
        <label htmlFor="tok" className="mt-4 block text-sm font-semibold">Token</label>
        <input id="tok" name="token" type="password" required autoComplete="current-password" className="mt-1 min-h-11 w-full rounded-[8px] border border-line px-3" />
        {state.error && <p role="alert" className="mt-2 text-sm text-carmine">{state.error}</p>}
        <button type="submit" disabled={pending} className="mt-4 min-h-11 w-full rounded-[8px] bg-carmine text-sm font-semibold text-white">Sign in</button>
      </form>
    </main>
  );
}
