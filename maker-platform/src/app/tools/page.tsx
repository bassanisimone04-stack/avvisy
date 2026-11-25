import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { plannedTools, tools } from "@/features/tools/registry";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Free woodworking calculators",
  description: "Free board foot, CNC project cost and cut list calculators with documented formulas, imperial and metric units.",
  path: "/tools",
});

export default function ToolsPage() {
  return (
    <div className="container-page pt-6 md:pt-8">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/tools", label: "Free Tools" }]} />
      <header className="mt-8 max-w-3xl">
        <p className="eyebrow">Free tools</p>
        <h1 className="mt-3 text-display-lg text-balance">
          Calculators for <em className="text-clay-ink italic">exact</em> work.
        </h1>
        <p className="mt-4 text-[1.0625rem] leading-relaxed text-muted">
          Free, no sign-up. Every tool shows its formula, supports imperial and metric where it matters, and tells you plainly what it does not account for.
        </p>
      </header>

      <ol className="mt-14 border-t border-line">
        {tools.map((t) => (
          <li key={t.slug} className="border-b border-line">
            <Link href={`/tools/${t.slug}`} className="group grid items-center gap-4 py-8 md:grid-cols-[6rem_1fr_auto] md:py-10">
              <span className="nums font-display text-[3rem] leading-none font-[300] text-clay-ink italic">{t.index}</span>
              <span>
                <span className="block font-display text-display-sm text-forest transition-colors group-hover:text-clay-ink">{t.name}</span>
                <span className="mt-2 block max-w-xl text-muted">{t.summary}</span>
              </span>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-forest">
                Open tool <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
              </span>
            </Link>
          </li>
        ))}
      </ol>

      <section aria-labelledby="planned-h" className="mt-16 rounded-lg bg-ivory-deep p-8 md:p-10">
        <h2 id="planned-h" className="text-display-sm">
          Coming with new crafts
        </h2>
        <ul className="mt-6 flex flex-wrap gap-2">
          {plannedTools.map((t) => (
            <li key={t}>
              <Badge tone="outline" className="py-1 text-[0.75rem] normal-case tracking-normal">
                {t}
              </Badge>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
