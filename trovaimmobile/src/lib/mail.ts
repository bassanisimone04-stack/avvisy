import { db } from "./db";

/**
 * Invio email. Senza un provider configurato i messaggi vengono salvati nella tabella "outbox"
 * (consultabile in dashboard in sviluppo). Per la produzione collegare qui il provider SMTP/API scelto.
 */
export function sendMail(to: string, subject: string, body: string): void {
  db().prepare("INSERT INTO outbox (to_email, subject, body) VALUES (?, ?, ?)").run(to, subject, body);
}
