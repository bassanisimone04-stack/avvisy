import Breadcrumbs from "@/components/Breadcrumbs";
import type { Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionary";

export function PrivacyContent({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const en = locale === "en";
  return (
    <div className="container-page py-10">
      <Breadcrumbs locale={locale} items={[{ name: t.footer.privacy, path: "/privacy" }]} />
      <div className="prose-article mx-auto max-w-3xl">
        <h1>Privacy Policy</h1>
        {en ? (
          <>
            <p>This demo prototype does not collect or process any real personal data. In a production version, this page would describe in detail the purposes of processing, the legal bases, retention periods and data subject rights under GDPR (EU Regulation 2016/679).</p>
            <h2>Data collected</h2>
            <p>Accounts, favorites and reviews entered in this prototype are stored exclusively in the local browser (localStorage) and are never transmitted to any external server.</p>
            <h2>Contact</h2>
            <p>For any privacy-related question, write to privacy@glutenfreedirectory.it.</p>
          </>
        ) : (
          <>
            <p>Questo prototipo dimostrativo non raccoglie né elabora dati personali reali. In una versione in produzione, questa pagina descriverebbe nel dettaglio le finalità del trattamento, le basi giuridiche, i tempi di conservazione e i diritti dell&apos;interessato ai sensi del GDPR (Regolamento UE 2016/679).</p>
            <h2>Dati raccolti</h2>
            <p>Account, preferiti e recensioni inseriti in questo prototipo sono salvati esclusivamente nel browser locale (localStorage) e non vengono trasmessi a nessun server esterno.</p>
            <h2>Contatti</h2>
            <p>Per qualsiasi domanda relativa alla privacy scrivi a privacy@glutenfreedirectory.it.</p>
          </>
        )}
      </div>
    </div>
  );
}

export function CookieContent({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const en = locale === "en";
  return (
    <div className="container-page py-10">
      <Breadcrumbs locale={locale} items={[{ name: t.footer.cookie, path: "/cookie" }]} />
      <div className="prose-article mx-auto max-w-3xl">
        <h1>Cookie Policy</h1>
        {en ? (
          <>
            <p>This prototype only uses the browser's local storage to remember the theme preference (light/dark) and the demo account data, with no profiling or third-party cookies.</p>
            <h2>Technical cookies</h2>
            <p>We do not use tracking cookies in this prototype. A production version would include a consent banner compliant with applicable regulations for any analytics or marketing cookies.</p>
          </>
        ) : (
          <>
            <p>Questo prototipo utilizza esclusivamente lo storage locale del browser per memorizzare la preferenza di tema (chiaro/scuro) e i dati dell&apos;account dimostrativo, senza cookie di profilazione o di terze parti.</p>
            <h2>Cookie tecnici</h2>
            <p>Non utilizziamo cookie di tracciamento in questo prototipo. Una versione in produzione includerebbe un banner di consenso conforme alla normativa vigente per eventuali cookie analitici o di marketing.</p>
          </>
        )}
      </div>
    </div>
  );
}

export function TermsContent({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const en = locale === "en";
  return (
    <div className="container-page py-10">
      <Breadcrumbs locale={locale} items={[{ name: t.footer.terms, path: "/termini" }]} />
      <div className="prose-article mx-auto max-w-3xl">
        <h1>{en ? "Terms of Service" : "Termini di servizio"}</h1>
        {en ? (
          <>
            <p>GlutenFree Directory is a demo prototype. Information on businesses, products and reviews shown on the site is fictional and for illustrative purposes only, and does not represent real data.</p>
            <h2>Use of the service</h2>
            <p>Use of the platform is free. Users agree to publish truthful content (reviews, comments, reports) that is respectful of the community.</p>
            <h2>Limitation of liability</h2>
            <p>Food safety information published by users is indicative only: always check directly with the business for any doubts about allergens and contamination.</p>
          </>
        ) : (
          <>
            <p>GlutenFree Directory è un prototipo dimostrativo. Le informazioni su attività, prodotti e recensioni presenti nel sito sono inventate a scopo illustrativo e non rappresentano dati reali.</p>
            <h2>Uso del servizio</h2>
            <p>L&apos;utilizzo della piattaforma è gratuito. Gli utenti si impegnano a pubblicare contenuti (recensioni, commenti, segnalazioni) veritieri e rispettosi della community.</p>
            <h2>Limitazione di responsabilità</h2>
            <p>Le informazioni sulla sicurezza alimentare pubblicate dagli utenti hanno natura orientativa: si raccomanda sempre di verificare direttamente con l&apos;attività eventuali dubbi su allergeni e contaminazioni.</p>
          </>
        )}
      </div>
    </div>
  );
}
