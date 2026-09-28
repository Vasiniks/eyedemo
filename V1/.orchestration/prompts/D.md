LETTER = D — ASSET RESEARCH. Output: `docs/research/D-asset-inventory.md` + downloaded files in `assets/source/` (subfolders: logo/, brands/, insurance/, imagery/, other/).
Objective: identify and DOWNLOAD the real assets from https://eyeqoptical.ca/ (all pages).
1. Official EyeQ logo: find every variant (header, footer, favicon, og:image, apple-touch-icon, any SVG). Download the HIGHEST resolution original of each (for Shopify CDN images strip size params like `_200x` / `?width=` to get the original). Prefer SVG if one exists. Record pixel dimensions, format, transparency, colors. DO NOT edit/redraw/trace the logo.
2. Sponsor / eyewear brand logos: download each at max resolution; name files by brand (e.g. brands/ray-ban.png). Record URL, dimensions, format, transparency, whether light- or dark-colored (important: the cinematic scene is black, note which logos would need a light variant — do NOT create variants, just note it).
3. Insurance / billing logos: same treatment.
4. Useful imagery (hero/banners/store/product photos) and promotional graphics: download, record URL + dimensions + what it depicts.
5. Fonts: identify font families actually loaded (computed styles + network font requests), their source (Shopify fonts/Google/self-hosted), and license status if clear.
6. Colors: brand colors actually used (hex).
Deliverable: a manifest table: local path | source URL | type | dimensions | format | transparent? | notes. Plus ## Logo analysis and ## Gaps (assets that are low-res or missing).
Use curl with a browser User-Agent for downloads. Verify every downloaded file opens (check with `file` / image dimensions).
