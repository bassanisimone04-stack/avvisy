import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { run, get, type BusinessUser } from "./db";

/**
 * Autenticazione reale, senza dipendenze esterne: `scrypt` è nativo in
 * Node.js (usato anche da npm stesso per l'hashing), progettato per essere
 * costoso da forzare a forza bruta anche via GPU. Il formato salvato è
 * `salt:hash` in esadecimale, entrambi a lunghezza fissa.
 * Hash e verifica restano sincroni (pura CPU, nessuna I/O); tutto ciò che
 * tocca il database è asincrono — vedi lib/db.ts.
 */

const KEY_LEN = 64;

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, KEY_LEN).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, KEY_LEN);
  const expected = Buffer.from(hash, "hex");
  if (candidate.length !== expected.length) return false;
  return timingSafeEqual(candidate, expected);
}

const SESSION_DAYS = 30;
export const SESSION_COOKIE = "sessione";

export async function createSession(userId: number): Promise<{ token: string; expiresAt: Date }> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await run("INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)", [
    token,
    userId,
    expiresAt.toISOString(),
  ]);
  return { token, expiresAt };
}

export async function destroySession(token: string): Promise<void> {
  await run("DELETE FROM sessions WHERE token = ?", [token]);
}

export async function getUserFromSession(token: string | undefined): Promise<BusinessUser | null> {
  if (!token) return null;
  const row = await get<BusinessUser>(
    `SELECT u.* FROM sessions s
     JOIN business_users u ON u.id = s.user_id
     WHERE s.token = ? AND s.expires_at > datetime('now')`,
    [token],
  );
  return row ?? null;
}

export async function findUserByEmail(email: string): Promise<BusinessUser | null> {
  const row = await get<BusinessUser>("SELECT * FROM business_users WHERE email = ?", [
    email.toLowerCase().trim(),
  ]);
  return row ?? null;
}

export async function createUser(email: string, password: string, nomeStruttura: string): Promise<BusinessUser> {
  await run("INSERT INTO business_users (email, password_hash, nome_struttura) VALUES (?, ?, ?)", [
    email.toLowerCase().trim(),
    hashPassword(password),
    nomeStruttura,
  ]);
  return (await findUserByEmail(email))!;
}
