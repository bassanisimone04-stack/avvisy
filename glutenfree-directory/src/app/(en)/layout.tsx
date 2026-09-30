import type { Metadata, Viewport } from "next";
import RootShell from "@/components/RootShell";
import { SITE_DESCRIPTION_EN, SITE_NAME, SITE_URL } from "@/lib/site-config";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} — Gluten-free restaurants, shops and venues in Italy`, template: `%s · ${SITE_NAME}` },
  description: SITE_DESCRIPTION_EN,
  applicationName: SITE_NAME,
  keywords: [
    "mappa senza glutine",
    "gluten-free Italy",
    "celiac disease",
    "gluten-free restaurants Italy",
    "where to eat gluten-free",
    "AIC certified",
  ],
  authors: [{ name: SITE_NAME }],
  alternates: { canonical: "/en" },
  openGraph: {
    title: `${SITE_NAME} — Gluten-free restaurants, shops and venues in Italy`,
    description: SITE_DESCRIPTION_EN,
    url: `${SITE_URL}/en`,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: SITE_NAME, description: SITE_DESCRIPTION_EN },
  robots: { index: true, follow: true },
  icons: { icon: "/icon.svg" },
  verification: { google: "iqZQUOtgVkrSjozA2Lp3HGi7xeyu9drs8-crOSQRxIs" },
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
  return <RootShell lang="en">{children}</RootShell>;
}
