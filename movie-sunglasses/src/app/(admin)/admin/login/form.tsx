"use client";
import { useActionState } from "react";
import { loginAction } from "./actions";

const input = "mt-1 w-full rounded-lg border border-line bg-white px-4 py-3";
export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, { error: "", email: "" });
  return (
    <form action={action} className="space-y-5">
      <div><label htmlFor="email" className="text-sm font-medium">Email</label><input id="email" name="email" type="email" required autoComplete="username" defaultValue={state.email} className={input} /></div>
      <div><label htmlFor="password" className="text-sm font-medium">Password</label><input id="password" name="password" type="password" required autoComplete="current-password" className={input} /></div>
      {state.error && <p role="alert" className="text-sm text-red-700">{state.error}</p>}
      <button disabled={pending} className="w-full rounded-full bg-ink py-3 text-sm font-medium text-white hover:bg-champagne-text disabled:opacity-60">{pending ? "Accesso…" : "Accedi"}</button>
    </form>
  );
}
