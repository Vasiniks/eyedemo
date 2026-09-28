import { chromium } from 'playwright';
import fs from 'node:fs';
const BASE = 'http://localhost:5505/v1.html';
const OUT = '/tmp/v3-qa-shots';
const browser = await chromium.launch();
// settle-aware probe: scroll, wait for scrollY to land, then 4s for loader catch-up
async function probe(tag, w, h, targets) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.v1-film__stage.is-intro', { timeout: 110000 });
  const geo = await page.evaluate(() => {
    const sec = document.querySelector('.v1-film');
    return { top: sec.offsetTop, dist: sec.offsetHeight - window.innerHeight };
  });
  for (const [name, frac] of targets) {
    const y = Math.round(geo.top + frac * geo.dist);
    await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'auto' }), y);
    // wait until scrollY settles near target (Lenis may animate)
    for (let i = 0; i < 20; i++) {
      await page.waitForTimeout(250);
      const sy = await page.evaluate(() => window.scrollY);
      if (Math.abs(sy - y) < 8) break;
    }
    const sy = await page.evaluate(() => window.scrollY);
    await page.waitForTimeout(3500); // loader catch-up (priority fill)
    const sy2 = await page.evaluate(() => window.scrollY);
    await page.screenshot({ path: `${OUT}/qa2-${name}-${tag}.png` });
    console.log(`${tag} ${name}: target=${y} settled=${sy} final=${sy2} drift=${sy2 - y}`);
  }
  if (errs.length) console.log(tag, 'ERRORS:', errs);
  await ctx.close();
}
// W1 hold ~s312 -> frac .499; W2 hold ~s460 -> frac .747; s500 -> .8181; ring s368 -> .596
await probe('1512', 1512, 860, [['w1hold', 0.499], ['w2hold', 0.747], ['s500', 0.8181]]);
// mobile: reviews s100 (~.17?), lenses s185, hero s215; use key fracs +. s185 ~ (.231+.343)/2=.287
await probe('390', 390, 844, [['s100', 0.17], ['s185', 0.287], ['hero', 0.343], ['w2hold', 0.747]]);
await browser.close();
console.log('PROBE DONE');
