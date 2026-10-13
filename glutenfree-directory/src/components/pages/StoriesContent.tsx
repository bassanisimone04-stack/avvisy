import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import StoryForm from "@/components/StoryForm";
import { STORIES } from "@/lib/stories";
import { getBusinessBySlug } from "@/lib/mock-businesses";
import { formatDate } from "@/lib/format";
import { localeHref, type Locale } from "@/lib/i18n/locale";

export const STORIES_PATH = "/le-vostre-storie";

export default function StoriesContent({ locale }: { locale: Locale }) {
  const en = locale === "en";
  return (
    <div className="container-page py-10">
      <Breadcrumbs locale={locale} items={[{ name: en ? "Your stories" : "Le vostre storie", path: STORIES_PATH }]} />
      <div className="mx-auto max-w-3xl">
        <h1 className="font-editorial text-3xl font-semibold text-ink sm:text-4xl">
          {en ? "Your stories: share your gluten-free experience" : "Le vostre storie: racconta la tua esperienza senza glutine"}
        </h1>
        <p className="mt-4 text-lg text-ink-soft">
          {en
            ? "You've tried a venue from our map? Tell us how it went: what you ate, how they handled celiac disease, what you'd tell someone going there. Real experiences help other people choose, and they're the only kind we publish."
            : "Hai provato un locale della nostra mappa? Raccontaci com'è andata: cosa hai mangiato, come hanno gestito la celiachia, cosa diresti a chi ci va. Le esperienze vere aiutano gli altri a scegliere, e sono le uniche che pubblichiamo."}
        </p>

        <h2 className="font-editorial mt-10 text-2xl font-semibold text-ink">{en ? "How it works" : "Come funziona"}</h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-ink-soft">
          <li>{en ? "Fill in the form: it prepares an email that you send to us." : "Compili il modulo: prepara un'email che ci invii."}</li>
          <li>{en ? "We read every story and may shorten it; we never invent or change the facts." : "Leggiamo ogni storia e possiamo accorciarla; non inventiamo né cambiamo i fatti."}</li>
          <li>{en ? "We publish it only with your consent, under the first name or initial you choose." : "La pubblichiamo solo con il tuo consenso, col nome o l'iniziale che scegli."}</li>
          <li>{en ? "Only your own photos, with no recognisable faces without the person's consent (especially children)." : "Solo foto tue, senza volti riconoscibili senza il consenso della persona (soprattutto bambini)."}</li>
          <li>{en ? "No insults, no health details of other people, no advertising." : "Niente insulti, niente dati di salute di altre persone, niente pubblicità."}</li>
        </ul>

        <div className="mt-8"><StoryForm locale={locale} /></div>

        <h2 className="font-editorial mt-12 text-2xl font-semibold text-ink">{en ? "Published stories" : "Storie pubblicate"}</h2>
        {STORIES.length === 0 ? (
          <p className="mt-3 text-ink-soft">
            {en ? "No stories published yet: yours can be the first." : "Ancora nessuna storia pubblicata: la tua può essere la prima."}
          </p>
        ) : (
          <div className="mt-4 space-y-4">
            {STORIES.map((s) => {
              const biz = s.businessSlug ? getBusinessBySlug(s.businessSlug) : undefined;
              return (
                <blockquote key={s.id} className="card card-soft p-5 text-sm text-ink-soft">
                  <p>{s.body}</p>
                  <footer className="mt-2 text-xs text-muted">
                    {s.author} · {formatDate(s.date, locale)}
                    {biz && (<> · <Link href={localeHref(locale, `/directory/${biz.slug}`)} className="link-underline text-brand-dark">{biz.name}</Link></>)}
                  </footer>
                </blockquote>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
