import type { Metadata } from "next";
import Link from "next/link";
import { currentUser, isAdvertiser } from "@/lib/session";
import { PublishForm } from "@/components/PublishForm";

export const metadata: Metadata = { title: "Pubblica un annuncio" };
export const dynamic = "force-dynamic";

export default async function PublishPage() {
  const user = await currentUser();
  return (
    <div className="container section" style={{ maxWidth: 780 }}>
      <h1>Pubblica un annuncio</h1>
      {!user ? (
        <div className="card card-pad stack">
          <p style={{ margin: 0 }}>Per pubblicare serve un account da proprietario privato o da agenzia.</p>
          <div className="row">
            <Link className="btn btn-primary" href="/registrati?ruolo=private">
              Sono un privato
            </Link>
            <Link className="btn" href="/registrati?ruolo=agency">
              Sono un&apos;agenzia
            </Link>
            <Link href="/accedi?next=/pubblica">Ho già un account</Link>
          </div>
        </div>
      ) : !isAdvertiser(user) ? (
        <div className="alert alert-warn">Il tuo account è di tipo «Cerco casa». Per pubblicare crea un account da privato o agenzia.</div>
      ) : (
        <PublishForm role={user.role as "private" | "agency"} />
      )}
    </div>
  );
}
