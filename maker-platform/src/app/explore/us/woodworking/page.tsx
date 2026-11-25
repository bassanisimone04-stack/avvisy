import { Suspense } from "react";
import { DirectoryExplorer } from "@/components/directory/directory-explorer";
import { BusinessRow } from "@/components/directory/business-row";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { DemoBadge } from "@/components/ui/badge";
import { listBusinesses } from "@/features/directory/repository";
import { parseDirectoryQuery, searchDirectory } from "@/features/directory/search";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Woodworking & CNC near you — workshops, CNC services and hardwood suppliers",
  description:
    "Find shared woodworking shops, makerspaces, CNC routing services, laser cutting and hardwood suppliers across the United States. Filter by access, machines, file formats and classes.",
  path: "/explore/us/woodworking",
  // Demo data must not be indexed (docs/SEO_STRATEGY.md).
  index: false,
});

const crumbs = [
  { href: "/", label: "Home" },
  { href: "/explore/us/woodworking", label: "Explore" },
  { href: "/explore/us/woodworking", label: "Woodworking & CNC" },
];

async function Results({ searchParams }: { searchParams: PageProps<"/explore/us/woodworking">["searchParams"] }) {
  const query = parseDirectoryQuery(await searchParams);
  return <DirectoryExplorer businesses={listBusinesses()} initialQuery={query} />;
}

/** Server-rendered fallback list: crawlable and usable before JS loads. */
function ResultsFallback() {
  const r = searchDirectory(listBusinesses(), {});
  return (
    <div className="px-4 py-6 md:px-6 xl:px-8">
      <p className="mb-4 text-sm text-muted" role="status">
        Loading filters and map…
      </p>
      <div className="max-w-3xl space-y-3">
        {r.items.map((i) => (
          <BusinessRow key={i.business.slug} business={i.business} />
        ))}
      </div>
    </div>
  );
}

export default function DirectoryPage({ searchParams }: PageProps<"/explore/us/woodworking">) {
  return (
    <>
      <header className="px-4 pt-6 pb-6 md:px-6 md:pt-8 xl:px-8">
        <Breadcrumbs items={crumbs.slice(0, 1).concat(crumbs.slice(2))} />
        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-display-md">
              Woodworking &amp; CNC <span className="text-sage-ink italic">in the United States</span>
            </h1>
            <p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-muted">
              Shared shops, makerspaces, CNC routing, laser cutting, tool rental and hardwood suppliers.
            </p>
          </div>
          <p className="flex items-center gap-2 text-xs text-muted">
            <DemoBadge /> Fictional listings for interface preview — not real businesses.
          </p>
        </div>
      </header>
      <Suspense fallback={<ResultsFallback />}>
        <Results searchParams={searchParams} />
      </Suspense>
    </>
  );
}
