"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Store, TrendingUp, Users } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { localeHref, type Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionary";

const CONTACT_EMAIL = "info@mappasenzaglutine.it";

export default function BusinessOnboardingContent({ locale }: { locale: Locale }) {
  const [sent, setSent] = useState(false);
  const t = getDictionary(locale);
  const en = locale === "en";

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const ragione = String(data.get("ragione") ?? "");
    const categoria = String(data.get("categoria") ?? "");
    const citta = String(data.get("citta") ?? "");
    const email = String(data.get("email") ?? "");
    const subject = en ? `Listing request: ${ragione}` : `Richiesta inserimento: ${ragione}`;
    const body = en
      ? `Business name: ${ragione}\nCategory: ${categoria}\nCity: ${citta}\nContact email: ${email}`
      : `Nome attività: ${ragione}\nCategoria: ${categoria}\nCittà: ${citta}\nEmail di contatto: ${email}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <div className="container-page py-10">
      <Breadcrumbs locale={locale} items={[{ name: t.footer.addBusiness, path: "/per-le-aziende" }]} />
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <h1 className="text-3xl font-bold text-ink sm:text-4xl">{en ? "List your business" : "Inserisci la tua attività"}</h1>
          <p className="mt-3 text-ink-soft">{en ? "Get in front of people with celiac disease looking for safe places in your area." : "Fatti trovare dalle persone celiache che cercano locali sicuri nella tua zona."}</p>
          <p className="mt-2 text-sm text-ink-soft">
            {en ? "Not in the AIC program yet? " : "Non sei ancora nel programma AIC? "}
            <Link href={localeHref(locale, "/blog/ristoratori-come-aderire-al-programma-aic-alimentazione-fuori-casa")} className="link-underline text-brand-dark">{en ? "Here is how to join." : "Ecco come aderire."}</Link>
          </p>
          <div className="mt-6 space-y-4">
            {[
              { icon: Store, title: en ? "Free listing" : "Scheda gratuita", body: en ? "Your business listing, with address, gluten-free menu and contacts, at no activation cost." : "La scheda della tua attività, con indirizzo, menu senza glutine e contatti, senza costi di attivazione." },
              { icon: Users, title: en ? "Qualified community" : "Community qualificata", body: en ? "Direct visibility to celiac users genuinely interested in what you offer." : "Visibilità diretta verso utenti celiaci realmente interessati alla tua offerta." },
              { icon: TrendingUp, title: en ? "Checked data" : "Dati verificati", body: en ? "We check the data before publishing and state whether your kitchen is dedicated or mixed." : "Verifichiamo i dati prima di pubblicarli e indichiamo se la cucina è dedicata o mista." },
            ].map((item) => (
              <div key={item.title} className="flex gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-dark"><item.icon size={18} /></span>
                <div>
                  <p className="font-semibold text-ink">{item.title}</p>
                  <p className="text-sm text-ink-soft">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card card-soft p-6">
          {sent ? (
            <div className="flex items-center gap-2 text-brand-dark"><CheckCircle2 size={20} /> {en ? `We opened your email client with the request ready to send. If nothing opened, write to us directly at ${CONTACT_EMAIL}.` : `Abbiamo aperto il tuo client email con la richiesta pronta da inviare. Se non si è aperto nulla, scrivici direttamente a ${CONTACT_EMAIL}.`}</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="ragione" className="field-label">{en ? "Business name" : "Nome attività"}</label>
                <input id="ragione" name="ragione" className="field" required />
              </div>
              <div>
                <label htmlFor="categoria" className="field-label">{en ? "Category" : "Categoria"}</label>
                <select id="categoria" name="categoria" className="field">
                  <option>{en ? "Restaurant" : "Ristorante"}</option>
                  <option>Pizzeria</option>
                  <option>Hotel</option>
                  <option>{en ? "Pharmacy" : "Farmacia"}</option>
                  <option>{en ? "Supermarket" : "Supermercato"}</option>
                  <option>{en ? "Specialty shop" : "Negozio specializzato"}</option>
                </select>
              </div>
              <div>
                <label htmlFor="citta" className="field-label">{en ? "City" : "Città"}</label>
                <input id="citta" name="citta" className="field" required />
              </div>
              <div>
                <label htmlFor="email" className="field-label">{en ? "Contact email" : "Email di contatto"}</label>
                <input id="email" name="email" type="email" className="field" required />
              </div>
              <button type="submit" className="btn btn-primary btn-block">{en ? "Open email to send request" : "Apri email per inviare la richiesta"}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
