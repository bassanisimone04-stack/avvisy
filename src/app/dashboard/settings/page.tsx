"use client";

import { useState } from "react";
import { organizations } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const org = organizations[0]; // CAF Navigli (mock)

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-line bg-card p-4">
      <div>
        <p className="text-sm font-semibold">{label}</p>
        <p className="mt-0.5 text-sm text-muted">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
          checked ? "bg-brand" : "bg-line"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-5.5" : "translate-x-0.5"
          )}
        />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const [name, setName] = useState(org.name);
  const [address, setAddress] = useState(`${org.address}, ${org.city}`);
  const [hours, setHours] = useState(org.openingHours);
  const [queueOpen, setQueueOpen] = useState(org.queueOpen);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const embed = `<iframe src="https://avvisy.app/widget/${org.slug}" width="360" height="280" style="border:0;border-radius:16px" title="Prenota con Avvisy"></iframe>`;

  async function copyEmbed() {
    try {
      await navigator.clipboard.writeText(embed);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignora */
    }
  }

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">Impostazioni</h1>
      <p className="mt-1 text-sm text-muted">
        Le informazioni della tua struttura, visibili sulla pagina pubblica.
      </p>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 rounded-xl border border-line bg-card p-5">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Nome della struttura</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg border border-line px-3 py-2.5 text-sm outline-none transition-colors focus:border-brand"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Indirizzo</span>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="rounded-lg border border-line px-3 py-2.5 text-sm outline-none transition-colors focus:border-brand"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Orari di apertura</span>
            <input
              type="text"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="rounded-lg border border-line px-3 py-2.5 text-sm outline-none transition-colors focus:border-brand"
            />
          </label>
          <div className="rounded-lg bg-canvas p-3 font-mono text-xs text-muted">
            Pagina pubblica: avvisy.app/s/{org.slug}
          </div>
        </div>

        <Toggle
          checked={queueOpen}
          onChange={setQueueOpen}
          label="Coda live aperta"
          description="I clienti con check-in entrano in coda e seguono il turno dal telefono."
        />
        <Toggle
          checked={pushNotifications}
          onChange={setPushNotifications}
          label="Notifiche push"
          description="Avvisa i clienti sul telefono quando sta per arrivare il loro turno. Gratuite e immediate."
        />

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSaved(true)}
            className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            Salva modifiche
          </button>
          {saved && (
            <p className="text-sm font-medium text-brand-dark">
              Modifiche salvate (demo, solo in locale).
            </p>
          )}
        </div>
        </div>

        {/* Anteprima live della pagina pubblica */}
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
            Anteprima pagina pubblica
          </p>
          <div className="rounded-xl border border-line bg-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              {org.category}
            </p>
            <h2 className="mt-1 font-display text-xl font-bold tracking-tight">
              {name || "Nome della struttura"}
            </h2>
            <p className="mt-2 text-sm text-muted">{address}</p>
            <p className="mt-1 text-sm text-muted">{hours}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-brand px-4 py-1.5 text-xs font-semibold text-white">
                Prenota
              </span>
              {queueOpen && (
                <span className="rounded-full bg-brand-soft px-3 py-1.5 text-xs font-semibold text-brand-dark">
                  Coda aperta
                </span>
              )}
              {pushNotifications && (
                <span className="rounded-full bg-canvas px-3 py-1.5 text-xs font-semibold text-muted">
                  Notifiche push
                </span>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* Widget da incorporare nel proprio sito */}
      <section className="mt-8 max-w-2xl">
        <h2 className="text-lg font-bold">Widget per il tuo sito</h2>
        <p className="mt-1 text-sm text-muted">
          Incolla questo codice nel sito della tua struttura: i clienti
          potranno prenotare direttamente da lì.
        </p>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-canvas p-3 font-mono text-xs text-ink">
          {embed}
        </pre>
        <button
          type="button"
          onClick={copyEmbed}
          className="mt-3 rounded-full border border-line bg-card px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          {copied ? "Codice copiato ✓" : "Copia codice"}
        </button>
      </section>
    </>
  );
}
