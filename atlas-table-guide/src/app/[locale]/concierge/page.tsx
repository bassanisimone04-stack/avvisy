import { tx } from "@/i18n";
import type { Metadata } from "next";
import { pageCtx } from "../_ctx";
import { buildMetadata } from "@/seo/metadata";
import { PageShell } from "@/features/PageShell";
import { ConciergePlanner } from "@/features/ConciergePlanner";
import { MessageForm } from "@/features/forms/Forms";
import { integrations } from "@/config/site";
import { t } from "@/db/types";

type P = { params: Promise<{ locale: string }>; searchParams: Promise<{ restaurant?: string; hotel?: string; experience?: string; destination?: string }> };
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await pageCtx(params);
  return buildMetadata({ locale, path: "/concierge/", title: tx(locale, "Concierge — plan a culinary trip", "Concierge — pianifica un viaggio gastronomico"), description: tx(locale, "Plan a culinary trip from verified restaurant, hotel and experience records. Estimates labelled; availability never assumed.", "Pianifica un viaggio gastronomico da schede verificate di ristoranti, hotel ed esperienze. Stime indicate come tali; la disponibilità non è mai data per scontata.") });
}
export default async function Concierge({ params, searchParams }: P) {
  const { locale, dict, data } = await pageCtx(params);
  const sp = await searchParams;
  const r = sp.restaurant ? data.restaurants.find((x) => x.slug === sp.restaurant) : undefined;
  return (
    <PageShell crumbs={[{ name: dict.common.home, path: `/${locale}/` }, { name: "Concierge", path: `/${locale}/concierge/` }]} title="Concierge" lead={tx(locale, "Draft a trip from our own records, then ask a human concierge to request the tables.", "Prepara una bozza di viaggio dalle nostre schede, poi chiedi a un concierge in carne e ossa di richiedere i tavoli.")}>
      <ConciergePlanner locale={locale} llmConfigured={integrations().llm} labels={{ share: dict.common.share, copied: dict.common.copied }}
        initial={{ destination: r?.citySlug ?? sp.destination, restaurant: r?.slug }}
        cities={data.cities.map((c) => ({ value: c.slug, label: t(c.name, locale) }))} cuisines={data.cuisines.map((c) => ({ value: c.slug, label: t(c.name, locale) }))} />
      <section className="mt-12 max-w-2xl rounded-[12px] border border-line bg-white p-6" aria-labelledby="human">
        <h2 id="human" className="font-serif text-2xl">{dict.profile.requestConcierge}</h2>
        <p className="mb-4 mt-1 text-sm text-stone">{tx(locale, "We pass your request to the venue or partner. Nothing is confirmed until they reply.", "Inoltriamo la tua richiesta al locale o al partner. Nulla è confermato finché non rispondono.")}</p>
        <MessageForm kind="concierge" subjectRef={r ? `restaurant:${r.slug}` : sp.hotel ? `hotel:${sp.hotel}` : sp.experience ? `experience:${sp.experience}` : undefined} d={{ ...dict.forms, submit: dict.common.submit, sending: dict.common.sending }}
          extra={[{ name: "date", label: tx(locale, "Preferred date", "Data preferita"), type: "date" }, { name: "party_size", label: tx(locale, "Guests", "Ospiti"), type: "number" }]} messageLabel={r ? `${tx(locale, "Your request for", "La tua richiesta per")} ${r.name}` : dict.forms.message} />
      </section>
    </PageShell>
  );
}
