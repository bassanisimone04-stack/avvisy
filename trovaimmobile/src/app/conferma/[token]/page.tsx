import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { verifyToken } from "@/lib/crypto";
import { reconfirmListing } from "@/lib/listings";
import { timeAgo } from "@/lib/format";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Conferma disponibilità", robots: { index: false } };
export const dynamic = "force-dynamic";

type Payload = { lid: number; uid: number; purpose: string };

async function confirm(formData: FormData) {
  "use server";
  const token = String(formData.get("token"));
  const data = verifyToken<Payload>(token);
  if (data?.purpose === "reconfirm") reconfirmListing(data.lid, data.uid);
  redirect(`/conferma/${token}?fatto=1`);
}

// Il link dell'email apre questa pagina; la conferma avviene con un solo click sul pulsante
// (non all'apertura del link, così i filtri antispam che visitano i link non confermano al posto tuo).
export default async function ConfirmPage({ params, searchParams }: { params: Promise<{ token: string }>; searchParams: Promise<{ fatto?: string }> }) {
  const { token } = await params;
  const { fatto } = await searchParams;
  const data = verifyToken<Payload>(token);
  const listing = data?.purpose === "reconfirm" ? (db().prepare("SELECT id, title, status, confirmed_at FROM listings WHERE id = ? AND advertiser_id = ?").get(data.lid, data.uid) as { id: number; title: string; status: string; confirmed_at: string } | undefined) : undefined;

  return (
    <div className="container section" style={{ maxWidth: 520 }}>
      <div className="card card-pad stack">
        {!listing ? (
          <>
            <h1>Link non valido o scaduto</h1>
            <p className="muted">Puoi riconfermare la disponibilità dalla tua dashboard.</p>
            <Link className="btn btn-primary" href="/dashboard/annunci">
              Vai ai miei annunci
            </Link>
          </>
        ) : listing.status !== "active" ? (
          <>
            <h1>Annuncio chiuso</h1>
            <p className="muted">«{listing.title}» non è più attivo.</p>
          </>
        ) : fatto ? (
          <>
            <h1>Grazie, confermato ✓</h1>
            <p>
              «{listing.title}» risulta <strong>disponibile — confermato {timeAgo(listing.confirmed_at)}</strong>. Ti scriveremo di nuovo tra una settimana.
            </p>
            <Link href={`/annunci/${listing.id}`}>Vedi l&apos;annuncio →</Link>
          </>
        ) : (
          <>
            <h1>È ancora disponibile?</h1>
            <p>
              «{listing.title}» — ultima conferma {timeAgo(listing.confirmed_at)}.
            </p>
            <form action={confirm}>
              <input type="hidden" name="token" value={token} />
              <button className="btn btn-primary btn-block">Sì, è ancora disponibile</button>
            </form>
            <Link href="/dashboard/annunci" className="small">
              No, l&apos;ho affittato: chiudi l&apos;annuncio
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
