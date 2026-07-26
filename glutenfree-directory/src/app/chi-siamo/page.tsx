import { Target, Heart, ShieldCheck } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { pageMetadata } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site-config";

export const metadata = pageMetadata({
  title: `Chi siamo — ${SITE_NAME}`,
  description: "La missione di GlutenFree Directory: diventare il punto di riferimento italiano per chi cerca locali, prodotti e informazioni affidabili sul senza glutine.",
  path: "/chi-siamo",
});

export default function AboutPage() {
  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ name: "Chi siamo", path: "/chi-siamo" }]} />
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-ink sm:text-4xl">Chi siamo</h1>
        <p className="mt-4 text-lg text-ink-soft">
          {SITE_NAME} nasce dall&apos;esperienza diretta di persone celiache che, troppo spesso, hanno faticato a trovare informazioni affidabili su dove mangiare, dormire e fare la spesa in sicurezza in Italia.
        </p>
        <p className="mt-4 leading-relaxed text-ink-soft">
          Il nostro obiettivo è costruire la directory italiana più completa e aggiornata dedicata al mondo senza glutine: ristoranti, pizzerie, hotel, farmacie, supermercati e negozi verificati, affiancati da una redazione che pubblica guide, ricette e approfondimenti scientificamente accurati sulla celiachia e la sensibilità al glutine.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {[
            { icon: Target, title: "La nostra missione", body: "Rendere la vita senza glutine più semplice, ovunque tu sia in Italia." },
            { icon: Heart, title: "Fatto dalla community", body: "Recensioni e segnalazioni vengono da persone celiache reali, non da bot." },
            { icon: ShieldCheck, title: "Verifica costante", body: "Aggiorniamo periodicamente indirizzi, orari e certificazioni AIC." },
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
