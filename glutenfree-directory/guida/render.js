// Stampa un file HTML in PDF A5 con Chromium (Playwright).
// Uso: node guida/render.js <in.html> <out.pdf> <cover|body>
const fs = require("fs");
const path = require("path");

function loadPlaywright() {
  for (const p of ["playwright", "/opt/node22/lib/node_modules/playwright"]) {
    try { return require(p); } catch (_) { /* prova il prossimo */ }
  }
  throw new Error("Playwright non trovato: installalo (npm i -D playwright) oppure usa quello globale.");
}

(async () => {
  const [, , input, output, mode] = process.argv;
  const { chromium } = loadPlaywright();
  const exe = fs.existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined;
  const browser = await chromium.launch({ executablePath: exe });
  const page = await browser.newPage();
  await page.goto("file://" + path.resolve(input), { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  const base = { width: "148mm", height: "210mm", printBackground: true, preferCSSPageSize: false };
  if (mode === "cover") {
    await page.pdf({ ...base, path: output, margin: { top: "0", right: "0", bottom: "0", left: "0" } });
  } else {
    const footer =
      '<div style="font-family:Arial,sans-serif;font-size:7pt;color:#6b7a72;width:100%;padding:0 15mm;display:flex;justify-content:space-between;">' +
      '<span>Vivere Senza Glutine · mappasenzaglutine.it</span><span class="pageNumber"></span></div>';
    await page.pdf({
      ...base,
      path: output,
      margin: { top: "17mm", right: "15mm", bottom: "20mm", left: "15mm" },
      displayHeaderFooter: true,
      headerTemplate: "<div></div>",
      footerTemplate: footer,
    });
  }
  await browser.close();
})();
