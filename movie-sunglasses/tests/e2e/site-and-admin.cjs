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

  // CSV offers import
  await p.goto(B + "/admin/offers/import");
  await p.fill("#csv", "model,merchant,price,availability,url\npersol-649,ebay,99,in stock,http://bad.example/x\nnope,ebay,1,in stock,https://x.com\n"); await p.click('button:has-text("Verifica")');
  await p.waitForSelector("[role=alert]:has-text('nulla è stato importato')"); ok(true, "import with errors is all-or-nothing");
  await p.fill("#csv", "model,merchant,price,availability,shipping,url\npersol-649,ebay,99,in stock,Free,https://www.ebay.com/itm/649\n"); await p.click('button:has-text("Verifica")');
  await p.waitForSelector("text=Verifica superata"); ok(true, "dry run validates without saving");
  await p.uncheck('input[name=dry]'); await p.click('button:has-text("Verifica")'); await p.waitForSelector("text=Importate o aggiornate 1");
  await p.goto(B + "/sunglasses/persol-649"); ok(await p.locator("text=$99.00").count() > 0, "imported offer appears in comparator");

  // photos: rights are enforced
  const photoForm = async (f) => { await p.goto(B + "/admin/photos/new"); await p.fill("#f-url", f.url); await p.fill("#f-alt", f.alt); await p.selectOption("#f-kind", f.kind); await p.fill("#f-credit", f.credit); await p.selectOption("#f-license", f.license); if (f.proof) await p.fill("#f-licenseUrl", f.proof); if (f.model) await p.selectOption("#f-modelId", f.model); if (f.movie) await p.selectOption("#f-movieId", f.movie); if (f.approved) await p.check("input[name=approved]"); await p.click('button:has-text("Crea")'); };
  await photoForm({ url: "https://img.example.com/x.jpg", alt: "Persol 649 frame on a grey background", kind: "product", credit: "Studio", license: "press", model: "persol-649", approved: true });
  await p.waitForSelector("[role=alert]:has-text('prova dei diritti')"); ok(true, "approving a press photo without proof is rejected");
  await photoForm({ url: "https://img.example.com/p649.jpg", alt: "Persol 649 frame on a grey background", kind: "product", credit: "Own studio", license: "owned", model: "persol-649", approved: true }); await p.waitForURL(/saved=1/);
  await photoForm({ url: "https://img.example.com/scene.jpg", alt: "Maverick on the flight deck at sunset", kind: "scene", credit: "Commons author", license: "cc", proof: "https://commons.wikimedia.org/wiki/File:Example.jpg", movie: "top-gun", approved: true }); await p.waitForURL(/saved=1/);
  await photoForm({ url: "https://img.example.com/draft.jpg", alt: "Draft photo that must stay hidden", kind: "product", credit: "Draft", license: "owned", model: "ray-ban-predator-2-rb2027", approved: false }); await p.waitForURL(/saved=1/);
  await p.goto(B + "/sunglasses/persol-649"); ok(await p.locator('img[alt="Persol 649 frame on a grey background"]').count() > 0 && (await p.locator("text=Photo: Own studio").count()) > 0, "approved product photo shows on the model page with credit");
  await p.goto(B + "/sunglasses?q=persol"); ok(await p.locator('#results img[alt="Persol 649 frame on a grey background"]').count() > 0, "approved product photo replaces the illustration on the card");
  await p.goto(B + "/movies/top-gun"); ok((await p.locator('figure img[alt="Maverick on the flight deck at sunset"]').count()) > 0 && (await p.locator('figure a[href*="commons.wikimedia.org"]').count()) > 0, "scene photo shows on the film page with rights link");
  await p.goto(B + "/sunglasses/ray-ban-predator-2-rb2027"); ok((await p.locator('img[alt="Draft photo that must stay hidden"]').count()) === 0, "unapproved photo never shows");

  // fair use: guardrails + emergency switch
  const fu = async (f) => { await p.goto(B + "/admin/photos/new"); await p.fill("#f-url", f.url); await p.fill("#f-alt", "Maverick on the flight deck at sunset"); await p.selectOption("#f-kind", "scene"); await p.fill("#f-credit", "Studio Pictures"); await p.selectOption("#f-license", "fair_use"); if (f.note) await p.fill("#f-rightsNote", f.note); if (f.source) await p.fill("#f-sourceUrl", f.source); await p.selectOption("#f-movieId", "top-gun-maverick"); await p.check("input[name=approved]"); await p.click('button:has-text("Crea")'); };
  await fu({ url: "https://img.example.com/fu.jpg" }); await p.waitForSelector("[role=alert]:has-text('motivazione')"); ok(true, "fair use without rationale is rejected");
  await fu({ url: "https://img.example.com/fu.jpg", note: "Reduced still shown beside our evidence analysis of the sunglasses; credited to the studio.", source: "https://studio.example.com/press/still" }); await p.waitForURL(/saved=1/);
  await p.goto(B + "/movies/top-gun-maverick"); ok((await p.locator("figcaption:has-text('Still ©')").count()) > 0 && (await p.locator('figcaption a[href="/copyright"]').count()) > 0, "fair use still shows credit, source and copyright notice");
  await p.goto(B + "/admin"); ok((await p.locator("text=foto pubblicate in «fair use dichiarato»").count()) > 0, "dashboard warns about fair use photos");
  await p.click('button:has-text("Ritira tutte subito")'); await p.waitForSelector("text=foto in fair use ritirate");
  await p.goto(B + "/movies/top-gun-maverick"); ok((await p.locator("figcaption:has-text('Still ©')").count()) === 0, "withdraw-all takes fair use photos offline");
  await p.goto(B + "/copyright"); ok((await p.locator("h1:has-text('Copyright Notice')").count()) > 0, "copyright notice page exists");

  // trailer facade + photo CSV import
  await p.goto(B + "/admin/movies/risky-business"); await p.fill("#f-trailerUrl", "https://vimeo.com/123"); await p.click('button:has-text("Salva modifiche")'); await p.waitForSelector("[role=alert]:has-text('YouTube')"); ok(true, "non-YouTube trailer is rejected");
  await p.fill("#f-trailerUrl", "https://www.youtube.com/watch?v=dQw4w9WgXcQ"); await p.click('button:has-text("Salva modifiche")'); await p.waitForURL(/saved=1/);
  await p.goto(B + "/movies/risky-business"); const reqs = []; p.on("request", (r) => /youtube/.test(r.url()) && reqs.push(r.url()));
  await p.waitForSelector("text=Play the official trailer"); ok(reqs.length === 0 && (await p.locator("iframe").count()) === 0, "trailer is a facade: no YouTube request before play");
  await p.click("text=Play the official trailer"); await p.waitForSelector('iframe[src^="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"]'); ok(true, "play loads the privacy-enhanced embed");
  await p.goto(B + "/admin/photos/import");
  await p.fill("#csv", "url,alt,kind,credit,license,source_url,rights_note,movie,approved\nhttps://img.example.com/i1.jpg,Maverick on the flight deck at sunset,scene,Studio,fair_use,,,top-gun,yes\n"); await p.click('button:has-text("Verifica")');
  await p.waitForSelector("[role=alert]:has-text('nulla è stato importato')"); ok(true, "photo import enforces rights rules");
  await p.fill("#csv", "url,alt,kind,credit,license,license_url,movie,approved\nhttps://img.example.com/i2.jpg,Doc Brown style still for the catalogue,scene,Commons author,cc,https://commons.wikimedia.org/wiki/File:Z.jpg,the-blues-brothers,yes\n"); await p.uncheck("input[name=dry]"); await p.click('button:has-text("Verifica")'); await p.waitForSelector("text=Importate o aggiornate 1 foto");
  await p.goto(B + "/movies/the-blues-brothers"); ok((await p.locator('figure img[alt="Doc Brown style still for the catalogue"]').count()) > 0, "imported photo is live on the film page");

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
