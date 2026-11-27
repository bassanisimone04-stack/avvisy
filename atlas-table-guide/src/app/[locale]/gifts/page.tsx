import { tx } from "@/i18n";
import type { Metadata } from "next";
import { pageCtx } from "../_ctx";
import { buildMetadata } from "@/seo/metadata";
import { PageShell } from "@/features/PageShell";
import { t } from "@/db/types";
import { formatMoney } from "@/lib/price";
import { Notice, DemoBadge } from "@/components/ui/ui";
import { MessageForm } from "@/features/forms/Forms";
import { GiftCheckout } from "@/features/GiftCheckout";
import { JsonLd } from "@/components/JsonLd";
import { buildGiftCardJsonLd } from "@/seo/jsonld";
import { integrations } from "@/config/site";
import { NOT_CONFIGURED } from "@/config/integrations-copy";
import { SelectionMark } from "@/components/Logo";

export const revalidate = 3600;
type P = { params: Promise<{ locale: string }>; searchParams: Promise<{ paid?: string }> };
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, dict } = await pageCtx(params);
  return buildMetadata({ locale, path: "/gifts/", title: `${dict.nav.gifts} — fine dining gift cards`, description: locale === "it" ? "Buoni regalo per l'alta cucina: menu degustazione, cena e soggiorno, tavoli dello chef ed esperienze nel vino." : "Fine dining gift vouchers: tasting menus, dine & stay, chef's tables and wine experiences." });
}
const DESIGN: Record<string, string> = { carmine: "bg-carmine text-ivory", garnet: "bg-garnet text-ivory", ivory: "bg-ivory text-carmine border border-line" };

export default async function Gifts({ params, searchParams }: P) {
  const paid = (await searchParams).paid === "1";
  const { locale, dict, data } = await pageCtx(params);
  const stripe = integrations().stripe;
  return (
    <PageShell crumbs={[{ name: dict.common.home, path: `/${locale}/` }, { name: dict.nav.gifts, path: `/${locale}/gifts/` }]} title={dict.home.cards.gift[0]!} lead={dict.home.cards.gift[1]}>
      {paid && <div className="mb-4"><Notice tone="success">{tx(locale, "Thank you — test payment received. This was a TEST: no real card was charged and no real gift card is issued.", "Grazie: pagamento di prova ricevuto. Era una PROVA: nessuna carta reale è stata addebitata e nessuna gift card reale viene emessa.")}</Notice></div>}
      <Notice tone="warning" title={stripe ? tx(locale, "Test mode", "Modalità test") : tx(locale, "Not available yet", "Non ancora disponibile")}>{stripe ? tx(locale, NOT_CONFIGURED.paymentsTest, "Stripe in MODALITÀ TEST: nessuna carta viene addebitata e nessuna gift card reale viene emessa.") : tx(locale, NOT_CONFIGURED.payments, "Il pagamento online non è ancora disponibile: nessun accordo con un esercente è configurato. Non verrà addebitato nulla. Lascia la tua email e ti avviseremo all'apertura.")}</Notice>
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
        <h2 id="gift-form" className="font-serif text-2xl">{stripe ? tx(locale, "Prepare a gift card (test mode)", "Prepara una gift card (modalità test)") : tx(locale, "Tell me when gift cards open", "Avvisami quando le gift card saranno disponibili")}</h2>
        <p className="mb-4 mt-1 text-sm text-stone">{tx(locale, "Choose a design, value, recipient, message and delivery date.", "Scegli grafica, importo, destinatario, messaggio e data di consegna.")} {stripe ? tx(locale, "Checkout runs in Stripe test mode only.", "Il pagamento funziona solo in modalità test di Stripe.") : tx(locale, "We store your request only — nothing is charged or issued.", "Conserviamo solo la tua richiesta: non viene addebitato né emesso nulla.")}</p>
        {stripe ? <GiftCheckout locale={locale} cards={data.giftCards.map((g) => ({ slug: g.slug, name: t(g.name, locale), values: g.values, currency: g.currency }))} /> : (
        <MessageForm kind="gift-interest" d={{ ...dict.forms, submit: dict.common.submit, sending: dict.common.sending }} fields={["name", "email", "message"]} messageLabel={tx(locale, "Message for the recipient", "Messaggio per il destinatario")}
          extra={[
            { name: "card", label: tx(locale, "Gift card", "Gift card"), type: "select", options: data.giftCards.map((g) => ({ value: g.slug, label: t(g.name, locale) })) },
            { name: "design", label: tx(locale, "Design", "Grafica"), type: "select", options: [{ value: "carmine", label: "Carmine" }, { value: "garnet", label: "Garnet" }, { value: "ivory", label: "Ivory" }] },
            { name: "value", label: tx(locale, "Value (EUR)", "Importo (EUR)"), type: "select", options: [100, 150, 250, 400, 500, 900].map((v) => ({ value: String(v), label: `€${v}` })) },
            { name: "recipient", label: tx(locale, "Recipient's name", "Nome del destinatario") },
            { name: "delivery_date", label: tx(locale, "Delivery date", "Data di consegna"), type: "date" },
          ]} submitLabel={stripe ? tx(locale, "Continue to test checkout", "Continua al pagamento di prova") : tx(locale, "Notify me", "Avvisami")} />
        )}
      </section>
      {data.giftCards.map((g) => <JsonLd key={g.slug} data={buildGiftCardJsonLd(g, locale)} />)}
    </PageShell>
  );
}
