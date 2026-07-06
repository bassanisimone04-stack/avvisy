import type { Metadata, Viewport } from "next";
import {
  Bricolage_Grotesque,
  Dancing_Script,
  Instrument_Sans,
  JetBrains_Mono,
} from "next/font/google";
import CookieBanner from "@/components/CookieBanner";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

const dancing = Dancing_Script({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-dancing",
});

const SITE_URL = "https://avvisy.app";
const TITLE = "Avvisy — Appuntamenti e code senza attese";
const DESCRIPTION =
  "Avvisy aiuta piccoli uffici e studi a gestire appuntamenti, check-in e code live. Per i cittadini prenotare è sempre gratis.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s · Avvisy",
  },
  description: DESCRIPTION,
  applicationName: "Avvisy",
  keywords: [
    "appuntamenti",
    "prenotazioni",
    "coda",
    "eliminacode",
    "check-in",
    "CAF",
    "studio medico",
  ],
  icons: {
    icon: "/icon-192.png",
    apple: "/apple-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Avvisy",
  },
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: SITE_URL,
    siteName: "Avvisy",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#0e7a68",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="it"
      className={`${bricolage.variable} ${instrument.variable} ${jetbrains.variable} ${dancing.variable}`}
    >
      <body className="min-h-dvh">
        {children}
        <CookieBanner />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
