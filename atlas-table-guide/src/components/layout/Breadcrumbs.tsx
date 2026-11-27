import Link from "next/link";
import { ChevronRight } from "@/components/ui/icons";
import { JsonLd } from "@/components/JsonLd";
import { buildBreadcrumbJsonLd } from "@/seo/jsonld";

/** Visible breadcrumbs + matching BreadcrumbList JSON-LD. */
export function Breadcrumbs({ items, light }: { items: { name: string; path: string }[]; light?: boolean }) {
  return (
    <>
      <nav aria-label="Breadcrumb" className={light ? "text-ivory" : "text-stone"}>
        <ol className="flex flex-wrap items-center gap-1 text-sm">
          {items.map((it, i) => (
            <li key={it.path} className="inline-flex items-center gap-1">
              {i > 0 && <ChevronRight size={14} />}
              {i === items.length - 1 ? <span aria-current="page" className={light ? "text-ivory" : "text-ink"}>{it.name}</span> : <Link href={it.path} className="hover:underline">{it.name}</Link>}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={buildBreadcrumbJsonLd(items)} />
    </>
  );
}
