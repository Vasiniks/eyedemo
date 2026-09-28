// V3-SCROLL verification: curve uniformity table + snap keys + Lenis config
// + screenshots at 4 viewports. Run: node docs/phase4/qa/v3/scroll-verify.mjs
// Needs vite on :5502.
import { chromium } from '@playwright/test';
import fs from 'node:fs';

const BASE = 'http://localhost:5502/v1.html';
const OUT = 'docs/phase4/qa/v3';
const results = { beats: null, keys: null, lenisSrc: null, shots: [] };

const page0 = await (async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1512, height: 860 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text().slice(0, 160)); });
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  // Film math needs no frames; wait briefly for app boot (Lenis + snap wire).
  await page.waitForTimeout(4000);

  // 1. Curve table from the SHIPPED module (vite transforms TS on the fly).
  results.beats = await page.evaluate(() => (async () => {
    const fc = await import('/src/v1/filmCurve.ts');
    const space = fc.resolveFilmSpace(fc.V2_FILM_MANIFEST);
    const segs = fc.buildSegments(space);
    const sec = document.querySelector('.v1-film');
    const dist = sec ? sec.offsetHeight - window.innerHeight : 0;
    const rows = segs.map((s) => {
      const dSrc = fc.filmToSource(s.film1, space) - fc.filmToSource(s.film0, space);
      const px = (s.scroll1 - s.scroll0) * dist;
      const per100 = px > 0 ? (dSrc / px) * 100 : 0;
      return { beat: s.name, dSrc: +dSrc.toFixed(1), px: Math.round(px), per100: +per100.toFixed(2), ease: s.ease };
    });
    return { vw: window.innerWidth, vh: window.innerHeight, dist, rows };
  })());

  // 2. Snap keys + capture windows (scroll fractions + px at this viewport).
  results.keys = await page.evaluate(() => (async () => {
    const fc = await import('/src/v1/filmCurve.ts');
    const keys = fc.snapKeyScrolls();
    const sec = document.querySelector('.v1-film');
    const top = sec ? sec.offsetTop : 0;
    const dist = sec ? sec.offsetHeight - window.innerHeight : 0;
    return {
      keys: keys.map((k, i) => ({
        src: fc.SNAP_SOURCE_KEYS[i],
        frac: +k.toFixed(4),
        y: Math.round(top + k * dist),
        winFrac: +fc.snapCaptureWindow(i).toFixed(4),
        winPx: Math.round(fc.snapCaptureWindow(i) * dist),
      })),
    };
  })());

  // 3. Lenis config straight from the served source.
  results.lenisSrc = await page.evaluate(async () => {
    const t = await (await fetch('/src/v1/lenis.ts')).text();
    const grab = (re) => (t.match(re) || [])[1] ?? 'MISSING';
    return {
      lerp: grab(/lerp:\s*([0-9.]+)/),
      wheelMultiplier: grab(/wheelMultiplier:\s*([0-9.]+)/),
      touchMultiplier: grab(/touchMultiplier:\s*([0-9.]+)/),
      syncTouch: grab(/syncTouch:\s*(true|false)/),
      hasDuration: /duration\s*:/.test(t),
    };
  });
  results.errors = errors;

  // 4. Park at the hero key and screenshot (snap should hold it).
  const heroY = results.keys.keys.find((k) => k.src === 215).y;
  await page.evaluate((y) => window.scrollTo(0, y), heroY);
  await page.waitForTimeout(2500);
  results.settledY = await page.evaluate(() => window.scrollY);
  await page.screenshot({ path: `${OUT}/scroll-hero-1512.png` });
  results.shots.push('scroll-hero-1512.png');
  await browser.close();
})();

// 5. Remaining viewports: boot, park at hero key, screenshot.
for (const [w, h, tag] of [[1920, 1080, '1920'], [1024, 768, '1024'], [390, 844, '390']]) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3500);
  const y = await page.evaluate(() => (async () => {
    const fc = await import('/src/v1/filmCurve.ts');
    const keys = fc.snapKeyScrolls();
    const sec = document.querySelector('.v1-film');
    const top = sec ? sec.offsetTop : 0;
    const dist = sec ? sec.offsetHeight - window.innerHeight : 0;
    return { y: Math.round(top + keys[3] * dist), dist, vh: window.innerHeight };
  })());
  await page.evaluate((yy) => window.scrollTo(0, yy), y.y);
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `${OUT}/scroll-hero-${tag}.png` });
  results.shots.push(`scroll-hero-${tag}.png (filmDist=${y.dist}px ≈ ${(y.dist / y.vh).toFixed(1)} screens)`);
  await browser.close();
}

fs.writeFileSync(`${OUT}/scroll-metrics.json`, JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
