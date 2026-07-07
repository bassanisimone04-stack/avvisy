import Link from "next/link";
import { notFound } from "next/navigation";
import QueueList from "@/components/QueueList";
import { getMyOrganization, getQueueByOrg, getServicesByOrg } from "@/lib/data";

export default async function QueuePage() {
  const org = await getMyOrganization();
  if (!org) notFound();
  const queue = await getQueueByOrg(org.id);
  const services = await getServicesByOrg(org.id);

  return (
    <>
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Coda live</h1>
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
        </span>
      </div>
      <p className="mt-1 text-sm text-muted">
        Chiama il prossimo numero quando lo sportello è libero. I clienti
        vedono l&apos;aggiornamento sul telefono.
      </p>
      <div className="mt-3">
        <Link
          href={`/s/${org.slug}/schermo`}
          target="_blank"
          className="inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          Apri schermo sala d&apos;attesa ↗
        </Link>
      </div>
      <div className="mt-5">
        <QueueList
          initialEntries={queue}
          services={services}
          orgId={org.id}
          interactive
        />
      </div>
    </>
  );
}
