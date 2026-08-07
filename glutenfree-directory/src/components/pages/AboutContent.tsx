import Link from "next/link";
import { Target, Heart, ShieldCheck, MapPinned, BookOpen, HelpCircle } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SITE_NAME } from "@/lib/site-config";
import type { Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionary";
import { localeHref } from "@/lib/i18n/locale";

export default function AboutContent({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const en = locale === "en";
  const h = (path: string) => localeHref(locale, path);

  return (
    <div className="container-page py-10">
      <Breadcrumbs locale={locale} items={[{ name: t.footer.about, path: "/chi-siamo" }]} />
      <div className="mx-auto max-w-3xl">
        <h1 className="font-editorial text-3xl font-semibold text-ink sm:text-4xl">{en ? "About us" : "Chi siamo"}</h1>
        <p className="mt-4 text-lg text-ink-soft">
          {en
            ? `${SITE_NAME} was born from the direct experience of people with celiac disease who too often struggled to find reliable information on where to eat gluten-free safely in Italy, caught between the fear of cross-contamination and venues that call themselves "gluten-free" with no real guarantees.`
            : `${SITE_NAME} nasce dall'esperienza diretta di persone celiache che, troppo spesso, hanno faticato a trovare informazioni affidabili su dove mangiare senza glutine in sicurezza in Italia, tra il timore della contaminazione crociata e locali che si dichiarano "gluten free" senza reali garanzie.`}
        </p>
        <p className="mt-4 leading-relaxed text-ink-soft">
          {en
            ? "Our goal is to build Italy's most complete and up-to-date gluten-free directory: restaurants, pizzerias, hotels, bakeries, gelaterias and specialty shops, each verified through official sources — the venue's own website, the AIC register, phone confirmation — before appearing on the site. Alongside the directory, our editorial team publishes guides on celiac disease, food safety and cross-contamination, written for people who live with celiac disease every day."
            : "Il nostro obiettivo è costruire la directory italiana più completa e aggiornata dedicata al mondo senza glutine: ristoranti, pizzerie, hotel, bar e pasticcerie, gelaterie e negozi specializzati, ognuno verificato tramite fonti ufficiali — sito del locale, registro AIC, conferma telefonica — prima di comparire sul sito. Accanto alla directory, una redazione dedicata pubblica guide su celiachia, sicurezza alimentare e contaminazione crociata, pensate per chi convive ogni giorno con la celiachia."}
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {[
            { icon: Target, title: en ? "Our mission" : "La nostra missione", body: en ? "Making gluten-free life simpler anywhere in Italy, with verified venues and reliable information on celiac disease." : "Rendere la vita senza glutine più semplice ovunque in Italia, con locali verificati e informazioni affidabili sulla celiachia." },
            { icon: Heart, title: en ? "Built by the community" : "Fatto dalla community", body: en ? "Reviews and reports come from real people with celiac disease, not bots: safety told by those who live it every day." : "Recensioni e segnalazioni arrivano da persone celiache reali, non da bot: la sicurezza raccontata da chi la vive ogni giorno." },
            { icon: ShieldCheck, title: en ? "Constantly verified" : "Verifica costante", body: en ? "We periodically update addresses, hours and AIC certifications, so information stays reliable over time." : "Aggiorniamo periodicamente indirizzi, orari e certificazioni AIC, così le informazioni restano affidabili nel tempo." },
          ].map((item) => (
            <div key={item.title} className="card card-soft p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand-dark"><item.icon size={18} /></span>
              <h2 className="mt-3 font-semibold text-ink">{item.title}</h2>
              <p className="mt-1 text-sm text-ink-soft">{item.body}</p>
            </div>
          ))}
        </div>

        <h2 className="font-editorial mt-12 text-2xl font-semibold text-ink">
          {en ? "How we select gluten-free venues" : "Come selezioniamo i locali senza glutine"}
        </h2>
        <p className="mt-3 leading-relaxed text-ink-soft">
          {en
            ? "Every listing in the directory starts with a check against public official sources: the venue's own website, the Italian Celiac Association (AIC) register where available, and, where possible, direct phone confirmation. We always indicate whether a venue is AIC certified or not: the absence of the mark doesn't mean a restaurant is unsafe, but certification reduces the margin of error on cross-contamination. We never publish invented reviews or ratings: every rating comes from the community's real experiences."
            : "Ogni scheda della directory nasce da una verifica su fonti pubbliche ufficiali: il sito del locale, il registro dell'Associazione Italiana Celiachia (AIC) quando disponibile e, dove possibile, una conferma diretta. Indichiamo sempre se un locale è certificato AIC oppure no: l'assenza del marchio non significa che un ristorante sia pericoloso, ma la certificazione riduce il margine di errore sulla contaminazione crociata. Non pubblichiamo mai recensioni o valutazioni inventate: ogni voto nasce dalle esperienze reali della community."}
        </p>

        <h2 className="font-editorial mt-10 text-2xl font-semibold text-ink">
          {en ? `What you'll find on ${SITE_NAME}` : `Cosa trovi su ${SITE_NAME}`}
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {[
            { icon: MapPinned, href: "/directory", title: en ? "The directory" : "La directory", body: en ? "Verified gluten-free restaurants, pizzerias, hotels and shops across Italy." : "Ristoranti, pizzerie, hotel e negozi senza glutine verificati in tutta Italia." },
            { icon: BookOpen, href: "/blog", title: en ? "The blog" : "Il blog", body: en ? "Guides on celiac disease, food safety, cross-contamination and gluten-free recipes." : "Guide su celiachia, sicurezza alimentare, contaminazione crociata e ricette senza glutine." },
            { icon: HelpCircle, href: "/faq", title: en ? "The FAQ" : "Le FAQ", body: en ? "Answers to the most searched questions about celiac disease and gluten-free life." : "Risposte alle domande più cercate su celiachia e vita senza glutine." },
          ].map((item) => (
            <Link key={item.href} href={h(item.href)} className="card card-hover card-soft p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand-dark"><item.icon size={18} /></span>
              <p className="mt-3 font-semibold text-ink">{item.title}</p>
              <p className="mt-1 text-sm text-ink-soft">{item.body}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
