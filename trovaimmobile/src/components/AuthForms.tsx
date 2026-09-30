"use client";

import { useState } from "react";
import { loginAction, registerAction } from "@/app/actions";
import { useFormAction } from "./useFormAction";

export function LoginForm({ next }: { next?: string }) {
  const { state, onSubmit, pending } = useFormAction(loginAction);
  return (
    <form onSubmit={onSubmit} className="stack">
      <input type="hidden" name="next" value={next ?? ""} />
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" className="input" autoComplete="email" required />
      </div>
      <div className="field">
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" className="input" autoComplete="current-password" required />
      </div>
      {state?.error && <div className="alert alert-danger">{state.error}</div>}
      <button className="btn btn-primary" disabled={pending}>
        {pending ? "Accesso…" : "Accedi"}
      </button>
    </form>
  );
}

export function RegisterForm({ next, defaultRole }: { next?: string; defaultRole?: string }) {
  const { state, onSubmit, pending } = useFormAction(registerAction);
  const [role, setRole] = useState(defaultRole ?? "seeker");
  return (
    <form onSubmit={onSubmit} className="stack">
      <input type="hidden" name="next" value={next ?? ""} />
      <fieldset>
        <legend>Tipo di account</legend>
        <div className="stack" style={{ gap: 8 }}>
          {[
            ["seeker", "Cerco casa", "Prenoti visite, scrivi agli inserzionisti, lasci recensioni dopo le visite."],
            ["private", "Proprietario privato", "Pubblichi i tuoi immobili. Nessuna commissione consentita."],
            ["agency", "Agenzia / professionista", "Pubblichi per conto terzi. Commissione dichiarata e dovuta solo alla firma."],
          ].map(([v, t, d]) => (
            <label key={v} className="check" style={{ alignItems: "flex-start" }}>
              <input type="radio" name="role" value={v} checked={role === v} onChange={() => setRole(v)} style={{ marginTop: 3 }} />
              <span>
                {t}
                <span className="hint" style={{ display: "block", marginTop: 0 }}>
                  {d}
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="field">
        <label htmlFor="name">Nome e cognome</label>
        <input id="name" name="name" className="input" autoComplete="name" required />
        {role === "private" && <span className="hint">Pubblicamente mostriamo solo nome e iniziale del cognome.</span>}
      </div>
      {role === "agency" && (
        <>
          <div className="field">
            <label htmlFor="agency_name">Ragione sociale</label>
            <input id="agency_name" name="agency_name" className="input" autoComplete="organization" required />
          </div>
          <div className="field">
            <label htmlFor="agency_vat">Partita IVA</label>
            <input id="agency_vat" name="agency_vat" className="input" inputMode="numeric" pattern="(IT)?[0-9]{11}" required />
            <span className="hint">Visibile sul profilo pubblico dell&apos;agenzia.</span>
          </div>
        </>
      )}
      <div className="field">
        <label htmlFor="r-email">Email</label>
        <input id="r-email" name="email" type="email" className="input" autoComplete="email" required />
      </div>
      <div className="field">
        <label htmlFor="r-password">Password</label>
        <input id="r-password" name="password" type="password" className="input" minLength={8} autoComplete="new-password" required />
        <span className="hint">Almeno 8 caratteri.</span>
      </div>
      {state?.error && <div className="alert alert-danger">{state.error}</div>}
      <button className="btn btn-primary" disabled={pending}>
        {pending ? "Creazione…" : "Crea account"}
      </button>
    </form>
  );
}
