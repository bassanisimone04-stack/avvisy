import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { StoreProvider } from "@/lib/store";
import Toaster from "@/components/Toaster";
import ThemeInit from "@/components/ThemeInit";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
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
    <html
      lang="it"
      suppressHydrationWarning
      className={`${archivo.variable} ${plexSans.variable} ${plexMono.variable}`}
    >
      <body className="min-h-dvh antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('scortvia_theme');if(!t){t=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.dataset.theme=t;}catch(e){}})();",
          }}
        />
        <ThemeInit />
        <StoreProvider>
          {children}
          <Toaster />
        </StoreProvider>
      </body>
    </html>
  );
}
