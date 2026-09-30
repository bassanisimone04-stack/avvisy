import { db, nowIso } from "./db";
import { signToken } from "./crypto";
import { sendMail } from "./mail";
import { RECONFIRM_EVERY_DAYS } from "./freshness";

/**
 * Promemoria settimanale di riconferma. Parte quando l'ultima conferma ha più di 6 giorni
 * (prima che il badge perda lo stato "confermato") e al massimo una volta a settimana per annuncio.
 */
export function sendReconfirmReminders(baseUrl: string): number {
  const d = db();
  const due = d
    .prepare(
      `SELECT l.id, l.title, l.confirmed_at, u.id AS uid, u.email, u.name
         FROM listings l JOIN users u ON u.id = l.advertiser_id
        WHERE l.status = 'active'
          AND julianday('now') - julianday(l.confirmed_at) >= ?
          AND (l.reminder_sent_at IS NULL OR julianday('now') - julianday(l.reminder_sent_at) >= ?)`,
    )
    .all(RECONFIRM_EVERY_DAYS - 1, RECONFIRM_EVERY_DAYS) as { id: number; title: string; confirmed_at: string; uid: number; email: string; name: string }[];

  const mark = d.prepare("UPDATE listings SET reminder_sent_at = ? WHERE id = ?");
  for (const l of due) {
    const token = signToken({ lid: l.id, uid: l.uid, purpose: "reconfirm" }, 14 * 86400);
    sendMail(
      l.email,
      `È ancora disponibile? «${l.title}»`,
      `Ciao ${l.name.split(" ")[0]},\n\nconfermi che l'immobile «${l.title}» è ancora libero?\n\n` +
        `Sì, è disponibile: ${baseUrl}/conferma/${token}\n\n` +
        `Se l'hai già affittato, chiudi l'annuncio dalla dashboard: ${baseUrl}/dashboard/annunci\n\n` +
        `Gli annunci non riconfermati scendono nei risultati di ricerca e mostrano da quanto tempo non sono verificati.`,
    );
    mark.run(nowIso(), l.id);
  }
  return due.length;
}
