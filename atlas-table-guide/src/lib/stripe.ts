import { createHmac, timingSafeEqual } from "node:crypto";

/** Parses `t=…,v1=…,v1=…` from the Stripe-Signature header. */
export function parseStripeSignature(header: string): { t: number; v1: string[] } | null {
  const parts = header.split(",").map((p) => p.trim().split("="));
  const t = Number(parts.find(([k]) => k === "t")?.[1]);
  const v1 = parts.filter(([k]) => k === "v1").map(([, v]) => v ?? "");
  return Number.isFinite(t) && v1.length ? { t, v1 } : null;
}

/** Verifies a webhook per Stripe's scheme: HMAC-SHA256 of `${t}.${payload}`, constant-time compare, replay window. */
export function verifyStripeSignature(payload: string, header: string | null, secret: string, toleranceSec = 300, nowSec = Math.floor(Date.now() / 1000)): boolean {
  if (!header || !secret) return false;
  const sig = parseStripeSignature(header);
  if (!sig || Math.abs(nowSec - sig.t) > toleranceSec) return false;
  const expected = createHmac("sha256", secret).update(`${sig.t}.${payload}`).digest("hex");
  const e = Buffer.from(expected);
  return sig.v1.some((v) => { const b = Buffer.from(v); return b.length === e.length && timingSafeEqual(b, e); });
}

/** Test-mode only: refuses live keys so no real money can ever move before merchant agreements exist. */
export const isTestKey = (key: string | undefined): key is string => !!key && key.startsWith("sk_test_");

export const minorUnits = (amount: number, currency: string) => Math.round(amount * (["JPY", "KRW"].includes(currency.toUpperCase()) ? 1 : 100));

export async function createCheckoutSession(secretKey: string, params: Record<string, string>): Promise<{ id: string; url: string }> {
  if (!isTestKey(secretKey)) throw new Error("Only Stripe test keys are allowed");
  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: { Authorization: `Bearer ${secretKey}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(params),
    signal: AbortSignal.timeout(15000),
  });
  const j = (await res.json()) as { id?: string; url?: string; error?: { message: string } };
  if (!res.ok || !j.id || !j.url) throw new Error(j.error?.message ?? `Stripe ${res.status}`);
  return { id: j.id, url: j.url };
}
