import { expect, test } from "@playwright/test";

test("hero search lands on filtered, shareable directory results", async ({ page }) => {
  await page.goto("/");
  const hero = page.getByRole("search", { name: "Search workshops and suppliers" });
  await hero.getByPlaceholder("City, state or ZIP code").fill("Austin");
  await hero.getByRole("button", { name: "Explore the map" }).click();
  await expect(page).toHaveURL(/\/explore\/us\/woodworking\?.*near=Austin/);
  await expect(page.getByText(/within 25 mi of/).filter({ visible: true }).first()).toBeVisible();
});

test("directory filters update results and the URL", async ({ page }, info) => {
  test.skip(info.project.name === "mobile", "desktop layout");
  await page.goto("/explore/us/woodworking");
  await page.getByRole("button", { name: "CNC machining services" }).click();
  await expect(page).toHaveURL(/category=cnc-services/);
  await expect(page.locator("article h3").first()).toBeVisible();
  const cards = page.locator("article[id^='biz-']");
  const n = await cards.count();
  expect(n).toBeGreaterThan(0);
  expect(n).toBeLessThan(18);
});

test("unknown locations are reported honestly", async ({ page }) => {
  await page.goto("/explore/us/woodworking?near=Atlantis");
  await expect(page.getByText(/We couldn.t place “Atlantis”/)).toBeVisible();
});

test("add a product to the cart and see it in the cart", async ({ page }) => {
  await page.goto("/shop/walnut-hall-bench-plan");
  await page.getByRole("button", { name: "Add to cart" }).click();
  await expect(page.getByRole("link", { name: /In your cart/ })).toBeVisible();
  await page.goto("/cart");
  await expect(page.getByRole("link", { name: "Walnut Hall Bench" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Checkout unavailable/ })).toBeDisabled();
});

test("board foot calculator computes 8 BF for 2 × 6 in × 8 ft", async ({ page }) => {
  await page.goto("/tools/board-foot-calculator");
  await page.getByLabel("Thickness", { exact: true }).fill("2");
  await page.getByLabel("Width", { exact: true }).fill("6");
  await page.getByLabel("Length", { exact: true }).fill("8");
  await page.getByLabel("Quantity", { exact: true }).fill("1");
  await expect(page.getByText("Board feet", { exact: true }).locator("..").locator("dd")).toHaveText("8");
  await page.getByLabel("Width", { exact: true }).fill("0");
  await expect(page.getByText("Width must be a number greater than zero.")).toBeVisible();
});

test("favorites persist across pages", async ({ page }) => {
  await page.goto("/business/rose-city-woodshop-demo");
  await page.getByRole("button", { name: /Save Rose City Woodshop to favorites/ }).first().click();
  await page.goto("/favorites");
  await expect(page.getByRole("heading", { name: "Rose City Woodshop" })).toBeVisible();
});
