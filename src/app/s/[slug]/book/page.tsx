import Link from "next/link";
import { notFound } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import BookingForm from "@/components/BookingForm";
import { getOrganizationBySlug, getServicesByOrg } from "@/lib/mock-data";

export default async function BookPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ service?: string }>;
}) {
  const { slug } = await params;
  const { service } = await searchParams;

  const org = getOrganizationBySlug(slug);
  if (!org) notFound();

  const services = getServicesByOrg(org.id);

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-2xl px-4 pb-20 pt-8">
        <Link
          href={`/s/${org.slug}`}
          className="text-sm font-medium text-muted transition-colors hover:text-ink"
        >
          ← {org.name}
        </Link>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Prenota un appuntamento
        </h1>
        <p className="mt-2 text-sm text-muted">
          Tre passaggi, nessuna registrazione. Ti avvisiamo con una notifica
          quando è il tuo turno.
        </p>
        <div className="mt-6">
          <BookingForm
            org={org}
            services={services}
            defaultServiceId={service}
          />
        </div>
      </main>
    </>
  );
}
