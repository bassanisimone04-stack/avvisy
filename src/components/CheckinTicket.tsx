"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import type { Appointment, Organization, Service } from "@/lib/types";
import { formatDate, generateTicket } from "@/lib/utils";

type Props = {
  appointment: Appointment;
  org: Organization;
  service: Service | null;
};

export default function CheckinTicket({ appointment, org, service }: Props) {
  const [ticket, setTicket] = useState(appointment.ticket);
  const [shared, setShared] = useState(false);
  const checkedIn = ticket !== null;

  function doCheckin() {
    setTicket((current) => current ?? generateTicket());
  }

  async function share() {
    const data = {
      title: `Il tuo numero: ${ticket}`,
      text: `${service?.name ?? "Appuntamento"} · ${org.name} — numero ${ticket}`,
      url: typeof window !== "undefined" ? window.location.href : undefined,
    };
    try {
      if (navigator.share) {
        await navigator.share(data);
        return;
      }
      await navigator.clipboard.writeText(data.url ?? "");
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch {
      /* condivisione annullata dall'utente */
    }
  }

  return (
    <div className="ticket mx-auto max-w-sm p-6 text-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted">
        {org.name} · {org.city}
      </p>
      <h1 className="mt-3 font-display text-xl font-bold">
        {service?.name ?? "Appuntamento"}
      </h1>
      <p className="mt-1 text-sm text-muted">{appointment.customerName}</p>
      <p className="mt-3 font-mono text-lg font-semibold">
        <span className="capitalize">{formatDate(appointment.date)}</span> ·{" "}
        {appointment.time}
      </p>

      <div className="ticket-divider my-5" />

      {checkedIn ? (
        <>
          <p className="text-xs text-muted">Il tuo numero</p>
          <p className="font-mono text-6xl font-bold tracking-tight text-signal">
            {ticket}
          </p>
          <p className="mt-3 text-sm text-muted">
            Sei in coda. Ti mandiamo un SMS quando sta per arrivare il tuo
            turno: nel frattempo puoi anche allontanarti.
          </p>
          <div className="mt-4 flex flex-col items-center gap-2">
            <div className="rounded-lg bg-white p-3">
              <QRCodeSVG
                value={
                  typeof window !== "undefined" ? window.location.href : ""
                }
                size={128}
                marginSize={0}
                aria-label="QR code del biglietto"
              />
            </div>
            <p className="text-xs text-muted">
              Mostra questo codice allo sportello
            </p>
          </div>
          <p className="mt-4 rounded-lg bg-canvas p-3 text-sm">
            Ora in servizio:{" "}
            <span className="font-mono font-bold">A-041</span> · attesa stimata{" "}
            <span className="font-mono font-bold">~20&apos;</span>
          </p>
          <div className="no-print mt-5 flex gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex-1 rounded-full border border-line px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Stampa
            </button>
            <button
              type="button"
              onClick={share}
              className="flex-1 rounded-full border border-line px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              {shared ? "Link copiato ✓" : "Condividi"}
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="text-sm leading-relaxed text-muted">
            Sei arrivato? Conferma la tua presenza per ricevere il numero ed
            entrare in coda.
          </p>
          <button
            type="button"
            onClick={doCheckin}
            className="mt-5 w-full rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            Fai il check-in
          </button>
        </>
      )}
    </div>
  );
}
