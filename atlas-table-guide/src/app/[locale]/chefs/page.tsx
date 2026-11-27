import Link from "next/link";
import type { Metadata } from "next";
import { pageCtx } from "../_ctx";
import { buildMetadata } from "@/seo/metadata";
import { PageShell } from "@/features/PageShell";
import { JsonLd } from "@/components/JsonLd";
import { buildItemListJsonLd } from "@/seo/jsonld";
import { t } from "@/db/types";

export const revalidate = 3600;
type P = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, dict } = await pageCtx(params);
  return buildMetadata({ locale, path: "/chefs/", title: dict.footer.chefs, description: `${dict.footer.chefs} — profiles and the restaurants where they cook.` });
}
export default async function Chefs({ params }: P) {
  const { locale, dict, data } = await pageCtx(params);
  const chefs = [...data.chefs].sort((a, b) => a.name.localeCompare(b.name));
  return (
    <PageShell crumbs={[{ name: dict.common.home, path: `/${locale}/` }, { name: dict.footer.chefs, path: `/${locale}/chefs/` }]} title={dict.footer.chefs}>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {chefs.map((c) => {
          const rs = data.restaurants.filter((r) => r.chefSlug === c.slug);
          return (
            <li key={c.slug} className="relative rounded-[12px] border border-line bg-white p-5 hover:border-carmine">
              <h2 className="font-sans text-base font-bold"><Link href={`/${locale}/chefs/${c.slug}/`} className="after:absolute after:inset-0 after:content-['']">{c.name}</Link></h2>
              <p className="mt-1 text-sm text-stone">{rs.map((r) => r.name).join(", ")}</p>
              <p className="mt-2 line-clamp-3 text-sm">{t(c.bio, locale)}</p>
            </li>
          );
        })}
      </ul>
      <JsonLd data={buildItemListJsonLd(dict.footer.chefs, chefs.map((c) => ({ name: c.name, path: `/${locale}/chefs/${c.slug}/` })))} />
    </PageShell>
  );
}
