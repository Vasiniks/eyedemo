// EyeQ Vision Care — V2 WORDS: FilmCaptions overlay.
// Restrained editorial overlay, pure function of film progress p.
// Beat A (bird's-eye, src 1–30) shows ONLY a small scroll hint at the
// bottom — the logo on the sleeve owns the frame; no caption may cover it.
// All film words live in SidePanels (empty-side panels); the 7 verbatim
// Essilor lens names (B §4, heading "Our Popular High-Definition Lenses")
// run on the RIGHT during 145–215 — never a left-column list here, which
// would overlap the subject once it swings left. No side text at/after the
// ring and lens dive (≥325 except the sweep insurance header in SidePanels).
// Masked reveal (translateY, eased in progress space). Never covers centre.
import './captions.css';
import { OVERLAY_MARKS } from './filmCurve';

const clamp01 = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (p: number, a: number, b: number): number => {
  const t = clamp01((p - a) / (b - a));
  return t * t * (3 - 2 * t);
};

function FilmCaptions({ progress }: { progress: number }) {
  const p = clamp01(progress);

  // Beat A: bird's-eye — scroll hint only, bottom-left, small. The logo on
  // the sleeve owns the frame; no lockup, no micro-cap over it.
  const hintIn = smooth(p, 0.0, 0.008);
  const hintExit = smooth(
    p,
    OVERLAY_MARKS.birdseyeEnd - 0.012,
    OVERLAY_MARKS.birdseyeEnd + 0.004,
  );
  const hintOp = Math.min(hintIn, 1 - hintExit);
  const showHint = hintOp > 0.001;
  if (!showHint) return <div className="v1cap" aria-hidden="true" />;

  return (
    <div className="v1cap" aria-hidden="true">
      <div
        className="v1cap__beat v1cap__establish"
        style={{ opacity: hintOp }}
      >
        <div className="v1cap__scrollhint" />
      </div>
    </div>
  );
}

export { FilmCaptions };
export default FilmCaptions;
