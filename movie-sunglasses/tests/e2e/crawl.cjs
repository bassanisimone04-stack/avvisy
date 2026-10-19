const { chromium } = require("playwright-core");
const B = process.env.E2E_BASE || "http://localhost:3100";
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME_PATH, args: ["--no-sandbox"] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } }); await ctx.addInitScript(() => localStorage.setItem("ss-consent","denied"));
  const seen = new Map(), queue = ["/"], bad = [], overflow = [], consoleErrs = [], dupIds = [], noAlt = [];
  const p = await ctx.newPage();
  p.on("console", m => { if (m.type()==="error" && !/Failed to load resource/.test(m.text())) consoleErrs.push(p.url()+" "+m.text().slice(0,100)); });
  while (queue.length && seen.size < 220) {
    const path = queue.shift(); if (seen.has(path)) continue;
    const r = await p.goto(B + path, { waitUntil: "domcontentloaded" }).catch(e => ({ status: () => 0 }));
    seen.set(path, r.status());
    if (r.status() >= 400) { bad.push(path + " -> " + r.status()); continue; }
    await p.waitForTimeout(150);
    const info = await p.evaluate(() => ({
      over: document.documentElement.scrollWidth > window.innerWidth + 1 ? document.documentElement.scrollWidth : 0,
      links: [...document.querySelectorAll("a[href]")].map(a => a.getAttribute("href")).filter(h => h && (h.startsWith("/") && !h.startsWith("//"))),
      dups: (() => { const ids = [...document.querySelectorAll("[id]")].map(e => e.id); return ids.filter((x, i) => ids.indexOf(x) !== i); })(),
      noalt: [...document.querySelectorAll("img:not([alt])")].length,
      hashBroken: [...document.querySelectorAll('a[href^="#"]')].map(a => a.getAttribute("href")).filter(h => h.length > 1 && !document.getElementById(h.slice(1))),
    }));
    if (info.over) overflow.push(path + " (" + info.over + "px)");
    if (info.dups.length) dupIds.push(path + " " + [...new Set(info.dups)].join(","));
    if (info.noalt) noAlt.push(path);
    if (info.hashBroken.length) bad.push(path + " broken anchors " + info.hashBroken.join(","));
    for (const l of info.links) { const u = l.split("#")[0].replace(/\?.*$/, m => m); if (/^\/(admin|api|go)/.test(u)) continue; if (!seen.has(u) && !queue.includes(u)) queue.push(u); }
  }
  console.log("pages crawled:", seen.size);
  console.log("bad:", bad); console.log("overflow@390:", overflow); console.log("duplicate ids:", dupIds); console.log("imgs without alt:", noAlt); console.log("console errors:", consoleErrs.slice(0,8));
  await b.close();
  const failed = bad.length + overflow.length + dupIds.length + consoleErrs.length;
  console.log(failed ? "CRAWL FAILED" : "CRAWL OK"); process.exit(failed ? 1 : 0);
})();
