/** Small in-memory sliding-window limiter. On serverless this is per-instance; use Upstash/Vercel KV for global limits. */
const buckets = new Map<string, number[]>();
export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= max) { buckets.set(key, hits); return false; }
  hits.push(now);
  buckets.set(key, hits);
  if (buckets.size > 5000) for (const [k, v] of buckets) if (!v.some((t) => now - t < windowMs)) buckets.delete(k);
  return true;
}
/**
 * Client address for rate limiting. The FIRST X-Forwarded-For entry is client-controlled (spoofable), so it is never used:
 * prefer headers set by the platform, else the LAST entry (appended by the nearest proxy).
 */
export function clientIp(headers: Headers): string {
  const platform = headers.get("x-vercel-forwarded-for") || headers.get("x-real-ip");
  if (platform) return platform.split(",")[0].trim();
  const xff = headers.get("x-forwarded-for");
  if (xff) return xff.split(",").map((x) => x.trim()).filter(Boolean).pop() ?? "unknown";
  return "unknown";
}

/** Non-recording check + explicit recording, for limits that should only count failures (e.g. logins). */
export function isBlocked(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  return (buckets.get(key) ?? []).filter((t) => now - t < windowMs).length >= max;
}
export function recordHit(key: string) {
  buckets.set(key, [...(buckets.get(key) ?? []), Date.now()]);
}
