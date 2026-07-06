import { notFound } from "next/navigation";
import Logo from "@/components/Logo";
import OpenStatusBadge from "@/components/OpenStatusBadge";
import { getOrganizationBySlug, getQueueByOrg } from "@/lib/mock-data";

/** Card compatta pensata per essere incorporata via iframe nel sito della
 * struttura. Niente header/footer: solo prenotazione. */
export default async function WidgetPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const org = getOrganizationBySlug(slug);
  if (!org) notFound();

  const serving =
    getQueueByOrg(org.id).find((e) => e.status === "in-servizio")?.ticket ??
    null;

  return (
    <div className="p-4">
      <div className="mx-auto max-w-sm rounded-2xl border border-line bg-card p-5">
        <div className="flex items-center justify-between gap-3">
          <Logo className="text-lg" />
          <OpenStatusBadge openingHours={org.openingHours} />
        </div>
        <h2 className="mt-3 font-display text-xl font-bold tracking-tight">
          {org.name}
        </h2>
        <p className="text-sm text-muted">{org.category}</p>

        {org.queueOpen && serving && (
          <p className="mt-3 text-sm text-muted">
            Ora in servizio:{" "}
            <span className="font-mono font-bold text-signal">{serving}</span>
          </p>
        )}

        <a
          href={`/s/${org.slug}/book`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 block rounded-full bg-brand px-5 py-3 text-center text-base font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          Prenota un appuntamento
        </a>
        <p className="mt-2 text-center text-xs text-muted">
          Prenotazione gratuita con Avvisy
        </p>
      </div>
    </div>
  );
}
