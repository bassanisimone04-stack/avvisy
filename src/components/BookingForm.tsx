"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Organization, Service } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";

type Props = {
  org: Organization;
  services: Service[];
  defaultServiceId?: string;
};

const steps = ["Servizio", "Data e ora", "I tuoi dati"] as const;

const timeSlots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
];

function nextDays(count: number) {
  const days: string[] = [];
  const d = new Date();
  while (days.length < count) {
    d.setDate(d.getDate() + 1);
    const weekday = d.getDay();
    if (weekday !== 0) days.push(d.toISOString().slice(0, 10)); // salta la domenica
  }
  return days;
}

export default function BookingForm({ org, services, defaultServiceId }: Props) {
  const days = useMemo(() => nextDays(6), []);
  const bookingId = useMemo(
    () => `apt-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    []
  );

  const [step, setStep] = useState(0);
  const [serviceId, setServiceId] = useState(
    defaultServiceId && services.some((s) => s.id === defaultServiceId)
      ? defaultServiceId
      : ""
  );
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const service = services.find((s) => s.id === serviceId) ?? null;

  const canContinue =
    (step === 0 && serviceId !== "") ||
    (step === 1 && date !== "" && time !== "") ||
    (step === 2 && name.trim() !== "" && phone.trim() !== "");

  const checkinHref =
    service &&
    `/checkin/${bookingId}?${new URLSearchParams({
      org: org.slug,
      service: service.id,
      name: name.trim(),
      phone: phone.trim(),
      date,
      time,
    }).toString()}`;

  if (confirmed && service) {
    return (
      <div className="ticket mx-auto max-w-sm p-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted">
          Prenotazione confermata
        </p>
        <p className="mt-3 font-display text-xl font-bold">{service.name}</p>
        <p className="mt-1 text-sm text-muted">{org.name}</p>
        <p className="mt-4 font-mono text-3xl font-bold text-brand-dark">
          {formatDate(date)} · {time}
        </p>
        <div className="ticket-divider my-5" />
        <p className="text-sm text-muted">
          Ti abbiamo inviato un SMS a {phone}. Il giorno dell&apos;appuntamento
          fai il check-in per ricevere il tuo numero.
        </p>
        <Link
          href={checkinHref || "/checkin/demo-appointment"}
          className="mt-5 block rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          Vai al check-in
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-line bg-card p-5 sm:p-6">
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
        <fieldset>
          <legend className="mb-3 font-display text-lg font-bold">
            Scegli il servizio
          </legend>
          <div className="flex flex-col gap-2">
            {services.map((s) => (
              <label
                key={s.id}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-3 rounded-lg border p-3 transition-colors",
                  serviceId === s.id
                    ? "border-brand bg-brand-soft"
                    : "border-line hover:border-muted"
                )}
              >
                <span>
                  <span className="block text-sm font-semibold">{s.name}</span>
                  <span className="block font-mono text-xs text-muted">
                    {s.durationMin} min{s.price ? ` · ${s.price}` : ""}
                  </span>
                </span>
                <input
                  type="radio"
                  name="service"
                  value={s.id}
                  checked={serviceId === s.id}
                  onChange={() => setServiceId(s.id)}
                  className="h-4 w-4 accent-(--color-brand)"
                />
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {step === 1 && (
        <div>
          <h2 className="mb-3 font-display text-lg font-bold">
            Scegli data e ora
          </h2>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {days.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDate(d)}
                className={cn(
                  "shrink-0 rounded-lg border px-3 py-2 text-sm font-medium capitalize transition-colors",
                  date === d
                    ? "border-brand bg-brand-soft text-brand-dark"
                    : "border-line hover:border-muted"
                )}
              >
                {formatDate(d)}
              </button>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5">
            {timeSlots.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTime(t)}
                disabled={!date}
                className={cn(
                  "rounded-lg border py-2 font-mono text-sm transition-colors disabled:opacity-40",
                  time === t
                    ? "border-brand bg-brand-soft font-bold text-brand-dark"
                    : "border-line hover:border-muted"
                )}
              >
                {t}
              </button>
            ))}
          </div>
          {!date && (
            <p className="mt-3 text-xs text-muted">
              Seleziona prima una data per scegliere l&apos;orario.
            </p>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-4">
          <h2 className="font-display text-lg font-bold">I tuoi dati</h2>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Nome e cognome</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Es. Giulia Ferrari"
              className="rounded-lg border border-line bg-card px-3 py-2.5 text-sm outline-none transition-colors focus:border-brand"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Telefono</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Es. +39 340 123 4567"
              className="rounded-lg border border-line bg-card px-3 py-2.5 text-sm outline-none transition-colors focus:border-brand"
            />
            <span className="text-xs text-muted">
              Ti avvisiamo via SMS quando sta per arrivare il tuo turno.
            </span>
          </label>
          {service && date && time && (
            <p className="rounded-lg bg-canvas p-3 text-sm text-muted">
              Riepilogo: <strong className="text-ink">{service.name}</strong>{" "}
              da {org.name}, {formatDate(date)} alle {time}.
            </p>
          )}
        </div>
      )}

      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="rounded-full border border-line px-6 py-3 text-base font-semibold text-ink transition-colors hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:invisible"
        >
          Indietro
        </button>
        <button
          type="button"
          disabled={!canContinue}
          onClick={() =>
            step < 2 ? setStep((s) => s + 1) : setConfirmed(true)
          }
          className="rounded-full bg-brand px-7 py-3 text-base font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-40"
        >
          {step < 2 ? "Continua" : "Conferma prenotazione"}
        </button>
      </div>
    </div>
  );
}
