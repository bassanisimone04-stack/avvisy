import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";
import { currentUser, isAdvertiser } from "@/lib/session";
import { ThemeToggle, THEME_INIT_SCRIPT } from "@/components/ThemeToggle";
import { IconShield } from "@/components/icons";

export const metadata: Metadata = {
  title: { default: "TrovaImmobile — affitti verificati in tutta Italia", template: "%s · TrovaImmobile" },
  description: "Annunci d'affitto con disponibilità confermata, visite prenotabili su calendario reale e costo d'ingresso trasparente prima del contatto.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#171e1b" },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  return (
    <html lang="it" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <a href="#main" className="sr-only">
          Vai al contenuto
        </a>
        <header className="site-header">
          <div className="container">
            <Link href="/" className="logo" aria-label="TrovaImmobile, home">
              <span className="logo-mark">
                <IconShield size={18} />
              </span>
              TrovaImmobile
            </Link>
            <nav className="nav" aria-label="Principale">
              <Link href="/annunci">Cerca</Link>
              {(!user || isAdvertiser(user)) && (
                <Link href="/pubblica" className="hide-sm">
                  Pubblica
                </Link>
              )}
              <Link href="/sicurezza" className="hide-sm">
                Sicurezza
              </Link>
              {user ? <Link href="/dashboard">Area personale</Link> : <Link href="/accedi">Accedi</Link>}
              <ThemeToggle />
            </nav>
          </div>
        </header>
        <main id="main">{children}</main>
        <footer className="site-footer">
          <div className="container spread">
            <span>© {new Date().getFullYear()} TrovaImmobile — affitti verificati in tutta Italia.</span>
            <span className="row">
              <Link href="/sicurezza">Come riconoscere una truffa</Link>
              <span>·</span>
              <Link href="/come-funziona">Come funziona</Link>
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
