"use client";

import { useState } from "react";
import type { Appointment, Organization, Service } from "@/lib/types";
import { formatDate } from "@/lib/utils";

type Props = {
  appointment: Appointment;
  org: Organization;
  service: Service | null;
};

export default function CheckinTicket({ appointment, org, service }: Props) {
  const [checkedIn, setCheckedIn] = useState(appointment.ticket !== null);
  const ticket = appointment.ticket ?? "A-045"; // numero mock assegnato al check-in

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
          <p className="mt-4 rounded-lg bg-canvas p-3 text-sm">
            Ora in servizio:{" "}
            <span className="font-mono font-bold">A-041</span> · attesa stimata{" "}
            <span className="font-mono font-bold">~20&apos;</span>
          </p>
        </>
      ) : (
        <>
          <p className="text-sm leading-relaxed text-muted">
            Sei arrivato? Conferma la tua presenza per ricevere il numero ed
            entrare in coda.
          </p>
          <button
            type="button"
            onClick={() => setCheckedIn(true)}
            className="mt-5 w-full rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            Fai il check-in
          </button>
        </>
      )}
    </div>
  );
}
