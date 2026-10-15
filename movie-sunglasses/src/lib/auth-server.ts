import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { COOKIE, verifySessionToken } from "./auth";

export function authConfigError(): string | null {
  if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) return "Imposta SESSION_SECRET (almeno 32 caratteri) nelle variabili d'ambiente.";
  if (!process.env.ADMIN_EMAIL) return "Imposta ADMIN_EMAIL.";
  const prod = process.env.NODE_ENV === "production";
  if (prod && !process.env.ADMIN_PASSWORD_HASH) return "Imposta ADMIN_PASSWORD_HASH (genera con: npm run admin:hash -- \"password\").";
  if (!prod && !process.env.ADMIN_PASSWORD_HASH && !process.env.ADMIN_PASSWORD) return "Imposta ADMIN_PASSWORD (solo sviluppo) o ADMIN_PASSWORD_HASH.";
  return null;
}

function safeEq(a: string, b: string) {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function checkCredentials(email: string, password: string): boolean {
  const okEmail = safeEq(email.trim().toLowerCase(), (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase());
  let okPass = false;
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (hash?.startsWith("scrypt:")) {
    const [, salt, digest] = hash.split(":");
    okPass = safeEq(scryptSync(password, salt, 64).toString("hex"), digest);
  } else if (process.env.NODE_ENV !== "production" && process.env.ADMIN_PASSWORD) {
    okPass = safeEq(password, process.env.ADMIN_PASSWORD);
  } else {
    scryptSync(password, randomBytes(8), 64); // equalise timing
  }
  return okEmail && okPass;
}

export async function getAdmin() {
  try { return await verifySessionToken((await cookies()).get(COOKIE)?.value); } catch { return null; }
}
/** Call at the top of every admin page and server action (defence in depth beyond middleware). */
export async function requireAdmin() {
  const s = await getAdmin();
  if (!s) redirect("/admin/login");
  return s;
}
