/**
 * Pure admin allow-list rules, deliberately free of Next and Supabase
 * imports so tests can exercise the real implementation rather than a copy.
 * A restated copy in a test file drifts from the code it is meant to guard.
 */

/** Parses the comma-separated ADMIN_EMAILS value into normalized entries. */
export function parseAdminEmails(raw: string | undefined | null): string[] {
  return (raw ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Whether an address is on the allow-list. An empty list grants nobody
 * access rather than everybody — the failure mode of a missing env var
 * must be closed, not open.
 */
export function isAllowedAdmin(
  email: string | null | undefined,
  raw: string | undefined | null,
): boolean {
  const allowed = parseAdminEmails(raw);
  if (allowed.length === 0) return false;
  return !!email && allowed.includes(email.toLowerCase());
}
