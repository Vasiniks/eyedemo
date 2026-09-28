import { chromium } from 'playwright';

const URL = 'http://localhost:5404/v1.html';
const errors = [];

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1512, height: 860 },
  recordVideo: { dir: 'docs/phase4/qa/v2/', size: { width: 1512, height: 860 } },
});
const page = await ctx.newPage();
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text().slice(0, 200)); });

await page.goto(URL, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('.v1-film', { timeout: 20000 });
await page.waitForTimeout(2500);

const info = await page.evaluate(async () => {
  const sec = document.querySelector('.v1-film');
  const m = await import('/src/v1/filmCurve.ts');
  const keys = m.snapKeyScrolls();
  return {
    top: sec.offsetTop,
    h: sec.offsetHeight,
    vh: window.innerHeight,
    keys,
    captures: keys.map((_, i) => m.snapCaptureWindow(i)),
  };
});
console.log('FILM', JSON.stringify({ top: info.top, h: info.h, vh: info.vh }));
console.log('KEYS', info.keys.map((k) => k.toFixed(4)).join(' '));
console.log('CAPT', info.captures.map((c) => c.toFixed(4)).join(' '));

const dist = info.h - info.vh;
const ki = 3; // key 215 (hero) — mid-film, big capture window
const targetY = info.top + info.keys[ki] * dist;
const halfWin = (info.captures[ki] * dist) / 2;
const startY = targetY - halfWin;
console.log('TARGET', Math.round(targetY), 'START', Math.round(startY), 'HALFWIN', Math.round(halfWin));

await page.evaluate((y) => window.scrollTo(0, y), startY);
await page.waitForTimeout(400);
const y1 = await page.evaluate(() => window.scrollY);
await page.screenshot({ path: 'docs/phase4/qa/v2/snap-before.png' });
await page.waitForTimeout(1800);
const y2 = await page.evaluate(() => window.scrollY);
await page.screenshot({ path: 'docs/phase4/qa/v2/snap-after.png' });
console.log('Y-SETTLE', Math.round(y1), '->', Math.round(y2), 'TARGET', Math.round(targetY));
console.log('NUDGE-OK', Math.abs(y2 - targetY) < Math.abs(y1 - targetY) && Math.abs(y2 - targetY) < 60);

// Cancel check: new input during snap should stop it
await page.evaluate((y) => window.scrollTo(0, y), targetY - halfWin);
await page.waitForTimeout(300);
await page.mouse.wheel(0, 400);
await page.waitForTimeout(200);
const y3 = await page.evaluate(() => window.scrollY);
console.log('CANCEL-POS', Math.round(y3));

console.log('ERRORS', errors.length ? errors.slice(0, 8) : 'none');
await ctx.close();
await browser.close();
