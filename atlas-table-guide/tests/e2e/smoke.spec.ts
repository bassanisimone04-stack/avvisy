import { test, expect } from "./fixtures";
import { test as raw } from "@playwright/test";

test("home renders hero, sections and footer disclaimer", async ({ page }) => {
  await page.goto("/en/");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.getByRole("heading", { level: 2, name: "Explore culinary destinations" })).toBeVisible();
  await expect(page.getByText(/is an independent platform and is not affiliated/)).toBeVisible();
  await page.getByLabel("Where would you like to dine?").focus();
  await expect(page.locator("#hero-adv")).toBeVisible();
});

test("hero search submits to the directory", async ({ page }) => {
  await page.goto("/en/");
  await page.getByLabel("Where would you like to dine?").fill("sushi");
  await page.getByRole("button", { name: "Explore" }).click();
  await expect(page).toHaveURL(/\/en\/restaurants\/\?q=sushi/);
  await expect(page.getByRole("heading", { level: 2, name: "Sushi Kawase" })).toBeVisible();
});

test("directory filters, chips and clear-all are URL-synced", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/en/restaurants/");
  await page.locator("aside").getByLabel("Terrace").check();
  await expect(page).toHaveURL(/feat=terrace/);
  await expect(page.getByRole("link", { name: /Remove: Terrace/ })).toBeVisible();
  await page.getByLabel("Sort by").selectOption("price-asc");
  await expect(page).toHaveURL(/sort=price-asc/);
  await page.getByRole("link", { name: "Clear all" }).first().click();
  await expect(page).not.toHaveURL(/feat=terrace/);
});

test("mobile filter sheet shows a live count", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en/restaurants/");
  await page.getByRole("button", { name: "Filters" }).click();
  const dialog = page.getByRole("dialog", { name: "Filters" });
  await dialog.getByLabel("Vegan").check();
  await expect(dialog.getByRole("button", { name: /Show \d+ results/ })).toBeVisible();
  await dialog.getByRole("button", { name: /Show \d+ results/ }).click();
  await expect(page).toHaveURL(/diet=vegan/);
});

test("profile shows price dashboard, honest reservation state and JSON-LD", async ({ page }) => {
  await page.goto("/en/restaurant/maison-lune-paris/");
  await expect(page.getByRole("heading", { level: 1, name: "Maison Lune" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Lunch tasting menu" })).toBeVisible();
  await expect(page.getByText("Estimated combined experience")).toBeVisible();
  await expect(page.getByText(/Reservations are not yet available/).first()).toBeAttached();
  const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
  const restaurant = ld.map((s) => JSON.parse(s)).find((j) => j["@type"] === "Restaurant");
  expect(restaurant.geo["@type"]).toBe("GeoCoordinates");
});

test("gallery lightbox is keyboard accessible", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/en/restaurant/maison-lune-paris/");
  await page.getByRole("button", { name: /Open gallery, image 1 of 5/ }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(dialog).toHaveAttribute("aria-label", /Image 2 of 5/);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("unknown pages return a branded 404", async ({ page }) => {
  const res = await page.goto("/en/does-not-exist/");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1, name: /couldn.t find that page/ })).toBeVisible();
});

test("language switch keeps the path", async ({ page }) => {
  await page.goto("/en/restaurants/");
  await page.getByRole("button", { name: /Preferences/ }).click();
  await page.getByRole("link", { name: "Italiano" }).click();
  await expect(page).toHaveURL(/\/it\/restaurants\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "it");
});

raw("cookie banner appears before consent and stores the choice", async ({ page }) => {
  await page.goto("/en/");
  const banner = page.getByRole("region", { name: "Cookies & privacy" });
  await expect(banner).toBeVisible();
  await banner.getByRole("button", { name: "Reject non-essential" }).click();
  await expect(banner).toBeHidden();
  await page.reload();
  await expect(page.getByRole("region", { name: "Cookies & privacy" })).toBeHidden();
});

for (const path of ["/en/", "/en/restaurants/", "/en/restaurant/maison-lune-paris/", "/en/compare/?r=maison-lune-paris,rug-copenhagen", "/en/price-index/"]) {
  test(`no horizontal page scroll at 390px: ${path}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
}
