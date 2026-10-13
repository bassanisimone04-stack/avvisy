import { getCurrentUser } from "@/lib/supabase/server";
import { isAllowedAdmin, parseAdminEmails } from "@/lib/admin-rules";

/**
 * Admin allow-list, from a server-only env var (comma-separated emails).
 *
 * Deliberately not a database flag: a role column is only as safe as every
 * policy that touches it, and this project has one operator. An env var
 * cannot be escalated into through SQL, and changing it requires deploy
 * access rather than a session.
 *
 * The matching rules live in ./admin-rules.ts so they can be unit tested
 * directly — see tests/admin.test.mjs.
 */
export function isAdminEmail(email: string | null | undefined): boolean {
  return isAllowedAdmin(email, process.env.ADMIN_EMAILS);
}

export const isAdminConfigured = () =>
  parseAdminEmails(process.env.ADMIN_EMAILS).length > 0;

/**
 * The current user if they are an admin, otherwise null.
 *
 * Every admin action must call this itself. Guarding only the page would
 * leave the server actions reachable directly, and these actions hand over
 * ownership of a business listing.
 */
export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || !isAdminEmail(user.email)) return null;
  return user;
}
