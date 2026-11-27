import { describe, expect, it } from "vitest";
import { createHmac } from "node:crypto";
import { verifyStripeSignature, parseStripeSignature, isTestKey, minorUnits } from "@/lib/stripe";
import { evaluateAlert } from "@/lib/alerts";
import { searchParams, toTypesenseDoc, collectionSchema, collectionName } from "@/lib/typesense";
import { buildSearchDocs } from "@/lib/search-docs";
import { demoDataset } from "@/db/demo";

const secret = "whsec_test_secret";
const sign = (payload: string, t: number, key = secret) => `t=${t},v1=${createHmac("sha256", key).update(`${t}.${payload}`).digest("hex")}`;

describe("Stripe", () => {
  const body = '{"type":"checkout.session.completed"}';
  it("accepts a valid signature", () => expect(verifyStripeSignature(body, sign(body, 1000), secret, 300, 1100)).toBe(true));
  it("accepts when one of several v1 signatures matches (key rotation)", () => expect(verifyStripeSignature(body, `${sign(body, 1000)},v1=deadbeef`, secret, 300, 1000)).toBe(true));
  it("rejects a wrong secret, tampered body, missing header, or replay outside the window", () => {
    expect(verifyStripeSignature(body, sign(body, 1000, "other"), secret, 300, 1000)).toBe(false);
    expect(verifyStripeSignature(`${body} `, sign(body, 1000), secret, 300, 1000)).toBe(false);
    expect(verifyStripeSignature(body, null, secret)).toBe(false);
    expect(verifyStripeSignature(body, sign(body, 1000), secret, 300, 2000)).toBe(false);
    expect(parseStripeSignature("garbage")).toBeNull();
  });
  it("only allows TEST keys", () => {
    expect(isTestKey("sk_test_abc")).toBe(true);
    expect(isTestKey("sk_live_abc")).toBe(false);
    expect(isTestKey(undefined)).toBe(false);
  });
  it("converts to minor units", () => { expect(minorUnits(250, "EUR")).toBe(25000); expect(minorUnits(99.99, "EUR")).toBe(9999); expect(minorUnits(5000, "JPY")).toBe(5000); });
});

describe("price alerts", () => {
  const base = { threshold_amount: null, currency: null, last_notified_at: null, created_at: "2026-01-01T00:00:00Z" };
  const row = (amount: number, at: string) => ({ amount, currency: "EUR", recorded_at: at, menu: "Dinner" });
  it("price_change fires only for changes after the last notification", () => {
    const a = { ...base, kind: "price_change" as const, last_notified_at: "2026-05-01T00:00:00Z" };
    expect(evaluateAlert(a, [row(100, "2026-04-01T00:00:00Z")], []).notify).toBe(false);
    const r = evaluateAlert(a, [row(100, "2026-04-01T00:00:00Z"), row(120, "2026-06-01T00:00:00Z")], []);
    expect(r.notify).toBe(true);
    expect(r.lines).toEqual(["Dinner: 120 EUR (2026-06-01)"]);
  });
  it("price_below fires at or under the threshold in the same currency", () => {
    const a = { ...base, kind: "price_below" as const, threshold_amount: 100, currency: "EUR" };
    expect(evaluateAlert(a, [], [row(100, "2026-02-01T00:00:00Z")]).notify).toBe(true);
    expect(evaluateAlert(a, [], [row(101, "2026-02-01T00:00:00Z")]).notify).toBe(false);
    expect(evaluateAlert(a, [], [{ ...row(50, "2026-02-01T00:00:00Z"), currency: "USD" }]).notify).toBe(false);
  });
});

describe("Typesense adapter", () => {
  it("builds a typo-tolerant query", () => {
    const p = searchParams("parsi", 8);
    expect(p.get("num_typos")).toBe("2");
    expect(p.get("prefix")).toBe("true");
    expect(p.get("query_by")).toBe("title,subtitle,text");
  });
  it("maps documents and names collections per locale", () => {
    const docs = buildSearchDocs(demoDataset(), "it");
    expect(docs.length).toBeGreaterThan(80);
    expect(toTypesenseDoc(docs[0]!).id).toMatch(/^[a-z]+:/);
    expect(collectionName("it")).toBe("atlas_it");
    expect(collectionSchema("en").fields.some((f) => f.name === "title")).toBe(true);
  });
});
