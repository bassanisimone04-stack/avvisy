import { describe, expect, it } from "vitest";
import { boardFeet, CUBIC_METERS_PER_BF, convertToInches, InputError } from "@/features/tools/board-foot";

const base = { thicknessUnit: "in", widthUnit: "in", lengthUnit: "in", quantity: 1 } as const;

describe("boardFeet", () => {
  it("1 × 12 × 12 inches is exactly one board foot", () => {
    expect(boardFeet({ ...base, thickness: 1, width: 12, length: 12 }).boardFeetTotal).toBeCloseTo(1, 10);
  });

  it("handles an 8/4 board 6 in wide and 8 ft long (8 BF)", () => {
    const r = boardFeet({ ...base, thickness: 2, width: 6, length: 8, lengthUnit: "ft" });
    expect(r.boardFeetEach).toBeCloseTo(8, 10);
  });

  it("multiplies by quantity and applies waste and price", () => {
    const r = boardFeet({ ...base, thickness: 1, width: 12, length: 12, quantity: 3 }, { wastePercent: 20, pricePerBF: 10 });
    expect(r.boardFeetTotal).toBeCloseTo(3);
    expect(r.boardFeetWithWaste).toBeCloseTo(3.6);
    expect(r.cost).toBeCloseTo(36);
  });

  it("converts metric input", () => {
    // 25.4 mm × 304.8 mm × 0.3048 m == 1 BF
    const r = boardFeet({ thickness: 25.4, thicknessUnit: "mm", width: 304.8, widthUnit: "mm", length: 0.3048, lengthUnit: "m", quantity: 1 });
    expect(r.boardFeetTotal).toBeCloseTo(1, 8);
    expect(r.cubicMetersTotal).toBeCloseTo(CUBIC_METERS_PER_BF, 10);
  });

  it("1 BF is about 0.00236 m³", () => {
    expect(CUBIC_METERS_PER_BF).toBeCloseTo(0.00235974, 7);
    expect(convertToInches(1, "ft")).toBe(12);
  });

  it("rejects invalid input", () => {
    expect(() => boardFeet({ ...base, thickness: 0, width: 1, length: 1 })).toThrow(InputError);
    expect(() => boardFeet({ ...base, thickness: 1, width: 1, length: 1, quantity: 1.5 })).toThrow(InputError);
    expect(() => boardFeet({ ...base, thickness: 1, width: 1, length: 1 }, { wastePercent: 120 })).toThrow(InputError);
    expect(() => boardFeet({ ...base, thickness: Number.NaN, width: 1, length: 1 })).toThrow(InputError);
  });
});
