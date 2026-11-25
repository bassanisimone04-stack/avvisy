import { describe, expect, it } from "vitest";
import { InputError } from "@/features/tools/board-foot";
import { cncProjectCost } from "@/features/tools/cnc-cost";

const input = {
  quantity: 4,
  sheets: 2,
  sheetPrice: 90,
  machineHours: 3,
  machineRate: 85,
  designHours: 2,
  designRate: 60,
  setupFee: 50,
  toolingCost: 20,
  finishingCost: 40,
  markupPercent: 25,
};

describe("cncProjectCost", () => {
  it("sums each line, applies markup and divides per piece", () => {
    const r = cncProjectCost(input);
    // 180 + 255 + 120 + 50 + 20 + 40 = 665
    expect(r.subtotal).toBe(665);
    expect(r.markup).toBeCloseTo(166.25);
    expect(r.total).toBeCloseTo(831.25);
    expect(r.perPiece).toBeCloseTo(207.8125);
    expect(r.lines).toHaveLength(6);
  });

  it("allows zero values", () => {
    const r = cncProjectCost({ ...input, designHours: 0, setupFee: 0, markupPercent: 0 });
    expect(r.total).toBe(495);
  });

  it("rejects negative or invalid values", () => {
    expect(() => cncProjectCost({ ...input, sheets: -1 })).toThrow(InputError);
    expect(() => cncProjectCost({ ...input, quantity: 0 })).toThrow(InputError);
    expect(() => cncProjectCost({ ...input, markupPercent: 900 })).toThrow(InputError);
  });
});
