"use client";

import { useMemo, useState } from "react";
import AppointmentTable from "@/components/AppointmentTable";
import {
  rescheduleAppointment,
  setAppointmentStatus,
} from "@/lib/appointments";
import { getServiceById } from "@/lib/mock-data";
import type { Appointment, AppointmentStatus } from "@/lib/types";
import { appointmentStatusLabel, cn } from "@/lib/utils";

/** Costruisce e scarica un CSV (UTF-8 con BOM per Excel) degli appuntamenti. */
function exportCSV(rows: Appointment[]) {
  const header = [
    "Data",
    "Ora",
    "Cliente",
    "Telefono",
    "Servizio",
    "Ticket",
    "Stato",
  ];
  const body = rows.map((a) => [
    a.date,
    a.time,
    a.customerName,
    a.customerPhone,
    getServiceById(a.serviceId)?.name ?? "",
    a.ticket ?? "",
    appointmentStatusLabel[a.status],
  ]);
  const csv = [header, ...body]
    .map((r) =>
      r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    )
    .join("\r\n");

  const blob = new Blob(["﻿" + csv], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `appuntamenti-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

type Filter = AppointmentStatus | "tutti";

const filters: { value: Filter; label: string }[] = [
  { value: "tutti", label: "Tutti" },
  { value: "confermato", label: appointmentStatusLabel["confermato"] },
  { value: "check-in", label: appointmentStatusLabel["check-in"] },
  { value: "in-corso", label: appointmentStatusLabel["in-corso"] },
  { value: "completato", label: appointmentStatusLabel["completato"] },
  { value: "annullato", label: appointmentStatusLabel["annullato"] },
];

export default function AppointmentsBoard({
  appointments,
}: {
  appointments: Appointment[];
}) {
  const [items, setItems] = useState(appointments);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("tutti");

  function cancel(id: string) {
    setItems((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "annullato" } : a))
    );
    void setAppointmentStatus(id, "annullato");
  }

  function reschedule(id: string, time: string) {
    setItems((prev) => prev.map((a) => (a.id === id ? { ...a, time } : a)));
    void rescheduleAppointment(id, time);
  }

  const counts = useMemo(() => {
    const map = new Map<Filter, number>([["tutti", items.length]]);
    for (const a of items) {
      map.set(a.status, (map.get(a.status) ?? 0) + 1);
    }
    return map;
  }, [items]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((a) => {
      if (filter !== "tutti" && a.status !== filter) return false;
      if (!q) return true;
      return (
        a.customerName.toLowerCase().includes(q) ||
        a.customerPhone.toLowerCase().includes(q)
      );
    });
  }, [items, query, filter]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <label className="relative block">
          <span className="sr-only">Cerca per nome o telefono</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cerca per nome o telefono…"
            className="w-full rounded-full border border-line bg-card px-5 py-3 text-base outline-none transition-colors focus:border-brand"
          />
        </label>

        <div className="flex flex-wrap items-center gap-2">
          {filters.map((f) => {
            const n = counts.get(f.value) ?? 0;
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                  filter === f.value
                    ? "border-brand bg-brand text-white"
                    : "border-line bg-card text-ink hover:border-ink"
                )}
              >
                {f.label}
                <span
                  className={cn(
                    "ml-1.5 font-mono text-xs",
                    filter === f.value ? "text-white/80" : "text-muted"
                  )}
                >
                  {n}
                </span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => exportCSV(visible)}
            disabled={visible.length === 0}
            className="ml-auto rounded-full border border-line bg-card px-4 py-1.5 text-sm font-semibold text-ink transition-colors hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-40"
          >
            Esporta CSV
          </button>
        </div>
      </div>

      {visible.length === 0 && items.length > 0 ? (
        <div className="rounded-xl border border-dashed border-line bg-card p-8 text-center text-sm text-muted">
          Nessun appuntamento corrisponde alla ricerca.
        </div>
      ) : (
        <AppointmentTable
          appointments={visible}
          onCancel={cancel}
          onReschedule={reschedule}
        />
      )}
    </div>
  );
}
