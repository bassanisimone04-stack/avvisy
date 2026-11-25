import { notFound } from "next/navigation";
import { BusinessRow } from "@/components/directory/business-row";
import { ProductCard } from "@/components/marketplace/product-card";
import { BoardFootCalculator } from "@/components/tools/board-foot-calculator";
import { CncCostCalculator } from "@/components/tools/cnc-cost-calculator";
import { CutListCalculator } from "@/components/tools/cut-list-calculator";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { getProduct } from "@/features/catalog/repository";
import type { Product } from "@/features/catalog/types";
import { getBusinessesByCategory } from "@/features/directory/repository";
import { toolContent } from "@/features/tools/content";
import { getTool, tools } from "@/features/tools/registry";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";

export function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps<"/tools/[slug]">) {
  const { slug } = await params;
  const t = getTool(slug);
  if (!t) return {};
  return pageMetadata({ title: `${t.name} — free, imperial & metric`, description: t.summary, path: `/tools/${t.slug}` });
}

const calculators: Record<string, () => React.ReactNode> = {
  "board-foot-calculator": () => <BoardFootCalculator />,
  "cnc-project-cost-calculator": () => <CncCostCalculator />,
  "cut-list-calculator": () => <CutListCalculator />,
};

export default async function ToolPage({ params }: PageProps<"/tools/[slug]">) {
  const { slug } = await params;
  const tool = getTool(slug);
  const content = toolContent[slug];
  if (!tool || !content) notFound();
  const products = content.relatedProducts.map(getProduct).filter((p): p is Product => Boolean(p));
  const places = getBusinessesByCategory([content.directoryCategory], 3);

  return (
    <div>
      <div className="container-page pt-6 md:pt-8">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/tools", label: "Free Tools" },
            { href: `/tools/${tool.slug}`, label: tool.name },
          ]}
        />
        <header className="mt-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-3xl">
            <p className="eyebrow">
              Free tool <span className="nums text-clay-ink">· {tool.index}</span>
            </p>
            <h1 className="mt-3 text-display-lg text-balance">{content.headline}</h1>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-muted">{content.intro}</p>
          </div>
          <nav aria-label="Other tools" className="flex flex-wrap gap-2 lg:justify-end">
            {tools
              .filter((t) => t.slug !== tool.slug)
              .map((t) => (
                <Link key={t.slug} href={`/tools/${t.slug}`} className="rounded-full border border-line-strong px-3.5 py-1.5 text-sm text-forest hover:border-forest">
                  {t.shortName}
                </Link>
              ))}
          </nav>
        </header>

        <div className="mt-10">{calculators[slug]()}</div>
      </div>

      <div className="container-page mt-20 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:gap-16">
        <article className="prose-editorial">
          <h2>{content.formula.title}</h2>
          <div className="not-prose rounded-md border border-line bg-white p-5 font-mono text-[0.875rem] leading-7 text-forest">
            {content.formula.lines.map((l) => (
              <p key={l}>{l}</p>
            ))}
          </div>
          <h2>Worked example</h2>
          {content.example.map((e) => (
            <p key={e}>{e}</p>
          ))}
          <h2>What this tool does not account for</h2>
          <ul>
            {content.limits.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
          <h2>Questions</h2>
          {content.faq.map((f) => (
            <div key={f.q}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}
          <p className="text-sm text-muted">Results are estimates for planning. They are not engineering, structural or financial advice.</p>
        </article>

        <aside className="space-y-8">
          <div>
            <p className="eyebrow">Find it locally</p>
            <div className="mt-4 space-y-3">
              {places.map((b) => (
                <BusinessRow key={b.slug} business={b} compact />
              ))}
            </div>
          </div>
        </aside>
      </div>

      <section aria-labelledby="tool-proj-h" className="container-page mt-20">
        <div className="border-t border-line pt-12">
          <h2 id="tool-proj-h" className="text-display-sm">
            Put it to work
          </h2>
          <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
