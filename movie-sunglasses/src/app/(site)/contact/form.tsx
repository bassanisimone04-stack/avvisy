"use client";
import { startTransition, useActionState } from "react";
import { sendMessage, type ContactState } from "./actions";

const input = "mt-1 w-full rounded-lg border border-line bg-white px-4 py-3 text-base";
export function ContactForm() {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendMessage, { ok: false, message: "" });
  if (state.ok) return <p role="status" className="rounded-2xl border border-champagne bg-champagne-light/40 p-6">{state.message}</p>;
  return (
    <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); startTransition(() => action(fd)); }} className="space-y-5">
      <div><label htmlFor="c-name" className="text-sm font-medium">Name</label><input id="c-name" name="name" required maxLength={100} autoComplete="name" className={input} /></div>
      <div><label htmlFor="c-email" className="text-sm font-medium">Email</label><input id="c-email" name="email" type="email" required maxLength={200} autoComplete="email" className={input} /></div>
      <div><label htmlFor="c-subject" className="text-sm font-medium">Subject</label><input id="c-subject" name="subject" maxLength={150} className={input} /></div>
      <div><label htmlFor="c-body" className="text-sm font-medium">Message</label><textarea id="c-body" name="body" required minLength={10} maxLength={4000} rows={6} className={input} /></div>
      <div aria-hidden className="absolute -left-[9999px]"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      {state.message && <p role="alert" className="text-sm text-red-700">{state.message}</p>}
      <button disabled={pending} className="rounded-full bg-ink px-8 py-3 text-sm font-medium text-white hover:bg-champagne-text disabled:opacity-60">{pending ? "Sending…" : "Send message"}</button>
    </form>
  );
}
