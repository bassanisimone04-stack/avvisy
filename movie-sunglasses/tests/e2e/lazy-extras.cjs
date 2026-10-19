const { chromium } = require("playwright-core");
let f=0; const ok=(c,m)=>{console.log((c?"PASS ":"FAIL ")+m); if(!c) f++;};
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME_PATH, args: ["--no-sandbox"] });
  let ctx = await b.newContext({ viewport: { width: 1280, height: 900 } }); let p = await ctx.newPage(); const errs=[]; p.on("console", m=>m.type()==="error"&&!/Failed to load/.test(m.text())&&errs.push(m.text().slice(0,100)));
  await p.goto((process.env.E2E_BASE || "http://localhost:3100") + "/about"); await p.waitForSelector('[role=dialog][aria-labelledby=consent-title]', { timeout: 5000 }); ok(true, "consent banner appears after idle load");
  await p.click('button:has-text("Essential only")'); await p.waitForTimeout(200); ok(!(await p.locator('#consent-title').count()), "banner dismissed");
  await ctx.close();
  ctx = await b.newContext({ viewport: { width: 390, height: 800 } }); await ctx.addInitScript(() => localStorage.setItem("ss-consent","denied")); p = await ctx.newPage(); p.on("console", m=>m.type()==="error"&&!/Failed to load/.test(m.text())&&errs.push(m.text().slice(0,100)));
  await p.goto((process.env.E2E_BASE || "http://localhost:3100") + "/about"); await p.click('button[aria-label^="Search"]'); await p.waitForSelector('[role=dialog][aria-label=Search]', { timeout: 5000 }); ok(true, "search icon pressed before extras loaded still opens palette (parked event)");
  await p.keyboard.press("Escape"); await p.waitForTimeout(200);
  await p.goto((process.env.E2E_BASE || "http://localhost:3100") + "/about"); await p.click('footer button:has-text("Cookie settings")'); await p.waitForSelector('#consent-title', { timeout: 5000 }); ok(true, "Cookie settings pressed early reopens banner");
  await p.goto((process.env.E2E_BASE || "http://localhost:3100") + "/contact", { waitUntil: "networkidle" }); await p.waitForTimeout(1800);
  await p.click("#c-body"); await p.keyboard.type("a/b"); ok((await p.inputValue("#c-body")) === "a/b", "'/' can be typed in text fields after extras load (regression)");
  console.log("console errors:", errs); await b.close(); process.exit(f?1:0);
})();
