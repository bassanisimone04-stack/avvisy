import "./globals.css";
import Link from "next/link";
import { dmSans } from "./fonts";

export const metadata = { title: "404 | GastroAtlas", robots: { index: false, follow: false } };

export default function GlobalNotFound() {
  return (
    <html lang="it" className={dmSans.variable}>
      <body>
        <header><div className="bar"><Link className="brand" href="/it/">GASTROATLAS</Link></div></header>
        <main id="main" className="wrap section">
          <h1>Pagina non trovata · Page not found</h1>
          <div className="row"><Link className="more" href="/it/">Torna alla homepage →</Link><Link className="more" href="/en/">Back to the homepage →</Link></div>
        </main>
      </body>
    </html>
  );
}
