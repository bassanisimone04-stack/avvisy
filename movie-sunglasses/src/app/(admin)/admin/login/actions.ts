"use server";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE, SESSION_MAX_AGE, createSessionToken } from "@/lib/auth";
import { authConfigError, checkCredentials } from "@/lib/auth-server";
import { clientIp, isBlocked, recordHit } from "@/lib/ratelimit";

export async function loginAction(_: { error: string; email?: string }, form: FormData): Promise<{ error: string; email?: string }> {
  const cfg = authConfigError();
  if (cfg) return { error: cfg };
  const ip = clientIp(await headers());
  // per-address limit, plus a global ceiling that also slows distributed guessing
  if (isBlocked(`login:${ip}`, 5, 15 * 60_000) || isBlocked("login:all", 30, 60 * 60_000)) return { error: "Troppi tentativi. Riprova più tardi." };
  const email = String(form.get("email") ?? ""), password = String(form.get("password") ?? "");
  if (!checkCredentials(email, password)) {
    recordHit(`login:${ip}`); recordHit("login:all");
    await new Promise((r) => setTimeout(r, 600));
    return { error: "Credenziali non valide.", email };
  }
  (await cookies()).set(COOKIE, await createSessionToken(email.trim().toLowerCase()), {
    httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/admin", maxAge: SESSION_MAX_AGE,
  });
  redirect("/admin");
}
