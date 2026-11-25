import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { DemoBanner } from "@/components/layout/demo-banner";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { siteConfig } from "@/config/site";
import "./globals.css";

const fraunces = localFont({
  src: [
    { path: "../fonts/fraunces-latin-opsz-normal.woff2", style: "normal" },
    { path: "../fonts/fraunces-latin-opsz-italic.woff2", style: "italic" },
  ],
  variable: "--font-fraunces",
  weight: "100 900",
  display: "swap",
});

const inter = localFont({
  src: [{ path: "../fonts/inter-latin-opsz-normal.woff2", style: "normal" }],
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: `${siteConfig.name} — Find your space. Make something extraordinary.`, template: `%s · ${siteConfig.name}` },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  robots: siteConfig.allowIndexing ? undefined : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#F8F6F0",
  colorScheme: "light",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const messages = await getMessages();
  return (
    <html lang="en-US" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <NextIntlClientProvider messages={messages} locale="en-US">
          <a
            href="#main"
            className="sr-only z-[100] rounded-sm bg-forest px-4 py-2 text-ivory focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
          >
            Skip to content
          </a>
          <DemoBanner />
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
