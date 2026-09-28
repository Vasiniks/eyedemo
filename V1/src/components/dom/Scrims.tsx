// Lane E — local contrast scrims (PLAN-MASTER §6, anti-slop A1/A2).
// ONLY permitted scrim shapes: 120px gradient behind film copy, and the
// mobile bottom-40% band. V3-MPAGE: pure-black (never #050607) so no lighter
// seam over the film's pure-black frames; bottom band fades to transparent
// so its top edge never reads as a seam.
export function CopyScrim() {
  return <div className="eyeq-chapter__copy" aria-hidden="true" />;
}

export function BottomScrim() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 'auto 0 0 0',
        height: '40%',
        background: 'linear-gradient(to top, rgba(0,0,0,.55), rgba(0,0,0,0))',
        pointerEvents: 'none',
      }}
    />
  );
}
