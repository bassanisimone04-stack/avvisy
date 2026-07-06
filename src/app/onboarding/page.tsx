"use client";

import Link from "next/link";
import { useState } from "react";
import Logo from "@/components/Logo";
import { cn } from "@/lib/utils";

const steps = ["Struttura", "Primo servizio", "Pronto"] as const;

export default function OnboardingPage() {
  const [step, setStep] = useState(0);

  // Struttura
  const [orgName, setOrgName] = useState("");
  const [address, setAddress] = useState("");
  const [hours, setHours] = useState("");

  // Primo servizio
  const [svcName, setSvcName] = useState("");
  const [svcDuration, setSvcDuration] = useState("30");
  const [svcPrice, setSvcPrice] = useState("");

  const canContinue =
    (step === 0 && orgName.trim().length >= 2) ||
    (step === 1 && svcName.trim().length >= 2) ||
    step === 2;

  const field =
    "rounded-lg border border-line bg-card px-3 py-2.5 text-base outline-none transition-colors focus:border-brand";

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-10">
      <Link href="/" className="mb-6 text-2xl">
        <Logo />
      </Link>

      {/* Indicatore step */}
      <ol className="mb-6 flex items-center gap-2">
        {steps.map((label, i) => (
          <li key={label} className="flex flex-1 flex-col gap-1.5">
            <span
              className={cn(
                "h-1 rounded-full",
                i <= step ? "bg-brand" : "bg-line"
              )}
            />
            <span
              className={cn(
                "text-xs font-medium",
                i === step ? "text-ink" : "text-muted"
              )}
            >
              {label}
            </span>
          </li>
        ))}
      </ol>

      {step === 0 && (
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Parlaci della struttura
            </h1>
            <p className="mt-1 text-sm text-muted">
              Queste informazioni appariranno sulla tua pagina pubblica.
            </p>
          </div>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Nome della struttura</span>
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="Es. CAF Navigli"
              className={field}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Indirizzo</span>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Via, numero, città"
              className={field}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Orari di apertura</span>
            <input
              type="text"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="Es. Lun–Ven 9:00–18:00"
              className={field}
            />
          </label>
        </div>
      )}

      {step === 1 && (
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Aggiungi il primo servizio
            </h1>
            <p className="mt-1 text-sm text-muted">
              È ciò che i clienti potranno prenotare. Potrai aggiungerne altri
              dopo.
            </p>
          </div>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Nome del servizio</span>
            <input
              type="text"
              value={svcName}
              onChange={(e) => setSvcName(e.target.value)}
              placeholder="Es. Dichiarazione 730"
              className={field}
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Durata (min)</span>
              <input
                type="number"
                min={5}
                step={5}
                value={svcDuration}
                onChange={(e) => setSvcDuration(e.target.value)}
                className={field}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Prezzo (facoltativo)</span>
              <input
                type="text"
                value={svcPrice}
                onChange={(e) => setSvcPrice(e.target.value)}
                placeholder="Es. 45 €"
                className={field}
              />
            </label>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="ticket w-full max-w-sm p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">
              Tutto pronto
            </p>
            <p className="mt-3 font-display text-2xl font-bold">
              {orgName || "La tua struttura"} è online
            </p>
            <p className="mt-2 text-sm text-muted">
              Hai la pagina pubblica, il primo servizio
              {svcName ? ` (${svcName})` : ""} e la coda live. Ora puoi ricevere
              le prime prenotazioni.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="mt-2 w-full max-w-sm rounded-full bg-brand px-6 py-3 text-center text-base font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            Vai alla dashboard
          </Link>
        </div>
      )}

      {step < 2 && (
        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="rounded-full border border-line px-6 py-3 text-base font-semibold text-ink transition-colors hover:border-ink disabled:invisible"
          >
            Indietro
          </button>
          <button
            type="button"
            disabled={!canContinue}
            onClick={() => setStep((s) => s + 1)}
            className="rounded-full bg-brand px-7 py-3 text-base font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-40"
          >
            {step === 1 ? "Completa" : "Continua"}
          </button>
        </div>
      )}
    </main>
  );
}
