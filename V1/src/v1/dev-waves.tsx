import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import BrandWaves from "./BrandWaves";
import "../styles/tokens.css";

/* V2-WAVES dev page: 6-frame flight sequence per wave + settled holds.
 * F(s) = (s-1)/614. Wave 1 owns src 215–325 (right side), wave 2 owns
 * src 411–470 (left side). Nothing during the ring (325–411). */

const F = (s: number): number => (s - 1) / 614;
const W1_FLIGHT = [222, 240, 258, 276, 294, 310];
const W1_HOLD = 320;
const W2_FLIGHT = [415, 425, 435, 445, 455, 462];
const W2_HOLD = 467;

export default function DevWaves() {
  const params = new URLSearchParams(window.location.search);
  const initial = Number(params.get("p") ?? F(W1_HOLD));
  const [p, setP] = useState(Number.isFinite(initial) ? initial : F(W1_HOLD));
  return (
    <div style={{ position: "fixed", inset: 0, background: "#000", color: "#e9e2d3", overflow: "hidden" }}>
      {/* subject-half guard: left half must stay clear during wave 1, right half during wave 2 */}
      <div
        aria-hidden
        style={{
          position: "absolute", left: "50%", top: 0, width: "1px", height: "100%",
          background: "rgba(233,226,211,0.25)",
        }}
      />
      <BrandWaves progress={p} />
      <div style={{ position: "absolute", left: 12, right: 12, bottom: 12, display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
        <input
          type="range" min={0.3} max={0.8} step={0.001} value={p}
          onChange={(e) => setP(Number(e.target.value))}
          style={{ flex: "1 1 100%" }} aria-label="film progress"
        />
        <span style={{ fontVariantNumeric: "tabular-nums", minWidth: 48 }}>p={p.toFixed(3)}</span>
        <span style={{ fontSize: 11, opacity: 0.7 }}>W1 flight:</span>
        {W1_FLIGHT.map((s) => (
          <button key={s} onClick={() => setP(F(s))} style={{ fontSize: 11 }}>s{s}</button>
        ))}
        <button onClick={() => setP(F(W1_HOLD))} style={{ fontSize: 11, fontWeight: 700 }}>W1 hold s320</button>
        <span style={{ fontSize: 11, opacity: 0.7 }}>W2 flight:</span>
        {W2_FLIGHT.map((s) => (
          <button key={s} onClick={() => setP(F(s))} style={{ fontSize: 11 }}>s{s}</button>
        ))}
        <button onClick={() => setP(F(W2_HOLD))} style={{ fontSize: 11, fontWeight: 700 }}>W2 hold s467</button>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DevWaves />
  </StrictMode>
);
