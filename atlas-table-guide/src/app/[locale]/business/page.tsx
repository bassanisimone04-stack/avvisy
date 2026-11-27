import type { Metadata } from "next";
import Link from "next/link";
import { pageCtx } from "../_ctx";
import { buildMetadata } from "@/seo/metadata";
import { PageShell } from "@/features/PageShell";
import { BUSINESS, PLANS } from "@/data/pages";
import { Notice } from "@/components/ui/ui";
import { integrations } from "@/config/site";

type P = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, dict } = await pageCtx(params);
  return buildMetadata({ locale, path: "/business/", title: `${dict.footer.business} — partner plans`, description: "Claim your restaurant, list your hotel or experience, and manage verified information. Commercial plans never influence recognitions." });
}
export default async function Business({ params }: P) {
  const { locale, dict } = await pageCtx(params);
  return (
    <PageShell crumbs={[{ name: dict.common.home, path: `/${locale}/` }, { name: dict.footer.business, path: `/${locale}/business/` }]} title={dict.footer.business} lead="Tools for restaurants, hotels and experience partners — with editorial independence built in.">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {BUSINESS.map((b) => <li key={b.slug} className="relative rounded-[12px] border border-line bg-white p-5 hover:border-carmine"><h2 className="font-sans text-base font-bold"><Link href={`/${locale}/business/${b.slug}/`} className="after:absolute after:inset-0 after:content-['']">{b.title}</Link></h2><p className="mt-1 text-sm text-stone">{b.lead}</p></li>)}
      </ul>
      <section className="mt-14" aria-labelledby="plans">
        <h2 id="plans" className="font-serif text-2xl">Partner plans <span className="text-base font-sans text-stone">(illustrative — editable before launch)</span></h2>
        <div className="mt-2"><Notice tone="info">{integrations().stripe ? "Subscriptions run in Stripe test mode only." : "Subscriptions are not open yet — no payment is taken. Contact sales to register interest."} Commercial plans never influence recognitions, the editorial selection or the order of results.</Notice></div>
        <ul className="mt-6 grid gap-4 md:grid-cols-5">
          {PLANS.map((p) => <li key={p.name} className="rounded-[12px] border border-line bg-white p-5"><p className="font-serif text-xl">{p.name}</p><p className="text-sm text-stone">{p.price}</p><ul className="mt-3 space-y-1 text-sm">{p.features.map((f) => <li key={f}>• {f}</li>)}</ul></li>)}
        </ul>
      </section>
      <section className="mt-14 rounded-[12px] border border-line bg-sand p-6" aria-labelledby="portal">
        <h2 id="portal" className="font-serif text-2xl">Partner dashboard</h2>
        <p className="mt-2 text-sm">The dashboard (profile editing, authorised image uploads with licence confirmation, price updates that append to price history, booking links, view/click analytics) opens after your claim is verified and approved by an editor. {integrations().supabase ? "" : "It requires accounts, which are not configured on this deployment."}</p>
        <Link href={`/${locale}/business/claim-your-restaurant/`} className="mt-4 inline-flex min-h-11 items-center rounded-[8px] bg-carmine px-5 text-sm font-semibold text-white">Start a claim</Link>
      </section>
    </PageShell>
  );
}
