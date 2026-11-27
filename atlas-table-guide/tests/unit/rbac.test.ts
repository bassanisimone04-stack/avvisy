import { describe, expect, it } from "vitest";
import { can, partnerCanEdit, sanitizePartnerPatch } from "@/lib/rbac";
import { createAdminSession, verifyAdminSession } from "@/lib/admin-session";

describe("RBAC", () => {
  it("grants by role", () => {
    expect(can("admin", "user:manage")).toBe(true);
    expect(can("editor", "article:publish")).toBe(true);
    expect(can("editor", "price:verify")).toBe(false);
    expect(can("data-verifier", "price:verify")).toBe(true);
    expect(can("viewer", "restaurant:edit")).toBe(false);
    expect(can("partner", "admin:access")).toBe(false);
    expect(can("user", "admin:access")).toBe(false);
    expect(can(null, "admin:access")).toBe(false);
  });
  it("partners edit only approved, claimed venues when verified", () => {
    const claims = [{ partnerUserId: "p1", restaurantId: "r1", status: "approved" as const }, { partnerUserId: "p1", restaurantId: "r2", status: "pending" as const }];
    expect(partnerCanEdit({ id: "p1", role: "partner", partnerVerified: true }, "r1", claims)).toBe(true);
    expect(partnerCanEdit({ id: "p1", role: "partner", partnerVerified: true }, "r2", claims)).toBe(false);
    expect(partnerCanEdit({ id: "p1", role: "partner", partnerVerified: false }, "r1", claims)).toBe(false);
    expect(partnerCanEdit({ id: "p2", role: "partner", partnerVerified: true }, "r1", claims)).toBe(false);
    expect(partnerCanEdit({ id: "e", role: "editor" }, "r9", [])).toBe(true);
  });
  it("strips editorial fields from partner patches", () => {
    expect(sanitizePartnerPatch({ website: "x", recognition: 3, atlasSelection: true, publicationStatus: "published", menus: [] })).toEqual({ website: "x", menus: [] });
  });
});

describe("admin session (dev guard)", () => {
  const secret = "s".repeat(32);
  it("verifies a signed, unexpired session", () => {
    const c = createAdminSession({ role: "admin", name: "a", exp: Date.now() + 1000 }, secret);
    expect(verifyAdminSession(c, secret)?.role).toBe("admin");
  });
  it("rejects tampering, expiry, wrong or weak secrets", () => {
    const c = createAdminSession({ role: "viewer", name: "a", exp: Date.now() + 1000 }, secret);
    const [data, sig] = c.split(".");
    const forged = `${Buffer.from(JSON.stringify({ role: "admin", name: "a", exp: Date.now() + 1000 })).toString("base64url")}.${sig}`;
    expect(verifyAdminSession(forged, secret)).toBeNull();
    expect(verifyAdminSession(`${data}.x`, secret)).toBeNull();
    expect(verifyAdminSession(c, "t".repeat(32))).toBeNull();
    expect(verifyAdminSession(c, "short")).toBeNull();
    expect(verifyAdminSession(createAdminSession({ role: "admin", name: "a", exp: Date.now() - 1 }, secret), secret)).toBeNull();
    expect(verifyAdminSession(undefined, secret)).toBeNull();
  });
});
