import Link from "next/link";
import type { Service } from "@/lib/types";

type Props = {
  service: Service;
  orgSlug: string;
  /** Nasconde il bottone "Prenota", es. dentro la dashboard. */
  hideAction?: boolean;
};

export default function ServiceCard({ service, orgSlug, hideAction }: Props) {
  return (
    <div className="flex flex-col rounded-xl border border-line bg-card p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div>
        <h3 className="font-display text-lg font-bold">{service.name}</h3>
        <p className="mt-1 text-base leading-relaxed text-muted">
          {service.description}
        </p>
        <p className="mt-2 font-mono text-sm text-muted">
          {service.durationMin} min
          {service.price ? ` · ${service.price}` : " · Gratuito"}
        </p>
      </div>
      {!hideAction && (
        <Link
          href={`/s/${orgSlug}/book?service=${service.id}`}
          className="mt-4 shrink-0 rounded-full bg-brand px-6 py-2.5 text-center text-base font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:mt-0"
        >
          Prenota
        </Link>
      )}
    </div>
  );
}
