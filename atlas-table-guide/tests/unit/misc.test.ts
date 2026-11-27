import { describe, expect, it } from "vitest";
import { buildIcs } from "@/lib/ics";
import { statsBy, lunchDinnerRatio } from "@/lib/price-index";
import { demoDataset } from "@/db/demo";
import { rateLimit } from "@/lib/rate-limit";
import { rulePlan } from "@/lib/concierge";
import { DEMO_REFERENCE_RATES as R } from "@/lib/fx-demo";
import { completeness } from "@/lib/completeness";
import { haversine, inBBox, formatDistance } from "@/lib/geo";

const d = demoDataset();
describe("price index", () => {
  it("suppresses figures below the sample threshold", () => {
    const s = statsBy(d.restaurants, { kind: "tasting", service: "dinner", groupBy: (r) => r.citySlug, label: (k) => k, minSample: 5 });
    const paris = s.find((x) => x.key === "paris")!;
    const milan = s.find((x) => x.key === "milan")!;
    expect(paris.n).toBeGreaterThanOrEqual(milan.n);
    expect(milan.suppressed).toBe(true);
    expect(milan.avg).toBeNull();
  });
  it("lunch/dinner ratio uses only venues with both verified", () => {
    const r = lunchDinnerRatio(d.restaurants, 5);
    expect(r.n).toBeGreaterThan(5);
    expect(r.ratio!).toBeGreaterThan(0.2);
    expect(r.ratio!).toBeLessThan(1);
  });
});
describe("ICS", () => {
  it("builds a valid calendar with CRLF and escaping", () => {
    const ics = buildIcs("Trip", [{ uid: "1@x", date: "2027-01-10", time: "20:00", durationMin: 150, summary: "Dinner, tasting; menu" }], new Date("2026-01-01T00:00:00Z"));
    expect(ics.startsWith("BEGIN:VCALENDAR\r\n")).toBe(true);
    expect(ics).toContain("DTSTART:20270110T200000");
    expect(ics).toContain("DTEND:20270110T223000");
    expect(ics).toContain("SUMMARY:Dinner\\, tasting\; menu");
  });
});
describe("rate limit", () => {
  it("blocks after the limit within the window", () => {
    const key = `t-${Math.random()}`;
    expect([1, 2, 3].map(() => rateLimit(key, 2, 1000, 0).ok)).toEqual([true, true, false]);
    expect(rateLimit(key, 2, 1000, 2000).ok).toBe(true);
  });
});
describe("concierge rule planner", () => {
  it("returns only internal records with estimates and caveats", () => {
    const p = rulePlan(d, { destination: "paris", days: 2, guests: 2, dietary: [], hotel: true }, R);
    expect(p.items.length).toBeGreaterThan(2);
    expect(p.items.every((i) => i.path.startsWith("/en/"))).toBe(true);
    expect(p.caveats.join()).toMatch(/NOT confirmed/);
  });
  it("respects dietary filters", () => {
    const p = rulePlan(d, { destination: "paris", days: 1, guests: 2, dietary: ["vegan"], hotel: false }, R);
    for (const i of p.items.filter((x) => x.type === "restaurant")) expect(d.restaurants.find((r) => r.slug === i.slug)!.dietary.vegan).toBe(true);
  });
});
describe("completeness & geo", () => {
  it("scores demo profiles below 100 (illustrative images, no contact)", () => {
    const c = completeness(d.restaurants[0]!);
    expect(c.score).toBeLessThan(100);
    expect(c.missing).toContain("licensed (non-illustrative) photo");
  });
  it("geo helpers", () => {
    expect(Math.round(haversine({ lat: 48.8566, lng: 2.3522 }, { lat: 51.5072, lng: -0.1276 }) / 1000)).toBe(344);
    expect(inBBox({ lat: 0, lng: 179 }, [170, -10, -170, 10])).toBe(true);
    expect(formatDistance(1609.344 * 2, "imperial")).toBe("2.0 mi");
  });
});
