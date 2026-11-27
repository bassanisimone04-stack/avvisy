import type { Metadata } from "next";
import { Photo } from "@/components/Photo";
import { Page } from "@/components/Section";
import { localeOf } from "@/components/PageHelpers";
import { T } from "@/lib/i18n";
import { meta } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> { const l = await localeOf(params); return meta(l, "travel/tuscany", T(l)("A gastronomic journey through Tuscany", "Un viaggio gastronomico in Toscana")); }
export default async function Tuscany({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await localeOf(params);
  const t = T(locale);
  return (
    <Page heading={t("A gastronomic journey through Tuscany", "Un viaggio gastronomico in Toscana")}>
      <div className="wide topline"><Photo name="tuscany" alt={t("Tuscan hills with vineyards and a farmhouse at sunset", "Colline toscane con vigneti e un casale al tramonto")} priority sizes="(min-width: 1180px) 1180px, 100vw" /></div>
      <p className="lead">{t("A self-guided itinerary idea for three days.", "Un’idea di itinerario autonomo per tre giorni.")}</p>
      <ol>
        <li>{t("Florence · Explore a food market and try seasonal Tuscan dishes.", "Firenze · Esplora un mercato alimentare e assaggia la cucina toscana di stagione.")}</li>
        <li>{t("Chianti · Explore wine villages and contact estates about tastings.", "Chianti · Esplora i borghi del vino e contatta le tenute per le degustazioni.")}</li>
        <li>{t("Val d’Orcia · Walk through Pienza and look for local pecorino.", "Val d’Orcia · Passeggia per Pienza e cerca il pecorino locale.")}</li>
      </ol>
    </Page>
  );
}
