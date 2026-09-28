// Lane D screenshot harness — stage + sponsor waves (steps 7/8 acceptance).
// Serves the isolated dev-D.html (Vite must run on :5104) and captures the
// QA stops into docs/phase4/qa/D/. Usage:
//   npx vite --port 5104 --strictPort &
//   node docs/phase4/qa/D/capture-D.mjs
// Fails non-zero on console errors or missing WebGL.
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { chromium } from '@playwright/test'

const BASE = 'http://localhost:5104/dev-D.html'
const OUT = `${dirname(fileURLToPath(import.meta.url))}/`

// Round-2 stops (prefix r2-). Miu Miu (W1 i=3: start 0.733, flight 0.060)
// is the tracked mark for the 4-frame flight sequence (visible small-to-far
// in every early frame); Canada Life (W2 i=4: start 0.882, flight 0.045)
// for the W2 flight frame. [name, query] — ui=0 hides the harness panel for
// clean QA frames; standin=1 keeps the hero reference.
const STOPS = [
  ['r2-01-stage-1440', '?p=0.05&waves=w1&standin=1&ui=0'],
  ['r2-03-sweep-1440', '?p=0.3&waves=w1&standin=1&ui=0'],
  ['r2-w1-seq-tiny-1440', '?p=0.741&waves=1&standin=1&ui=0'],
  ['r2-w1-seq-rush-1440', '?p=0.745&waves=1&standin=1&ui=0'],
  ['r2-w1-seq-decel-1440', '?p=0.752&waves=1&standin=1&ui=0'],
  ['r2-w1-seq-settled-1440', '?p=0.8&waves=1&standin=1&ui=0'],
  ['r2-w1-seq-solo-tiny-1440', '?p=0.741&waves=1&standin=0&ui=0&solo=3'],
  ['r2-w1-seq-solo-rush-1440', '?p=0.745&waves=1&standin=0&ui=0&solo=3'],
  ['r2-w1-seq-solo-decel-1440', '?p=0.752&waves=1&standin=0&ui=0&solo=3'],
  ['r2-w1-seq-solo-settled-1440', '?p=0.8&waves=1&standin=0&ui=0&solo=3'],
  ['r2-w1-settled-1440', '?p=0.85&waves=1&standin=1&ui=0'],
  ['r2-w1-settled-390', '?p=0.85&waves=1&standin=1&ui=0'],
  ['r2-w2-flight-1440', '?p=0.886&waves=2&standin=1&ui=0'],
  ['r2-w2-settled-1440', '?p=0.96&waves=both&standin=1&ui=0'],
  ['r2-w2-settled-390', '?p=0.96&waves=both&standin=1&ui=0'],
  ['r2-both-1440', '?p=0.905&waves=both&standin=1&ui=0'],
  ['r2-both-390', '?p=0.905&waves=both&standin=1&ui=0'],
]

const VIEWPORTS = {
  '-1440': { width: 1440, height: 900 },
  '-390': { width: 390, height: 844 },
}

let failures = 0
const browser = await chromium.launch({
  args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'],
})

// Round 2b: one retry per stop. Vite HMR can re-execute the harness module
// while a page sits in its settle wait (double-createRoot console error) if
// files were saved shortly before the run — the retry loads a settled build.
async function captureOnce(name, query) {
  const suffix = name.endsWith('-1440') ? '-1440' : '-390'
  const viewport = VIEWPORTS[suffix]
  const page = await browser.newPage({ viewport })
  const errors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', (err) => errors.push(String(err)))
  await page.goto(`${BASE}${query}`, { waitUntil: 'networkidle' })
  // Atlas JSON + HDR + first frames.
  await page.waitForTimeout(3500)
  const webgl = await page.evaluate(() => {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  })
  if (!webgl) errors.push('WebGL unavailable')
  await page.screenshot({ path: join(OUT, `${name}.png`) })
  await page.close()
  return errors
}

for (const [name, query] of STOPS) {
  let errors = await captureOnce(name, query)
  if (errors.length > 0) {
    console.log(`${name}: retrying after first-pass errors`)
    await new Promise((r) => setTimeout(r, 4000))
    errors = await captureOnce(name, query)
  }
  if (errors.length > 0) {
    console.error(`${name}: console errors:\n  ${errors.join('\n  ')}`)
    failures++
  } else {
    console.log(`${name}: ok`)
  }
}
await browser.close()
if (failures > 0) {
  console.error(`capture-D: ${failures} failure(s)`)
  process.exit(1)
}
console.log('capture-D: all stops captured, console-clean')
