// Lane A one-off acceptance capture (NOT Lane B's scripts/qa harness).
// Screenshots docs/phase4/qa/A/tokens-1440.png + tokens-390.png.
import { chromium } from '@playwright/test';

const shots = [
  { file: 'tokens-1440.png', width: 1440, height: 900 },
  { file: 'tokens-390.png', width: 390, height: 844 },
];

const browser = await chromium.launch();
for (const s of shots) {
  const page = await browser.newPage({ viewport: { width: s.width, height: s.height } });
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto('http://localhost:5117/qa/tokens', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `docs/phase4/qa/A/${s.file}`, fullPage: true });
  console.log(s.file, 'console-errors:', errors.length ? errors : 'none');
  await page.close();
}
await browser.close();
