import { chromium } from 'playwright';
const BASE = 'http://localhost:5505/v1.html';
const browser = await chromium.launch();
// SNAP probe: park 100px off hero key, wait, check nudge lands exact; then on-key hold check
{
  const ctx = await browser.newContext({ viewport: { width: 1512, height: 860 } });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.v1-film__stage.is-intro', { timeout: 110000 });
  const geo = await page.evaluate(() => {
    const sec = document.querySelector('.v1-film');
    return { top: sec.offsetTop, dist: sec.offsetHeight - window.innerHeight };
  });
  const heroY = Math.round(geo.top + 0.343 * geo.dist);
  await page.evaluate((y) => window.scrollTo({ top: y - 100, behavior: 'auto' }), heroY);
  await page.waitForTimeout(500);
  const parked = await page.evaluate(() => window.scrollY);
  await page.waitForTimeout(3000); // idle -> snap may nudge
  const after = await page.evaluate(() => window.scrollY);
  console.log(`SNAP off-key: hero=${heroY} parked=${parked} afterIdle=${after} nudged=${after - parked}`);
  // cancel path: start nudge then wheel
  await page.evaluate((y) => window.scrollTo({ top: y - 90, behavior: 'auto' }), heroY);
  await page.waitForTimeout(1500);
  await page.mouse.wheel(0, 120);
  await page.waitForTimeout(400);
  const cancelPos = await page.evaluate(() => window.scrollY);
  await page.waitForTimeout(2500);
  const cancelAfter = await page.evaluate(() => window.scrollY);
  console.log(`SNAP cancel: mid=${cancelPos} after=${cancelAfter} hero=${heroY}`);
  await ctx.close();
}
// Reduced motion: stills render?
{
  const ctx = await browser.newContext({ viewport: { width: 1512, height: 860 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(12000);
  const stills = await page.evaluate(() => ({
    n: document.querySelectorAll('.v1-still').length,
    imgs: [...document.querySelectorAll('.v1-still img')].map((i) => i.currentSrc.slice(-24)),
    canvas: !!document.querySelector('.v1-film__canvas'),
  }));
  console.log('RM:', JSON.stringify(stills));
  await page.screenshot({ path: '/tmp/v3-qa-shots/qa-rm-1512.png' });
  await ctx.close();
}
await browser.close();
console.log('SNAPRM DONE');
