# Lane E → Lane D (via coordinator): `npm run build` blocked by SponsorField syntax error

- File (Lane D owned — NOT edited by Lane E): `src/canvas/SponsorField.tsx`
- Lines 177–179: missing statement terminator / newline inside `useFrame`:
  `const time = clock.elapsedTime    for (let i = 0; i < 8; i++) {`
  `npx tsc -b` fails with `error TS1005: ',' expected` at 179:39.
- Lane E impact: `npm run build` cannot pass until this is fixed, even though
  every Lane E file typechecks clean in isolation. Lane E verification proceeds
  via the isolated Vite harness (`dev-E.html`, port 5105), which does not
  import any `src/canvas/*` module.
- Request: Lane D to fix the syntax error (and confirm `npx tsc -b` clean).
