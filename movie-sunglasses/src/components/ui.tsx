import Link from "next/link";
import { MATCH_HELP, MATCH_LABEL } from "@/lib/site";
import type { MatchType } from "@/lib/types";
import { jsonLd } from "@/lib/format";
import { SITE } from "@/lib/site";

export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-7xl px-5 sm:px-8 ${className}`}>{children}</div>;
}

export function SectionHeading({ eyebrow, title, href, linkLabel = "View all", dark = false }: { eyebrow: string; title: string; href?: string; linkLabel?: string; dark?: boolean }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-6">
      <div>
        <p className="eyebrow mb-2">{eyebrow}</p>
        <h2 className={`font-display text-4xl font-semibold leading-none sm:text-5xl ${dark ? "text-white" : ""}`}>{title}</h2>
      </div>
      {href && (
        <Link href={href} className={`shrink-0 border-b pb-0.5 text-sm font-medium transition-colors ${dark ? "border-champagne/60 text-champagne hover:text-white" : "border-ink/30 hover:border-champagne-text hover:text-champagne-text"}`}>
          {linkLabel} <span aria-hidden>→</span>
        </Link>
      )}
    </div>
  );
}

const MATCH_STYLE: Record<MatchType, string> = {
  exact: "bg-ink text-white",
  official_reissue: "bg-champagne-light text-champagne-text ring-1 ring-champagne/60",
  similar: "bg-white text-slate ring-1 ring-line",
  unconfirmed: "bg-white text-slate border border-dashed border-mist",
};
export function MatchBadge({ type, title }: { type: MatchType; title?: boolean }) {
  return (
    <span title={title ? MATCH_HELP[type] : undefined} className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-wider ${MATCH_STYLE[type]}`}>
      <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${type === "exact" ? "bg-champagne" : type === "official_reissue" ? "bg-champagne-text" : "bg-mist"}`} />
      {MATCH_LABEL[type]}
    </span>
  );
}

export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(data) }} />;
}

export function Breadcrumbs({ items }: { items: { name: string; href?: string }[] }) {
  const all = [{ name: "Home", href: "/" }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {all.map((it, i) => (
            <li key={i} className="flex items-center gap-2">
              {it.href && i < all.length - 1 ? <Link href={it.href} className="hover:text-ink hover:underline">{it.name}</Link> : <span aria-current={i === all.length - 1 ? "page" : undefined} className="text-ink">{it.name}</span>}
              {i < all.length - 1 && <span aria-hidden className="text-mist">/</span>}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        itemListElement: all.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, ...(it.href ? { item: SITE.url + it.href } : {}) })),
      }} />
    </>
  );
}

export function PageHeader({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro?: string; children?: React.ReactNode }) {
  return (
    <header className="mb-10 max-w-3xl">
      <p className="eyebrow mb-3">{eyebrow}</p>
      <h1 className="font-display text-5xl font-semibold leading-[0.95] sm:text-6xl">{title}</h1>
      {intro && <p className="mt-5 text-lg leading-relaxed text-slate">{intro}</p>}
      {children}
    </header>
  );
}

export function UnreviewedNotice() {
  if (!SITE.showUnreviewedNotice) return null;
  return (
    <p className="mb-6 rounded-sm border border-dashed border-champagne bg-champagne-light/50 px-4 py-3 text-sm text-champagne-text" role="note">
      <strong>Editorial review pending.</strong> This record was compiled from the sources listed below and has not yet been through human editorial sign-off.
    </p>
  );
}

export function AdSlot({ slot, label = "Advertisement" }: { slot: string; label?: string }) {
  if (process.env.NEXT_PUBLIC_ADS_ENABLED !== "true") return null;
  return <aside aria-label={label} data-ad-slot={slot} className="my-10 flex min-h-[110px] items-center justify-center border border-dashed border-line text-xs uppercase tracking-widest text-mist">{label}</aside>;
}

export function Pagination({ page, pages, basePath, params }: { page: number; pages: number; basePath: string; params: Record<string, string | undefined> }) {
  if (pages <= 1) return null;
  const href = (p: number) => {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v) sp.set(k, v);
    if (p > 1) sp.set("page", String(p));
    const qs = sp.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };
  return (
    <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-2">
      {page > 1 && <Link rel="prev" href={href(page - 1)} className="rounded-full border border-line px-4 py-2 text-sm hover:border-ink">← Previous</Link>}
      <span className="px-3 text-sm text-slate">Page {page} of {pages}</span>
      {page < pages && <Link rel="next" href={href(page + 1)} className="rounded-full border border-line px-4 py-2 text-sm hover:border-ink">Next →</Link>}
    </nav>
  );
}

export const btn = "inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-white transition hover:bg-champagne-text focus-visible:outline-offset-2";
export const btnGhost = "inline-flex items-center justify-center gap-2 rounded-full border border-ink/25 px-6 py-3 text-sm font-medium transition hover:border-ink hover:bg-ink hover:text-white";
