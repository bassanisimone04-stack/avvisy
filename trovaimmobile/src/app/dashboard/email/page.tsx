import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { timeAgo } from "@/lib/format";

// Solo sviluppo: mostra le email che la piattaforma avrebbe inviato all'utente.
export default async function OutboxPage() {
  if (process.env.NODE_ENV === "production") notFound();
  const user = await requireUser();
  const mails = db().prepare("SELECT * FROM outbox WHERE to_email = ? ORDER BY id DESC LIMIT 50").all(user.email) as { id: number; subject: string; body: string; created_at: string }[];
  return (
    <section className="card card-pad">
      <h2>Email inviate a {user.email}</h2>
      <p className="xs muted">In sviluppo le email non partono: vengono salvate qui. In produzione collegare un provider in src/lib/mail.ts.</p>
      {mails.length === 0 ? (
        <p className="small muted">Nessuna email.</p>
      ) : (
        <ul className="list">
          {mails.map((m) => (
            <li key={m.id}>
              <div className="spread">
                <strong>{m.subject}</strong>
                <span className="xs muted">{timeAgo(m.created_at)}</span>
              </div>
              <pre className="small" style={{ whiteSpace: "pre-wrap", margin: "6px 0 0", fontFamily: "inherit" }}>
                {m.body.split(/(https?:\/\/\S+)/).map((part, i) => (i % 2 ? <a key={i} href={part}>{part}</a> : part))}
              </pre>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
