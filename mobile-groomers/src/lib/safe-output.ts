/**
 * Escaping helpers for values that reach the page from the database.
 *
 * A groomer who claims a listing can update their own row, and RLS does not
 * restrict which columns — so their business name, description, phone and
 * website are attacker-controlled text as far as rendering is concerned.
 */

/**
 * Serializes data for a <script type="application/ld+json"> block.
 *
 * JSON.stringify does not escape "<", so a value containing "</script>"
 * closes the block early and anything after it is parsed as HTML. Escaping
 * the three characters that can start a tag or comment sequence keeps the
 * payload inside the script element. The output is still valid JSON: <
 * and friends are ordinary JSON string escapes.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    // U+2028/U+2029 are valid in JSON strings but terminate a JS line.
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

/**
 * Returns a URL only if it is safe to put in an href, otherwise null.
 *
 * React renders a `javascript:` href as-is, so an owner-supplied website
 * would otherwise become script execution on click. Only absolute http(s)
 * URLs are allowed through.
 */
export function safeExternalUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    // Not an absolute URL — reject rather than guessing at a scheme.
    return null;
  }
}
