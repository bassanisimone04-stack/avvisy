import type { AppointmentStatus, QueueStatus } from "./types";

/** Concatenazione condizionale di classi (sostituibile con clsx/cn di shadcn in seguito). */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("it-IT", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export const appointmentStatusLabel: Record<AppointmentStatus, string> = {
  confermato: "Confermato",
  "check-in": "Check-in",
  "in-corso": "In corso",
  completato: "Completato",
  annullato: "Annullato",
};

export const appointmentStatusClass: Record<AppointmentStatus, string> = {
  confermato: "bg-teal-50 text-teal-800 ring-teal-600/20",
  "check-in": "bg-amber-50 text-amber-800 ring-amber-600/20",
  "in-corso": "bg-sky-50 text-sky-800 ring-sky-600/20",
  completato: "bg-stone-100 text-stone-600 ring-stone-500/20",
  annullato: "bg-red-50 text-red-700 ring-red-600/20",
};

export const queueStatusLabel: Record<QueueStatus, string> = {
  "in-servizio": "In servizio",
  chiamato: "Chiamato",
  "in-attesa": "In attesa",
};
