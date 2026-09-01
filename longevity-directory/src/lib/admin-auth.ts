import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Gate minimo per /admin: una sola password (ADMIN_PASSWORD in .env), un
 * cookie firmato con HMAC e scadenza — nessuna tabella, nessun account.
 * È adeguato per un prototipo con un solo operatore interno, non per un
 * pannello multi-utente con ruoli: quello richiederebbe la stessa tabella
 * `business_users` con un campo `is_admin`, o un sistema RBAC dedicato.
 */

export const ADMIN_COOKIE = "admin_sess";
const SESSION_HOURS = 12;

function secret(): string {
  const s = process.env.ADMIN_PASSWORD;
  if (!s) throw new Error("ADMIN_PASSWORD non impostata: /admin è disabilitato finché non la configuri in .env.");
  return s;
}

export function adminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export function checkAdminPassword(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || "";
  const a = Buffer.from(candidate);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function issueAdminCookieValue(): string {
  const expires = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
  const sig = createHmac("sha256", secret()).update(String(expires)).digest("hex");
  return `${expires}.${sig}`;
}

export function verifyAdminCookieValue(value: string | undefined): boolean {
  if (!value || !adminConfigured()) return false;
  const [expiresStr, sig] = value.split(".");
  if (!expiresStr || !sig) return false;
  const expires = Number(expiresStr);
  if (!Number.isFinite(expires) || Date.now() > expires) return false;
  const expected = createHmac("sha256", secret()).update(expiresStr).digest("hex");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
