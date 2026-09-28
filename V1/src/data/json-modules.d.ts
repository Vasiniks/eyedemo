// Lane E ambient declaration so `import x from './x.json'` typechecks without
// touching the shared tsconfig (Lane A owned). Values are narrowed with `as`
// casts in src/data/index.ts.
declare module '*.json' {
  const value: unknown;
  export default value;
}
