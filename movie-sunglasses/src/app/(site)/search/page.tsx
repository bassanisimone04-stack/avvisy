import type { Metadata } from "next";
import Link from "next/link";
import { getCatalog } from "@/lib/catalog";
import { searchCatalog } from "@/lib/search";
import { one, type Params } from "@/lib/filter";
import { buildMetadata } from "@/lib/seo";
import { SearchBox } from "@/components/search-box";
import { Breadcrumbs, Container, PageHeader } from "@/components/ui";

export const metadata: Metadata = buildMetadata({ title: "Search", description: "Search movie sunglasses by film, actor, character, brand or model.", path: "/search", noindex: true });
const LABEL: Record<string, string> = { model: "Sunglasses", movie: "Movies & TV", actor: "Actors", character: "Characters", brand: "Brands", article: "Guides" };

export default async function SearchPage({ searchParams }: { searchParams: Promise<Params> }) {
  const p = await searchParams;
  const q = one(p.q) ?? "";
  const c = await getCatalog();
  const hits = searchCatalog(c, q, 60);
  const groups = Object.keys(LABEL).map((t) => [t, hits.filter((h) => h.type === t)] as const).filter(([, h]) => h.length);
  return (
    <Container className="pt-10">
      <Breadcrumbs items={[{ name: "Search" }]} />
      <PageHeader eyebrow="Search" title={q ? `Results for “${q}”` : "Search"} />
      <div className="mb-10 max-w-xl"><SearchBox autoFocus={!q} /></div>
      {q && hits.length === 0 && <p className="text-slate">No results. Try a film title, an actor, a brand or a model number.</p>}
      {groups.map(([t, rows]) => (
        <section key={t} className="mb-10"><h2 className="eyebrow mb-3">{LABEL[t]}</h2>
          <ul className="divide-y divide-line rounded-2xl border border-line bg-white">{rows.map((h) => <li key={h.href + h.label}><Link href={h.href} className="flex items-baseline justify-between gap-4 px-5 py-3 hover:bg-champagne-light/40"><span className="font-medium">{h.label}</span><span className="text-sm text-slate">{h.sub}</span></Link></li>)}</ul>
        </section>
      ))}
    </Container>
  );
}
