import type { Metadata, Viewport } from "next";
import {
  Bricolage_Grotesque,
  Dancing_Script,
  Instrument_Sans,
  JetBrains_Mono,
} from "next/font/google";
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

export const metadata: Metadata = {
  title: "Avvisy — Appuntamenti e code senza attese",
  description:
    "Avvisy aiuta piccoli uffici e studi a gestire appuntamenti, check-in e code live. Prenotare è gratis.",
  icons: {
    icon: "/icon-192.png",
    apple: "/apple-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Avvisy",
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
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
