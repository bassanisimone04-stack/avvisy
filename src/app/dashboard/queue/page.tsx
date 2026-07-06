import QueueList from "@/components/QueueList";
import { getQueueByOrg, getServicesByOrg } from "@/lib/mock-data";

const ORG_ID = "org-1";

export default function QueuePage() {
  const queue = getQueueByOrg(ORG_ID);
  const services = getServicesByOrg(ORG_ID);

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
      <div className="mt-5">
        <QueueList initialEntries={queue} services={services} interactive />
      </div>
    </>
  );
}
