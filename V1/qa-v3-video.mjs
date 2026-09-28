import { chromium } from 'playwright';
const BASE = 'http://localhost:5505/v1.html';
const OUT = '/tmp/v3-qa-shots';
const V = (process.env.QAV || '1512,1920,1024,390').split(',');
const MAP = { 1512: [1512, 860], 1920: [1920, 1080], 1024: [1024, 768], 390: [390, 844] };
const browser = await chromium.launch();
for (const tag of V) {
  const [w, h] = MAP[tag];
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, recordVideo: { dir: `${OUT}/vid-${tag}`, size: { width: w, height: h } } });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  try { await page.waitForSelector('.v1-film__stage.is-intro', { timeout: 110000 }); } catch {}
  const total = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
  const steps = 50;
  for (let i = 0; i <= steps; i++) {
    await page.evaluate(([t, ii, ss]) => window.scrollTo({ top: (t * ii) / ss, behavior: 'auto' }), [total, i, steps]);
    await page.waitForTimeout(500); // 50 x 500ms = ~25s scroll
  }
  await page.waitForTimeout(1000);
  await ctx.close();
  console.log(`VIDEO ${tag} done total=${total}`);
}
await browser.close();
