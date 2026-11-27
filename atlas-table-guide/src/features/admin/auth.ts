import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminSession, type AdminSession } from "@/lib/admin-session";
import { can, ROLES, type Action, type Role } from "@/lib/rbac";
import { supabaseAnon, supabaseService } from "@/db/supabase";

export const ADMIN_COOKIE = "atg_admin"; // development token session
export const SB_COOKIE = "atg_sb"; // Supabase access token (httpOnly)

/**
 * Admin guard.
 *  - Production: Supabase Auth. The access token in the httpOnly cookie is verified with Supabase, then the user's
 *    role is read from `profiles` with the service role (so it cannot be spoofed by the client).
 *  - Development: signed cookie from ADMIN_DEV_TOKEN (disabled when NODE_ENV=production).
 */
export async function requireAdmin(action: Action = "admin:access"): Promise<AdminSession> {
  const jar = await cookies();
  const token = jar.get(SB_COOKIE)?.value;
  const anon = supabaseAnon();
  const svc = supabaseService();
  if (token && anon && svc) {
    const { data } = await anon.auth.getUser(token);
    if (data.user) {
      const { data: prof } = await svc.from("profiles").select("role").eq("id", data.user.id).maybeSingle();
      const role = prof?.role as Role | undefined;
      if (role && (ROLES as readonly string[]).includes(role) && can(role, action)) return { role, name: data.user.email ?? data.user.id, exp: 0 };
    }
  }
  const secret = process.env.NODE_ENV === "production" ? undefined : process.env.ADMIN_DEV_TOKEN;
  const s = verifyAdminSession(jar.get(ADMIN_COOKIE)?.value, secret);
  if (s && can(s.role, action)) return s;
  redirect("/admin/login/");
}
