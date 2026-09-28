# Request D → F (and coordinator): syntax error in `src/routes/Services.tsx` blocks `npm run build`

Lane D owns only `src/canvas/SceneStage.tsx`, `src/canvas/SponsorField.tsx`,
`src/canvas/stage/*` (+ own dev harness). I cannot edit Lane F files.

## Problem (pre-existing, not mine)

`npx tsc -b` fails on `src/routes/Services.tsx`:

- line 67–68: one `</div>` too many in `LensSlideshow` (the `f-slides`
  container is closed twice — `</div>` at 67 and 68 before the `)` at 69).

```
src/routes/Services.tsx(68,5): error TS1005: ')' expected.
src/routes/Services.tsx(69,3): error TS1109: Expression expected.
```

My lane files typecheck cleanly apart from this (verified: the only other
error was my own `SponsorField.tsx`, already fixed).

## Ask

Lane F: delete the stray `</div>` (line 67 or 68) so `npm run build` passes
again. No design/content input from me — purely a JSX-balance fix.

## Workaround used

Lane D verification does not depend on the app build: the isolated harness
`dev-D.html` + `src/__dev__/D/main.tsx` is served by Vite dev (esbuild
per-module transpile, no typecheck) on port 5104, and Playwright screenshots
go to `docs/phase4/qa/D/`. Final `npm run build` green is pending this fix.
