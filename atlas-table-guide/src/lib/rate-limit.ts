/**
 * Fixed-window rate limiter (in-memory, per server instance). Good enough for a single region;
 * for multi-instance production use a shared store (Upstash/Redis) — see docs/REPORT.md.
 */
const buckets = new Map<string, { count: number; reset: number }>();

export function rateLimit(key: string, limit: number, windowMs: number, now = Date.now()): { ok: boolean; remaining: number; retryAfterMs: number } {
  const b = buckets.get(key);
  if (!b || b.reset <= now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    if (buckets.size > 10_000) for (const [k, v] of buckets) if (v.reset <= now) buckets.delete(k);
    return { ok: true, remaining: limit - 1, retryAfterMs: 0 };
  }
  if (b.count >= limit) return { ok: false, remaining: 0, retryAfterMs: b.reset - now };
  b.count++;
  return { ok: true, remaining: limit - b.count, retryAfterMs: 0 };
}
