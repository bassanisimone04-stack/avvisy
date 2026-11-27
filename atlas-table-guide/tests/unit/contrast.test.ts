import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { TOKENS, CONTRAST_PAIRS } from "@/config/tokens";
import { contrast } from "@/lib/contrast";

describe("design tokens", () => {
  it.each(CONTRAST_PAIRS)("%s on %s meets %s:1", (fg, bg, min) => {
    expect(contrast(TOKENS[fg], TOKENS[bg])).toBeGreaterThanOrEqual(min);
  });
  it("CSS variables match tokens.ts exactly", () => {
    const css = readFileSync(new URL("../../src/app/globals.css", import.meta.url), "utf8");
    for (const [k, v] of Object.entries(TOKENS)) expect(css).toMatch(new RegExp(`--${k}:\\s*${v}`, "i"));
  });
  it("hero subtitle (ivory at 80% on carmine) passes AA", () => {
    const blend = (a: number, b: number) => Math.round(a * 0.8 + b * 0.2);
    const [r, g, b] = [[0xfa, 0xb3], [0xf7, 0x12], [0xf2, 0x2b]].map(([x, y]) => blend(x!, y!));
    const hex = `#${[r, g, b].map((n) => n!.toString(16).padStart(2, "0")).join("")}`;
    expect(contrast(hex, TOKENS["red-600"])).toBeGreaterThanOrEqual(4.5);
  });
});
