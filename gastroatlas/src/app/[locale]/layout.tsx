import { notFound } from "next/navigation";
import "../globals.css";
import { dmSans } from "../fonts";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LOCALES, T, isLocale, type Locale } from "@/lib/i18n";

export const dynamicParams = false;
export const generateStaticParams = () => LOCALES.map((locale) => ({ locale }));

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale: l } = await params;
  if (!isLocale(l)) notFound();
  const locale: Locale = l;
  return (
    <html lang={locale} className={dmSans.variable}>
      <body>
        <a className="skip btn" href="#main">{T(locale)("Skip to content", "Vai al contenuto")}</a>
        <Header locale={locale} />
        <main id="main" tabIndex={-1}>{children}</main>
        <Footer locale={locale} />
      </body>
    </html>
  );
}
