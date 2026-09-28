// Lane B box stand-in captures (step 4 acceptance).
// 12 QA stops (§11.1) × 1440×900 + 390×844 → docs/phase4/qa/B/*-boxes-*.png
// Run: dev server on :5102, then `node docs/phase4/qa/B/capture-boxes.mjs`.
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const OUT = join(ROOT, 'qa', 'B')
mkdirSync(OUT, { recursive: true })

const STOPS = [
  ['01-case', 0.05],
  ['02-open', 0.17],
  ['03-velvet', 0.24],
  ['04-emerge', 0.32],
  ['05-unfold', 0.47],
  ['06-info', 0.62],
  ['07-wave1', 0.77],
  ['08-wave2', 0.885],
  ['09-approach', 0.945],
  ['10-entry', 0.985],
  ['11-white', 1.0],
]

const VIEWPORTS = [
  ['1440', { width: 1440, height: 900 }],
  ['390', { width: 390, height: 844 }],
]

const browser = await chromium.launch()
let failures = 0
for (const [tag, vp] of VIEWPORTS) {
  const page = await browser.newPage({ viewport: vp })
  const errors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', (err) => errors.push(String(err)))
  await page.goto('http://localhost:5102/dev-b.html', { waitUntil: 'load' })
  await page.waitForFunction(() => window.__film !== undefined, null, { timeout: 20000 })
  await page.waitForTimeout(1500)
  for (const [name, p] of STOPS) {
    await page.evaluate((v) => window.__film.setProgress(v), p)
    await page.waitForTimeout(700)
    const state = await page.evaluate(() => window.__film.getProgress())
    await page.screenshot({ path: join(OUT, `${name}-boxes-${tag}.png`) })
    console.log(`${name}-boxes-${tag}.png p=${state.p.toFixed(3)} beat=${state.beat} console-errors: ${errors.length ? errors.join(' | ') : 'none'}`)
    if (errors.length) failures += errors.length
  }
  await page.close()
}
await browser.close()
if (failures) {
  console.error(`CONSOLE ERRORS: ${failures}`)
  process.exit(1)
}
console.log('capture-boxes: clean')
