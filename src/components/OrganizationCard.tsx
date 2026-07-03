import Link from "next/link";
import type { Organization } from "@/lib/types";

export default function OrganizationCard({ org }: { org: Organization }) {
  return (
    <Link
      href={`/s/${org.slug}`}
      className="group flex flex-col rounded-xl border border-line bg-card p-5 transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            {org.category}
          </p>
          <h3 className="mt-1 text-lg font-bold group-hover:text-brand-dark">
            {org.name}
          </h3>
        </div>
        <span
          className={
            org.queueOpen
              ? "shrink-0 rounded-full bg-brand-soft px-2.5 py-1 text-xs font-semibold text-brand-dark"
              : "shrink-0 rounded-full bg-canvas px-2.5 py-1 text-xs font-semibold text-muted"
          }
        >
          {org.queueOpen ? "Coda aperta" : "Solo su appuntamento"}
        </span>
      </div>
      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted">
        {org.description}
      </p>
      <p className="mt-4 text-xs text-muted">
        {org.address}, {org.city} · {org.openingHours}
      </p>
    </Link>
  );
}
