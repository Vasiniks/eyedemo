// V2-FILM QA — screenshots at each key source frame + scroll video.
// Usage: node scripts/frames/qa-film.mjs
// Assumes dev server on :5401. Viewport 1512x860 (+390x844 stills).
import { chromium } from '@playwright/test';

const BASE = 'http://localhost:5401/v1.html';
const OUT = 'docs/phase4/qa/v2';
// Key snap targets (source frames) -> film progress (s-1)/614.
const KEYS = [1, 70, 145, 215, 280, 368, 440, 500, 600];
const filmP = (s) => (s - 1) / 614;

async function scrollFilmTo(page, p) {
  await page.evaluate((pp) => {
    const sec = document.querySelector('.v1-film');
    const top = sec.offsetTop;
    const range = sec.offsetHeight - window.innerHeight;
    window.scrollTo(0, top + pp * range);
  }, p);
}

async function filmProgress(page) {
  return page.evaluate(() => {
    const fill = document.querySelector('.v1-progress__fill');
    const m = /scaleY\(([\d.]+)\)/.exec(fill?.style.transform || '');
    return m ? parseFloat(m[1]) : -1;
  });
}

// Seek until the eased film progress (rail) matches the target film
// fraction — inverts the scroll→film punch curve by bisection.
async function seekFilm(page, target) {
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 10; i++) {
    const mid = (lo + hi) / 2;
    await scrollFilmTo(page, mid);
    await page.waitForTimeout(2400);
    const p = await filmProgress(page);
    if (p < 0) break;
    if (Math.abs(p - target) < 0.004) {
      lo = mid;
      hi = mid;
      break;
    }
    if (p < target) lo = mid;
    else hi = mid;
  }
  await scrollFilmTo(page, (lo + hi) / 2);
  await page.waitForTimeout(3000); // priority fill + scrub settle
  return filmProgress(page);
}

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1512, height: 860 } });
  page.on('console', (m) => {
    if (m.type() === 'error') console.log('[console.error]', m.text().slice(0, 200));
  });
  page.on('pageerror', (e) => console.log('[pageerror]', String(e).slice(0, 200)));
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.v1-preloader.is-done', { timeout: 180000 });
  console.log('preloader done');
  await page.waitForTimeout(1500);

  for (const s of KEYS) {
    const p = await seekFilm(page, filmP(s));
    await page.screenshot({ path: `${OUT}/film-key-${String(s).padStart(3, '0')}.png` });
    console.log(`key s=${s} filmP~${p.toFixed(4)} (target ${filmP(s).toFixed(4)}) shot`);
  }

  // Mobile stills: hero + end card.
  const mob = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mob.goto(BASE, { waitUntil: 'domcontentloaded' });
  await mob.waitForSelector('.v1-preloader.is-done', { timeout: 180000 });
  for (const s of [215, 600]) {
    const p = await seekFilm(mob, filmP(s));
    await mob.screenshot({ path: `${OUT}/film-key-${String(s).padStart(3, '0')}-390.png` });
    console.log(`mobile s=${s} filmP~${p.toFixed(4)} shot`);
  }
  await mob.close();

  // 15 s scroll video with pauses between keys.
  const vctx = await browser.newContext({
    viewport: { width: 1512, height: 860 },
    recordVideo: { dir: `${OUT}`, size: { width: 1512, height: 860 } },
  });
  const vpage = await vctx.newPage();
  await vpage.goto(BASE, { waitUntil: 'domcontentloaded' });
  await vpage.waitForSelector('.v1-preloader.is-done', { timeout: 180000 });
  const t0 = Date.now();
  for (const s of KEYS) {
    await scrollFilmTo(vpage, filmP(s));
    await vpage.waitForTimeout(1400);
    if (Date.now() - t0 > 60000) break;
  }
  await vctx.close();
  console.log('video done');
} finally {
  await browser.close();
}
console.log('QA complete');
