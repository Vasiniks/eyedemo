ID = REF — measured reference teardowns. Consult: `reference-analyst`. Load the `visual-fidelity` skill and use its `vf teardown` tooling (see the skill for the exact command/path).
Output: `docs/phase4/PLAN-reference-teardowns.md` (raw teardown artifacts under `.design/ref/<site-slug>/`).
1. From `docs/research/E-visual-references.md`, pick the 2–3 references most relevant to: a long scroll-driven 3D product film, a product reveal/open, and a circular/lens/iris transition. Prefer verified live URLs from E's reference table.
2. Run teardowns and extract MEASURED values: scroll length (vh) of their pinned sequences, scrub values, eases and durations of reveals, text split/stagger values, camera/3D scene settings (tone mapping, exposure, lights, materials) where captured, transition techniques.
3. Translate into recommendations for EyeQ: which measured values to adopt as defaults, and what NOT to copy (composition/animation must stay original — brief forbids copying).
If a teardown fails (site blocks automation), record the failure and fall back to manual Playwright measurement of scroll length + timing on that site.
