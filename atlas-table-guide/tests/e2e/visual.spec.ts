import { test, expect } from "./fixtures";

/** Visual-regression baselines (viewport screenshots) for Home, Hub and Profile at 390 / 768 / 1280. */
const PAGES = [["home", "/en/"], ["hub", "/en/restaurants/france/paris/"], ["profile", "/en/restaurant/maison-lune-paris/"]] as const;
for (const [name, path] of PAGES) {
  for (const width of [390, 768, 1280]) {
    test(`visual ${name} @${width} @visual`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction(() => [...document.images].filter((i) => { const r = i.getBoundingClientRect(); return r.width > 0 && r.top < innerHeight && r.bottom > 0 && r.left < innerWidth && r.right > 0; }).every((i) => i.complete), undefined, { timeout: 20000 });
      await expect(page).toHaveScreenshot(`${name}-${width}.png`, { animations: "disabled", maxDiffPixelRatio: 0.03 });
    });
  }
}
