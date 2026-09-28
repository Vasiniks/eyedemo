import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1512, height: 860 } });
await page.goto('http://localhost:5502/v1.html', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(3500);
// Park 100px before the hero key (2065), inside the 154px capture window.
await page.evaluate(() => window.scrollTo(0, 1965));
await page.waitForTimeout(400);
const y0 = await page.evaluate(() => window.scrollY);
await page.waitForTimeout(2000);
const y1 = await page.evaluate(() => window.scrollY);
console.log(JSON.stringify({ parkedAt: 1965, after400ms: y0, after2400ms: y1, heroKey: 2065, nudged: Math.abs(y1 - 2065) < 3 }));
await browser.close();
