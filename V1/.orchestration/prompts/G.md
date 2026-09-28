LETTER = G — GLASSES MODEL INSPECTION. Output: `docs/research/G-glasses-model.md` + preview renders in `docs/research/screens/G/`.
Model: `/Users/admin/Downloads/Glasses_Mama_WBL/` (Glasses_Mama_WBL.obj, .mtl, Glasses_Mama_Tex/). READ-ONLY: never modify or move these source files.
Do NOT use the Blender MCP (another agent owns the live Blender instance). You MAY use headless Blender via CLI if installed (look for /Applications/Blender.app/Contents/MacOS/Blender and run with `-b --factory-startup --python <script>`; scripts go in `.orchestration/tmp/`), or parse the OBJ with Python.
Determine:
1. Objects/groups (o/g lines), material assignments, vertex/face/triangle counts per object and total.
2. Bounding box, units/scale (real glasses ≈ 140 mm wide), orientation (which axis is up/forward), origin.
3. Is it split into separate parts (front frame, lenses, left arm, right arm, hinges, nose pads)? If arms are NOT separate, describe how they could be separated (loose parts / vertex position ranges) and estimate hinge pivot positions (coordinates).
4. Is the model currently OPEN or FOLDED?
5. Textures: list files, resolution, maps (albedo/normal/roughness/...), and what the MTL references.
6. Mesh quality: n-gons, non-manifold, doubled verts, normals, UVs present.
7. Web-readiness: estimated glb size after Draco/meshopt; decimation needed for mobile (<150k tris target overall scene).
8. If headless Blender is available, render 3 low-quality EEVEE preview PNGs (front, 3/4, top) into screens/G/.
Deliverable: facts table + ## Rigging plan for fold/unfold (pivots, rotation axes, angles) + ## Material plan to make it DARK premium (black/dark metallic, lens tint) + ## Issues.
