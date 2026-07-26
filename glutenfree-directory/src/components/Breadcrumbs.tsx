import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";

export default function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  const full = [{ name: "Home", path: "/" }, ...items];
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <JsonLd data={breadcrumbJsonLd(full)} />
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
        {full.map((item, i) => (
          <li key={item.path} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight size={14} className="text-muted" />}
            {i === full.length - 1 ? (
              <span className="font-medium text-ink" aria-current="page">{item.name}</span>
            ) : (
              <Link href={item.path} className="hover:text-brand-dark link-underline">{item.name}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
