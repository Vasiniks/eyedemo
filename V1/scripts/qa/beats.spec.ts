// EyeQ Vision Care — beat-capture QA harness (Lane B, step 14).
// PLAN-MASTER §11.1: 12 progress stops × 1440/390 (+768 for portal),
// progress stops via window.__film.setProgress(p) + 600ms settle, DOM stops
// via scrollIntoView. Output: docs/phase4/qa/beats/ — the review contract.
//
// Target: FILM_URL (default http://localhost:5102/dev-b.html — the Lane B
// isolated harness). At integration this retargets to the real Home URL (/);
// the mechanism is unchanged (same __film hook, same stop table).
import { test, expect } from '@playwright/test'
import { mkdirSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const FILM_URL = process.env.FILM_URL ?? 'http://localhost:5102/dev-b.html'
const OUT = join(process.cwd(), 'docs', 'phase4', 'qa', 'beats')
mkdirSync(OUT, { recursive: true })

/** §11.1 stop table (progress = §6 cumulative; null = DOM-driven stop). */
const STOPS: Array<[string, number | null]> = [
  ['00-preloader', null],
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
  ['11-white', null],
  ['12-rails', null],
]

const PROGRESS_STOPS = STOPS.filter((s): s is [string, number] => s[1] !== null)

test.describe('beats', () => {
  test.setTimeout(240000)

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
      await page.waitForTimeout(1200)
      for (const [name, p] of PROGRESS_STOPS) {
        await page.evaluate((v) => window.__film?.setProgress(v), p)
        await page.waitForTimeout(600)
        const state = await page.evaluate(() => window.__film?.getProgress())
        expect(state?.p, `${name} progress sticks`).toBeCloseTo(p, 2)
        await page.screenshot({ path: join(OUT, `${name}-${tag}.png`) })
      }
      expect(errors, 'console-clean').toEqual([])
    })
  }

  test('portal stops @768', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(String(err)))
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto(FILM_URL, { waitUntil: 'load' })
    await page.waitForFunction(() => window.__film !== undefined, null, { timeout: 20000 })
    await page.waitForTimeout(1200)
    for (const [name, p] of [
      ['09-approach', 0.945],
      ['10-entry', 0.985],
      ['11-white-veil', 1.0],
    ] as const) {
      await page.evaluate((v) => window.__film?.setProgress(v), p)
      await page.waitForTimeout(600)
      await page.screenshot({ path: join(OUT, `${name}-768.png`) })
    }
    const veil = await page.evaluate(() => document.getElementById('white-veil')?.style.opacity)
    expect(veil, 'veil full at p=1').toBe('1')
    expect(errors, 'console-clean').toEqual([])
  })

  test('11-white DOM stop (scrollIntoView + settle)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(FILM_URL, { waitUntil: 'load' })
    await page.waitForFunction(() => window.__film !== undefined, null, { timeout: 20000 })
    await page.locator('#white-stub').scrollIntoViewIfNeeded()
    await page.waitForTimeout(800)
    await page.screenshot({ path: join(OUT, '11-white-dom-1440.png') })
  })

  test('00-preloader (deferred to step 17)', async () => {
    test.skip(true, 'preloader lands with Lane B step 17 (none in harness yet)')
  })

  test('12-rails (deferred to Lane E step 12)', async () => {
    test.skip(true, 'rails land with Lane E step 12 (none in harness yet)')
  })

  test('reverse 0.77→0.32 reproduces state (no pops)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(FILM_URL, { waitUntil: 'load' })
    await page.waitForFunction(() => window.__film !== undefined, null, { timeout: 20000 })
    await page.waitForTimeout(1000)
    await page.evaluate(() => window.__film?.setProgress(0.77))
    await page.waitForTimeout(900)
    const fwd = await page.evaluate(() => window.__film?.getProgress())
    await page.evaluate(() => window.__film?.setProgress(0.32))
    await page.waitForTimeout(900)
    const back = await page.evaluate(() => window.__film?.getProgress())
    expect(back?.beat).toBe('B3')
    await page.evaluate(() => window.__film?.setProgress(0.77))
    await page.waitForTimeout(900)
    const again = await page.evaluate(() => window.__film?.getProgress())
    expect(again?.p).toBeCloseTo(fwd?.p ?? 0.77, 3)
    await page.screenshot({ path: join(OUT, 'reverse-077-1440.png') })
  })

  test('fast-flick to 1.0 ends on full veil', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(FILM_URL, { waitUntil: 'load' })
    await page.waitForFunction(() => window.__film !== undefined, null, { timeout: 20000 })
    await page.waitForTimeout(800)
    for (const p of [0.1, 0.5, 0.9, 0.2, 1.0]) {
      await page.evaluate((v) => window.__film?.setProgress(v), p)
      await page.waitForTimeout(120)
    }
    await page.waitForTimeout(700)
    const veil = await page.evaluate(() => document.getElementById('white-veil')?.style.opacity)
    expect(veil).toBe('1')
  })

  test('reload-at-depth restores progress', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(FILM_URL, { waitUntil: 'load' })
    await page.waitForFunction(() => window.__film !== undefined, null, { timeout: 20000 })
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.7))
    await page.waitForTimeout(1200)
    const before = await page.evaluate(() => window.__film?.getProgress())
    expect(before!.p).toBeGreaterThan(0.3)
    await page.reload({ waitUntil: 'load' })
    await page.waitForFunction(() => window.__film !== undefined, null, { timeout: 20000 })
    await page.waitForTimeout(1200)
    const after = await page.evaluate(() => window.__film?.getProgress())
    // ScrollTrigger re-evaluates on load: same scroll ⇒ same state (±settle).
    expect(after!.p).toBeGreaterThan(0.3)
  })

  test('resize-mid-beat keeps state, console-clean', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(String(err)))
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(FILM_URL, { waitUntil: 'load' })
    await page.waitForFunction(() => window.__film !== undefined, null, { timeout: 20000 })
    // Scroll-driven (production path): scroll is the source of truth, so a
    // refresh re-derives the same progress. setProgress-without-scroll is a
    // dev-only writer and is intentionally clobbered by refresh.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.5))
    await page.waitForTimeout(1800)
    const before = await page.evaluate(() => window.__film?.getProgress())
    await page.setViewportSize({ width: 390, height: 844 })
    await page.waitForTimeout(1200)
    const after = await page.evaluate(() => window.__film?.getProgress())
    expect(after?.beat, `beat preserved across resize (was ${before?.beat})`).toBe(before?.beat)
    expect(errors).toEqual([])
  })

  test('?tier=low forces the low spec', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(`${FILM_URL}?tier=low`, { waitUntil: 'load' })
    await page.waitForFunction(() => window.__film !== undefined, null, { timeout: 20000 })
    await page.waitForTimeout(800)
    const hud = await page.locator('#film-hud').innerText()
    expect(hud).toContain('low')
    await page.evaluate(() => window.__film?.setProgress(0.77))
    await page.waitForTimeout(600)
    await page.screenshot({ path: join(OUT, 'tier-low-1440.png') })
  })

  test('reduced-motion: no Lenis, progress still drivable', async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce' })
    const page = await ctx.newPage()
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(FILM_URL, { waitUntil: 'load' })
    await page.waitForFunction(() => window.__film !== undefined, null, { timeout: 20000 })
    await page.waitForTimeout(800)
    const cls = await page.evaluate(() => document.documentElement.className)
    expect(cls, 'no Lenis classes under RM').not.toContain('lenis')
    await page.evaluate(() => window.__film?.setProgress(0.62))
    await page.waitForTimeout(600)
    const state = await page.evaluate(() => window.__film?.getProgress())
    expect(state?.p).toBeCloseTo(0.62, 2)
    await page.screenshot({ path: join(OUT, 'rm-static-1440.png') })
    await ctx.close()
  })

  test('banned-token grep — Lane B files (brief §7 + ART A6)', async () => {
    // Scope: Lane B ownership only (motion/store/components/canvas/__dev__/
    // scripts/qa + lane entries). Repo-wide enforcement with verbatim-copy
    // exemptions is the coordinator's integration gate (see
    // docs/phase4/requests/B-film-integration.md §6).
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
    for (const d of ['src/motion', 'src/store', 'src/components/canvas', 'src/__dev__/b']) {
      walk(join(process.cwd(), d))
    }
    files.push(join(process.cwd(), 'dev-b.html'))
    // NOTE: scripts/qa/beats.spec.ts itself is excluded — it DEFINES the gate
    // (its regex literals necessarily name the banned tokens).
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
