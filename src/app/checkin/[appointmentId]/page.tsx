import Link from "next/link";
import { notFound } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import CheckinTicket from "@/components/CheckinTicket";
import type { Appointment } from "@/lib/types";
import {
  getAppointmentById,
  getOrganizationBySlug,
  getServiceById,
  organizations,
} from "@/lib/mock-data";

type CheckinQuery = {
  org?: string;
  service?: string;
  name?: string;
  phone?: string;
  date?: string;
  time?: string;
};

export default async function CheckinPage({
  params,
  searchParams,
}: {
  params: Promise<{ appointmentId: string }>;
  searchParams: Promise<CheckinQuery>;
}) {
  const { appointmentId } = await params;
  const q = await searchParams;

  // Prenotazione demo già presente nei dati mock…
  let appointment: Appointment | null = getAppointmentById(appointmentId);
  let org = appointment
    ? organizations.find((o) => o.id === appointment!.orgId) ?? null
    : null;

  // …oppure prenotazione appena creata, con i dati passati dal link.
  if (!appointment && q.org && q.service && q.name && q.date && q.time) {
    org = getOrganizationBySlug(q.org);
    if (org) {
      appointment = {
        id: appointmentId,
        orgId: org.id,
        serviceId: q.service,
        customerName: q.name,
        customerPhone: q.phone ?? "",
        date: q.date,
        time: q.time,
        status: "confermato",
        ticket: null,
      };
    }
  }

  if (!appointment || !org) notFound();

  const service = getServiceById(appointment.serviceId);

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-2xl px-4 pb-20 pt-10">
        <CheckinTicket appointment={appointment} org={org} service={service} />
        <p className="mt-6 text-center text-sm text-muted">
          Vuoi vedere la coda completa?{" "}
          <Link
            href={`/s/${org.slug}`}
            className="font-semibold text-brand-dark hover:underline"
          >
            Apri la pagina di {org.name}
          </Link>
        </p>
      </main>
    </>
  );
}
