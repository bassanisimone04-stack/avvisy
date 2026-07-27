import { Target, Heart, ShieldCheck } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SITE_NAME } from "@/lib/site-config";
import type { Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionary";

export default function AboutContent({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const en = locale === "en";

  return (
    <div className="container-page py-10">
      <Breadcrumbs locale={locale} items={[{ name: t.footer.about, path: "/chi-siamo" }]} />
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-ink sm:text-4xl">{en ? "About us" : "Chi siamo"}</h1>
        <p className="mt-4 text-lg text-ink-soft">
          {en
            ? `${SITE_NAME} was born from the direct experience of people with celiac disease who too often struggled to find reliable information on where to eat, sleep and shop safely in Italy.`
            : `${SITE_NAME} nasce dall'esperienza diretta di persone celiache che, troppo spesso, hanno faticato a trovare informazioni affidabili su dove mangiare, dormire e fare la spesa in sicurezza in Italia.`}
        </p>
        <p className="mt-4 leading-relaxed text-ink-soft">
          {en
            ? "Our goal is to build the most complete and up-to-date Italian directory dedicated to the gluten-free world: verified restaurants, pizzerias, hotels, pharmacies, supermarkets and shops, alongside an editorial team publishing scientifically accurate guides, recipes and insights on celiac disease and gluten sensitivity."
            : "Il nostro obiettivo è costruire la directory italiana più completa e aggiornata dedicata al mondo senza glutine: ristoranti, pizzerie, hotel, farmacie, supermercati e negozi verificati, affiancati da una redazione che pubblica guide, ricette e approfondimenti scientificamente accurati sulla celiachia e la sensibilità al glutine."}
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {[
            { icon: Target, title: en ? "Our mission" : "La nostra missione", body: en ? "Making gluten-free life simpler, wherever you are in Italy." : "Rendere la vita senza glutine più semplice, ovunque tu sia in Italia." },
            { icon: Heart, title: en ? "Built by the community" : "Fatto dalla community", body: en ? "Reviews and reports come from real celiac people, not bots." : "Recensioni e segnalazioni vengono da persone celiache reali, non da bot." },
            { icon: ShieldCheck, title: en ? "Constantly verified" : "Verifica costante", body: en ? "We periodically update addresses, hours and AIC certifications." : "Aggiorniamo periodicamente indirizzi, orari e certificazioni AIC." },
          ].map((item) => (
            <div key={item.title} className="card card-soft p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand-dark"><item.icon size={18} /></span>
              <h2 className="mt-3 font-semibold text-ink">{item.title}</h2>
              <p className="mt-1 text-sm text-ink-soft">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
