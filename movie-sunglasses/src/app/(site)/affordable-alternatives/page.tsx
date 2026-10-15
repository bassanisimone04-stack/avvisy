import type { Metadata } from "next";
import Link from "next/link";
import { getCatalog } from "@/lib/catalog";
import { hasFilters, one, type Params } from "@/lib/filter";
import { PRICE_BAND_LABEL } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs, Container, PageHeader } from "@/components/ui";
import { Grid, ModelCard } from "@/components/cards";

export async function generateMetadata({ searchParams }: { searchParams: Promise<Params> }): Promise<Metadata> {
  return buildMetadata({ title: "Cheap Alternatives to Movie Sunglasses", description: "Look-alikes of famous movie sunglasses under $50, $100 and $200, matched to the originals they resemble. Price bands are editorial estimates.", path: "/affordable-alternatives", noindex: hasFilters(await searchParams) });
}

export default async function AffordablePage({ searchParams }: { searchParams: Promise<Params> }) {
  const [c, p] = await Promise.all([getCatalog(), searchParams]);
  const budget = one(p.budget);
  const alts = c.models.filter((m) => c.isAlternativeOnly(m.id));
  const bands = (["under50", "under100", "under200"] as const).filter((b) => !budget || b === budget);
  return (
    <Container className="pt-10">
      <Breadcrumbs items={[{ name: "Affordable alternatives" }]} />
      <PageHeader eyebrow="Same look, smaller price" title="Affordable Alternatives" intro="These are look-alikes, never claims about what was worn on screen. Price bands are editorial estimates until live merchant offers are connected — always confirm the price at the store." />
      <nav aria-label="Budget" className="mb-10 flex flex-wrap gap-3">
        <Link href="/affordable-alternatives" aria-current={!budget ? "page" : undefined} className={`rounded-full border px-5 py-2 text-sm ${!budget ? "border-ink bg-ink text-white" : "border-line hover:border-ink"}`}>All budgets</Link>
        {(["under50", "under100", "under200"] as const).map((b) => <Link key={b} href={`/affordable-alternatives?budget=${b}`} aria-current={budget === b ? "page" : undefined} className={`rounded-full border px-5 py-2 text-sm ${budget === b ? "border-ink bg-ink text-white" : "border-line hover:border-ink"}`}>{PRICE_BAND_LABEL[b]}</Link>)}
      </nav>
      {bands.map((b) => {
        const rows = alts.filter((m) => c.priceBandOf(m).band === b);
        return (
          <section key={b} className="mb-14" aria-labelledby={`b-${b}`}>
            <h2 id={`b-${b}`} className="font-display mb-5 text-4xl font-semibold">{PRICE_BAND_LABEL[b]}</h2>
            {rows.length ? <Grid>{rows.map((m) => (
              <div key={m.id}><ModelCard c={c} m={m} />
                <p className="mt-2 px-1 text-xs text-slate">Alternative to {c.originalsOf(m.id).slice(0, 3).map(({ model }) => model.name).join(", ") || "—"}</p></div>
            ))}</Grid> : <p className="text-slate">Nothing in this band yet.</p>}
          </section>
        );
      })}
    </Container>
  );
}
