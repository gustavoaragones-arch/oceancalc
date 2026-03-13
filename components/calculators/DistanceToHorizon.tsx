"use client";

import { useState } from "react";
import { CalculatorCard } from "./CalculatorCard";

// Distance to horizon (nautical miles) ≈ 1.17 × √(height in feet)
const FEET_TO_HORIZON_NM = 1.17;

export function DistanceToHorizonCalculator() {
  const [heightFeet, setHeightFeet] = useState("6");
  const [heightMeters, setHeightMeters] = useState("1.83");
  const [useMetric, setUseMetric] = useState(false);

  const h = useMetric ? parseFloat(heightMeters) : parseFloat(heightFeet);
  const valid = Number.isFinite(h) && h > 0;
  let distanceNm = 0;
  if (valid) {
    if (useMetric) {
      const hFeet = h * 3.28084;
      distanceNm = FEET_TO_HORIZON_NM * Math.sqrt(hFeet);
    } else {
      distanceNm = FEET_TO_HORIZON_NM * Math.sqrt(h);
    }
  }
  const distanceKm = distanceNm * 1.852;
  const distanceMiles = distanceNm * 1.15078;

  const syncFromFeet = (ft: string) => {
    setHeightFeet(ft);
    const n = parseFloat(ft);
    if (Number.isFinite(n)) setHeightMeters((n / 3.28084).toFixed(2));
  };
  const syncFromMeters = (m: string) => {
    setHeightMeters(m);
    const n = parseFloat(m);
    if (Number.isFinite(n)) setHeightFeet((n * 3.28084).toFixed(2));
  };

  return (
    <CalculatorCard title="Distance to Horizon">
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
        Height of eye (e.g., from water level to your eyes).
      </p>
      <div className="flex gap-4 items-center mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="unit"
            checked={!useMetric}
            onChange={() => setUseMetric(false)}
            className="rounded border-slate-300"
          />
          Feet
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="unit"
            checked={useMetric}
            onChange={() => setUseMetric(true)}
            className="rounded border-slate-300"
          />
          Meters
        </label>
      </div>
      <div className="mb-4">
        {useMetric ? (
          <>
            <label htmlFor="height-m" className="label">Height of eye (m)</label>
            <input
              id="height-m"
              type="number"
              min="0.1"
              step="0.1"
              value={heightMeters}
              onChange={(e) => syncFromMeters(e.target.value)}
              className="input-field max-w-[200px]"
            />
          </>
        ) : (
          <>
            <label htmlFor="height-ft" className="label">Height of eye (ft)</label>
            <input
              id="height-ft"
              type="number"
              min="0.5"
              step="0.5"
              value={heightFeet}
              onChange={(e) => syncFromFeet(e.target.value)}
              className="input-field max-w-[200px]"
            />
          </>
        )}
      </div>
      {valid && (
        <div className="rounded-lg bg-slate-100 dark:bg-slate-700/50 p-4 space-y-1 text-sm">
          <p><strong>Horizon distance:</strong></p>
          <p>{distanceNm.toFixed(2)} nautical miles</p>
          <p>{distanceKm.toFixed(2)} km · {distanceMiles.toFixed(2)} statute miles</p>
        </div>
      )}
    </CalculatorCard>
  );
}
