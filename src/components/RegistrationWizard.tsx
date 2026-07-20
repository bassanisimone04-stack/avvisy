"use client";

import Link from "next/link";
import { useState } from "react";
import { IconCheck, IconDoc, IconShield } from "./icons";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { signUpAction } from "@/lib/supabase/auth-actions";

const steps = [
  "Dati personali",
  "Dati aziendali",
  "Partita IVA",
  "Sede",
  "Ruolo utente",
  "Documenti",
  "Conferma",
];

const sectors = [
  "Meccanica e componentistica",
  "Ricambistica industriale",
  "Edilizia e materiali",
  "Imballaggio e logistica",
  "Elettronica ed elettrotecnica",
  "Utensileria industriale",
  "Arredamento professionale",
  "Materie prime",
];
const regions = ["Lombardia", "Veneto", "Emilia-Romagna", "Piemonte", "Toscana", "Abruzzo", "Campania"];

type Form = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  ragioneSociale: string;
  sector: string;
  vatNumber: string;
  address: string;
  city: string;
  region: string;
};

const initial: Form = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  ragioneSociale: "",
  sector: sectors[0],
  vatNumber: "",
  address: "",
  city: "",
  region: regions[0],
};

export default function RegistrationWizard({ error }: { error?: string }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>(initial);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const last = steps.length - 1;

  function set<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validateStep(s: number): string[] {
    const e: string[] = [];
    if (isSupabaseConfigured) {
      if (s === 0) {
        if (!form.email.trim()) e.push("Inserisci l'email.");
        if (form.password.length < 6) e.push("La password deve avere almeno 6 caratteri.");
      }
      if (s === 1 && !form.ragioneSociale.trim()) e.push("Inserisci la ragione sociale.");
    }
    return e;
  }

  function next() {
    const e = validateStep(step);
    if (e.length) return setErrors(e);
    setErrors([]);
    setStep((s) => Math.min(last, s + 1));
  }

  async function submit() {
    // Modalità reale: crea utente + azienda su Supabase.
    if (isSupabaseConfigured) {
      for (let s = 0; s <= 1; s++) {
        const e = validateStep(s);
        if (e.length) {
          setErrors(e);
          setStep(s);
          return;
        }
      }
      const fd = new FormData();
      fd.set("email", form.email);
      fd.set("password", form.password);
      fd.set("ragioneSociale", form.ragioneSociale);
      fd.set("vatNumber", form.vatNumber);
      fd.set("sector", form.sector);
      fd.set("region", form.region);
      fd.set("province", form.city);
      await signUpAction(fd); // reindirizza in caso di successo
      return;
    }
    // Modalità demo.
    setDone(true);
  }

  if (done) {
    return (
      <div className="card card-soft p-8 text-center">
        <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft text-brand-dark">
          <IconCheck width={32} height={32} />
        </span>
        <h2 className="mt-4 text-2xl font-bold text-ink">Registrazione inviata</h2>
        <p className="mx-auto mt-2 max-w-md text-muted">
          La tua azienda è ora <strong>in verifica</strong>. Nel prototipo la
          verifica KYB è simulata: verrà approvata automaticamente a scopo
          dimostrativo.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/venditore" className="btn btn-primary">Vai all&apos;area venditore</Link>
          <Link href="/compratore" className="btn btn-outline">Vai all&apos;area compratore</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ol className="mb-6 flex flex-wrap gap-2">
        {steps.map((s, i) => (
          <li
            key={s}
            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${
              i === step ? "border-brand bg-brand-soft text-brand-dark" : i < step ? "border-brand/40 bg-surface text-brand-dark" : "border-line bg-surface text-muted"
            }`}
          >
            <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[0.65rem] ${i <= step ? "bg-brand text-white" : "bg-surface-2 text-muted"}`}>
              {i < step ? "✓" : i + 1}
            </span>
            {s}
          </li>
        ))}
      </ol>

      <div className="card card-soft p-6">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-xl font-bold text-ink">{steps[step]}</h2>
          <span className="text-sm text-muted">Passo {step + 1} di {steps.length}</span>
        </div>
        <p className="mb-5 text-sm text-muted">{descriptions[step]}</p>

        {(errors.length > 0 || error) && (
          <ul className="mb-4 space-y-1 rounded-lg bg-danger-soft p-3 text-sm text-danger" role="alert">
            {error && <li>• {error}</li>}
            {errors.map((e) => <li key={e}>• {e}</li>)}
          </ul>
        )}

        <div className="min-h-[220px]">
          <StepFields step={step} form={form} set={set} />
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
          <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="btn btn-ghost btn-sm disabled:opacity-40">
            Indietro
          </button>
          {step < last ? (
            <button onClick={next} className="btn btn-primary btn-sm">Continua</button>
          ) : (
            <button onClick={submit} className="btn btn-primary btn-sm">Invia registrazione</button>
          )}
        </div>
      </div>

      <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-muted">
        <IconShield width={14} height={14} className="text-brand" />
        {isSupabaseConfigured
          ? "Registrazione reale tramite Supabase Auth."
          : "Verifica KYB simulata · dati fittizi, nessun documento reale richiesto."}
      </p>
    </div>
  );
}

const descriptions = [
  "Chi gestirà l'account per conto dell'azienda.",
  "Ragione sociale e settore di attività.",
  "Identificativo fiscale dell'azienda.",
  "Indirizzo della sede legale o operativa.",
  "Il tuo ruolo determina le funzioni disponibili.",
  "Carica i documenti per la verifica (simulata).",
  "Controlla i dati e conferma la registrazione.",
];

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="field-label">{label}</label>
      <input className="field" {...props} />
    </div>
  );
}

function StepFields({
  step,
  form,
  set,
}: {
  step: number;
  form: Form;
  set: <K extends keyof Form>(key: K, value: Form[K]) => void;
}) {
  switch (step) {
    case 0:
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nome" placeholder="Mario" value={form.firstName} onChange={(e) => set("firstName", e.target.value)} />
          <Field label="Cognome" placeholder="Rossi" value={form.lastName} onChange={(e) => set("lastName", e.target.value)} />
          <Field label="Email aziendale" type="email" placeholder="nome@azienda.it" value={form.email} onChange={(e) => set("email", e.target.value)} />
          <Field label="Password" type="password" placeholder="Almeno 6 caratteri" value={form.password} onChange={(e) => set("password", e.target.value)} />
        </div>
      );
    case 1:
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Ragione sociale" placeholder="Azienda Esempio Srl" value={form.ragioneSociale} onChange={(e) => set("ragioneSociale", e.target.value)} />
          <div>
            <label className="field-label">Settore</label>
            <select className="field" value={form.sector} onChange={(e) => set("sector", e.target.value)}>
              {sectors.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <Field label="Sito web (facoltativo)" placeholder="www.azienda.it" />
          <div>
            <label className="field-label">Numero dipendenti</label>
            <select className="field">
              <option>1–10</option>
              <option>11–50</option>
              <option>51–200</option>
              <option>oltre 200</option>
            </select>
          </div>
        </div>
      );
    case 2:
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Partita IVA" placeholder="IT01234567890" value={form.vatNumber} onChange={(e) => set("vatNumber", e.target.value)} />
          <Field label="Codice fiscale azienda" placeholder="01234567890" />
          <Field label="Codice SDI / PEC" placeholder="ABCDEF1 o pec@azienda.it" />
          <div className="sm:col-span-2 flex items-center gap-2 rounded-lg bg-signal-soft p-3 text-sm text-signal">
            <IconShield width={16} height={16} /> La partita IVA verrà validata dalla verifica KYB simulata.
          </div>
        </div>
      );
    case 3:
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Indirizzo" placeholder="Via dell'Industria 12" value={form.address} onChange={(e) => set("address", e.target.value)} />
          <Field label="Città / Provincia" placeholder="Brescia" value={form.city} onChange={(e) => set("city", e.target.value)} />
          <div>
            <label className="field-label">Regione</label>
            <select className="field" value={form.region} onChange={(e) => set("region", e.target.value)}>
              {regions.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>
          <Field label="CAP" placeholder="25100" />
        </div>
      );
    case 4:
      return (
        <div className="grid gap-3">
          {[
            ["Venditore", "Pubblico lotti e gestisco le vendite."],
            ["Compratore", "Cerco e acquisto stock e componenti."],
            ["Entrambi", "Compro e vendo sul marketplace."],
          ].map(([t, d], i) => (
            <label key={t} className="flex cursor-pointer items-center gap-3 rounded-lg border border-line p-3 hover:bg-surface-2">
              <input type="radio" name="ruolo" defaultChecked={i === 0} className="h-4 w-4 accent-[var(--s-brand)]" />
              <span>
                <span className="block text-sm font-semibold text-ink">{t}</span>
                <span className="block text-xs text-muted">{d}</span>
              </span>
            </label>
          ))}
        </div>
      );
    case 5:
      return (
        <div className="space-y-3">
          {["Visura camerale", "Documento del legale rappresentante", "Attestazione partita IVA"].map((d) => (
            <div key={d} className="flex items-center justify-between rounded-lg border border-dashed border-line-strong p-4">
              <span className="flex items-center gap-2 text-sm text-ink-soft">
                <IconDoc width={18} height={18} className="text-muted" /> {d}
              </span>
              <button className="btn btn-outline btn-sm">Carica file</button>
            </div>
          ))}
          <p className="text-xs text-muted">Nel prototipo il caricamento è simulato: nessun file viene trasmesso.</p>
        </div>
      );
    case 6:
      return (
        <div className="space-y-3">
          <div className="rounded-lg bg-surface-2 p-4 text-sm">
            <p className="font-semibold text-ink">Riepilogo</p>
            <ul className="mt-2 space-y-1 text-muted">
              <li>Referente: {form.firstName || "—"} {form.lastName} · {form.email || "—"}</li>
              <li>Azienda: {form.ragioneSociale || "—"} · {form.sector}</li>
              <li>Partita IVA: {form.vatNumber || "—"}</li>
              <li>Sede: {form.city || "—"}, {form.region}</li>
            </ul>
          </div>
          <label className="flex items-start gap-2 text-sm text-ink-soft">
            <input type="checkbox" defaultChecked className="mt-1 h-4 w-4 accent-[var(--s-brand)]" />
            Accetto i termini del servizio.
          </label>
        </div>
      );
    default:
      return null;
  }
}
