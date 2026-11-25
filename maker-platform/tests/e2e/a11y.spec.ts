import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const pages = ["/", "/explore/us/woodworking", "/business/lone-oak-cnc-works-demo", "/shop", "/shop/walnut-hall-bench-plan", "/tools/board-foot-calculator", "/tools/cut-list-calculator"];

for (const path of pages) {
  test(`${path} has no serious WCAG A/AA violations`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      // The MapLibre canvas is covered by the list alternative and its own controls.
      .exclude(".maplibregl-canvas-container")
      .analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious.map((v) => `${v.id}: ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`)).toEqual([]);
  });
}
