import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 390, height: 844 } })).newPage();
const errs = [];
page.on('pageerror', (e) => errs.push(e.message));
await page.goto('http://localhost:5404/v1.html', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('.v1-film', { timeout: 20000 });
await page.waitForTimeout(2000);
const g = await page.evaluate(() => {
  const s = document.querySelector('.v1-film');
  return { h: s.offsetHeight, vh: window.innerHeight };
});
console.log('MOBILE-FILM', JSON.stringify(g));
await page.evaluate(() => window.scrollTo(0, 1500));
await page.waitForTimeout(2200);
console.log('MOBILE-Y', await page.evaluate(() => Math.round(window.scrollY)));
await page.screenshot({ path: 'docs/phase4/qa/v2/snap-mobile.png' });
console.log('MOBILE-ERRORS', errs.length ? errs : 'none');
await browser.close();
