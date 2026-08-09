import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto('http://localhost:4321/film/master-of-none/', { waitUntil: 'networkidle' });
await page.screenshot({ path: '/tmp/master-of-none.png' });
await page.goto('http://localhost:4321/locale/dopolavoro-la-foce/', { waitUntil: 'networkidle' });
await page.screenshot({ path: '/tmp/dopolavoro.png' });
await browser.close();
