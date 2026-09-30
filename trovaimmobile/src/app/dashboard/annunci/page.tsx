import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUser, isAdvertiser } from "@/lib/session";
import { listingsByAdvertiser } from "@/lib/listings";
import { formatEuro, timeAgo } from "@/lib/format";
import { closeListingAction, reconfirmAction, updatePriceAction } from "@/app/actions";
import { AvailabilityBadge } from "@/components/trust";
import { ActionForm } from "@/components/ActionForm";
import { entryCost } from "@/lib/costs";

export default async function MyListings() {
  const user = await requireUser();
  if (!isAdvertiser(user)) redirect("/dashboard");
  const listings = listingsByAdvertiser(user.id);

  if (listings.length === 0)
    return (
      <div className="card card-pad stack">
        <p style={{ margin: 0 }}>Non hai ancora pubblicato annunci.</p>
        <Link className="btn btn-primary" href="/pubblica">
          Pubblica il primo annuncio
        </Link>
      </div>
    );

  return (
    <div className="stack" style={{ gap: 16 }}>
      {listings.map((l) => (
        <section key={l.id} className="card card-pad stack">
          <div className="spread">
            <div>
              <Link href={`/annunci/${l.id}`} style={{ fontWeight: 700 }}>
                {l.title}
              </Link>
              <div className="xs muted">
                {l.via} {l.civico}, {l.comune} · <Link href={`/immobili/${l.property_id}`}>scheda immobile n. {l.property_id}</Link> · pubblicato {timeAgo(l.created_at)}
              </div>
            </div>
            <AvailabilityBadge confirmedAt={l.confirmed_at} status={l.status} />
          </div>

          {l.status === "active" ? (
            <>
              <div className="row">
                <form action={reconfirmAction}>
                  <input type="hidden" name="listingId" value={l.id} />
                  <button className="btn btn-primary btn-sm">✓ Confermo: è ancora disponibile</button>
                </form>
                <form action={closeListingAction} className="row">
                  <input type="hidden" name="listingId" value={l.id} />
                  <select name="reason" defaultValue="affittato" style={{ width: "auto", minHeight: 36 }} aria-label="Motivo">
                    <option value="affittato">Affittato</option>
                    <option value="ritirato">Ritirato</option>
                  </select>
                  <button className="btn btn-sm btn-danger">Chiudi annuncio</button>
                </form>
              </div>
              <details>
                <summary className="small" style={{ cursor: "pointer" }}>
                  Modifica costi (ingresso attuale {formatEuro(entryCost(l))})
                </summary>
                <div style={{ marginTop: 10 }}>
                  <ActionForm action={updatePriceAction} submitLabel="Salva costi">
                    <input type="hidden" name="listingId" value={l.id} />
                    <div className="grid grid-2">
                      {(["canone", "spese", "cauzione", "commissione"] as const).map((k) => (
                        <div className="field" key={k}>
                          <label htmlFor={`${k}-${l.id}`} style={{ textTransform: "capitalize" }}>
                            {k} (€)
                          </label>
                          <input id={`${k}-${l.id}`} name={k} className="input" inputMode="numeric" defaultValue={l[k]} readOnly={k === "commissione" && user.role === "private"} required />
                        </div>
                      ))}
                    </div>
                    <p className="xs muted" style={{ margin: 0 }}>Ogni cambio di canone o spese viene registrato nello storico pubblico dell&apos;immobile.</p>
                  </ActionForm>
                </div>
              </details>
            </>
          ) : (
            <p className="small muted" style={{ margin: 0 }}>
              Chiuso ({l.closed_reason}). La scheda dell&apos;immobile e il suo storico restano consultabili.
            </p>
          )}
        </section>
      ))}
    </div>
  );
}
