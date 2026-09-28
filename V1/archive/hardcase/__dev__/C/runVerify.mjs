// Lane C round-2 verify runner (node, NOT bundled — invoked manually).
// Loads the dev harness with ?verify=1, captures the LANEC-VERIFY console
// payload, and saves docs/phase4/qa/C/round2-verify.json.
// Usage: LANEC_PORT=5117 node src/__dev__/C/runVerify.mjs
import { chromium } from 'playwright-core'
import { mkdirSync, writeFileSync } from 'node:fs'

const PORT = process.env.LANEC_PORT ?? '5117'
const URL = `http://localhost:${PORT}/dev-C.html?verify=1&ui=0`

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
let result = null
page.on('console', (msg) => {
  const t = msg.text()
  if (t.startsWith('LANEC-VERIFY ')) {
    try {
      result = JSON.parse(t.slice('LANEC-VERIFY '.length))
    } catch (err) {
      console.error('unparsable LANEC-VERIFY payload', err)
    }
  }
  if (t.startsWith('LANEC-VERIFY-ERROR')) console.error(t)
})
page.on('pageerror', (err) => console.error('pageerror', err))
await page.goto(URL, { waitUntil: 'networkidle' })
const deadline = Date.now() + 240000
while (!result && Date.now() < deadline) await page.waitForTimeout(2000)
await browser.close()

if (!result) {
  console.error('VERIFY: no LANEC-VERIFY payload captured')
  process.exit(1)
}
mkdirSync('docs/phase4/qa/C', { recursive: true })
writeFileSync('docs/phase4/qa/C/round2-verify.json', JSON.stringify(result, null, 2) + '\n')
console.log(
  `VERIFY ${result.ok ? 'PASS' : 'FAIL'} attach=${result.attachR.spreadMm.toFixed(3)}/${result.attachL.spreadMm.toFixed(3)}mm ` +
    `arms=${result.armR.spreadMm.toFixed(3)}/${result.armL.spreadMm.toFixed(3)}mm ` +
    `clearViol=${result.clearance.violations} minClear=${result.clearance.minClearanceMm.toFixed(1)}mm ` +
    `faceDot=${result.facing.worstDot.toFixed(4)}`,
)
process.exit(result.ok ? 0 : 2)
