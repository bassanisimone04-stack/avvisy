/** Genera un evento .ics scaricabile, così l'appuntamento finisce nel
 * calendario del telefono (Google/Apple) con un promemoria automatico. */

export type CalendarEvent = {
  title: string;
  description?: string;
  location?: string;
  date: string; // yyyy-mm-dd
  time: string; // HH:mm
  durationMin: number;
};

const pad = (n: number) => String(n).padStart(2, "0");

/** Orario "locale" nel formato YYYYMMDDTHHMMSS. */
function localStamp(d: Date) {
  return (
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}` +
    `T${pad(d.getHours())}${pad(d.getMinutes())}00`
  );
}

function esc(s: string) {
  return s.replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");
}

export function buildICS(ev: CalendarEvent): string {
  const start = new Date(`${ev.date}T${ev.time}:00`);
  const end = new Date(start.getTime() + ev.durationMin * 60_000);
  const uid = `${Date.now()}-${Math.random().toString(36).slice(2)}@avvisy`;
  const dtstamp =
    new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Avvisy//Appuntamenti//IT",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${localStamp(start)}`,
    `DTEND:${localStamp(end)}`,
    `SUMMARY:${esc(ev.title)}`,
    ev.location && `LOCATION:${esc(ev.location)}`,
    ev.description && `DESCRIPTION:${esc(ev.description)}`,
    "BEGIN:VALARM",
    "TRIGGER:-PT1H", // promemoria 1 ora prima
    "ACTION:DISPLAY",
    `DESCRIPTION:${esc(ev.title)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");
}

/** Scarica l'evento come file .ics (lato browser). */
export function downloadICS(filename: string, ev: CalendarEvent) {
  const blob = new Blob([buildICS(ev)], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
