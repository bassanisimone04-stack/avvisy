import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "./db";
import { signToken, verifyToken } from "./crypto";

const COOKIE = "ti_session";
const TTL = 60 * 60 * 24 * 30;

export type Role = "seeker" | "private" | "agency";
export type SessionUser = { id: number; email: string; name: string; role: Role; agency_name: string | null };

export async function createSession(userId: number) {
  (await cookies()).set(COOKIE, signToken({ uid: userId }, TTL), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: TTL,
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

export async function currentUser(): Promise<SessionUser | null> {
  const data = verifyToken<{ uid: number }>((await cookies()).get(COOKIE)?.value);
  if (!data) return null;
  return (db().prepare("SELECT id, email, name, role, agency_name FROM users WHERE id = ?").get(data.uid) as SessionUser | undefined) ?? null;
}

export async function requireUser(next = "/dashboard"): Promise<SessionUser> {
  const u = await currentUser();
  if (!u) redirect(`/accedi?next=${encodeURIComponent(next)}`);
  return u;
}

export const isAdvertiser = (u: { role: Role } | null) => !!u && (u.role === "private" || u.role === "agency");
