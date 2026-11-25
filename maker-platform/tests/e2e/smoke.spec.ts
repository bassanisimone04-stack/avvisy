import { expect, test } from "@playwright/test";

const pages = ["/", "/explore/us/woodworking", "/business/lone-oak-cnc-works-demo", "/shop", "/shop/walnut-hall-bench-plan", "/tools", "/tools/board-foot-calculator", "/tools/cnc-project-cost-calculator", "/tools/cut-list-calculator"];

for (const path of pages) {
  test(`${path} renders without errors or horizontal overflow`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(path);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.getByText(/fictional demo data/i).first()).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    expect(errors).toEqual([]);
  });
}

test("preview builds are not indexable", async ({ page, request }) => {
  await page.goto("/");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Disallow: /");
  const res = await request.get("/");
  expect(res.headers()["x-robots-tag"]).toContain("noindex");
});

test("unknown pages return 404", async ({ request }) => {
  expect((await request.get("/business/does-not-exist")).status()).toBe(404);
});
