import AppointmentsBoard from "@/components/AppointmentsBoard";
import { getAppointmentsByOrg, getMyOrganization } from "@/lib/data";

export default async function AppointmentsPage() {
  const org = await getMyOrganization();
  const list = org ? await getAppointmentsByOrg(org.id) : [];
  const appointments = [...list].sort((a, b) =>
    `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`)
  );

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Appuntamenti</h1>
          <p className="mt-1 text-sm text-muted">
            Tutte le prenotazioni ricevute dalla tua pagina pubblica.
          </p>
        </div>
        <button
          type="button"
          className="rounded-full border border-line bg-card px-5 py-2 text-sm font-semibold transition-colors hover:border-ink"
        >
          + Nuovo appuntamento
        </button>
      </div>
      <div className="mt-5">
        <AppointmentsBoard appointments={appointments} />
      </div>
    </>
  );
}
