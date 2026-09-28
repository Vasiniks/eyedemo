// V3-SCROLL video: ~20 s scroll (trackpad-like wheel deltas, then a touch
// fling via CDP) with scrollY sampling to prove no snap fires during
// momentum. Run: node docs/phase4/qa/v3/scroll-video.mjs (vite :5502).
import { chromium } from '@playwright/test';
import fs from 'node:fs';

const BASE = 'http://localhost:5502/v1.html';
const OUT = 'docs/phase4/qa/v3';

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1512, height: 860 },
  recordVideo: { dir: OUT, size: { width: 1512, height: 860 } },
});
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
await page.goto(BASE, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(4000);

const samples = [];
const sample = async (tag) => samples.push({ t: Date.now(), tag, y: await page.evaluate(() => window.scrollY) });

// Phase 1 (~12 s): trackpad-like wheel — small deltas, both directions.
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(800);
await sample('start');
for (let i = 0; i < 48; i++) {
  await page.mouse.wheel(0, 55);
  if (i % 4 === 0) await sample(`wheel-${i}`);
  await page.waitForTimeout(220);
}
await sample('wheel-end');
await page.waitForTimeout(1500);
await sample('wheel-settled');

// Phase 2: touch fling via CDP gesture, then dense sampling of the glide.
const cdp = await ctx.newCDPSession(page);
await sample('pre-fling');
await cdp.send('Input.synthesizeScrollGesture', {
  x: 756, y: 600, yDistance: -1400, speed: 1800,
  gestureSourceType: 'touch',
});
for (let i = 0; i < 14; i++) {
  await page.waitForTimeout(100);
  await sample(`fling+${(i + 1) * 100}ms`);
}
await page.waitForTimeout(2500);
await sample('fling-settled');

const t0 = samples[0].t;
const log = samples.map((s) => ({ dt: +((s.t - t0) / 1000).toFixed(1), tag: s.tag, y: Math.round(s.y) }));
// Monotonicity check over the fling glide (first 900 ms): no snap reversal.
const glide = log.filter((s) => s.tag.startsWith('fling+')).slice(0, 9).map((s) => s.y);
let reversals = 0;
for (let i = 1; i < glide.length; i++) if (glide[i] < glide[i - 1] - 2) reversals++;
const out = { errors, reversalsInFlingGlide: reversals, log };
fs.writeFileSync(`${OUT}/scroll-video-log.json`, JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));

await ctx.close();
await browser.close();
// Playwright names the file <uuid>.webm — rename to a stable name.
for (const f of fs.readdirSync(OUT)) {
  if (f.endsWith('.webm') && !f.startsWith('scroll-')) {
    fs.renameSync(`${OUT}/${f}`, `${OUT}/scroll-video.webm`);
    console.log('video -> scroll-video.webm');
  }
}
