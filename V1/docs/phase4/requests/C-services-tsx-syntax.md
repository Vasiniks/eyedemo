# Lane C → Lane F: syntax error in `src/routes/Services.tsx`

`npx tsc -b` fails (blocks `npm run build` for all lanes):

- `src/routes/Services.tsx(68,5): error TS1005: ')' expected.`
- `src/routes/Services.tsx(69,3): error TS1109: Expression expected.`

Lane C cannot edit this file (§12 lane ownership). Request: fix the paren/
expression at lines 68–69 so `tsc -b` is clean again.

Lane C files (`src/canvas/*`, `src/__dev__/C/*`, `dev-C.html`) are type-clean
against this error baseline.
