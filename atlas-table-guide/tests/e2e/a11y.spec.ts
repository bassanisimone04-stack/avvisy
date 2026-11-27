import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "./fixtures";

const PAGES = ["/en/", "/it/", "/en/restaurants/", "/en/restaurants/france/paris/", "/en/restaurant/maison-lune-paris/", "/en/compare/?r=maison-lune-paris,rug-copenhagen", "/en/price-index/", "/en/magazine/how-to-read-a-tasting-menu-price/", "/en/hotel/palazzo-celeste-rome/", "/en/travel/gastronomic-journey-tuscany/", "/en/concierge/", "/en/gifts/", "/en/design-system/"];

for (const path of PAGES) {
  for (const width of [390, 1280]) {
    test(`axe: ${path} @${width} @a11y`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);
      const r = await new AxeBuilder({ page: page as never }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).exclude(".maplibregl-map").analyze();
      const bad = r.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
      expect(bad.map((v) => `${v.id}: ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`)).toEqual([]);
    });
  }
}

test("every <img> has an alt attribute @a11y", async ({ page }) => {
  for (const path of ["/en/", "/en/restaurants/", "/en/restaurant/rug-copenhagen/", "/en/hotels/"]) {
    await page.goto(path);
    expect(await page.locator("img:not([alt])").count(), path).toBe(0);
  }
});
