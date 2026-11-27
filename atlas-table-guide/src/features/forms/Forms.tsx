"use client";

import { useActionState, useId } from "react";
import clsx from "clsx";
import { subscribeNewsletter, submitForm, type FormState } from "./actions";
import { Notice } from "@/components/ui/ui";
import type { Dict } from "@/i18n/en";

type FormDict = Dict["forms"] & { submit: string; sending: string };

function Result({ state, d, doneMsg }: { state: FormState; d: FormDict; doneMsg: string }) {
  if (state.status === "success") return <Notice tone="success">{doneMsg}</Notice>;
  if (state.status === "pending-no-email") return <Notice tone="warning">{d.success} {d.doubleOptIn.split(" — ")[0]} — confirmation emails are not configured yet on this deployment.</Notice>;
  if (state.status === "not-configured") return <Notice tone="warning">{d.notConfigured}</Notice>;
  if (state.status === "rate-limited") return <Notice tone="error">{d.rateLimited}</Notice>;
  if (state.status === "error" && !state.errors) return <Notice tone="error">Error — please try again.</Notice>;
  return null;
}

const input = "min-h-11 w-full rounded-[8px] border border-line bg-white px-3 text-ink placeholder:text-stone/80";

export function NewsletterForm({ locale, d, entity, privacyHref, cities, compact, dark }: { locale: string; d: FormDict; entity: string; privacyHref: string; cities?: { slug: string; name: string }[]; compact?: boolean; dark?: boolean }) {
  const [state, action, pending] = useActionState(subscribeNewsletter, { status: "idle" });
  const id = useId();
  const err = state.errors ?? {};
  return (
    <form action={action} noValidate className={clsx("space-y-3", dark && "on-dark")} aria-describedby={`${id}-gdpr`}>
      <input type="hidden" name="locale" value={locale} />
      <div className="hidden" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      {Object.keys(err).length > 0 && (
        <div role="alert" className="rounded-[8px] border border-carmine/40 bg-blush p-3 text-sm text-ink">
          <p className="font-semibold">{d.errorSummary}</p>
          <ul className="list-disc pl-5">{err.email && <li><a href={`#${id}-email`} className="underline">{d.invalidEmail}</a></li>}{err.consent && <li><a href={`#${id}-consent`} className="underline">{d.consentRequired}</a></li>}</ul>
        </div>
      )}
      <div className={clsx("flex gap-2", compact ? "flex-col sm:flex-row" : "flex-col sm:flex-row")}>
        <label htmlFor={`${id}-email`} className="sr-only">{d.email}</label>
        <input id={`${id}-email`} name="email" type="email" autoComplete="email" required placeholder={d.email} aria-invalid={!!err.email} aria-describedby={err.email ? `${id}-email-err` : undefined} className={input} />
        <button type="submit" disabled={pending} className={clsx("min-h-11 shrink-0 rounded-[8px] px-5 text-sm font-semibold", dark ? "bg-ivory text-garnet hover:bg-white" : "bg-carmine text-white hover:bg-red-700")}>{pending ? d.sending : d.subscribe}</button>
      </div>
      {err.email && <p id={`${id}-email-err`} className={clsx("text-sm", dark ? "text-ivory" : "text-carmine")}>{d.invalidEmail}</p>}
      {!compact && (
        <fieldset className="grid gap-3 sm:grid-cols-2">
          <div>
            <legend className="mb-1 text-sm font-semibold">{d.topics}</legend>
            <div className="flex flex-wrap gap-x-4">{Object.entries(d.topicsList).map(([k, v]) => <label key={k} className="inline-flex min-h-9 items-center gap-2 text-sm"><input type="checkbox" name="topics" value={k} className="h-4 w-4 accent-[var(--red-600)]" />{v}</label>)}</div>
          </div>
          {cities && (
            <div>
              <label htmlFor={`${id}-cities`} className="mb-1 block text-sm font-semibold">{d.cities}</label>
              <select id={`${id}-cities`} name="cities" multiple className="h-24 w-full rounded-[8px] border border-line bg-white p-1 text-sm text-ink">{cities.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select>
            </div>
          )}
        </fieldset>
      )}
      <label htmlFor={`${id}-consent`} className="flex items-start gap-2 text-sm">
        <input id={`${id}-consent`} type="checkbox" name="consent" required aria-invalid={!!err.consent} className="mt-1 h-4 w-4 shrink-0 accent-[var(--red-600)]" />
        <span>{d.consent}</span>
      </label>
      <p id={`${id}-gdpr`} className={clsx("text-xs", dark ? "text-ivory/90" : "text-stone")}>{d.doubleOptIn} {d.gdpr.replace("{entity}", entity)} <a href={privacyHref} className="underline">{privacyHref.includes("/it/") ? "Privacy" : "Privacy policy"}</a></p>
      <div aria-live="polite"><Result state={state} d={d} doneMsg={d.newsletterSuccess} /></div>
    </form>
  );
}

export function MessageForm({ kind, d, subjectRef, fields = ["name", "email", "message"], messageLabel, submitLabel, extra }: {
  kind: "contact" | "correction" | "waitlist" | "concierge" | "claim" | "partner-lead" | "gift-interest";
  d: FormDict; subjectRef?: string; fields?: ("name" | "email" | "message")[]; messageLabel?: string; submitLabel?: string;
  extra?: { name: string; label: string; type?: "text" | "select" | "number" | "date"; options?: { value: string; label: string }[]; required?: boolean }[];
}) {
  const [state, action, pending] = useActionState(submitForm, { status: "idle" });
  const id = useId();
  const err = state.errors ?? {};
  const msgs: Record<string, string> = { email: d.invalidEmail, message: d.tooShort, name: d.name };
  return (
    <form action={action} noValidate className="space-y-4">
      <input type="hidden" name="kind" value={kind} />
      {subjectRef && <input type="hidden" name="subject_ref" value={subjectRef} />}
      <div className="hidden" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      {Object.keys(err).length > 0 && (
        <div role="alert" className="rounded-[8px] border border-carmine/40 bg-blush p-3 text-sm">
          <p className="font-semibold">{d.errorSummary}</p>
          <ul className="list-disc pl-5">{Object.keys(err).map((k) => <li key={k}><a className="underline" href={`#${id}-${k}`}>{msgs[k] ?? k}</a></li>)}</ul>
        </div>
      )}
      {fields.includes("name") && (
        <div><label htmlFor={`${id}-name`} className="mb-1 block text-sm font-semibold">{d.name}</label><input id={`${id}-name`} name="name" autoComplete="name" className={input} /></div>
      )}
      <div>
        <label htmlFor={`${id}-email`} className="mb-1 block text-sm font-semibold">{d.email} <span className="font-normal text-stone">({"*"})</span></label>
        <input id={`${id}-email`} name="email" type="email" autoComplete="email" required aria-invalid={!!err.email} className={input} />
      </div>
      {extra?.map((x) => (
        <div key={x.name}>
          <label htmlFor={`${id}-${x.name}`} className="mb-1 block text-sm font-semibold">{x.label}</label>
          {x.type === "select" ? (
            <select id={`${id}-${x.name}`} name={x.name} className={input}>{x.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
          ) : (
            <input id={`${id}-${x.name}`} name={x.name} type={x.type ?? "text"} required={x.required} className={input} />
          )}
        </div>
      ))}
      {fields.includes("message") && (
        <div>
          <label htmlFor={`${id}-message`} className="mb-1 block text-sm font-semibold">{messageLabel ?? d.message} <span className="font-normal text-stone">(*)</span></label>
          <textarea id={`${id}-message`} name="message" rows={5} required aria-invalid={!!err.message} className={clsx(input, "py-2")} />
        </div>
      )}
      <button type="submit" disabled={pending} className="inline-flex min-h-11 items-center rounded-[8px] bg-carmine px-5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">{pending ? d.sending : (submitLabel ?? d.submit)}</button>
      <div aria-live="polite"><Result state={state} d={d} doneMsg={d.success} /></div>
    </form>
  );
}
