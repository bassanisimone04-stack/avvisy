import type { Metadata, Viewport } from "next";
import { Inter, Sora, Fraunces } from "next/font/google";
import { StoreProvider } from "@/lib/store";
import ThemeInit from "@/components/ThemeInit";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { JsonLd, organizationJsonLd } from "@/lib/seo";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site-config";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const sora = Sora({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-sora", display: "swap" });
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} — Ristoranti, negozi e prodotti senza glutine in Italia`, template: `%s · ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "mappa senza glutine",
    "senza glutine",
    "celiachia",
    "ristoranti senza glutine",
    "locali gluten free vicino a me",
    "dove mangiare senza glutine",
    "gluten free Italia",
    "AIC",
    "prodotti senza glutine",
  ],
  authors: [{ name: SITE_NAME }],
  alternates: { canonical: "/" },
  openGraph: {
    title: `${SITE_NAME} — Ristoranti, negozi e prodotti senza glutine in Italia`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "it_IT",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: SITE_NAME, description: SITE_DESCRIPTION },
  robots: { index: true, follow: true },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1b4332" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1712" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" suppressHydrationWarning>
      <head>
        <ThemeInit />
      </head>
      <body className={`${inter.variable} ${sora.variable} ${fraunces.variable} font-sans`}>
        <JsonLd data={organizationJsonLd()} />
        <StoreProvider>
          <a href="#main-content" className="skip-link">Vai al contenuto principale</a>
          <SiteHeader />
          <main id="main-content">{children}</main>
          <SiteFooter />
        </StoreProvider>
      </body>
    </html>
  );
}
