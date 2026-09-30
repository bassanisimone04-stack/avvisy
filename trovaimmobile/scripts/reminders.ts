// Invia i promemoria settimanali di riconferma. Da pianificare (es. cron ogni ora):
//   APP_URL=https://tuodominio.it npm run reminders
import { sendReconfirmReminders } from "../src/lib/reminders";

const base = (process.env.APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
console.log(`Promemoria inviati: ${sendReconfirmReminders(base)}`);
