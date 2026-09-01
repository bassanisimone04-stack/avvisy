import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { db, type BusinessUser } from "./db";

/**
 * Autenticazione reale, senza dipendenze esterne: `scrypt` è nativo in
 * Node.js (usato anche da npm stesso per l'hashing), progettato per essere
 * costoso da forzare a forza bruta anche via GPU. Il formato salvato è
 * `salt:hash` in esadecimale, entrambi a lunghezza fissa.
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

export function createSession(userId: number): { token: string; expiresAt: Date } {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  db.prepare("INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)").run(
    token,
    userId,
    expiresAt.toISOString(),
  );
  return { token, expiresAt };
}

export function destroySession(token: string): void {
  db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
}

export function getUserFromSession(token: string | undefined): BusinessUser | null {
  if (!token) return null;
  const row = db
    .prepare(
      `SELECT u.* FROM sessions s
       JOIN business_users u ON u.id = s.user_id
       WHERE s.token = ? AND s.expires_at > datetime('now')`,
    )
    .get(token) as BusinessUser | undefined;
  return row ?? null;
}

export function findUserByEmail(email: string): BusinessUser | null {
  const row = db.prepare("SELECT * FROM business_users WHERE email = ?").get(email.toLowerCase().trim()) as
    | BusinessUser
    | undefined;
  return row ?? null;
}

export function createUser(email: string, password: string, nomeStruttura: string): BusinessUser {
  db.prepare("INSERT INTO business_users (email, password_hash, nome_struttura) VALUES (?, ?, ?)").run(
    email.toLowerCase().trim(),
    hashPassword(password),
    nomeStruttura,
  );
  return findUserByEmail(email)!;
}
