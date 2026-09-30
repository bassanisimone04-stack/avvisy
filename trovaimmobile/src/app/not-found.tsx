import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container section stack" style={{ maxWidth: 520 }}>
      <h1>Pagina non trovata</h1>
      <p className="muted">L&apos;annuncio potrebbe essere stato rimosso. La scheda dell&apos;immobile, se esiste, resta consultabile.</p>
      <Link className="btn btn-primary" href="/annunci">
        Torna alla ricerca
      </Link>
    </div>
  );
}
