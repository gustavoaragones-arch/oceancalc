"use client";

import { useState } from "react";
import { CalculatorCard } from "./CalculatorCard";

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}
function toDeg(rad: number) {
  return (rad * 180) / Math.PI;
}

// True wind from boat's perspective: TWA = true wind angle (0 = head, 180 = tail)
// Boat speed Vb, true wind speed Vt, true wind angle TWA (degrees)
// Apparent wind: Va^2 = Vb^2 + Vt^2 + 2*Vb*Vt*cos(TWA)
// Apparent wind angle from bow: cos(AWA) = (Vt*cos(TWA) + Vb) / Va
export function ApparentWindCalculator() {
  const [boatSpeed, setBoatSpeed] = useState("6");
  const [trueWindSpeed, setTrueWindSpeed] = useState("10");
  const [trueWindAngle, setTrueWindAngle] = useState("90"); // degrees from bow

  const Vb = parseFloat(boatSpeed);
  const Vt = parseFloat(trueWindSpeed);
  const TWA = parseFloat(trueWindAngle);
  const valid =
    Number.isFinite(Vb) &&
    Vb >= 0 &&
    Number.isFinite(Vt) &&
    Vt >= 0 &&
    Number.isFinite(TWA) &&
    TWA >= 0 &&
    TWA <= 180;

  let apparentSpeed = 0;
  let apparentAngle = 0;
  if (valid) {
    const twaRad = toRad(TWA);
    apparentSpeed = Math.sqrt(
      Vb * Vb + Vt * Vt + 2 * Vb * Vt * Math.cos(twaRad)
    );
    const cosAWA = (Vt * Math.cos(twaRad) + Vb) / apparentSpeed;
    apparentAngle = toDeg(Math.acos(Math.max(-1, Math.min(1, cosAWA))));
  }

  return (
    <CalculatorCard title="Apparent Wind Calculator">
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
        True wind angle is the angle from the bow (0° = headwind, 180° = downwind). All speeds in knots.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div>
          <label htmlFor="boat-speed" className="label">Boat speed (kn)</label>
          <input
            id="boat-speed"
            type="number"
            min="0"
            step="0.5"
            value={boatSpeed}
            onChange={(e) => setBoatSpeed(e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label htmlFor="true-wind" className="label">True wind speed (kn)</label>
          <input
            id="true-wind"
            type="number"
            min="0"
            step="0.5"
            value={trueWindSpeed}
            onChange={(e) => setTrueWindSpeed(e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label htmlFor="twa" className="label">True wind angle (°)</label>
          <input
            id="twa"
            type="number"
            min="0"
            max="180"
            step="5"
            value={trueWindAngle}
            onChange={(e) => setTrueWindAngle(e.target.value)}
            className="input-field"
          />
        </div>
      </div>
      {valid && (
        <div className="rounded-lg bg-slate-100 dark:bg-slate-700/50 p-4 space-y-1">
          <p className="font-medium">Apparent wind</p>
          <p className="text-lg">{apparentSpeed.toFixed(1)} knots</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Apparent wind angle from bow: {apparentAngle.toFixed(0)}°
          </p>
        </div>
      )}
    </CalculatorCard>
  );
}
