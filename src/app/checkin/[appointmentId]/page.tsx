import Link from "next/link";
import { notFound } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import CheckinTicket from "@/components/CheckinTicket";
import {
  getAppointmentById,
  getServiceById,
  organizations,
} from "@/lib/mock-data";

export default async function CheckinPage({
  params,
}: {
  params: Promise<{ appointmentId: string }>;
}) {
  const { appointmentId } = await params;
  const appointment = getAppointmentById(appointmentId);
  if (!appointment) notFound();

  const org = organizations.find((o) => o.id === appointment.orgId);
  if (!org) notFound();

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
