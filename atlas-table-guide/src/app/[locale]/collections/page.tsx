import Link from "next/link";
import type { Metadata } from "next";
import { pageCtx } from "../_ctx";
import { buildMetadata } from "@/seo/metadata";
import { PageShell } from "@/features/PageShell";
import { collections } from "@/data/collections";
import { collectionMembers } from "@/db/queries";
import { t } from "@/db/types";
import { fmt } from "@/i18n";
import { JsonLd } from "@/components/JsonLd";
import { buildItemListJsonLd } from "@/seo/jsonld";

export const revalidate = 3600;
type P = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, dict } = await pageCtx(params);
  return buildMetadata({ locale, path: "/collections/", title: dict.nav.collections, description: "Curated fine-dining collections: by recognition, budget, rooms, romance and wine pairing — computed from verified data." });
}
export default async function Collections({ params }: P) {
  const { locale, dict, data, rates } = await pageCtx(params);
  const items = collections.map((c) => ({ c, n: collectionMembers(data, c, rates).length }));
  return (
    <PageShell crumbs={[{ name: dict.common.home, path: `/${locale}/` }, { name: dict.nav.collections, path: `/${locale}/collections/` }]} title={dict.nav.collections}>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ c, n }) => (
          <li key={c.slug} className="relative rounded-[12px] border border-line bg-white p-5 hover:border-carmine">
            <h2 className="font-serif text-xl"><Link href={`/${locale}/collections/${c.slug}/`} className="after:absolute after:inset-0 after:content-['']">{t(c.title, locale)}</Link></h2>
            <p className="mt-1 text-sm text-stone">{fmt(dict.home.venues, { n })}</p>
            <p className="mt-2 text-sm">{t(c.intro, locale)}</p>
          </li>
        ))}
      </ul>
      <JsonLd data={buildItemListJsonLd(dict.nav.collections, items.map(({ c }) => ({ name: t(c.title, locale), path: `/${locale}/collections/${c.slug}/` })))} />
    </PageShell>
  );
}
