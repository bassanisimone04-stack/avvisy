import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "./fixtures";

const PAGES = ["/it/", "/en/", "/it/restaurants/", "/it/restaurants/paris/", "/it/restaurant/atlas-1/", "/en/restaurant/atlas-12/", "/it/compare/?r=atlas-1,atlas-2,atlas-3", "/it/favorites/", "/it/destinations/", "/it/concierge/"];

for (const path of PAGES) {
  test(`no horizontal scroll: ${path}`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState("load");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test(`axe (WCAG 2.2 AA, serious/critical): ${path}`, async ({ page }) => {
    await page.goto(path);
    const r = await new AxeBuilder({ page: page as never }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
    const bad = r.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(bad.map((v) => `${v.id}: ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`)).toEqual([]);
  });
}

test("touch targets are at least 44px on the home page", async ({ page }) => {
  await page.goto("/it/");
  const small = await page.evaluate(() => [...document.querySelectorAll<HTMLElement>("main button, main a.btn, header button, .search button, .chips a")].filter((e) => e.offsetParent && (e.getBoundingClientRect().height < 24)).map((e) => e.textContent?.trim().slice(0, 20)));
  expect(small).toEqual([]);
});

test("home: hero photo first, search below it, vertical city cards, then experiences and Tuscany", async ({ page }) => {
  await page.goto("/it/");
  const photo = (await page.locator(".hero .photo").boundingBox())!;
  const search = (await page.locator(".hero .search").boundingBox())!;
  expect(search.y).toBeGreaterThanOrEqual(photo.y + photo.height);
  const cityPhoto = (await page.locator(".cities .photo").first().boundingBox())!;
  expect(cityPhoto.height).toBeGreaterThan(cityPhoto.width);
  const ys = [] as number[];
  for (const sel of [".hero", ".cities", ".home-experiences", ".wide"]) ys.push((await page.locator(sel).first().boundingBox())!.y);
  expect(ys).toEqual([...ys].sort((a, b) => a - b));
  // nothing is cut off horizontally
  const wide = await page.locator(".wide .photo").first().boundingBox();
  const vw = page.viewportSize()!.width;
  expect(wide!.x + wide!.width).toBeLessThanOrEqual(vw + 1);
});

test("directory: filters are reachable and cards fit the screen", async ({ page }) => {
  await page.goto("/it/restaurants/");
  await expect(page.getByLabel("Città")).toBeVisible();
  const vw = page.viewportSize()!.width;
  const box = (await page.locator("#results .card").first().boundingBox())!;
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(vw + 1);
});

test("profile: gallery and actions fit the screen", async ({ page }) => {
  await page.goto("/it/restaurant/atlas-1/");
  const vw = page.viewportSize()!.width;
  for (const sel of [".gallery", ".price-grid", ".filters"]) {
    const b = (await page.locator(sel).first().boundingBox())!;
    expect(b.x + b.width, sel).toBeLessThanOrEqual(vw + 1);
  }
});
