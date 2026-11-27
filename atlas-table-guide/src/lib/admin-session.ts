import { createHmac, timingSafeEqual } from "node:crypto";
import type { Role } from "./rbac";

/**
 * Development-only admin session used when Supabase Auth is not configured.
 * Cookie value = base64url(json) + "." + HMAC-SHA256(secret). Disabled in production.
 */
export type AdminSession = { role: Role; name: string; exp: number };

const b64 = (s: string) => Buffer.from(s).toString("base64url");
const sign = (data: string, secret: string) => createHmac("sha256", secret).update(data).digest("base64url");

export function createAdminSession(s: AdminSession, secret: string): string {
  const data = b64(JSON.stringify(s));
  return `${data}.${sign(data, secret)}`;
}

export function verifyAdminSession(cookie: string | undefined, secret: string | undefined, now = Date.now()): AdminSession | null {
  if (!cookie || !secret || secret.length < 16) return null;
  const [data, sig] = cookie.split(".");
  if (!data || !sig) return null;
  const expected = sign(data, secret);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const s = JSON.parse(Buffer.from(data, "base64url").toString()) as AdminSession;
    if (typeof s.exp !== "number" || s.exp < now) return null;
    return s;
  } catch {
    return null;
  }
}
