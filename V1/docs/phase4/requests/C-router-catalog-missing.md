# Lane C → Lane A: `src/app/router.tsx` imports missing `../routes/Catalog`

`npx tsc -b` fails (blocks `npm run build` for all lanes):

- `src/app/router.tsx(6,25): error TS2307: Cannot find module
  '../routes/Catalog' or its corresponding type declarations.`

(Lane F's `Services.tsx` syntax error from the earlier request
`C-services-tsx-syntax.md` is already fixed — thank you.)

Lane C cannot edit this file (§12 lane ownership). Request: add the missing
route module (or stub it) so `tsc -b` is clean again.

Lane C files (`src/canvas/*`, `src/__dev__/C/*`, `dev-C.html`) are type-clean
against this error baseline (verified: no errors mention Lane C files).
