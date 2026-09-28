# Lane B → coordinator / Lanes A, C, D, E: film integration contracts

Lane B (conductor/camera/portal/QA). No action needed until integration
(after P4-C, P4-D2, P4-E, P4-F report DONE). Full plug-in spec:
`src/components/canvas/API.md`.

## 1. Canonical canvas paths (confirm)

PLAN-MASTER §7.2 + scaffold put canvas files at `src/components/canvas/`
(`FilmCanvas`, `CameraRig`, `Effects`, `LensPortal` — all written). Some lane
notes shorthand this as `src/canvas/`. Please confirm `src/components/canvas/`
is canonical so Lane C's `CaseRig`/`GlassesRig` land beside (not under a new
`src/canvas/`) — or instruct a move.

## 2. Lane E: `#film-pin` shell + `#white-veil` element (Home composition)

When composing the real Home page, Lane B needs (Lane E owns DOM/CSS):

```css
/* film.css */
#film-pin { height: 800vh; position: relative; }
@media (max-width: 1024px) { #film-pin { height: 640vh; } } /* tablet: 640 dark */
@media (max-width: 768px) { #film-pin { height: 560vh; } }  /* mobile: 560 dark */
```

- `<div id="film-pin">` wraps the sticky film (canvas fixed z-0 + 9
  `<section>` chapters z-10). Timeline trigger + pin target (do not rename).
- `<div id="white-veil">` (fixed inset-0, Paper `#F5F1E8`, z above canvas
  below header) — or Lane B's exported `<WhiteVeil/>` from
  `components/canvas/LensPortal.tsx` may be mounted directly. Opacity/clip are
  conductor-driven (imperative, no renders); do NOT animate it in CSS.

## 3. Lane C: lens anchor handoff

`motion/chapters.ts` exports `getLensAnchor()` / `setLensAnchor(center,
normal)`. Once real `G_Lenses` exists, call `setLensAnchor()` per frame from
its world transform and pass `linked` to `<LensPortal/>` (stand-in disc
unmounts; ramp hooks + veil keep driving). CameraRig B8–B9 needs no change.
Right lens is the portal lens; left is the mirror backup. Stand-in anchor:
center (0.048, 0.082, 0.012), normal (−0.0822, 0.0205, 0.9964).

## 4. Lane D: lights own the look; conductor owns fog/exposure numbers

CameraRig writes `scene.fog.density` (FogExp2 Void) + `gl.toneMappingExposure`
from `sampleCamera()` (0.035→0.015→0.030→0; 1.0→1.15→1.35→2.2). SceneStage
should NOT also write these (single writer). Light intensities stay yours.

## 5. Deferral note

Real-Home integration (steps 17–18) waits for all lanes DONE. Lane B's
proof until then: `dev-b.html` harness + `docs/phase4/qa/B/` screenshots.

## 6. Observed 2026-09-28 (for coordinator triage, no action by Lane B)

- **Conductor fork:** `src/canvas/*` (C/D, written 28 Sep) implements its own
  `rigs/progressMap.ts` + local progress refs instead of consuming
  `src/motion/*` (`filmProgress`, `sampleCamera`, `setLensAnchor`). §6/§12
  name ONE conductor with `filmProgress` as the sole 3D input — recommend
  unifying on `motion/*` at integration (API.md §2–§4) and deleting the fork.
- **Path fork:** C/D write `src/canvas/*`; B (per §7.2 + scaffold) owns
  `src/components/canvas/*`. Decide ONE canonical dir (§1 above).
- **Router breakage (in progress):** Lane F deleted `src/routes/Catalog.tsx`
  (moved to `parts/`) while `src/app/router.tsx` still imports it — `/`
  currently 500s on a fresh server. Lane F/A to resolve; Lane B untouched.
- **Banned-token hits outside Lane B** (repo-wide gate will flag these;
  owners adjudicate verbatim-vs-draft):
  - `src/routes/parts/content.ts:43` — "premium eyewear" (verify against
    B-content-inventory verbatim; if verbatim, exempt; else reword).
  - `src/canvas/rigs/materialUpgrades.ts:67` — "dark premium graphite"
    (code comment; reword to avoid the token).
  - `src/components/dom/WhiteSection.tsx` — "EYEQ VISION CARE" display
    (use the exact business-name casing "EyeQ Vision Care").
