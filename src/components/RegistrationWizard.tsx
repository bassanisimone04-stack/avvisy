"use client";

import Link from "next/link";
import { useState } from "react";
import { IconCheck, IconDoc, IconShield } from "./icons";

const steps = [
  "Dati personali",
  "Dati aziendali",
  "Partita IVA",
  "Sede",
  "Ruolo utente",
  "Documenti",
  "Conferma",
];

export default function RegistrationWizard() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const last = steps.length - 1;

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
          <Link href="/venditore" className="btn btn-primary">
            Vai all&apos;area venditore
          </Link>
          <Link href="/compratore" className="btn btn-outline">
            Vai all&apos;area compratore
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Stepper */}
      <ol className="mb-6 flex flex-wrap gap-2">
        {steps.map((s, i) => (
          <li
            key={s}
            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${
              i === step
                ? "border-brand bg-brand-soft text-brand-dark"
                : i < step
                  ? "border-brand/40 bg-surface text-brand-dark"
                  : "border-line bg-surface text-muted"
            }`}
          >
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full text-[0.65rem] ${
                i < step ? "bg-brand text-white" : i === step ? "bg-brand text-white" : "bg-surface-2 text-muted"
              }`}
            >
              {i < step ? "✓" : i + 1}
            </span>
            {s}
          </li>
        ))}
      </ol>

      <div className="card card-soft p-6">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-xl font-bold text-ink">{steps[step]}</h2>
          <span className="text-sm text-muted">
            Passo {step + 1} di {steps.length}
          </span>
        </div>
        <p className="mb-5 text-sm text-muted">{descriptions[step]}</p>

        <div className="min-h-[220px]">
          <StepFields step={step} />
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="btn btn-ghost btn-sm disabled:opacity-40"
          >
            Indietro
          </button>
          {step < last ? (
            <button
              onClick={() => setStep((s) => Math.min(last, s + 1))}
              className="btn btn-primary btn-sm"
            >
              Continua
            </button>
          ) : (
            <button onClick={() => setDone(true)} className="btn btn-primary btn-sm">
              Invia registrazione
            </button>
          )}
        </div>
      </div>

      <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-muted">
        <IconShield width={14} height={14} className="text-brand" />
        Verifica KYB simulata · dati fittizi, nessun documento reale richiesto.
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

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="field-label">{label}</label>
      <input className="field" {...props} />
    </div>
  );
}

function StepFields({ step }: { step: number }) {
  switch (step) {
    case 0:
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nome" placeholder="Mario" />
          <Field label="Cognome" placeholder="Rossi" />
          <Field label="Email aziendale" type="email" placeholder="nome@azienda.it" />
          <Field label="Telefono" placeholder="+39 000 0000000" />
        </div>
      );
    case 1:
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Ragione sociale" placeholder="Azienda Esempio Srl" />
          <div>
            <label className="field-label">Settore</label>
            <select className="field">
              <option>Meccanica e componentistica</option>
              <option>Ricambistica industriale</option>
              <option>Edilizia e materiali</option>
              <option>Imballaggio e logistica</option>
              <option>Elettronica ed elettrotecnica</option>
              <option>Utensileria industriale</option>
              <option>Arredamento professionale</option>
              <option>Materie prime</option>
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
          <Field label="Partita IVA" placeholder="IT01234567890" />
          <Field label="Codice fiscale azienda" placeholder="01234567890" />
          <Field label="Codice SDI / PEC" placeholder="ABCDEF1 o pec@azienda.it" />
          <div className="sm:col-span-2 flex items-center gap-2 rounded-lg bg-signal-soft p-3 text-sm text-signal">
            <IconShield width={16} height={16} /> La partita IVA verrà validata
            dalla verifica KYB simulata.
          </div>
        </div>
      );
    case 3:
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Indirizzo" placeholder="Via dell'Industria 12" />
          <Field label="Città" placeholder="Brescia" />
          <div>
            <label className="field-label">Regione</label>
            <select className="field">
              {["Lombardia","Veneto","Emilia-Romagna","Piemonte","Toscana","Abruzzo","Campania"].map((r) => (
                <option key={r}>{r}</option>
              ))}
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
            <label
              key={t}
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-line p-3 hover:bg-surface-2"
            >
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
          <p className="text-xs text-muted">
            Nel prototipo il caricamento è simulato: nessun file viene trasmesso.
          </p>
        </div>
      );
    case 6:
      return (
        <div className="space-y-3">
          <div className="rounded-lg bg-surface-2 p-4 text-sm">
            <p className="font-semibold text-ink">Riepilogo</p>
            <ul className="mt-2 space-y-1 text-muted">
              <li>Referente: Mario Rossi · nome@azienda.it</li>
              <li>Azienda: Azienda Esempio Srl · Meccanica e componentistica</li>
              <li>Partita IVA: IT01234567890</li>
              <li>Sede: Brescia, Lombardia</li>
              <li>Ruolo: Venditore</li>
              <li>Documenti: 3 caricati (simulati)</li>
            </ul>
          </div>
          <label className="flex items-start gap-2 text-sm text-ink-soft">
            <input type="checkbox" defaultChecked className="mt-1 h-4 w-4 accent-[var(--s-brand)]" />
            Accetto i termini del servizio e confermo che i dati sono fittizi a
            scopo dimostrativo.
          </label>
        </div>
      );
    default:
      return null;
  }
}
