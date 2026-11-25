import { describe, expect, it } from "vitest";
import { demoBusinesses } from "@/data/demo/businesses";
import { distanceMiles, resolveDemoPlace } from "@/features/directory/geo";
import { parseDirectoryQuery, searchDirectory, serializeDirectoryQuery } from "@/features/directory/search";

describe("directory search", () => {
  it("every demo business is flagged as demo", () => {
    expect(demoBusinesses.every((b) => b.isDemo && b.lastVerifiedAt === null)).toBe(true);
  });

  it("filters by category and flags", () => {
    const r = searchDirectory(demoBusinesses, { category: "cnc-services", pageSize: 50 });
    expect(r.total).toBeGreaterThan(0);
    expect(r.all.every((i) => i.business.categories.includes("cnc-services"))).toBe(true);
    const f = searchDirectory(demoBusinesses, { flags: ["classes", "publicAccess"], pageSize: 50 });
    expect(f.all.every((i) => i.business.attributes.classes && i.business.attributes.publicAccess)).toBe(true);
  });

  it("sorts by distance within radius when a place resolves", () => {
    const r = searchDirectory(demoBusinesses, { near: "Austin", radius: 25, pageSize: 50 });
    expect(r.place?.label).toBe("Austin, TX");
    expect(r.all.every((i) => i.business.city === "Austin")).toBe(true);
    const d = r.all.map((i) => i.distance!);
    expect([...d].sort((a, b) => a - b)).toEqual(d);
  });

  it("flags unknown places instead of guessing", () => {
    const r = searchDirectory(demoBusinesses, { near: "Atlantis" });
    expect(r.placeNotFound).toBe(true);
  });

  it("resolves demo ZIP codes by prefix", () => {
    expect(resolveDemoPlace("97214")?.label).toContain("Portland");
    expect(resolveDemoPlace("10001")).toBeNull();
  });

  it("paginates", () => {
    const r = searchDirectory(demoBusinesses, { pageSize: 5, page: 2 });
    expect(r.items).toHaveLength(5);
    expect(r.page).toBe(2);
  });

  it("round-trips URL params", () => {
    const q = parseDirectoryQuery({ near: "Denver", category: "makerspaces", f: "classes,bogus", cnc: "1", page: "2" });
    expect(q.flags).toEqual(["classes"]);
    expect(serializeDirectoryQuery(q)).toBe("?near=Denver&category=makerspaces&f=classes&cnc=1&page=2");
  });

  it("haversine distance Austin → Denver ≈ 770 mi", () => {
    expect(distanceMiles({ lat: 30.2672, lng: -97.7431 }, { lat: 39.7392, lng: -104.9903 })).toBeGreaterThan(740);
  });
});
