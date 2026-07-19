import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { StoreProvider } from "@/lib/store";
import Toaster from "@/components/Toaster";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const TITLE = "Scortvia — La nuova via delle scorte aziendali";
const DESCRIPTION =
  "Marketplace B2B italiano per comprare e vendere stock, componenti industriali, ricambi e rimanenze di produzione tra aziende verificate.";

export const metadata: Metadata = {
  title: {
    default: TITLE,
    template: "%s · Scortvia",
  },
  description: DESCRIPTION,
  applicationName: "Scortvia",
  keywords: [
    "marketplace B2B",
    "scorte aziendali",
    "componenti industriali",
    "ricambi",
    "stock aziendali",
    "rimanenze di produzione",
    "economia circolare",
  ],
  openGraph: {
    type: "website",
    locale: "it_IT",
    siteName: "Scortvia",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#0d7d63",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it" className={inter.variable}>
      <body className="min-h-dvh antialiased">
        <StoreProvider>
          {children}
          <Toaster />
        </StoreProvider>
      </body>
    </html>
  );
}
