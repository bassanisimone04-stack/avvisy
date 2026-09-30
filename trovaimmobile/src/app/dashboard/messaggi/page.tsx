import Link from "next/link";
import { requireUser } from "@/lib/session";
import { contactsFor } from "@/lib/dashboard";
import { timeAgo } from "@/lib/format";
import { replyAction } from "@/app/actions";
import { ActionForm } from "@/components/ActionForm";
import { FraudWarning } from "@/components/trust";

export default async function MessagesPage() {
  const user = await requireUser();
  const contacts = contactsFor(user.id);
  const received = contacts.filter((c) => c.advertiser_id === user.id);
  const sent = contacts.filter((c) => c.seeker_id === user.id);

  return (
    <div className="stack" style={{ gap: 16 }}>
      {received.length > 0 && (
        <section className="card card-pad">
          <h2>Richieste ricevute</h2>
          <p className="xs muted">Il tempo che impieghi a rispondere è misurato e mostrato sul tuo profilo pubblico.</p>
          <ul className="list">
            {received.map((c) => (
              <li key={c.id} className="stack" style={{ gap: 6 }}>
                <div className="spread">
                  <strong>{c.seeker_name}</strong>
                  <span className="xs muted">{timeAgo(c.created_at)}</span>
                </div>
                <div className="xs">
                  per <Link href={`/annunci/${c.listing_id}`}>{c.title}</Link>
                </div>
                <p style={{ margin: 0, whiteSpace: "pre-line" }}>{c.message}</p>
                {c.reply ? (
                  <div className="alert alert-info">
                    <strong>La tua risposta · {timeAgo(c.replied_at!)}</strong>
                    {c.reply}
                  </div>
                ) : (
                  <ActionForm action={replyAction} submitLabel="Rispondi" hideOnSuccess>
                    <input type="hidden" name="contactId" value={c.id} />
                    <textarea name="reply" required aria-label="Risposta" placeholder="Rispondi, o proponi di prenotare una visita dal calendario." />
                  </ActionForm>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="card card-pad">
        <h2>Messaggi inviati</h2>
        {sent.length === 0 ? (
          <p className="small muted" style={{ margin: 0 }}>Non hai ancora scritto a nessun inserzionista.</p>
        ) : (
          <ul className="list">
            {sent.map((c) => (
              <li key={c.id} className="stack" style={{ gap: 6 }}>
                <div className="spread">
                  <Link href={`/annunci/${c.listing_id}`}>{c.title}</Link>
                  <span className="xs muted">{timeAgo(c.created_at)}</span>
                </div>
                <p className="small" style={{ margin: 0, whiteSpace: "pre-line" }}>{c.message}</p>
                {c.reply ? (
                  <div className="alert alert-info">
                    <strong>{c.advertiser_name} · {timeAgo(c.replied_at!)}</strong>
                    {c.reply}
                  </div>
                ) : (
                  <span className="xs muted">In attesa di risposta</span>
                )}
                {c.payment_flag ? <FraudWarning /> : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
