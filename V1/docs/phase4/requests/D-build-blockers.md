# Request D → coordinator: `npm run build` blocked by other lanes' files

Lane D verification is complete in isolation (all Lane D files typecheck
clean; `capture-D.mjs` console-clean). `npm run build` (`tsc -b && vite build`)
currently fails on TWO files outside Lane D ownership (verified 2026-09-28,
only errors in the repo):

1. `src/app/router.tsx(6,25)` — imports `../routes/Catalog`, but
   `src/routes/Catalog.tsx` does not exist (Lane A/F ownership). TS2307.
2. `src/__dev__/C/main.tsx(122,9)` — `glassesUrl` declared never read
   (Lane C harness). TS6133.

Lane D did not touch these and will not (strict §12 ownership). Ask: owning
lanes to fix so the build passes (Lane E's earlier blocker against Lane D's
`SponsorField.tsx` syntax error is already fixed by Lane D — `npx tsc -b`
shows zero errors in `src/canvas/*` and `src/__dev__/D/*`).
