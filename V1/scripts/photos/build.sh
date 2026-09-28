#!/bin/sh
# F5-PHOTOS — responsive WebP + LQIP builder (Lane PHOTOS owns scripts/photos/**).
# Sources: real downloads from the live site in assets/source/imagery/.
# Excludes: old-Burlington storefront/signage, promos (REBAJAS), UNVERIFIED
# generics (download.jpg), frames catalog (client rule §6d), red-wall
# interiors (eyeqburlington-4 — recognisable old-store interior).
# Usage: sh scripts/photos/build.sh   (repo root; needs cwebp + python3/Pillow)
set -eu
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SRC="$ROOT/assets/source/imagery"
OUT="$ROOT/public/web/photos"
mkdir -p "$OUT"

build_one() {
  name="$1"; src="$2"
  for w in 640 1024 1600; do
    cwebp -q 72 -m 6 -resize "$w" 0 "$SRC/$src" -o "$OUT/$name-$w.webp" >/dev/null
  done
  python3 - "$SRC/$src" "$OUT/$name-lqip.webp" <<'EOF'
import sys
from PIL import Image, ImageFilter
im = Image.open(sys.argv[1]).convert("RGB")
im = im.resize((32, max(1, round(32 * im.height / im.width))), Image.LANCZOS)
im = im.filter(ImageFilter.GaussianBlur(2))
im.save(sys.argv[2], "WEBP", quality=40, method=6)
EOF
}

build_one about-eyewear hero-glasses-stack-original.png
build_one services-exam eyeqburlington-3-original.png
build_one lenses-polarized polarized-lenses-original.jpg
build_one lenses-tech services-graphic-1-original.png

echo "--- public/web/photos ---"
ls -la "$OUT"
echo "--- total bytes ---"
du -sk "$OUT"
