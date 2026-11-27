import type { Metadata } from "next";
import { pageCtx } from "../_ctx";
import { buildMetadata } from "@/seo/metadata";
import { PageShell } from "@/features/PageShell";
import { t } from "@/db/types";
import { formatMoney } from "@/lib/price";
import { Notice, DemoBadge } from "@/components/ui/ui";
import { MessageForm } from "@/features/forms/Forms";
import { JsonLd } from "@/components/JsonLd";
import { buildGiftCardJsonLd } from "@/seo/jsonld";
import { integrations } from "@/config/site";
import { NOT_CONFIGURED } from "@/config/integrations-copy";
import { SelectionMark } from "@/components/Logo";

export const revalidate = 3600;
type P = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, dict } = await pageCtx(params);
  return buildMetadata({ locale, path: "/gifts/", title: `${dict.nav.gifts} — fine dining gift cards`, description: "Fine dining gift vouchers: tasting menus, dine & stay, chef's tables and wine experiences." });
}
const DESIGN: Record<string, string> = { carmine: "bg-carmine text-ivory", garnet: "bg-garnet text-ivory", ivory: "bg-ivory text-carmine border border-line" };

export default async function Gifts({ params }: P) {
  const { locale, dict, data } = await pageCtx(params);
  const stripe = integrations().stripe;
  return (
    <PageShell crumbs={[{ name: dict.common.home, path: `/${locale}/` }, { name: dict.nav.gifts, path: `/${locale}/gifts/` }]} title={dict.home.cards.gift[0]!} lead={dict.home.cards.gift[1]}>
      <Notice tone="warning" title={stripe ? "Test mode" : "Not available yet"}>{stripe ? NOT_CONFIGURED.paymentsTest : NOT_CONFIGURED.payments}</Notice>
      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.giftCards.map((g) => (
          <li key={g.slug} className="rounded-[12px] border border-line bg-white p-4">
            <div className={`flex aspect-[1.6] flex-col justify-between rounded-[10px] p-4 ${DESIGN[g.design]}`} aria-hidden="true">
              <SelectionMark size={26} /><span className="font-serif text-lg">{t(g.name, locale)}</span>
            </div>
            <h2 className="mt-3 font-sans text-base font-bold">{t(g.name, locale)} {g.isDemo && <DemoBadge label={dict.common.demoData} />}</h2>
            <p className="text-sm text-stone">{t(g.description, locale)}</p>
            <p className="mt-2 text-sm">{g.values.map((v) => formatMoney(v, g.currency, locale)).join(" · ")}</p>
          </li>
        ))}
      </ul>
      <section className="mt-12 max-w-2xl rounded-[12px] border border-line bg-white p-6" aria-labelledby="gift-form">
        <h2 id="gift-form" className="font-serif text-2xl">{stripe ? "Prepare a gift card (test mode)" : "Tell me when gift cards open"}</h2>
        <p className="mb-4 mt-1 text-sm text-stone">Choose a design, value, recipient, message and delivery date. {stripe ? "Checkout runs in Stripe test mode only." : "We store your request only — nothing is charged or issued."}</p>
        <MessageForm kind="gift-interest" d={{ ...dict.forms, submit: dict.common.submit, sending: dict.common.sending }} fields={["name", "email", "message"]} messageLabel="Message for the recipient"
          extra={[
            { name: "card", label: "Gift card", type: "select", options: data.giftCards.map((g) => ({ value: g.slug, label: t(g.name, locale) })) },
            { name: "design", label: "Design", type: "select", options: [{ value: "carmine", label: "Carmine" }, { value: "garnet", label: "Garnet" }, { value: "ivory", label: "Ivory" }] },
            { name: "value", label: "Value (EUR)", type: "select", options: [100, 150, 250, 400, 500, 900].map((v) => ({ value: String(v), label: `€${v}` })) },
            { name: "recipient", label: "Recipient's name" },
            { name: "delivery_date", label: "Delivery date", type: "date" },
          ]} submitLabel={stripe ? "Continue to test checkout" : "Notify me"} />
      </section>
      {data.giftCards.map((g) => <JsonLd key={g.slug} data={buildGiftCardJsonLd(g, locale)} />)}
    </PageShell>
  );
}
