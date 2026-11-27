import { describe, expect, it } from "vitest";
import { encodeCompare, decodeCompare, compareHref } from "@/lib/compare-url";

describe("comparison URL", () => {
  it("encodes, dedupes and caps at 4", () => {
    expect(encodeCompare(["a", "b", "a", "c", "d", "e"])).toBe("a,b,c,d");
  });
  it("decodes strings and arrays, rejecting invalid slugs", () => {
    expect(decodeCompare("maison-lune-paris,%3Cscript%3E,rug-copenhagen")).toEqual(["maison-lune-paris", "rug-copenhagen"]);
    expect(decodeCompare(["a,b", "c"])).toEqual(["a", "b", "c"]);
    expect(decodeCompare(undefined)).toEqual([]);
    expect(decodeCompare("A, B ")).toEqual(["a", "b"]);
  });
  it("round-trips", () => {
    const s = ["x-1", "y-2", "z-3"];
    expect(decodeCompare(encodeCompare(s))).toEqual(s);
  });
  it("builds a shareable href", () => {
    expect(compareHref("it", ["a", "b"])).toBe("/it/compare/?r=a,b");
    expect(compareHref("en", [])).toBe("/en/compare/");
  });
});
