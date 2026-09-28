# F5-PAUSE — Remove pause buttons (rails)

ID: PAUSE · Port: 5707 · Viewport: 1512×860 · Date: 2026-09-28

## Client request
"remove pause buttons."

## Scope
- Remove every visible pause/play **rail control** on the homepage.
- Found via `grep -ri 'pause' src/components/dom src/v1`:
  - `src/components/dom/LogoRails.tsx` — `RailsPause` component (❚❚ / ▶, aria-label "Pause/Play brand rails"), 3 usages (pair desktop, single-side, mobile strip).
  - `src/components/dom/lane-e.css` — `.eyeq-rails__pause`, `:hover`, `.eyeq-rails__pause--mobile` + media-query rules.
  - `src/v1/FilmSequence.tsx` — only code comments ("drawing paused when off-screen", "pause while off-screen"); no button. Untouched.
- Kept (per brief, "don't touch anything else"):
  - Reduced-motion: `usePrefersReducedMotion()` → `StaticGrid` / `StaticColumn` unchanged.
  - Hover-slow: `Rail` onMouseEnter/Focus `setHover(20/72)` unchanged.
  - IntersectionObserver offscreen-stop + scroll-velocity coupling unchanged.
  - About video poster `▷ PLAY VIDEO` (`eyeq-about__play`) — video starter, contains no "pause" string, out of grep scope; left intact.
  - Footer "Replay film" / "Back to top" — untouched.

## Changes
1. `src/components/dom/LogoRails.tsx`
   - Deleted `RailsPause` export.
   - `useRailsRunning()`: removed `paused`/`setPaused` state; `running = visible` (was `visible && !paused`).
   - `WhiteActRails`: removed both `<RailsPause/>` instances; single-side wrapper keeps flex column layout minus button.
   - `RailsMobileStrip`: removed `.eyeq-rails__pause--mobile` wrapper + `<RailsPause/>`.
   - Comments reworded off "pause" for grep-cleanliness (hover-slow kept).
2. `src/components/dom/index.ts` — removed `RailsPause` from re-export.
3. `src/components/dom/lane-e.css`
   - Deleted `.eyeq-rails__pause`, `:hover`, `.eyeq-rails__pause--mobile` blocks.
   - Deleted `.eyeq-railside .eyeq-rails__pause` and `.eyeq-rails__pause--mobile` media-query rules.
   - `≥1280px .v1-rail .eyeq-rail` height `calc(100svh - 76px)` → `100svh` (76px was reserved for the pause control); updated comment.

## Build
- `npx tsc -b` → exit 0.
- `npm run build` → first run hit transient vite `prepareOutDir` ENOENT on `public/v1film/.tmp.mobile.*` (unrelated public asset race); retry → `✓ built in 37.76s` + postbuild `cp dist/index.html dist/404.html`. PASS.

## Verify @1512×860 (http://localhost:5707/, Playwright)
- `document.querySelectorAll('.eyeq-rails__pause, .eyeq-rails__pause--mobile')` → **0**.
- Buttons matching `/pause/i` (aria-label + text) → **0**.
- Broad `/pause|play/i` raw query → 2 hits, both out-of-scope, neither a pause control:
  - `▷ PLAY VIDEO` (`.eyeq-about__play`, visible) — About video poster starter; no "pause" string; kept per "don't touch anything else".
  - `Replay film` (footer) — substring false positive ("Re**play**"); replay action, not pause/play toggle.
- Rails still render: `.eyeq-rail/.eyeq-rails--desktop` → 5 nodes present.
- Viewport screenshot (film top): no pause/play control visible.

## Result
Zero visible pause buttons. Reduced-motion static grids + hover-slow preserved. Nothing else touched.

F5-PAUSE-DONE
