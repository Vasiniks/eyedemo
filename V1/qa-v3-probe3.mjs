import { chromium } from 'playwright';
const BASE = 'http://localhost:5505/v1.html';
const OUT = '/tmp/v3-qa-shots';
const browser = await chromium.launch();
async function probe(tag, w, h, sources) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.v1-film__stage.is-intro', { timeout: 110000 });
  const fracs = await page.evaluate(async (srcs) => {
    const fc = await import('/src/v1/filmCurve.ts');
    const m = { count: 3588, sourceFrames: 615 };
    return srcs.map((s) => [s, fc.filmToScroll(fc.sourceToFilm(s, fc.resolveFilmSpace(m)), m)]);
  }, sources);
  const geo = await page.evaluate(() => {
    const sec = document.querySelector('.v1-film');
    return { top: sec.offsetTop, dist: sec.offsetHeight - window.innerHeight };
  });
  for (const [s, frac] of fracs) {
    const y = Math.round(geo.top + frac * geo.dist);
    await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'auto' }), y);
    for (let i = 0; i < 20; i++) {
      await page.waitForTimeout(250);
      if (Math.abs((await page.evaluate(() => window.scrollY)) - y) < 8) break;
    }
    await page.waitForTimeout(3500);
    await page.screenshot({ path: `${OUT}/qa3-s${s}-${tag}.png` });
    console.log(`${tag} s${s}: frac=${frac.toFixed(4)} y=${y}`);
  }
  await ctx.close();
}
await probe('1512', 1512, 860, [312, 460]);
await probe('390', 390, 844, [100, 185, 312, 460]);
await browser.close();
console.log('PROBE3 DONE');
