import ServiceCard from "@/components/ServiceCard";
import { getServicesByOrg, organizations } from "@/lib/mock-data";

const ORG_ID = "org-1";

export default function ServicesPage() {
  const org = organizations.find((o) => o.id === ORG_ID)!;
  const services = getServicesByOrg(ORG_ID);

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Servizi</h1>
          <p className="mt-1 text-sm text-muted">
            I servizi prenotabili dalla tua pagina pubblica.
          </p>
        </div>
        <button
          type="button"
          className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          + Aggiungi servizio
        </button>
      </div>
      <div className="mt-5 flex flex-col gap-3">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            orgSlug={org.slug}
            hideAction
          />
        ))}
      </div>
    </>
  );
}
