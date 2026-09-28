# F4-MAP — Load map by default (ID=MAP, port 5705)

## Change
- `src/components/dom/StoreBits.tsx` — `MapEmbed` no longer click-to-activate.
  Real Google Maps `iframe` renders immediately with `loading="lazy"`,
  same query `https://maps.google.com/maps?q=2-227+Vodden+St+East%2C+Brampton%2C+ON&t=m&z=15&output=embed&iwloc=near`, same `title`, `referrerPolicy="no-referrer-when-downgrade"`, `allowFullScreen`.
- Scroll-safe without a click gate: wrapper `.eyeq-map--live`; iframe
  `pointer-events:none` by default so wheel over the map scrolls the page;
  single click/tap on wrapper sets `active` → `pointer-events:auto`;
  `mouseLeave` resets to `none`; holding Ctrl/Cmd (`keydown`/`keyup` mod
  tracking) temporarily enables interaction for zoom. Touch: `onTouchStart`
  activates.
- `src/components/dom/lane-e.css` — added `.eyeq-map--live .eyeq-map__hint`
  (tiny pill, `opacity:0` → `1` on `:hover`/`:focus-within` only, hidden
  while `.is-active`, `prefers-reduced-motion` disables transition).
- Directions link `.eyeq-map__dirs` unchanged (both White + Visit instances).
- Untouched per brief: `LogoRails.tsx`, `Header.tsx`, `Scrims.tsx`, `v1.css`.

## Verify (dev http://127.0.0.1:5705/)
- Iframes found: 2 (White `eyeq-white__map` + Visit compact), both
  `src`=correct query, `loading="lazy"`, computed `pointer-events:none`
  before click → `auto` after click dispatch. `covers=0`, `hints=2`,
  `hintOpacity(default)=0`, no "Load map" poster text, both `dirs` =
  `https://www.google.com/maps/dir/?api=1&destination=2-227+Vodden+St+East%2C+Brampton%2C+ON`.
- 1512×860: white-map iframe rect `{x:545, y:288, w:436, h:244}` in-viewport;
  screenshot `qa-map-1512.png`.
- 390×860: white-map rect `{x:33, w:324}` inside 390, `scrollWidth=390`
  (no h-overflow); screenshot `qa-map-390.png`.
- Perf: `loading="lazy"` defers fetch until near viewport; no poster JS
  weight; iframe is the only added cost, on user request ("load the map
  by default").
