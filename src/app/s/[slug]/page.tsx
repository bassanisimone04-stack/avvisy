import Link from "next/link";
import { notFound } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import ServiceCard from "@/components/ServiceCard";
import QueueList from "@/components/QueueList";
import NowServing from "@/components/NowServing";
import OpenStatusBadge from "@/components/OpenStatusBadge";
import OrgQuickActions from "@/components/OrgQuickActions";
import { getOrganizationBySlug, getServicesByOrg } from "@/lib/data";
import { getQueueByOrg } from "@/lib/mock-data";

export default async function OrganizationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const org = await getOrganizationBySlug(slug);
  if (!org) notFound();

  const services = await getServicesByOrg(org.id);
  const queue = getQueueByOrg(org.id);

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-5xl px-4 pb-20 pt-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          {org.category}
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
          {org.name}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
          {org.description}
        </p>
        <p className="mt-3 text-sm text-muted">
          {org.address}, {org.city} · {org.openingHours}
        </p>
        <div className="mt-3">
          <OpenStatusBadge openingHours={org.openingHours} />
        </div>
        <div className="mt-4">
          <OrgQuickActions org={org} />
        </div>

        <div className="mt-6">
          <Link
            href={`/s/${org.slug}/book`}
            className="inline-block rounded-full bg-brand px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            Prenota un appuntamento
          </Link>
        </div>

        {org.queueOpen && (
          <div className="mt-6 max-w-xl">
            <NowServing queue={queue} />
          </div>
        )}

        <section className="mt-10">
          <h2 className="text-xl font-bold tracking-tight">Servizi</h2>
          <div className="mt-4 flex flex-col gap-3">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                orgSlug={org.slug}
              />
            ))}
          </div>
        </section>

        {org.queueOpen && (
          <section className="mt-10">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight">Coda di oggi</h2>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
              </span>
            </div>
            <p className="mt-1 text-sm text-muted">
              Aggiornata in tempo reale. Con il check-in entri in coda dal
              telefono.
            </p>
            <div className="mt-4">
              <QueueList initialEntries={queue} />
            </div>
          </section>
        )}
      </main>
    </>
  );
}
