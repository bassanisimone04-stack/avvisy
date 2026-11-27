import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminSession, type AdminSession } from "@/lib/admin-session";
import { can, type Action } from "@/lib/rbac";

export const ADMIN_COOKIE = "atg_admin";

/**
 * Admin guard. Production: Supabase Auth + profiles.role (see docs/REPORT.md).
 * Development fallback: signed cookie from ADMIN_DEV_TOKEN (disabled when NODE_ENV=production).
 */
export async function requireAdmin(action: Action = "admin:access"): Promise<AdminSession> {
  const secret = process.env.NODE_ENV === "production" ? undefined : process.env.ADMIN_DEV_TOKEN;
  const s = verifyAdminSession((await cookies()).get(ADMIN_COOKIE)?.value, secret);
  if (!s || !can(s.role, action)) redirect("/admin/login/");
  return s;
}
