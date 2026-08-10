import type { Metadata, Viewport } from "next";
import SiteHeader from "@/components/SiteHeader";
import { AstaProvider } from "@/lib/store";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "FantAsta — gestionale per l'asta del fantacalcio",
    template: "%s · FantAsta",
  },
  description:
    "Gestionale completo per l'asta del fantacalcio: listone Serie A 2026/27 con valutazione giocatori, prezzi consigliati calcolati sulla tua lega, gestione crediti in tempo reale e rassegna stampa.",
};

export const viewport: Viewport = {
  themeColor: "#060d0b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it">
      <body className="min-h-screen">
        <AstaProvider>
          <SiteHeader />
          <main className="mx-auto max-w-[1600px] px-4 py-5">{children}</main>
          <footer className="mx-auto max-w-[1600px] px-4 pb-8 pt-4 text-[0.72rem] leading-relaxed text-[color:var(--muted)]">
            <p>
              FantAsta è uno strumento indipendente per gestire l&apos;asta. Quotazioni e
              fantavalori del dataset di partenza sono <strong>stime</strong> ricostruite dalle
              guide pubblicate ad agosto 2026: per i numeri ufficiali importa il listone di Leghe
              Fantacalcio dalla pagina Listone.
            </p>
            <p className="mt-1">
              Nessun dato lascia il tuo browser: l&apos;asta è salvata in locale ed esportabile in
              JSON o CSV.
            </p>
          </footer>
        </AstaProvider>
      </body>
    </html>
  );
}
