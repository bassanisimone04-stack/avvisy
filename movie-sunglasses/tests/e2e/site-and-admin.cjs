const { chromium } = require("playwright-core");
const B = (process.env.E2E_BASE || "http://localhost:3100");
let fails = 0;
const ok = (c, m) => { console.log((c ? "PASS " : "FAIL ") + m); if (!c) fails++; };
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME_PATH, args: ["--no-sandbox"] });
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  await ctx.addInitScript(() => localStorage.setItem("ss-consent", "denied"));
  const p = await ctx.newPage();
  const errs = []; p.on("pageerror", (e) => errs.push(p.url() + " :: " + e.message.slice(0,60))); p.on("console", (m) => m.type() === "error" && errs.push(m.text()));

  // autocomplete
  await p.goto(B + "/");
  await p.fill('input[role="combobox"] >> nth=0', "top gu");
  await p.waitForSelector('[role="listbox"] [role="option"]');
  ok((await p.locator('[role="option"]').first().innerText()).toLowerCase().includes("top gun"), "autocomplete shows Top Gun");
  await p.keyboard.press("ArrowDown"); await p.keyboard.press("Enter");
  await p.waitForURL(/\/movies\/top-gun|\/sunglasses|\/search/);
  ok(true, "autocomplete keyboard navigation -> " + p.url());

  // filters
  await p.goto(B + "/sunglasses?brand=knockaround&sort=name"); await p.waitForSelector("#results h2");
  ok((await p.locator("#results h2").count()) === 3, "filter brand=knockaround yields 3 cards");
  const canon = await p.locator('link[rel=canonical]').getAttribute("href");
  ok(canon.endsWith("/sunglasses") && (await p.locator('meta[name=robots]').getAttribute("content")).includes("noindex"), "filtered page: canonical base + noindex");

  // model page: no invented prices, search links, click tracking
  await p.goto(B + "/sunglasses/ray-ban-aviator-classic-rb3025");
  ok(await p.locator("text=No verified offers").count() > 0, "no offers -> honest empty state");
  const ld = await p.locator('script[type="application/ld+json"]').allInnerTexts();
  ok(ld.some((t) => t.includes('"Product"')) && !ld.some((t) => t.includes("AggregateOffer")), "Product JSON-LD without fabricated offers");
  const href = await p.locator('a:has-text("Find listings on eBay")').getAttribute("href");
  const r = await ctx.request.get(B + href, { maxRedirects: 0 });
  ok(r.status() === 302 && r.headers()["location"].startsWith("https://www.ebay.com/sch/i.html?_nkw=Ray-Ban"), "/go redirects to eBay search: " + r.headers()["location"]);
  const bad = await ctx.request.get(B + "/go?m=ebay&model=nope", { maxRedirects: 0 });
  ok(bad.status() === 302 && bad.headers()["location"].startsWith(B), "/go with bad model does not redirect externally");
  const open = await ctx.request.get(B + "/go?m=ebay&model=ray-ban-aviator-classic-rb3025&o=x&src=https://evil.com", { maxRedirects: 0 });
  ok(open.headers()["location"].includes("ebay.com"), "/go cannot be steered to arbitrary hosts");

  // unconfirmed label for F1
  await p.goto(B + "/sunglasses/st-dupont-d002-6051");
  ok((await p.locator("text=Why Unconfirmed?").count()) > 0, "F1 shows downgrade explanation");

  // contact form
  await p.goto(B + "/contact");
  await p.fill("#c-name", "Test"); await p.fill("#c-email", "t@example.com"); await p.fill("#c-body", "A correction with a source please.");
  await p.click('button:has-text("Send message")'); await p.waitForSelector("text=has been received");
  ok(true, "contact form stores message");

  // admin: protection
  const anon = await ctx.request.get(B + "/admin/models", { maxRedirects: 0 });
  ok(anon.status() === 307, "anonymous /admin/models redirected");
  await p.goto(B + "/admin/login");
  await p.fill("#email", "admin@example.com"); await p.fill("#password", "wrong"); await p.click('button:has-text("Accedi")');
  await p.waitForSelector("text=Credenziali non valide");
  ok(true, "wrong password rejected");
  await p.fill("#password", "dev-password-123"); await p.click('button:has-text("Accedi")');
  await p.waitForSelector("h1:has-text('Dashboard')"); ok(await p.locator("h1:has-text('Dashboard')").count() > 0, "login ok -> dashboard");
  const cookies = await ctx.cookies(); const ck = cookies.find((c) => c.name === "ss_admin");
  ok(ck && ck.httpOnly && ck.sameSite === "Strict" && ck.path === "/admin", "session cookie httpOnly/strict/path=/admin");

  // create offer
  await p.goto(B + "/admin/offers/new");
  await p.selectOption("#f-modelId", "ray-ban-aviator-classic-rb3025"); await p.selectOption("#f-merchantId", "ebay");
  await p.fill("#f-price", "149.5"); await p.selectOption("#f-availability", "in_stock"); await p.fill("#f-shipping", "Free"); await p.fill("#f-url", "http://insecure.example/x");
  await p.click('button:has-text("Crea")'); await p.waitForSelector("text=https://");
  ok(true, "non-https offer URL rejected");
  await p.fill("#f-url", "https://www.ebay.com/itm/123"); await p.click('button:has-text("Crea")'); await p.waitForURL(/saved=1/);
  ok(true, "valid offer saved");
  await p.goto(B + "/sunglasses/ray-ban-aviator-classic-rb3025");
  ok(await p.locator("text=$149.50").count() > 0 && await p.locator("a:has-text('View Deal')").count() > 0, "price comparator shows real offer + View Deal");
  const ld2 = (await p.locator('script[type="application/ld+json"]').allInnerTexts()).join("");
  ok(ld2.includes("AggregateOffer") && ld2.includes("149.5"), "JSON-LD AggregateOffer present with real price");
  // click via article attribution
  await p.goto(B + "/blog/top-gun-sunglasses-tom-cruise-aviators");
  await p.goto(B + "/sunglasses/ray-ban-aviator-classic-rb3025");
  const [popup] = await Promise.all([p.waitForEvent("popup", { timeout: 8000 }).catch(() => null), p.click("a:has-text('View Deal')")]);
  if (popup) await popup.close();
  await p.waitForTimeout(500);

  // publish guard
  await p.goto(B + "/admin/articles/tom-cruise-risky-business-sunglasses");
  await p.selectOption("#f-status", "published"); await p.click('button:has-text("Salva")');
  await p.waitForSelector("[role=alert]:has-text('Non si può pubblicare')");
  ok(true, "cannot publish unreviewed/incomplete article");
  // slug change redirect
  await p.goto(B + "/admin/actors/tom-cruise");
  await p.fill("#f-slug", "tom-cruise-renamed"); await p.click('button:has-text("Salva modifiche")'); await p.waitForURL(/saved=1/);
  const red = await ctx.request.get(B + "/actors/tom-cruise", { maxRedirects: 0 });
  ok(red.status() === 308 && red.headers()["location"].endsWith("/actors/tom-cruise-renamed"), "slug change creates 301/308 redirect");
  await p.goto(B + "/admin/actors/tom-cruise"); await p.fill("#f-slug", "tom-cruise"); await p.click('button:has-text("Salva modifiche")'); await p.waitForURL(/saved=1/);
  // delete guard
  await p.goto(B + "/admin/brands"); await p.click('form button[aria-label^="Elimina Ray-Ban"]'); await p.waitForSelector("[role=alert]:has-text('Non eliminabile')");
  ok(true, "cannot delete a brand still in use");

  // keywords
  await p.goto(B + "/admin/keywords");
  await p.fill("#csv", "Keyword,Volume,KD\nmatrix sunglasses,1200,30\nneo matrix sunglasses,300,20\nwhere to buy blinde matrix,,\n");
  await p.fill("#source", "test"); await p.click('button:has-text("Importa")'); await p.waitForSelector("text=Importate 3");
  await p.click('button:has-text("Raggruppa")'); await p.waitForSelector("text=cluster creati");
  ok(true, "CSV import + clustering");
  await p.goto(B + "/admin/stats"); ok(await p.locator("text=Ricavi REALI").count() > 0 && await p.locator("text=STIMATI").count() > 0, "stats separates real/estimated");
  const st = await p.innerText("body"); ok(/clic \(totali\)/i.test(st), "stats rendered");
  // AI unconfigured
  await p.goto(B + "/admin/articles/what-sunglasses-does-brad-pitt-wear-in-f1");
  ok(await p.locator("button:has-text('Genera')").isDisabled(), "AI generate disabled when no API key");
  ok(await p.locator("text=Controllo informazioni non verificate").count() > 0, "claims checker panel present");

  console.log("page errors:", errs.filter((e) => !/Failed to load resource/.test(e)).slice(0, 5));
  await b.close();
  console.log(fails ? `${fails} FAILED` : "ALL PASSED");
  process.exit(fails ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
