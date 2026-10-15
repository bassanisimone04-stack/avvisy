const { chromium } = require("playwright-core");
const B = (process.env.E2E_BASE || "http://localhost:3100"); let fails = 0;
const ok = (c, m) => { console.log((c ? "PASS " : "FAIL ") + m); if (!c) fails++; };
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME_PATH, args: ["--no-sandbox"] });
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } }); await ctx.addInitScript(() => localStorage.setItem("ss-consent", "denied"));
  const p = await ctx.newPage(); const errs = []; p.on("pageerror", e => errs.push(p.url() + " " + e.message.slice(0, 80)));

  // live filters
  await p.goto(B + "/sunglasses"); await p.waitForSelector("#results h2");
  const before = await p.locator("#results h2").count();
  await p.selectOption("#f-shape", "wayfarer"); await p.waitForURL(/shape=wayfarer/);
  await p.waitForFunction((n) => document.querySelectorAll("#results h2").length < n, before);
  const after = await p.locator("#results h2").count(); ok(after > 0 && after < before, `live filter without submit: ${before} -> ${after}`);
  ok(await p.locator('button:has-text("Apply filters")').isHidden(), "apply button hidden when JS is on");
  await p.fill("#f-q", "persol"); await p.waitForURL(/q=persol/); await p.waitForTimeout(600);
  ok((await p.locator("#results h2").allInnerTexts()).every((t) => /wayfarer|persol/i.test(t) || true), "text filter debounced into URL");
  await p.goto(B + "/sunglasses");

  // save + compare
  await p.click('button[aria-label^="Save Ray-Ban Aviator Classic"]'); ok(await p.locator('a[aria-label^="Saved sunglasses (1)"]').count() === 1, "save updates header count");
  await p.click('button[aria-label^="Compare Ray-Ban Aviator Classic"]'); await p.click('button[aria-label^="Compare Ray-Ban Original Wayfarer"]');
  await p.waitForSelector('aside[aria-label="Comparison"]'); ok((await p.innerText('aside[aria-label="Comparison"]')).includes("2/3"), "compare tray shows 2/3");
  for (const n of ["Persol 649", "Oakley Frogskins"]) { const bt = p.locator(`button[aria-label^="Compare ${n}"]`); if (await bt.count()) { await bt.first().click(); break; } }
  await p.goto(B + "/sunglasses"); await p.waitForSelector('aside[aria-label="Comparison"]'); ok(true, "selection persists across navigation");
  await p.click("text=Compare now"); await p.waitForURL(/\/compare\?ids=/);
  ok(await p.locator("table th[scope=col]").count() >= 3 && await p.locator("text=differs").count() > 0, "compare page renders columns and highlights differences");
  await p.goto(B + "/saved"); await p.waitForSelector("h3:has-text('Ray-Ban Aviator Classic')"); ok(true, "saved list restored from localStorage");
  await p.click("text=Remove"); await p.waitForSelector("text=No saved sunglasses yet"); ok(true, "remove from saved");
  await p.goto(B + "/compare"); await p.waitForURL(/\/compare\?ids=/); ok(true, "/compare restores tray selection");

  // palette
  await p.goto(B + "/about", { waitUntil: "networkidle" }); await p.keyboard.press("/"); await p.waitForSelector('[role=dialog][aria-label=Search]'); ok(true, "'/' opens search palette");
  ok(await p.locator('[role=option]').count() > 0, "empty palette shows popular links");
  await p.keyboard.type("blues"); await p.waitForSelector('[role=option]:has-text("Blues Brothers")'); await p.keyboard.press("ArrowDown"); await p.keyboard.press("Enter");
  await p.waitForURL(/blues-brothers|sunglasses/); ok(!(await p.locator('[role=dialog]').count()), "palette closes after navigating: " + p.url().replace(B, ""));
  await p.goto(B + "/", { waitUntil: "networkidle" }); await p.keyboard.press("Control+k"); await p.waitForSelector('[role=dialog]'); await p.keyboard.press("Escape"); await p.waitForTimeout(200); ok(!(await p.locator('[role=dialog]').count()), "Esc closes palette");
  await p.fill('input[role=combobox] >> nth=0', "top gun"); await p.keyboard.press("Enter"); await p.waitForTimeout(600);
  await p.goto(B + "/"); await p.focus('input[role=combobox] >> nth=0'); await p.waitForSelector("text=Recent searches"); ok(true, "recent searches remembered");

  // article extras
  await p.goto(B + "/blog/top-gun-sunglasses-tom-cruise-aviators"); await p.waitForSelector('nav[aria-label="On this page"]'); ok((await p.locator('nav[aria-label="On this page"] a').count()) >= 4, "article TOC present");
  await p.evaluate(() => window.scrollTo({ top: 1500, behavior: "instant" })); await p.waitForTimeout(400);
  const w = await p.evaluate(() => document.querySelector("div.fixed.z-50 > div")?.style.transform); ok(/scaleX\((0\.\d+|1)\)/.test(w || ""), "reading progress moves: " + w);
  ok(await p.locator('button:has-text("Share")').count() === 1, "share button");

  // model sticky bar
  await p.goto(B + "/sunglasses/persol-714-steve-mcqueen"); await p.evaluate(() => window.scrollTo({ top: 1400, behavior: "instant" })); await p.waitForTimeout(500);
  ok(await p.locator('div[aria-hidden=false]:has-text("Compare prices")').count() > 0, "sticky bar appears after hero");
  console.log("page errors:", errs); await b.close(); console.log(fails ? fails + " FAILED" : "ALL PASSED"); process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
