import type { Metadata } from "next";
import { pageCtx } from "../_ctx";
import { buildMetadata } from "@/seo/metadata";
import { PageShell } from "@/features/PageShell";
import { MessageForm } from "@/features/forms/Forms";
import { Notice } from "@/components/ui/ui";
import { SelectionMark } from "@/components/Logo";
import { integrations } from "@/config/site";

export const revalidate = 3600;
type P = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, dict } = await pageCtx(params);
  return buildMetadata({ locale, path: "/club/", title: dict.home.clubTitle, description: dict.home.clubSub });
}
const TIERS = [
  { name: "Member", price: "Free", perks: ["Saved lists across devices", "Monthly newsletter", "Price alerts (up to 5 restaurants)"] },
  { name: "Club", price: "Planned", perks: ["Unlimited price alerts", "Concierge requests", "Early access to new destinations"] },
  { name: "Club Reserve", price: "Planned", perks: ["Everything in Club", "Partner perks as agreements go live", "Priority concierge"] },
];
export default async function Club({ params }: P) {
  const { locale, dict } = await pageCtx(params);
  return (
    <PageShell crumbs={[{ name: dict.common.home, path: `/${locale}/` }, { name: dict.home.clubTitle, path: `/${locale}/club/` }]} title={dict.home.clubTitle} lead={dict.home.clubSub}>
      <Notice tone="info">{integrations().stripe ? "Memberships run in Stripe test mode only." : "Paid memberships are not open yet — join the waitlist and we will contact you. No payment is taken."}</Notice>
      <ul className="mt-8 grid gap-6 md:grid-cols-3">
        {TIERS.map((tier, i) => (
          <li key={tier.name} className={`rounded-[12px] border p-6 ${i === 1 ? "border-gold bg-garnet text-ivory on-dark" : "border-line bg-white"}`}>
            <h2 className="font-serif text-2xl">{tier.name}</h2>
            <p className={`mt-1 text-sm ${i === 1 ? "text-sand" : "text-stone"}`}>{tier.price}</p>
            <ul className="mt-4 space-y-2 text-sm">{tier.perks.map((p) => <li key={p} className="flex gap-2"><SelectionMark size={16} className={`mt-0.5 shrink-0 ${i === 1 ? "text-gold" : "text-carmine"}`} />{p}</li>)}</ul>
          </li>
        ))}
      </ul>
      <section className="mt-12 max-w-xl rounded-[12px] border border-line bg-white p-6" aria-labelledby="wl">
        <h2 id="wl" className="font-serif text-2xl">{dict.home.clubCta}</h2>
        <div className="mt-4"><MessageForm kind="waitlist" subjectRef="club" d={{ ...dict.forms, submit: dict.common.submit, sending: dict.common.sending }} fields={["name", "email"]} submitLabel={dict.home.clubCta} extra={[{ name: "tier", label: "Interested in", type: "select", options: TIERS.map((t) => ({ value: t.name, label: t.name })) }]} /></div>
      </section>
    </PageShell>
  );
}
