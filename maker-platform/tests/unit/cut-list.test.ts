import { describe, expect, it } from "vitest";
import { InputError } from "@/features/tools/board-foot";
import { estimateLinearStock, summarizeCutList, type CutPart } from "@/features/tools/cut-list";

const parts: CutPart[] = [
  { id: "a", name: "Leg", quantity: 4, length: 28, width: 2, thickness: 2 },
  { id: "b", name: "Apron", quantity: 2, length: 40, width: 4, thickness: 1 },
];

describe("summarizeCutList", () => {
  it("counts pieces and board feet by thickness", () => {
    const s = summarizeCutList(parts);
    expect(s.pieces).toBe(6);
    // legs: 4 × 28×2×2/144 = 3.111…, aprons: 2 × 40×4×1/144 = 2.222…
    expect(s.boardFeet).toBeCloseTo(5.3333, 3);
    expect(s.byThickness.map((g) => g.thickness)).toEqual([1, 2]);
  });

  it("validates parts", () => {
    expect(() => summarizeCutList([{ ...parts[0], length: 0 }])).toThrow(InputError);
    expect(() => summarizeCutList([{ ...parts[0], name: " " }])).toThrow(InputError);
  });
});

describe("estimateLinearStock (first-fit decreasing)", () => {
  it("packs parts onto 96 in boards including kerf", () => {
    const r = estimateLinearStock(parts, { stockLength: 96, stockWidth: 6, kerf: 0.125 });
    // 40+40 (+kerf) = 80.125 → board 1; 28+28+28 (+2 kerf) = 84.25 → board 2; 28 → fits board 1? 80.125+28.125 > 96 no; board 2: 84.25+28.125 > 96 no → board 3
    expect(r.boards).toHaveLength(3);
    expect(r.oversize).toHaveLength(0);
    r.boards.forEach((b) => expect(b.used).toBeLessThanOrEqual(96));
  });

  it("reports parts that are too long or too wide", () => {
    const r = estimateLinearStock(
      [
        { id: "x", name: "Top", quantity: 1, length: 120, width: 4, thickness: 1 },
        { id: "y", name: "Panel", quantity: 1, length: 20, width: 18, thickness: 1 },
      ],
      { stockLength: 96, stockWidth: 8, kerf: 0.125 },
    );
    expect(r.oversize.map((o) => o.name)).toEqual(["Top", "Panel"]);
    expect(r.boards).toHaveLength(0);
  });

  it("computes yield", () => {
    const r = estimateLinearStock([{ id: "z", name: "Slat", quantity: 2, length: 48, width: 2, thickness: 1 }], {
      stockLength: 96,
      stockWidth: 6,
      kerf: 0,
    });
    expect(r.boards).toHaveLength(1);
    expect(r.yieldPercent).toBeCloseTo(100);
  });
});
