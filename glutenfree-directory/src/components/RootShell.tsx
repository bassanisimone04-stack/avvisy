import { Inter, Sora, Fraunces } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { StoreProvider } from "@/lib/store";
import ThemeInit from "@/components/ThemeInit";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import MotionExtras from "@/components/MotionExtras";
import { JsonLd, organizationJsonLd } from "@/lib/seo";
import type { Locale } from "@/lib/i18n/locale";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const sora = Sora({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-sora", display: "swap" });
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

// Struttura HTML condivisa dai due root layout (italiano in (it), inglese in
// (en)): l'unica differenza è l'attributo lang di <html>, che con un solo
// layout restava "it" anche sulle pagine inglesi.
export default function RootShell({ lang, children }: { lang: Locale; children: React.ReactNode }) {
  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <ThemeInit />
      </head>
      <body className={`${inter.variable} ${sora.variable} ${fraunces.variable} font-sans`}>
        <JsonLd data={organizationJsonLd()} />
        <StoreProvider>
          <a href="#main-content" className="skip-link">{lang === "en" ? "Skip to main content" : "Vai al contenuto principale"}</a>
          <SiteHeader />
          <main id="main-content">{children}</main>
          <SiteFooter />
          <MotionExtras />
        </StoreProvider>
        <Analytics />
      </body>
    </html>
  );
}
