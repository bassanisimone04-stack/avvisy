import { test, expect } from "./fixtures";

test("root redirects to the Italian site; unknown pages are a real 404", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/it\/$/);
  const res = await page.goto("/it/non-esiste/");
  expect(res?.status()).toBe(404);
  expect((await page.goto("/fr/"))?.status()).toBe(404);
});

test("homepage shows terrace → city cards → experiences → Tuscany, in that order", async ({ page }) => {
  await page.goto("/it/");
  await expect(page.locator("h1")).toHaveCount(1);
  const heroPhoto = page.locator(".hero .photo img");
  await expect(heroPhoto).toHaveAttribute("alt", /Costiera Amalfitana/);
  const y = async (sel: string) => (await page.locator(sel).first().boundingBox())!.y;
  const photoBottom = (await page.locator(".hero .photo").boundingBox())!;
  // the search sits BELOW the photo
  expect((await page.locator(".hero .search").boundingBox())!.y).toBeGreaterThan(photoBottom.y + photoBottom.height - 1);
  expect((await page.locator(".hero h1").boundingBox())!.y).toBeGreaterThan(photoBottom.y + photoBottom.height - 1);
  const order = [await y(".hero"), await y(".cities"), await y(".home-experiences"), await y(".wide")];
  expect(order).toEqual([...order].sort((a, b) => a - b));
  await expect(page.locator(".cities .card")).toHaveCount(3);
  // city photos are vertical (3:4)
  const b = (await page.locator(".cities .photo").first().boundingBox())!;
  expect(b.height / b.width).toBeGreaterThan(1.2);
  await expect(page.locator(".home-experiences .card")).toHaveCount(4);
  await expect(page.locator(".wide .card h3")).toHaveText(/Toscana/);
});

test("hero search sends the query to the directory and filters it", async ({ page }) => {
  await page.goto("/it/");
  await page.getByLabel("Destinazione o ristorante").fill("parigi");
  await page.getByRole("button", { name: "Esplora" }).first().click();
  await expect(page).toHaveURL(/\/it\/restaurants\/\?q=parigi/);
  await expect(page.locator("#count")).toHaveText("3 risultati");
  await expect(page.locator("#results .card")).toHaveCount(3);
});

test("hero chips and advanced search apply the right filters", async ({ page }) => {
  await page.goto("/it/");
  await page.getByRole("link", { name: "Livello 3" }).click();
  await expect(page).toHaveURL(/level=3/);
  await expect(page.locator("#results .card").first()).toContainText("Livello 3");
  await page.goto("/it/");
  await page.getByText("Ricerca avanzata").click();
  await page.locator(".hero-filter select[name=city]").selectOption("rome");
  await page.locator(".hero-filter").getByRole("button", { name: "Esplora" }).click();
  await expect(page).toHaveURL(/city=rome/);
  await expect(page.locator("#results .card h3").first()).toBeVisible();
});

test("directory filters update the list and the shareable URL live", async ({ page }) => {
  await page.goto("/it/restaurants/");
  await expect(page.locator("#count")).toHaveText("30 risultati");
  await page.getByLabel("Città").selectOption("paris");
  await expect(page.locator("#count")).toHaveText("3 risultati");
  await expect(page).toHaveURL(/city=paris/);
  await page.getByLabel("Ordina").selectOption("price");
  await expect(page).toHaveURL(/sort=price/);
  const prices = await page.locator("#results .card p.muted").allTextContents();
  const nums = prices.map((t) => Number(t.replace(/\D+/g, "")));
  expect(nums).toEqual([...nums].sort((a, b) => a - b));
  await page.getByLabel("Prezzo sotto (€)").fill("1");
  await expect(page.locator("#results")).toContainText("Nessun risultato");
  // reload keeps the filters; the URL is shareable
  const url = page.url();
  await page.goto(url);
  await expect(page.getByLabel("Città")).toHaveValue("paris");
  await expect(page.locator("#count")).toHaveText("0 risultati");
  await page.getByRole("link", { name: "Azzera" }).click();
  await expect(page.locator("#count")).toHaveText("30 risultati");
  await expect(page.getByLabel("Città")).toHaveValue("");
});

test("city route /restaurants/paris/ lists only that city", async ({ page }) => {
  await page.goto("/it/restaurants/paris/");
  await expect(page.locator("h1")).toHaveText("Parigi");
  await expect(page.locator("#results .card")).toHaveCount(3);
});

test("rooms filter and English labels", async ({ page }) => {
  await page.goto("/en/restaurants/?rooms=1");
  await expect(page.getByLabel("With rooms")).toBeChecked();
  const n = Number((await page.locator("#count").textContent())!.split(" ")[0]);
  expect(n).toBeGreaterThan(0);
  expect(n).toBeLessThan(30);
});

test("every restaurant card is clearly marked as demo", async ({ page }) => {
  await page.goto("/it/restaurants/");
  const cards = page.locator("#results .card");
  const count = await cards.count();
  expect(count).toBe(30);
  for (let i = 0; i < count; i++) await expect(cards.nth(i).locator(".tag.demo")).toHaveText("Demo");
  await expect(page.locator(".notice").first()).toContainText("dimostrativi");
});

test("favourites persist across reloads and appear on /favorites/", async ({ page }) => {
  await page.goto("/it/restaurants/");
  await page.getByRole("button", { name: "Salva Aubépine et Sel" }).click();
  await expect(page.getByRole("button", { name: "Salva Aubépine et Sel" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("[data-saved]")).toHaveText("1");
  await page.reload();
  await expect(page.getByRole("button", { name: "Salva Aubépine et Sel" })).toHaveAttribute("aria-pressed", "true");
  await page.goto("/it/favorites/");
  await expect(page.locator(".card h3")).toHaveText(["Aubépine et Sel"]);
  await page.getByRole("button", { name: "Salva Aubépine et Sel" }).click();
  await expect(page.locator(".card")).toHaveCount(0);
});

test("comparison: link carries ?r=, max four, shareable page", async ({ page }) => {
  await page.goto("/it/restaurants/");
  for (const n of ["Aubépine et Sel", "Kohaku no Niwa", "Orto delle Ombre", "Fern and Flint"]) await page.getByLabel(`Confronta: ${n}`).check();
  await expect(page.locator("[data-compare-link]").first()).toHaveText("Confronta (4)");
  await page.getByLabel("Confronta: Juniper Ledger").click(); // refused: only four allowed
  await expect(page.getByLabel("Confronta: Juniper Ledger")).not.toBeChecked();
  await expect(page.getByText("Puoi scegliere fino a 4 ristoranti.").first()).toBeVisible();
  const href = await page.locator("[data-compare-link]").first().getAttribute("href");
  expect(decodeURIComponent(href!)).toContain("/it/compare/?r=atlas-1,atlas-2,atlas-3,atlas-4");
  await page.locator("[data-compare-link]").first().click();
  await expect(page.locator("table thead th")).toHaveCount(5);
  await expect(page.getByRole("link", { name: "Kohaku no Niwa" })).toBeVisible();
  // a shared link works in a brand-new context with empty storage
  const other = await page.context().browser()!.newContext();
  const p2 = await other.newPage();
  await p2.goto(`http://localhost:3300/it/compare/?r=atlas-3,atlas-9`);
  await expect(p2.locator("table thead th")).toHaveCount(3);
  await expect(p2.locator("table")).toContainText("Havtorn Bord");
  await other.close();
});

test("comparison with no selection explains what to do", async ({ page }) => {
  await page.goto("/en/compare/");
  await expect(page.getByText("Select up to four restaurants from the directory.")).toBeVisible();
});

test("profile: gallery lightbox is keyboard accessible", async ({ page }) => {
  await page.goto("/it/restaurant/atlas-1/");
  await expect(page.locator("h1")).toHaveText("Aubépine et Sel");
  await expect(page.locator(".gallery button")).toHaveCount(3);
  await page.locator('[data-gallery="0"]').click();
  const dialog = page.locator("dialog.gallery-view");
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("1/3");
  await page.keyboard.press("ArrowRight");
  await expect(dialog).toContainText("2/3");
  await page.getByRole("button", { name: "Foto successiva" }).click();
  await expect(dialog).toContainText("3/3");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(page.locator("[data-gallery='0']")).toBeFocused();
});

test("profile shows demo prices, honest missing data and no reservations", async ({ page }) => {
  await page.goto("/it/restaurant/atlas-1/");
  await expect(page.locator(".price-grid")).toContainText(/65\s?€/);
  await expect(page.locator(".price-grid")).toContainText("Dato assente");
  await expect(page.getByText("Le schede dimostrative non accettano prenotazioni.")).toBeVisible();
  await expect(page.locator(".profile-intro .tag.demo")).toBeVisible();
});

test("profile actions save and compare, shared with the rest of the site", async ({ page }) => {
  await page.goto("/it/restaurant/atlas-2/");
  await page.locator(".filters").getByRole("button", { name: "Salva" }).click();
  await page.getByLabel("Confronta: Kohaku no Niwa").check();
  await expect(page.locator("[data-saved]")).toHaveText("1");
  await expect(page.locator("[data-compare-link]")).toHaveText("Confronta (1)");
  await page.goto("/it/restaurants/");
  await expect(page.getByLabel("Confronta: Kohaku no Niwa")).toBeChecked();
});

test("language switch keeps the page and the query", async ({ page }) => {
  await page.goto("/it/restaurants/?level=2");
  await page.getByRole("link", { name: /passa all’inglese/i }).click();
  await expect(page).toHaveURL(/\/en\/restaurants\/\?level=2/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("h1")).toHaveText("Restaurants");
  await page.goto("/en/restaurant/atlas-5/");
  await page.getByRole("link", { name: /passa all’inglese|switch to italian/i }).click();
  await expect(page).toHaveURL(/\/it\/restaurant\/atlas-5\/$/);
});

test("search dialog opens with / and finds cities and venues", async ({ page }) => {
  await page.goto("/it/");
  // wait until React has attached the handlers
  await page.waitForFunction(() => { const b = document.querySelector("[data-finder]"); return !!b && Object.keys(b).some((k) => k.startsWith("__reactProps")); });
  await page.keyboard.press("/");
  const dialog = page.getByRole("dialog", { name: "Cerca" });
  await expect(dialog).toBeVisible();
  await page.keyboard.type("copen");
  await expect(dialog.getByRole("link", { name: "Copenaghen" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await page.getByRole("button", { name: /Cerca \(premi/ }).click();
  await page.keyboard.type("juniper");
  await dialog.getByRole("link", { name: "Juniper Ledger" }).click();
  await expect(page).toHaveURL(/\/it\/restaurant\/atlas-5\//);
});

test("featured tabs switch levels", async ({ page }) => {
  await page.goto("/it/");
  await page.getByRole("button", { name: "Livello 3" }).click();
  await expect(page.locator("#featured .card").first()).toContainText("Livello 3");
});

test("planner builds a demo itinerary within the budget", async ({ page }) => {
  await page.goto("/it/concierge/");
  await page.getByLabel("Destinazione").selectOption("paris");
  await page.getByLabel("Budget a persona (€)").fill("200");
  await page.getByRole("button", { name: "Crea itinerario" }).click();
  await expect(page.locator("#plan-results h2")).toHaveText("Parigi");
  await expect(page.locator("#plan-results")).toContainText("Totale indicativo");
});

test("every menu link opens a real page (no dead links)", async ({ page, request }) => {
  await page.goto("/it/");
  const hrefs = await page.locator("header a[href^='/'], footer a[href^='/']").evaluateAll((as) => [...new Set(as.map((a) => (a as HTMLAnchorElement).getAttribute("href")!))]);
  expect(hrefs.length).toBeGreaterThan(15);
  for (const h of hrefs) expect((await request.get(h)).status(), h).toBe(200);
});
