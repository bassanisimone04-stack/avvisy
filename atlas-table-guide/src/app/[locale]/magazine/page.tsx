import type { Metadata } from "next";
import Link from "next/link";
import { pageCtx } from "../_ctx";
import { buildMetadata } from "@/seo/metadata";
import { PageShell } from "@/features/PageShell";
import { PhotoCard } from "@/components/cards/Cards";
import { buildAlt } from "@/lib/alt";
import { t } from "@/db/types";
import { JsonLd } from "@/components/JsonLd";
import { buildItemListJsonLd } from "@/seo/jsonld";
import { DemoBadge } from "@/components/ui/ui";
import { formatDate } from "@/lib/format";

export const revalidate = 3600;
type P = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, dict } = await pageCtx(params);
  return buildMetadata({ locale, path: "/magazine/", title: dict.home.magazineTitle, description: dict.home.magazineSub });
}
export default async function Magazine({ params }: P) {
  const { locale, dict, data } = await pageCtx(params);
  const list = [...data.articles].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const cats = [...new Set(list.map((a) => a.category))];
  return (
    <PageShell crumbs={[{ name: dict.common.home, path: `/${locale}/` }, { name: dict.nav.magazine, path: `/${locale}/magazine/` }]} title={dict.home.magazineTitle} lead={dict.home.magazineSub}>
      <ul className="mb-8 flex flex-wrap gap-2">{cats.map((c) => <li key={c}><Link href={`/${locale}/magazine/${c}/`} className="inline-flex min-h-9 items-center rounded-full border border-line bg-white px-3 text-sm capitalize hover:border-carmine">{c.replace(/-/g, " ")}</Link></li>)}</ul>
      <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((a) => (
          <li key={a.slug}><PhotoCard href={`/${locale}/magazine/${a.slug}/`} imageKey={a.image.key} alt={buildAlt({ subject: "dish" }, { name: t(a.title, locale), city: "", locale })} titleAs="h2" title={t(a.title, locale)} subtitle={t(a.excerpt, locale)} sizes="(min-width:1024px) 360px, 50vw" badge={a.sponsored ? <span className="rounded-[4px] bg-gold px-1.5 py-0.5 text-[11px] font-bold uppercase text-ink">{dict.common.sponsored}</span> : a.isDemo ? <DemoBadge label={dict.common.demoData} /> : undefined} meta={<span className="text-xs uppercase tracking-wide text-stone">{a.category.replace(/-/g, " ")} · {formatDate(a.publishedAt, locale)}</span>} /></li>
        ))}
      </ul>
      <JsonLd data={buildItemListJsonLd(dict.home.magazineTitle, list.map((a) => ({ name: t(a.title, locale), path: `/${locale}/magazine/${a.slug}/` })))} />
    </PageShell>
  );
}
