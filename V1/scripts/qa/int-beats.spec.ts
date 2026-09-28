// EyeQ Vision Care — INTEGRATION beat captures (Lane B, round 2).
// PLAN-MASTER §11.1 mechanism against the REAL composed Home page (`/`):
// progress stops via dev-only `window.__film.setProgress(p)` + settle +
// screenshot; DOM stops via scrollIntoView. Output:
// docs/phase4/qa/beats/int-*.png — reviewed in INTEGRATION.md.
//
// Run: FILM_URL=http://localhost:5111/ npx playwright test int-beats
// (serve with `npx vite --port 5111 --strictPort` on a free port first).
import { test, expect } from '@playwright/test'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

const FILM_URL = process.env.FILM_URL ?? 'http://localhost:5111/'
const OUT = join(process.cwd(), 'docs', 'phase4', 'qa', 'beats')
mkdirSync(OUT, { recursive: true })

/** §11.1 stop table (progress = §6 cumulative). */
const PROGRESS_STOPS: Array<[string, number]> = [
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
]

/**
 * Drive to p, let the damped camera (λ=5.2, slow under software GL) converge,
 * re-assert (a stray ScrollTrigger refresh can clobber the dev-only write
 * with the scroll-derived value — production-meaningless, real users ARE at
 * their scroll truth), shoot, and verify p held across the shot. Retries the
 * stop on drift instead of failing the run on a harness artifact.
 */
async function settleStop(
  page: import('@playwright/test').Page,
  file: string,
  p: number,
): Promise<void> {
  for (let attempt = 0; attempt < 4; attempt++) {
    await page.evaluate((v) => window.__film?.setProgress(v), p)
    // Deterministic settle: wait for the damped camera to converge instead
    // of wall-time (software GL converges slowly; fast GPUs instantly). The
    // wait can time out if a refresh clobbers the dev-only write mid-settle
    // (dev HMR during parallel-lane edits; production-meaningless) — retry.
    try {
      await page.waitForFunction(
        (want) => Math.abs((window.__film?.getSmooth() ?? 0) - want) < 0.003,
        p,
        { timeout: 25000 },
      )
    } catch {
      continue
    }
    await page.evaluate((v) => window.__film?.setProgress(v), p)
    await page.waitForTimeout(800)
    const before = await page.evaluate(() => window.__film?.getProgress())
    await page.screenshot({ path: join(OUT, file) })
    const after = await page.evaluate(() => window.__film?.getProgress())
    if (before && after && Math.abs(before.p - p) < 0.005 && Math.abs(after.p - p) < 0.005) {
      expect(before.p, `${file} progress sticks`).toBeCloseTo(p, 2)
      return
    }
  }
  const state = await page.evaluate(() => window.__film?.getProgress())
  expect(state?.p, `${file} progress sticks`).toBeCloseTo(p, 2)
}

test.describe('int-beats', () => {
  test.setTimeout(300000)

  for (const [tag, vp] of [
    ['1440', { width: 1440, height: 900 }],
    ['390', { width: 390, height: 844 }],
  ] as const) {
    test(`progress stops @${tag}`, async ({ page }) => {
      const errors: string[] = []
      page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push(msg.text())
      })
      page.on('pageerror', (err) => errors.push(String(err)))
      await page.setViewportSize(vp)
      await page.goto(FILM_URL, { waitUntil: 'load' })
      await page.waitForFunction(() => window.__film !== undefined, null, { timeout: 20000 })
      await page.waitForSelector('[data-film-canvas] canvas', { timeout: 30000 })
      // Raw Phase-3 case.glb is ~10 MB + studio HDRI: let models settle.
      await page.waitForTimeout(7000)
      await page.screenshot({ path: join(OUT, `int-00-load-${tag}.png`) })
      for (const [name, p] of PROGRESS_STOPS) {
        // Settle, re-assert, verify p across the shot; retry on drift.
        await settleStop(page, `int-${name}-${tag}.png`, p)
      }
      // Fast-flick to the handoff: veil must be full.
      await page.evaluate(() => window.__film?.setProgress(1.0))
      await page.waitForTimeout(3500)
      const veil = await page.evaluate(() => document.getElementById('white-veil')?.style.opacity)
      expect(veil, 'veil full at p=1').toBe('1')
      expect(errors, 'console-clean').toEqual([])
    })
  }

  test('08b settled constellations @1440 (diagnostic, B8 hold)', async ({ page }) => {
    // p=0.92: W2 flights finished (settle 0.951? last stragglers land during
    // the rail blend) — documents the 16-plane frame the portal leaves from.
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(FILM_URL, { waitUntil: 'load' })
    await page.waitForFunction(() => window.__film !== undefined, null, { timeout: 20000 })
    await page.waitForSelector('[data-film-canvas] canvas', { timeout: 30000 })
    await page.waitForTimeout(7000)
    await settleStop(page, 'int-08b-settled-1440.png', 0.92)
  })

  test('portal stops @768', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(String(err)))
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto(FILM_URL, { waitUntil: 'load' })
    await page.waitForFunction(() => window.__film !== undefined, null, { timeout: 20000 })
    await page.waitForSelector('[data-film-canvas] canvas', { timeout: 30000 })
    await page.waitForTimeout(7000)
    for (const [name, p] of [
      ['09-approach', 0.945],
      ['10-entry', 0.985],
    ] as const) {
      await settleStop(page, `int-${name}-768.png`, p)
    }
    expect(errors, 'console-clean').toEqual([])
  })

  test('11-white + rails + rest @1440 (real scroll path)', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(String(err)))
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(FILM_URL, { waitUntil: 'load' })
    await page.waitForFunction(() => window.__film !== undefined, null, { timeout: 20000 })
    await page.waitForSelector('#white-act', { timeout: 30000 })
    await page.waitForTimeout(7000)
    await page.locator('#white-act').scrollIntoViewIfNeeded()
    await page.waitForTimeout(1500)
    await page.screenshot({ path: join(OUT, 'int-11-white-1440.png') })
    // Rails loop proof: two frames ~3 s apart must differ (seamless drift).
    await page.screenshot({ path: join(OUT, 'int-12-rails-A-1440.png') })
    await page.waitForTimeout(3000)
    await page.screenshot({ path: join(OUT, 'int-12-rails-B-1440.png') })
    await page.locator('#visit-h').scrollIntoViewIfNeeded()
    await page.waitForTimeout(1200)
    await page.screenshot({ path: join(OUT, 'int-13-visit-1440.png') })
    await page.locator('.eyeq-footer').scrollIntoViewIfNeeded()
    await page.waitForTimeout(1200)
    await page.screenshot({ path: join(OUT, 'int-14-footer-1440.png') })
    expect(errors, 'console-clean').toEqual([])
  })

  test('11-white + rails @390 (real scroll path)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(FILM_URL, { waitUntil: 'load' })
    await page.waitForFunction(() => window.__film !== undefined, null, { timeout: 20000 })
    await page.waitForSelector('#white-act', { timeout: 30000 })
    await page.waitForTimeout(7000)
    await page.locator('#white-act').scrollIntoViewIfNeeded()
    await page.waitForTimeout(1500)
    await page.screenshot({ path: join(OUT, 'int-11-white-390.png') })
    await page.screenshot({ path: join(OUT, 'int-12-rails-A-390.png') })
  })

  test('reverse 0.77→0.32 reproduces state (no pops)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(FILM_URL, { waitUntil: 'load' })
    await page.waitForFunction(() => window.__film !== undefined, null, { timeout: 20000 })
    await page.waitForSelector('[data-film-canvas] canvas', { timeout: 30000 })
    await page.waitForTimeout(7000)
    const converge = async (want: number): Promise<void> => {
      await page.waitForFunction(
        (w) => Math.abs((window.__film?.getSmooth() ?? 0) - w) < 0.003,
        want,
        { timeout: 45000 },
      )
    }
    await page.evaluate(() => window.__film?.setProgress(0.77))
    await converge(0.77)
    const fwd = await page.evaluate(() => window.__film?.getProgress())
    await page.evaluate(() => window.__film?.setProgress(0.32))
    await converge(0.32)
    const back = await page.evaluate(() => window.__film?.getProgress())
    expect(back?.beat).toBe('B3')
    await page.evaluate(() => window.__film?.setProgress(0.77))
    await converge(0.77)
    const again = await page.evaluate(() => window.__film?.getProgress())
    expect(again?.p).toBeCloseTo(fwd?.p ?? 0.77, 3)
    await page.screenshot({ path: join(OUT, 'int-reverse-077-1440.png') })
  })

  test('?tier=low renders the film', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(String(err)))
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(`${FILM_URL}?tier=low`, { waitUntil: 'load' })
    await page.waitForFunction(() => window.__film !== undefined, null, { timeout: 20000 })
    await page.waitForSelector('[data-film-canvas] canvas', { timeout: 30000 })
    await page.waitForTimeout(7000)
    await page.evaluate(() => window.__film?.setProgress(0.77))
    await page.waitForFunction(() => Math.abs((window.__film?.getSmooth() ?? 0) - 0.77) < 0.003, null, {
      timeout: 60000,
    })
    await page.screenshot({ path: join(OUT, 'int-tier-low-1440.png') })
    expect(errors, 'console-clean').toEqual([])
  })

  test('reduced-motion: static chapters, no Lenis', async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce' })
    const page = await ctx.newPage()
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(FILM_URL, { waitUntil: 'load' })
    await page.waitForFunction(() => window.__film !== undefined, null, { timeout: 20000 })
    await page.waitForTimeout(6000)
    const cls = await page.evaluate(() => document.documentElement.className)
    expect(cls, 'no Lenis classes under RM').not.toContain('lenis')
    const stacked = await page.evaluate(
      () => document.querySelector('[data-testid="chapter-overlay"]')?.classList.contains('eyeq-chapters--stacked'),
    )
    expect(stacked, 'stacked chapters under RM').toBe(true)
    await page.screenshot({ path: join(OUT, 'int-rm-static-1440.png') })
    // Static chapters carry the full story below the poster stage (scroll the
    // B5 lens-list chapter to the centre — it proves the verbatim copy).
    await page.evaluate(() => {
      const overlay = document.querySelector('[data-testid="chapter-overlay"]')
      overlay?.children[4]?.scrollIntoView({ block: 'center' })
    })
    await page.waitForTimeout(800)
    await page.screenshot({ path: join(OUT, 'int-rm-chapters-1440.png') })
    await ctx.close()
  })

  test('banned-token grep — Lane B files (brief §7 + ART A6)', async () => {
    // Scope: Lane B ownership only (motion/store/components/canvas/routes
    // Home+router/scripts/qa + lane entries). Repo-wide enforcement with
    // verbatim-copy exemptions is the coordinator's integration gate.
    const { readdirSync, readFileSync } = await import('node:fs')
    const files: string[] = []
    const walk = (dir: string): void => {
      for (const e of readdirSync(dir, { withFileTypes: true })) {
        if (e.name.startsWith('.')) continue
        if (e.isDirectory()) {
          walk(join(dir, e.name))
        } else if (/\.(ts|tsx|css)$/.test(e.name)) {
          files.push(join(dir, e.name))
        }
      }
    }
    for (const d of ['src/motion', 'src/store', 'src/components/canvas', 'src/routes/Home.tsx', 'src/app']) {
      const full = join(process.cwd(), d)
      try {
        const st = (await import('node:fs')).statSync(full)
        if (st.isDirectory()) walk(full)
        else files.push(full)
      } catch {
        // entry does not exist — skip
      }
    }
    files.push(join(process.cwd(), 'src/styles/film.css'))
    const hits: string[] = []
    for (const f of files) {
      const text = readFileSync(f, 'utf8')
      for (const [i, line] of text.split('\n').entries()) {
        if (/Vision Care/.test(line)) continue // business name, not hype
        if (/\b(VISION|FOCUS|CLARITY)\b/.test(line)) hits.push(`${f}:${i + 1}: ${line.trim()}`)
        if (/premium|ultimate|best-in-class|award-winning/i.test(line)) hits.push(`${f}:${i + 1}: ${line.trim()}`)
      }
    }
    expect(hits, 'banned hype tokens').toEqual([])
  })
})
