// Lane C round-2 screenshot sheet (node, NOT bundled — invoked manually).
// Fixed 3/4 camera + side camera at q = 0,0.2,0.3,0.4,0.5,0.6,0.8,1.0
// → docs/phase4/qa/C/round2-*.png
// Usage: LANEC_PORT=5117 node src/__dev__/C/capture.mjs
import { chromium } from 'playwright-core'
import { mkdirSync } from 'node:fs'

const PORT = process.env.LANEC_PORT ?? '5117'
const QS = [0, 0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1.0]
const CAMS = [
  ['34', ''],
  ['side', '&side=1'],
]

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
page.on('pageerror', (err) => console.error('pageerror', err))
mkdirSync('docs/phase4/qa/C', { recursive: true })
for (const [cam, extra] of CAMS) {
  for (const q of QS) {
    const url = `http://localhost:${PORT}/dev-C.html?q=${q}&mode=both&ui=0${extra}`
    await page.goto(url, { waitUntil: 'networkidle' })
    // raw case.glb is 9.6MB — allow load + 3 frames of settle
    await page.waitForTimeout(7000)
    const out = `docs/phase4/qa/C/round2-${cam}-q${q}.png`
    await page.screenshot({ path: out })
    console.log('saved', out)
  }
}
await browser.close()
