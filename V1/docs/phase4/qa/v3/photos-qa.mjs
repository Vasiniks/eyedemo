import { chromium } from '@playwright/test';
// F5-PHOTOS QA: screenshots per rest-of-homepage section + CLS + img audit.
const SECTIONS = [
  ['about', '.eyeq-photo--about'],
  ['services', '.eyeq-photo--services'],
  ['lenses-wide', '.eyeq-photo--lenses-wide'],
  ['lenses-tech', '.eyeq-photo--lenses-offset'],
];
for (const [label, W] of [['1512', 1512], ['390', 390]]) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: W, height: 860 } });
  await page.goto('http://localhost:5708/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => new Promise((r) => {
    window.__cls = 0;
    new PerformanceObserver((l) => l.getEntries().forEach((e) => {
      if (!e.hadRecentInput) window.__cls += e.value;
    })).observe({ type: 'layout-shift', buffered: true });
    setTimeout(r, 100);
  }));
  await page.waitForTimeout(2500);
  const audit = await page.evaluate(() => [...document.querySelectorAll('.eyeq-photo img')].map((img) => ({
    alt: img.alt, w: img.getAttribute('width'), h: img.getAttribute('height'),
    loading: img.loading, decoding: img.decoding, srcset: (img.srcset || '').split(',').length,
  })));
  console.log(label, 'AUDIT', JSON.stringify(audit));
  for (const [name, sel] of SECTIONS) {
    await page.evaluate((s) => document.querySelector(s)?.scrollIntoView({ block: 'center' }), sel);
    await page.waitForTimeout(1400);
    await page.screenshot({ path: `docs/phase4/qa/v3/photos-${name}-${label}.png` });
  }
  // Full scroll-through for CLS, then read the accumulator.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise((r) => setTimeout(r, 1200));
  });
  const cls = await page.evaluate(() => window.__cls);
  console.log(label, 'CLS', cls);
  await browser.close();
}
