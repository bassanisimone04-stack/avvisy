import type { Metadata, Viewport } from "next";
import RootShell from "@/components/RootShell";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site-config";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} — Ristoranti, negozi e locali senza glutine in Italia`, template: `%s · ${SITE_NAME}` },
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
  ],
  authors: [{ name: SITE_NAME }],
  alternates: { canonical: "/" },
  openGraph: {
    title: `${SITE_NAME} — Ristoranti, negozi e locali senza glutine in Italia`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "it_IT",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: SITE_NAME, description: SITE_DESCRIPTION },
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
  return <RootShell lang="it">{children}</RootShell>;
}
