import Breadcrumbs from "@/components/Breadcrumbs";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Cookie Policy",
  description: "Informativa sui cookie tecnici e di preferenza utilizzati da GlutenFree Directory.",
  path: "/cookie",
});

export default function CookiePage() {
  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ name: "Cookie policy", path: "/cookie" }]} />
      <div className="prose-article mx-auto max-w-3xl">
        <h1>Cookie Policy</h1>
        <p>Questo prototipo utilizza esclusivamente lo storage locale del browser per memorizzare la preferenza di tema (chiaro/scuro) e i dati dell&apos;account dimostrativo, senza cookie di profilazione o di terze parti.</p>
        <h2>Cookie tecnici</h2>
        <p>Non utilizziamo cookie di tracciamento in questo prototipo. Una versione in produzione includerebbe un banner di consenso conforme alla normativa vigente per eventuali cookie analitici o di marketing.</p>
      </div>
    </div>
  );
}
