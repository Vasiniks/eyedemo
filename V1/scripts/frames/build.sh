#!/bin/sh
# F4-PERF — build public/v1film/ tiers from render-repo/out/frames/.
#   full/   : 3024x1720 WebP q80 (re-encode from source; desktop ?hq=1 only)
#   web/    : 1512x860 WebP q68 (magick; desktop default incl. retina)
#   mobile/ : 1024x582 WebP q64 (magick; ≤820px / saveData / slow)
#   manifest.json : {"count":3588,"sourceFrames":615,...,"tiers":{full,web,mobile}}
# Usage: sh scripts/frames/build.sh [jobs]
# Idempotent: skips frames already present (force with FORCE=1).
#   TIERS="web mobile" limits to a subset (default: "full web mobile").
#   Web/mobile/full stage to a temp dir on the same filesystem and swap
#   atomically via mv so the live site never serves half-written files.
set -eu
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SRC="$ROOT/render-repo/out/frames"
DST="$ROOT/public/v1film"
JOBS="${1:-8}"
TIERS="${TIERS:-full web mobile}"

for t in $TIERS; do mkdir -p "$DST/$t"; done

# Full tier: re-encode source at q80 (V3-PERF: was hard-linked as-rendered
# 239 MB; q80 lands ~150 MB). Skip when already at q80 size signature.
# Staged to temp + atomic mv (F5-ENCODE).
if case " $TIERS " in *" full "*) true;; *) false;; esac; then
echo "full: re-encoding to 3024x1720 q80 ($JOBS parallel)…"
export DST
if [ "${FORCE:-0}" = "1" ]; then rm -f "$DST/full"/f_*.webp; fi
find "$SRC" -maxdepth 1 -name 'f_*.webp' -print0 \
  | xargs -0 -n 32 -P "$JOBS" sh -c '
    for src in "$@"; do
      out="$DST/full/$(basename "$src")"
      [ -f "$out" ] || magick "$src" -quality 80 "$out"
    done
  ' sh
echo "full: $(ls "$DST/full" | wc -l | tr -d ' ') frames"
fi

# Web tier: parallel resize, skip existing. Staged to temp + atomic swap.
if case " $TIERS " in *" web "*) true;; *) false;; esac; then
echo "web: resizing to 1512x860 q68 ($JOBS parallel)…"
TMPWEB="$DST/.tmp.web.$$"
rm -rf "$TMPWEB"; mkdir -p "$TMPWEB"
export TMPWEB
if [ "${FORCE:-0}" = "1" ]; then rm -f "$TMPWEB"/f_*.webp; fi
find "$SRC" -maxdepth 1 -name 'f_*.webp' -print0 \
  | xargs -0 -n 32 -P "$JOBS" sh -c '
    for src in "$@"; do
      out="$TMPWEB/$(basename "$src")"
      [ -f "$out" ] || magick "$src" -resize 1512x860! -quality 68 "$out"
    done
  ' sh
echo "web staged: $(ls "$TMPWEB" | wc -l | tr -d ' ') frames"
rm -rf "$DST/web.bak"; if [ -d "$DST/web" ]; then mv "$DST/web" "$DST/web.bak"; fi
mv "$TMPWEB" "$DST/web"; rm -rf "$DST/web.bak"
echo "web: $(ls "$DST/web" | wc -l | tr -d ' ') frames"
fi

# Mobile tier (F4-PERF): 1024x582 q64 for ≤820px / saveData / slow.
# Staged to temp + atomic swap.
if case " $TIERS " in *" mobile "*) true;; *) false;; esac; then
echo "mobile: resizing to 1024x582 q64 ($JOBS parallel)…"
TMPMOB="$DST/.tmp.mobile.$$"
rm -rf "$TMPMOB"; mkdir -p "$TMPMOB"
export TMPMOB
if [ "${FORCE:-0}" = "1" ]; then rm -f "$TMPMOB"/f_*.webp; fi
find "$SRC" -maxdepth 1 -name 'f_*.webp' -print0 \
  | xargs -0 -n 32 -P "$JOBS" sh -c '
    for src in "$@"; do
      out="$TMPMOB/$(basename "$src")"
      [ -f "$out" ] || magick "$src" -resize 1024x582! -quality 64 "$out"
    done
  ' sh
echo "mobile staged: $(ls "$TMPMOB" | wc -l | tr -d ' ') frames"
rm -rf "$DST/mobile.bak"; if [ -d "$DST/mobile" ]; then mv "$DST/mobile" "$DST/mobile.bak"; fi
mv "$TMPMOB" "$DST/mobile"; rm -rf "$DST/mobile.bak"
echo "mobile: $(ls "$DST/mobile" | wc -l | tr -d ' ') frames"
fi

if case " $TIERS " in *" full "*) true;; *) false;; esac \
&& case " $TIERS " in *" web "*) true;; *) false;; esac \
&& case " $TIERS " in *" mobile "*) true;; *) false;; esac; then
cat > "$DST/manifest.json" <<'EOF'
{"count":3588,"sourceFrames":615,"fpsMult":5.8333,"tiers":{"full":{"w":3024,"h":1720,"dir":"full"},"web":{"w":1512,"h":860,"dir":"web"},"mobile":{"w":1024,"h":582,"dir":"mobile"}},"pattern":"f_%05d.webp"}
EOF
echo "manifest written"
else
echo "manifest skipped (TIERS=\"$TIERS\")"
fi
