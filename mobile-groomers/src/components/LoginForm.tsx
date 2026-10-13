"use client";

import { useState } from "react";
import { signInWithEmail } from "@/lib/supabase/auth-actions";

export default function LoginForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function action(formData: FormData) {
    setPending(true);
    setError("");
    const result = await signInWithEmail(formData);
    setPending(false);
    if (result?.error) setError(result.error);
    else setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded-xl bg-teal-soft p-4 text-sm text-teal-dark">
        <p className="font-semibold">Check your inbox</p>
        <p className="mt-1">
          We sent you a sign-in link. It expires in one hour.
        </p>
      </div>
    );
  }

  return (
    <form action={action}>
      <label className="field-label" htmlFor="login-email">Work email</label>
      <input
        id="login-email"
        name="email"
        type="email"
        className="field"
        placeholder="you@yourbusiness.com"
        required
      />
      {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}
      <button type="submit" className="btn btn-primary btn-block mt-5" disabled={pending}>
        {pending ? "Sending…" : "Email me a sign-in link"}
      </button>
    </form>
  );
}
