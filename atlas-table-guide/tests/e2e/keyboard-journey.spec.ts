import { test, expect } from "./fixtures";

/** Keyboard-only walkthrough: search → filter → profile → compare → save. */
test("keyboard-only journey @a11y", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/en/");
  // search with the "/" shortcut
  await page.keyboard.press("/");
  const input = page.getByRole("combobox");
  await expect(input).toBeFocused();
  await page.keyboard.type("paris");
  await expect(page.getByRole("option").first()).toContainText("Destination");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/en\/restaurants\/france\/paris\//);
  // filter with keyboard
  const box = page.locator("aside").getByRole("checkbox", { name: "Romantic" });
  await box.focus();
  await page.keyboard.press("Space");
  await expect(page).toHaveURL(/feat=romantic/);
  // open first result via keyboard
  const first = page.locator("main article h2 a").first();
  await first.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/en\/restaurant\//);
  // compare + save from the sticky card
  const cmp = page.locator("aside").getByRole("checkbox", { name: /Compare:/ });
  await cmp.focus();
  await page.keyboard.press("Space");
  await expect(cmp).toBeChecked();
  const save = page.locator("aside").getByRole("button", { name: /Save to favourites/ });
  await save.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("link", { name: "Favourites (1)" })).toBeVisible();
  // comparison tray → compare page
  const go = page.getByRole("complementary", { name: "Comparison" }).getByRole("link", { name: /Compare \(1\)/ });
  await go.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/en\/compare\/\?r=/);
  await expect(page.getByRole("heading", { level: 1, name: "Compare restaurants" })).toBeVisible();
});

test("skip link moves focus to main", async ({ page }) => {
  await page.goto("/en/restaurants/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main")).toBeFocused();
});

test("mobile drawer traps focus and closes on Escape", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en/");
  await page.getByRole("button", { name: "Menu" }).click();
  const drawer = page.getByRole("dialog", { name: "Menu" });
  await expect(drawer).toBeVisible();
  for (let i = 0; i < 15; i++) await page.keyboard.press("Tab");
  expect(await drawer.evaluate((d) => d.contains(document.activeElement))).toBe(true);
  await page.keyboard.press("Escape");
  await expect(drawer).toBeHidden();
});
