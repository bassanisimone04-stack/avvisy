import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Photo } from "@/components/Photo";
import { Page } from "@/components/Section";
import { LOCALES, T, type Locale } from "@/lib/i18n";
import { meta } from "@/lib/seo";

export const dynamicParams = false;
const SLUGS = ["wine", "menus"] as const;
export const generateStaticParams = () => LOCALES.flatMap((locale) => SLUGS.map((slug) => ({ locale, slug })));
type P = { params: Promise<{ locale: string; slug: string }> };

const article = (locale: Locale, slug: string) => {
  const t = T(locale);
  if (slug === "wine") return { photo: "wine", heading: t("How to read a wine pairing", "Come leggere un abbinamento vini"), body: t("Start with the rhythm of the meal. Ask which wines accompany several courses, how large the pours are and whether the restaurant offers an alcohol-free pairing. This makes it easier to compare an included pairing with one sold separately.", "Parti dal ritmo della cena. Chiedi quali vini accompagnano più portate, quanto sono abbondanti i calici e se esiste un percorso analcolico. Potrai così confrontare abbinamenti inclusi e supplementi.") };
  if (slug === "menus") return { photo: "plate2", heading: t("How to compare tasting menus", "Come confrontare i menù degustazione"), body: t("Compare the number of courses, what the price includes and the restaurant’s policy on dietary adaptations. Check the date of the menu and ask whether a shorter lunch menu is available.", "Confronta il numero di portate, cosa include il prezzo e quali adattamenti prevede il ristorante. Controlla la data del menù e chiedi se a pranzo è disponibile un percorso più breve.") };
  return null;
};
export async function generateMetadata({ params }: P): Promise<Metadata> { const { locale, slug } = await params; return meta(locale as Locale, `magazine/${slug}`, article(locale as Locale, slug)?.heading); }
export default async function Article({ params }: P) {
  const { locale, slug } = await params;
  const a = article(locale as Locale, slug);
  if (!a) notFound();
  return <Page heading={a.heading}><div className="wide topline"><Photo name={a.photo} alt="" sizes="(min-width: 1180px) 1180px, 100vw" priority /></div><p className="lead">{a.body}</p></Page>;
}
